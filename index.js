import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productRouter from './routes/productRoutes.js';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';
import setupAdmin from './config/setupAdmin.js';  
import parameter from './routes/parameterRoute.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRouter);
app.use('/api/auth', authRoutes);
app.use('/api/device', parameter);
 

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Static file serving (for /uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// Start server and setup default admin
const PORT = 3000;
// const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await setupAdmin(); // ✅ Admin creation
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    process.exit(1);
  }
};

startServer();
