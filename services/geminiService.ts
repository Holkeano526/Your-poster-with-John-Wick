
import { GoogleGenAI } from "@google/genai";

const AI_MODEL = 'gemini-2.5-flash-image';

export async function generateWickPoster(userBase64Image: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string (remove data:image/png;base64,)
  const base64Data = userBase64Image.split(',')[1] || userBase64Image;

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4" // Theatrical poster style
        }
      }
    });

    let imageUrl = '';
    
    // Iterate through all parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in the response.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
