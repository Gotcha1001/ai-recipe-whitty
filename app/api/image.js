import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop";

export async function generateImage(recipeName) {
  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `A beautiful, appetizing photo of ${recipeName}, professional food photography, high quality, detailed, on a clean white plate, soft lighting`,
          negative_prompt:
            "blurry, low quality, distorted, ugly, bad lighting, text, watermark",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
        },
      }
    );

    if (!output || !output[0]) {
      console.warn("No image generated, using fallback");
      return FALLBACK_IMAGE;
    }

    return output[0];
  } catch (error) {
    console.error("Error generating image:", error);
    return FALLBACK_IMAGE;
  }
}
