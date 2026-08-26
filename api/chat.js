	// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured on server." });
  }

  try {
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `You are an expert engineering tutor for AKTU university students. Provide concise, accurate, and easy-to-understand explanations for exam preparation.\n\nUser Question: ${message}` }]
        }
      ]
    })
  }
);
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, couldn't process an answer right now.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Error connecting to AI service." });
  }
}