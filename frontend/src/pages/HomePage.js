import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const presetTopics = ['AI', 'Crypto', 'Stocks'];

function HomePage() {
  const [search, setSearch] = useState("");
  const [userTopics, setUserTopics] = useState([]); 

  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    navigate(`/analysis/${topic}`);
  };

  const handleAddTopic = () => {
    if (!search) return;
    
    if (presetTopics.includes(search) || userTopics.includes(search)) {
      setSearch("");
      return; 
    }
    
    // add search term to topics
    setUserTopics([search, ...userTopics]);
    setSearch("");
  };

  return (
    <div>
      <div>
        <h3>Add a new topic to dashboard</h3>
        <input 
          type="text" 
          placeholder="Enter a topic" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleAddTopic}>Add Topic</button>
      </div>

      <div>
        <h3>Preset Topics</h3>
        {presetTopics.map(topic => (
          <button key={topic} onClick={() => handleTopicClick(topic)}>
            {topic}
          </button>
        ))}
      </div>

      <div>
        <h3>Your Topics</h3>
        {userTopics.length === 0 && <p>None</p>}
        
        {userTopics.map(topic => (
          <button key={topic} onClick={() => handleTopicClick(topic)}>
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;