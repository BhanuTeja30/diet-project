import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeNutrients(mealDescription: string, userAgeContext: string = "adolescent") {
  const prompt = `Analyze the nutritional content of the following dietary framework: "${mealDescription}". 
  This could be a single meal, a full day, or an entire week of intake.
  
  Provide a JSON response with:
  1. "nutrients": A list of objects with "name", "amount" (number), "unit", and "status" ('deficit' | 'optimal' | 'excess'). Include key nutrients: Protein, Iron, Vitamin A, Calcium, etc.
  2. "totalCalories": Estimated total calories for the period (number).
  3. "recommendations": 3 specific dietary recommendations.
  4. "summary": { "assessment": 'Optimal' | 'Caution' | 'Critical', "score": number (0-100), "description": "A clear, blunt assessment of if this is 'good' or 'bad' for health" }
  
  Ensure the response is valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nutrients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  status: { 
                    type: Type.STRING, 
                    enum: ["optimal", "deficit", "excess"] 
                  }
                },
                required: ["name", "amount", "unit", "status"]
              }
            },
            totalCalories: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                assessment: { 
                  type: Type.STRING,
                  enum: ["Optimal", "Caution", "Critical"]
                },
                score: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["assessment", "score", "description"]
            }
          },
          required: ["nutrients", "totalCalories", "recommendations", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
}
