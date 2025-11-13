// --- client/src/pages/AnalysisPage.js ---
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import axios from 'axios';

function AnalysisPage() {
  const [articles, setArticles] = useState([]);

  const { topic } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      if (!topic) return;

      setArticles([]);

      try {
        const response = await axios.get(`/api/search?q=${topic}`);
        setArticles(response.data);
      } catch (err) {
        console.error("fetching data error", err);
      } finally {
      }
    };

    fetchData();
  }, [topic]);

  return (
    <div>
      <Link to="/">Back to Search</Link>
      
      <h2>Analysis for {topic}</h2>
      
      <div>
        {articles.map(article => (
          <div key={article.url}>
            <p><strong>{article.title}</strong></p>
            <p>Sentiment Score: {article.sentiment.score.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalysisPage;