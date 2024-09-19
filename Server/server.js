import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/MongoDb.js';
import ImportData from './Dataimport.js';
import productRoute from './Routes/ProductRoutes.js';
import { notFound,errorHandler } from "./Middleware/Errors.js";
import userRouter from './Routes/UserRouters.js';
import orderRouter from './Routes/OrderRoutes.js';
import categoryRouter from './Routes/CategoryRoutes.js';

connectDatabase();
dotenv.config();
const app = express();
app.use(express.json());

// API
app.use('/api/import', ImportData);
app.use('/api/products', productRoute);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/categorys', categoryRouter);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound); 
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, console.log(`server running port ${PORT}...`));