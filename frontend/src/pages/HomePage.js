import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, TextField, Typography, Box, Stack, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';

const presetTopics = ['AI', 'Crypto', 'Stocks'];

const getInitialTopics = () => {
  const savedTopics = localStorage.getItem('userTopics');
  return savedTopics ? JSON.parse(savedTopics) : [];
};

function HomePage() {
  const [search, setSearch] = useState("");
  const [userTopics, setUserTopics] = useState(getInitialTopics());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('userTopics', JSON.stringify(userTopics));
  }, [userTopics]);

  const handleTopicClick = (topic) => {
    navigate(`/analysis/${topic}`);
  };

  const handleAddTopic = () => {
    if (!search) return;
    if (presetTopics.includes(search) || userTopics.includes(search)) {
      setSearch("");
      return;
    }
    setUserTopics([search, ...userTopics]);
    setSearch("");
  };


  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Add a new topic to your dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <TextField
          label="Enter a topic"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAddTopic}
          sx={{ marginLeft: '1rem'}}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>

      <Divider sx={{ marginY: '2rem' }} />

      <Box sx={{ marginBottom: '2rem' }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Preset Topics
        </Typography>
        <Stack direction="row" spacing={1}>
          {presetTopics.map(topic => (
            <Button 
              key={topic} 
              variant="outlined" 
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Button>
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Your Added Topics
        </Typography>
        {userTopics.length === 0 && <Typography>None</Typography>}
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {userTopics.map(topic => (
            <Button 
              key={topic} 
              variant="outlined" 
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Button>
          ))}
        </Stack>
      </Box>

    </Box>
  );
}

export default HomePage;