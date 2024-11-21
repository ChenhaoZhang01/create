const express = require('express');
const axios = require('axios');
const app = express();

// Use environment variable for port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// OpenAI API Key (keep it secure!)
const apiKey = process.env.API_KEY;
app.get('/', (req, res) => {
  res.send('Hello, world! The server is running.');
});
app.post('/chat', async (req, res) => {
  const userInput = req.body.prompt;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', // Or gpt-4 if you’re using that model
      messages: [
        { role: 'user', content: userInput }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Send back the response to the frontend
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});
