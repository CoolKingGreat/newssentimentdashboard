// load api key
require('dotenv').config();
const apiKey = process.env.gnews_api_key;

const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
const cors = require('cors');
const mongoose = require('mongoose');
const MOCK_DATA = require('./mock-tesla-data.json');
const USE_MOCK_DATA = true;

const app = express();
const port = 8000;
const sentiment = new Sentiment();

const dbUrl = 'mongodb://localhost:27017/insightfeed';

mongoose.connect(dbUrl)
  .then(() => console.log('connected to db'))
  .catch((err) => console.error('failed connecting to db:', err));

const cacheSchema = new mongoose.Schema({
  topic: { type: String, required: true, index: true }, // search term
  articles: { type: Array, required: true },         // article results array
  timestamp: { type: Date, default: Date.now }       // saved
});

const Cache = mongoose.model('Cache', cacheSchema);

// allow for frontend to talk to backend
app.use(cors());

// api search
app.get('/api/search', async (req, res) => {
  const topic = req.query.q;

  // if (USE_MOCK_DATA) {
  //   console.log(`mock data for tesla but actual search term was ${topic}`);
  //   return res.json(MOCK_DATA);
  // }

  try {

    const cachedData = await Cache.findOne({topic: topic});

    const expired = 24 * 60 * 60 * 1000; // 24 hr * 60 min * 60 s * 1000 ms
    if (cachedData && (new Date() - cachedData.timestamp) < expired) {
      console.log(`cache found for ${topic}`);
      return res.json(cachedData.articles);
    }

    console.log("no cache");

    const apiUrl = `https://gnews.io/api/v4/search?q=${topic}&lang=en&apikey=${apiKey}`;

    // 2. call gnews api
    const response = await axios.get(apiUrl);
    const articles = response.data.articles;

    // run sentiment analysis
    const analyzedArticles = articles.map(article => {
      const analysisResult = sentiment.analyze(article.title + ' ' + article.description);
      return {
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        source: article.source.name,
        sentiment: {
          score: analysisResult.score,
          comparative: analysisResult.comparative,
        }
      };
    });

    await Cache.findOneAndUpdate({topic: topic}, {articles: analyzedArticles, timestamp: new Date()}, {upsert: true, new: true});

    console.log(`cached ${topic}`)

    res.json(analyzedArticles);

  } catch (error) {
    console.error('Error fetching from GNews:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// start server
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});