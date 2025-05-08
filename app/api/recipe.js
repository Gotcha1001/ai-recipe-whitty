import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateRecipe() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a random recipe with a quirky introduction. Follow this exact format:
**Recipe Name**
Ingredients:
- Item 1
- Item 2
...
Instructions:
1. Step 1
2. Step 2
...`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into a structured format
    const lines = text.split("\n");
    let name = "";
    let ingredients = [];
    let instructions = [];
    let currentSection = "";

    for (const line of lines) {
      if (line.startsWith("**") && line.endsWith("**")) {
        name = line.slice(2, -2).trim();
      } else if (line.toLowerCase().includes("ingredients:")) {
        currentSection = "ingredients";
      } else if (line.toLowerCase().includes("instructions:")) {
        currentSection = "instructions";
      } else if (
        currentSection === "ingredients" &&
        line.trim().startsWith("-")
      ) {
        ingredients.push(line.trim().slice(1).trim());
      } else if (
        currentSection === "instructions" &&
        /^\d+\./.test(line.trim())
      ) {
        instructions.push(line.trim().replace(/^\d+\.\s*/, ""));
      }
    }

    if (!name || ingredients.length === 0 || instructions.length === 0) {
      throw new Error("Invalid recipe format received from API");
    }

    return {
      name,
      ingredients,
      instructions,
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}
