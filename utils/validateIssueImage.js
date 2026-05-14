const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function validateIssueImage(imagePath) {

  try {

    const base64Image = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const response = await client.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
You are an AI assistant for a civic issue reporting platform.

Analyze the uploaded image carefully.

VALID civic issues include:
- potholes
- garbage dumps
- road damage
- drainage problems
- water leakage
- broken streetlights
- damaged public property
- traffic hazards
- public infrastructure damage

If image MAY represent a civic issue,
mark it as valid.

Be tolerant.
Do NOT reject uncertain images aggressively.

Respond ONLY in JSON:

{
  "isIssue": true,
  "confidence": 85,
  "category": "Road Damage",
  "reason": "Visible pothole on public road"
}
`
        },

        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this civic issue image"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }

      ],

      response_format: {
        type: "json_object"
      }

    });

    const result = JSON.parse(response.choices[0].message.content);

    return result;

  } catch (err) {

    console.log("AI VALIDATION ERROR:", err);

    return {
      isIssue: true,
      confidence: 50,
      category: "General Issue",
      reason: "Fallback validation"
    };

  }

}

module.exports = validateIssueImage;