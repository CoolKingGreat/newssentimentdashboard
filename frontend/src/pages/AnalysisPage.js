import React, { useState, useEffect } from 'react';

import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Link, 
  CircularProgress, 
  Paper,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AnalysisPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { topic } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!topic) return;
      setLoading(true);
      setArticles([]);
      try {
        const response = await axios.get(`/api/search?q=${topic}`);
        setArticles(response.data);
      } catch (err) {
        console.error("fetching data error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topic]);

  const calcAvg = () => {
    if (articles.length === 0) return 0;
    let totalScore = 0;
    for (let i = 0; i < articles.length; i++) {
      totalScore += articles[i].sentiment.score;
    }
    return totalScore / articles.length;
  };

  const averageScore = calcAvg().toFixed(2);

  const getSentimentBorder = (score) => {
    if (score > 0.5) {
      return { borderLeft: '5px solid #2e7d32' };
    } else if (score < -0.5) {
      return { borderLeft: '5px solid #d32f2f' };
    } else {
      return { borderLeft: '5px solid #ed6c02' };
    }
  };

  const getChartData = () => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    articles.forEach(article => {
      if (article.sentiment.score > 0.5) positive++;
      else if (article.sentiment.score < -0.5) negative++;
      else neutral++;
    });

    return [
      { name: 'Positive', count: positive, fill: '#2e7d32' },
      { name: 'Neutral', count: neutral, fill: '#ed6c02' },
      { name: 'Negative', count: negative, fill: '#d32f2f' },
    ];
  };

  return (
    <Box>
      <Link 
        component={RouterLink} 
        to="/"
        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <ArrowBackIcon sx={{ marginRight: '0.5rem' }} />
        Back to Search
      </Link>
      
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ marginTop: '1rem', textTransform: 'capitalize' }}
      >
        Analysis for "{topic}"
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          <Paper 
            elevation={3} 
            sx={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}
          >
            <Typography variant="h6" component="h3">
              Overall Sentiment Score
            </Typography>
            <Typography variant="h2" component="p" sx={{ fontWeight: 'bold' }}>
              {averageScore}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              (Based on {articles.length} articles)
            </Typography>
          </Paper>
          
          <Stack spacing={2}>
            {articles.map(article => (
              <Card 
                key={article.url} 
                sx={getSentimentBorder(article.sentiment.score)}
                elevation={1}
              >
                <CardContent>
                  <Typography variant="h6" component="h3">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginY: '0.5rem' }}>
                    Score: {article.sentiment.score.toFixed(2)}
                  </Typography>
                  <Link 
                    href={article.url} 
                    target="_blank" 
                  >
                    Read full article
                  </Link>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}

export default AnalysisPage;