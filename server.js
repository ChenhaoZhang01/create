const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const apiKey = process.env.API_KEY;

if (!apiKey) {
 console.error('Error: Missing API Key in environment variables.');
 process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Hello, world! The server is running.');
});

app.get('/chat', async (req, res) => {
  res.send('Hello, world! The server is running.');
});

app.post('/chat', async (req, res) => {
  const userInput = req.body.prompt;

  if (!userInput) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await axios.post(
      'https://api.pawan.krd/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', 
        messages: [{ role: 'user', content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
