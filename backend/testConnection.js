const connectDB = require('./db/connection');

connectDB().then(() => {
  console.log('Connection test successful');
  process.exit(0);
}).catch(err => {
  console.error('Connection test failed:', err);
  process.exit(1);
});