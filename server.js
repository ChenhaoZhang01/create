const express = require('express');
const axios = require('axios');
const app = express();

// Use environment variable for port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// OpenAI API Key (keep it secure!)
const apiKey = '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';

// Route to handle user input and call OpenAI API
app.post('/chat', async (req, res) => {
  const userInput = req.body.prompt;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',  // Or gpt-4 if you're using that model
      messages: [
        { role: 'user', content: userInput }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Return the ChatGPT response to the frontend
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Start the server on the dynamic port provided by Heroku or default to 3000 locally
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
