const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const GNEWS_API_URL = 'https://gnews.io/api/v4';
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;


app.use(cors({ origin: "*" }));
app.use(express.json());


app.get('/api/news', async (req, res) => {
    try {
        const { query, country, category, lang } = req.query;


        let url = `${GNEWS_API_URL}/top-headlines?token=${GNEWS_API_KEY}`;
        if (query) url += `&q=${query}`;
        if (country) url += `&country=${country}`;
        if (category) url += `&topic=${category}`;
        if (lang) url += `&lang=${lang}`;

        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});


app.get('/api/news/:id', async (req, res) => {
    try {
        const newsId = req.params.id;
        const response = await axios.get(`${GNEWS_API_URL}/article/${newsId}?token=${GNEWS_API_KEY}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the news article' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






cron.schedule('*/5 * * * *', () => {
    axios.get(`http://localhost:${PORT}`)
        .then(() => console.log('Pinged the server to keep it awake'))
        .catch(err => console.error('Error pinging server:', err));
});