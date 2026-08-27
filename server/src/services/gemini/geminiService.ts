import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';
import { AdvisoryRequest, AIResponse, AIResponseSchema } from '../../schemas';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an AI-powered agriculture crop advisory assistant.

Your job is to analyze agricultural information provided by a user and generate a practical, cautious, evidence-oriented crop suitability advisory.

You are not a replacement for a qualified local agronomist, soil scientist, agricultural extension officer, or other agricultural professional.

Analyze the user's:
- location
- soil characteristics
- soil pH
- land area
- season
- temperature
- rainfall
- water availability
- irrigation method
- previous crop
- farming objective
- preferred crop category
- observations

Do not blindly recommend a crop.

Evaluate crop suitability using multiple agricultural factors.

Consider:
1. Soil compatibility
2. Soil pH suitability
3. Climate suitability
4. Temperature compatibility
5. Rainfall compatibility
6. Water requirements
7. Irrigation availability
8. Season suitability
9. Crop rotation considerations
10. Land constraints
11. Farming objective
12. Potential pests and diseases
13. Environmental risks
14. Sustainability
15. General cultivation feasibility

When information is missing, explicitly identify the uncertainty instead of inventing facts.

Do not claim guaranteed yield, guaranteed profit, guaranteed weather, guaranteed disease resistance, or guaranteed crop success.

Do not fabricate local agricultural statistics.

Provide practical recommendations while clearly distinguishing general agricultural guidance from information that requires local verification.

Return ONLY valid JSON matching the requested schema.

Do not return Markdown.

Do not surround the JSON with code fences.

Do not add explanatory text outside the JSON.`;

/**
 * Calls Gemini API to generate crop recommendations based on form data,
 * then validates the returned JSON against the Zod schema.
 */
export const generateCropAdvisory = async (data: AdvisoryRequest): Promise<AIResponse> => {
  const prompt = `Analyze the following farm information and generate a crop advisory.

Farm:
${data.farmName}

Location:
${data.country}, ${data.state}, ${data.district}

Soil:
Type: ${data.soilType}
pH: ${data.soilPH !== undefined && data.soilPH !== null ? data.soilPH : 'Unknown'}

Land:
${data.landArea} ${data.landUnit}

Season:
${data.season}

Average temperature:
${data.averageTemperature !== undefined && data.averageTemperature !== null ? data.averageTemperature : 'Unknown'} °C

Rainfall:
${data.rainfall}

Water availability:
${data.waterAvailability}

Irrigation:
${data.irrigationMethod}

Previous crop:
${data.previousCrop || 'None'}

Farming goal:
${data.farmingGoal}

Preferred crop category:
${data.preferredCropCategory}

Additional observations:
${data.additionalObservations || 'None'}

Recommend the most suitable crops based on the available information.

Provide between 3 and 5 crop recommendations when enough information is available.

Rank recommendations by suitability.

Use a suitability score from 0 to 100.

Explain the main reasons behind each recommendation.

Explicitly identify important risks and uncertainties.

Return only JSON matching the requested schema.`;

  try {
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini API returned an empty response');
    }

    let parsedJSON: any;
    try {
      parsedJSON = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response text as JSON:', responseText);
      throw new Error('AI returned an invalid JSON structure');
    }

    const validationResult = AIResponseSchema.safeParse(parsedJSON);
    if (!validationResult.success) {
      console.error('Gemini response failed Zod validation:');
      console.error(JSON.stringify(validationResult.error.format(), null, 2));
      throw new Error('AI response structure was malformed or incomplete');
    }

    return validationResult.data;
  } catch (error: any) {
    console.error('Error generating advisory from Gemini:', error);
    throw new Error(error.message || 'Unable to generate agricultural advisory. Please try again.');
  }
};
