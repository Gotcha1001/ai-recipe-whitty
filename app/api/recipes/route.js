import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemMessage = `
You are Chef Quirky, a fun and engaging recipe assistant. When asked for a recipe, provide a quirky introduction limited to **two short paragraphs** (3-4 sentences total, max 100 words), followed by the recipe in this format:

**Recipe Name**
Ingredients:
- Item 1
- Item 2
...
Instructions:
1. Step 1
2. Step 2
...

For weekly requests, provide an introductory quirky response limited to **two short paragraphs** (3-4 sentences total, max 100 words), followed by seven recipes, each starting with '**Day: Recipe Name**', where Day is Monday to Sunday, followed by ingredients and instructions. Always ensure recipes are complete with ingredients and instructions.
`;

function parseRecipeResponse(text, isSingleRecipe = false) {
  const recipes = [];
  let quirkyResponse = "";
  let currentRecipe = null;
  let currentSection = null;
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let i = 0;
  let paragraphCount = 0;
  let sentenceCount = 0;
  let maxSentences = 4;

  const lines = text.split("\n");
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      if (currentRecipe) {
        i++;
        continue;
      }
      if (quirkyResponse && quirkyResponse[quirkyResponse.length - 1] !== "") {
        paragraphCount++;
      }
      quirkyResponse += "\n";
      i++;
      continue;
    }

    if (line.startsWith("**") && line.endsWith("**")) {
      const header = line.slice(2, -2).trim();
      if (isSingleRecipe) {
        if (currentRecipe) {
          recipes.push(currentRecipe);
        }
        currentRecipe = {
          name: header,
          ingredients: [],
          instructions: [],
          day: "",
        };
        currentSection = "ingredients";
        if (i > 0) {
          quirkyResponse = lines.slice(0, i).join("\n");
        }
        i++;
        continue;
      } else {
        for (const d of days) {
          if (header.startsWith(`${d}:`)) {
            if (currentRecipe) {
              recipes.push(currentRecipe);
            }
            const name = header.replace(`${d}:`, "").trim();
            currentRecipe = { name, ingredients: [], instructions: [], day: d };
            currentSection = "ingredients";
            break;
          }
        }
        if (!currentRecipe) {
          quirkyResponse += line + "\n";
        }
        i++;
      }
    } else if (currentRecipe) {
      if (line.toLowerCase().includes("ingredients:")) {
        currentSection = "ingredients";
      } else if (line.toLowerCase().includes("instructions:")) {
        currentSection = "instructions";
      } else if (currentSection === "ingredients") {
        if (
          line.startsWith("- ") ||
          line.startsWith("* ") ||
          line.startsWith("• ")
        ) {
          currentRecipe.ingredients.push(line.replace(/^[-*•]\s*/, "").trim());
        } else if (line.match(/^\d+\.\s/) && currentSection === "ingredients") {
          currentRecipe.ingredients.push(line.replace(/^\d+\.\s*/, "").trim());
        }
      } else if (currentSection === "instructions") {
        if (line.match(/^\d+\.\s/)) {
          currentRecipe.instructions.push(line.replace(/^\d+\.\s*/, "").trim());
        } else if (
          line.startsWith("- ") ||
          line.startsWith("* ") ||
          line.startsWith("• ")
        ) {
          currentRecipe.instructions.push(line.replace(/^[-*•]\s*/, "").trim());
        }
      }
      i++;
    } else {
      const sentences = line.split(/[.!?]+/);
      sentenceCount += sentences.filter((s) => s.trim()).length;
      if (sentenceCount <= maxSentences && paragraphCount < 2) {
        quirkyResponse += line + "\n";
      }
      i++;
    }
  }

  if (currentRecipe) {
    recipes.push(currentRecipe);
  }

  if (isSingleRecipe && recipes.length > 0) {
    recipes.length = 1;
  }

  quirkyResponse = quirkyResponse.trim();
  const words = quirkyResponse.split(/\s+/);
  if (words.length > 100) {
    quirkyResponse = words.slice(0, 100).join(" ") + "...";
  }

  return { quirkyResponse, recipes };
}

export async function POST(request) {
  try {
    console.log("Received recipe request");

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "API key not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);

    const { recipeName, userInput } = body;
    console.log("Recipe name:", recipeName);
    console.log("User input:", userInput);

    // Use either recipeName or userInput
    const recipeRequest = recipeName || userInput;

    if (!recipeRequest) {
      console.error("No recipe name or user input provided");
      return NextResponse.json(
        { error: "Please tell Chef Quirky what you'd like to cook!" },
        { status: 400 }
      );
    }

    console.log("Generating recipe for:", recipeRequest);
    const prompt = `${systemMessage}\n\nGenerate a recipe for: ${recipeRequest}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Generated recipe text:", text);

      if (!text || text.trim() === "") {
        console.error("Empty response from Gemini API");
        return NextResponse.json(
          {
            error: "Chef Quirky couldn't generate a recipe. Please try again!",
          },
          { status: 500 }
        );
      }

      const { quirkyResponse, recipes } = parseRecipeResponse(text, true);
      console.log(
        "Parsed response:",
        JSON.stringify({ quirkyResponse, recipes }, null, 2)
      );

      if (!recipes || recipes.length === 0) {
        console.error("No recipes were generated from text:", text);
        return NextResponse.json(
          {
            error:
              "Chef Quirky couldn't understand the recipe format. Please try again!",
          },
          { status: 500 }
        );
      }

      const recipe = recipes[0];
      if (
        !recipe.ingredients ||
        !recipe.instructions ||
        recipe.ingredients.length === 0 ||
        recipe.instructions.length === 0
      ) {
        console.error("Recipe is incomplete:", recipe);
        return NextResponse.json(
          {
            error:
              "The recipe is missing ingredients or instructions. Please try again!",
          },
          { status: 500 }
        );
      }

      // Generate image for the recipe
      try {
        const host = request.headers.get("host");
        const protocol =
          process.env.NODE_ENV === "development" ? "http" : "https";
        const imageUrl = `${protocol}://${host}/api/generate-image`;

        console.log("Requesting image generation from:", imageUrl);
        const imageResponse = await fetch(imageUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `A beautiful photo of ${recipe.name}`,
          }),
        });

        if (!imageResponse.ok) {
          console.error("Image generation failed:", await imageResponse.text());
          // Don't throw error, continue without image
        } else {
          const imageData = await imageResponse.json();
          console.log("Image generation response:", imageData);

          if (imageData.imageUrl) {
            console.log("Adding image URL to recipe:", imageData.imageUrl);
            recipe.imageUrl = imageData.imageUrl;
          }
        }
      } catch (imageError) {
        console.error("Error generating image:", imageError);
        // Continue without image
      }

      console.log("Final recipe with image:", recipe);
      return NextResponse.json({
        quirkyResponse,
        recipe,
      });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json(
        {
          error:
            "Chef Quirky is having trouble connecting to the recipe database. Please try again!",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in recipe generation:", error);
    return NextResponse.json(
      {
        error: "Chef Quirky hit a snag. Please try again!",
      },
      { status: 500 }
    );
  }
}
