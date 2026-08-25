import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();


await connectDB();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

//API
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend server running successfully!'});
});
app.listen(PORT, () => {
  console.log(`Server is running on port:  ${PORT}`);
});
