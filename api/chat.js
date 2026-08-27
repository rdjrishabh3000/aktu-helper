// Serverless Backend Handler for Vercel
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Message content is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured on server environment." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert engineering tutor for AKTU university students. Provide concise, accurate, and structured responses for exam preparation.\n\nUser Question: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message || "Gemini API returned an error." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, couldn't process an answer right now.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error connecting to AI service." });
  }
}