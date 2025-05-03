// Import necessary modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File path for data storage
const dataFilePath = path.join(__dirname, '../data/data.json');

// Load data from the JSON file
function loadData() {
  const file = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(file);
}

// Save data to the JSON file
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// POST route for saving journal and goals
router.post('/', (req, res) => {
  const { context, input } = req.body;
  if (!context || !input) {
    return res.status(400).json({ error: 'Missing context or input' });
  }

  const data = loadData();

  if (!data[context]) {
    data[context] = [];
  }

  data[context].push({
    text: input,
    timestamp: new Date().toISOString()
  });

  saveData(data);

  res.json({
    response: `Saved to ${context}: "${input}"`
  });
});

// NEW: GET route for fetching journal or goals
router.get('/:context', (req, res) => {
  const { context } = req.params;

  // Load data from file
  const data = loadData();

  // Check if the requested context exists
  if (!data[context]) {
    return res.status(404).json({ error: `No data found for context: ${context}` });
  }

  res.json({
    context,
    data: data[context]
  });
});

// DELETE route for removing journal or goals
router.delete('/:context', (req, res) => {
    const { context } = req.params;
    const { timestamp, text } = req.body; 
    
    // Load data from file
    const data = loadData();
  
    // Check if the context exists
    if (!data[context]) {
      return res.status(404).json({ error: `No data found for context: ${context}` });
    }
  
    // Find the index of the entry to delete based on timestamp or text
    const entryIndex = data[context].findIndex(entry => entry.timestamp === timestamp || entry.text === text);
  
    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }
  
    // Remove the entry from the array
    data[context].splice(entryIndex, 1);
  
    // Save the updated data
    saveData(data);

    console.log("Data to delete:", timestamp, text);
  
    res.json({
      response: `Entry deleted from ${context}.`
    });
  });
  

module.exports = router;
