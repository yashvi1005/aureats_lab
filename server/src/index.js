require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/db');

const PORT = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });

