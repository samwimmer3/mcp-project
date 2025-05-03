const express = require('express');
const app = express();

app.use(express.json());

try {
  const mcpRoutes = require('./routes/mcp');
  app.use('/mcp', mcpRoutes);
} catch (error) {
  console.error('Failed to load MCP routes:', error);
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
