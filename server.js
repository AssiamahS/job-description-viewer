const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. The Scraper Tunnel
app.post('/scrape', async (req, res) => {
    try {
        const { url } = req.body;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        res.json({ contents: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape site' });
    }
});

// 2. The AI Tunnel (Works for Claude, Gemini, or GPT)
app.post('/analyze', async (req, res) => {
    const { provider, apiKey, jobText } = req.body;
    
    try {
        let aiResponse;
        if (provider === 'claude') {
            aiResponse = await axios.post('https://api.anthropic.com/v1/messages', {
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{ role: 'user', content: `Analyze this job: ${jobText}` }]
            }, {
                headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }
            });
            res.json({ text: aiResponse.data.content[0].text });
        } 
        // Add Gemini/GPT logic here later
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Tunnel running on http://localhost:3000'));
