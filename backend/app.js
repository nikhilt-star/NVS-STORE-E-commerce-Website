import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js'
import adminProductRouter from './routes/admin/products.route.js'
import shopProductsRouter from './routes/shop/products.routes.js'
import shopCartRouter from './routes/shop/cart.route.js'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials: true
}))

app.use(express.json())
app.use(morgan('dev'));
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductRouter)
app.use('/api/shop/products', shopProductsRouter)
app.use('/api/shop/cart', shopCartRouter)

export default app;

// 7:23