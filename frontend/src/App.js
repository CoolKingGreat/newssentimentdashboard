import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    if (!search) {
      return;
    }

    setArticles([])

    try{
      const response = await axios.get(`/api/search?q=${search}`);
      setArticles(response.data);
      } catch (err){
        console.error("fetching data error", err)
      }
  }

  return (
    <div className="App">
      <h1>News Sentiment</h1>
      <div>
        <input type="text" placeholder="Enter a topic" value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
        {articles.map(article => (
          <div key={article.url}>
            <p>{article.title} {article.sentiment.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
