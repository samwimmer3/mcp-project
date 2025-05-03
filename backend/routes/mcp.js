const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data/data.json');

function loadData() {
  const file = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(file);
}

function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

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

module.exports = router;
