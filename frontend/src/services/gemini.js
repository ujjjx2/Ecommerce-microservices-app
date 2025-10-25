import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export async function analyzeProduct(product) {
  try {
    const prompt = `Analyze the following product and provide a detailed recommendation with pros and cons.

Product Name: ${product.name}
Brand: ${product.brand || 'N/A'}
Category: ${product.category}
Price: $${product.price}
Description: ${product.description}
Rating: ${product.rating || 'N/A'}/5
Stock: ${product.stock}

Please provide:
1. A brief summary (2-3 sentences)
2. Pros (3-5 positive points)
3. Cons (3-5 negative points or areas for improvement)
4. A final recommendation (who should buy this product)

Respond with JSON in this exact format:
{
  "summary": "Brief summary of the product",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "recommendation": "Final recommendation"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            pros: { 
              type: "array",
              items: { type: "string" }
            },
            cons: { 
              type: "array",
              items: { type: "string" }
            },
            recommendation: { type: "string" }
          },
          required: ["summary", "pros", "cons", "recommendation"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    
    if (rawJson) {
      const analysis = JSON.parse(rawJson);
      return analysis;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error('Error analyzing product:', error);
    throw new Error(`Failed to analyze product: ${error.message}`);
  }
}
