import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import categoriesRouter from './routes/categories/category.routes.js'
import cartRouter from './routes/carts/cart.routes.js'
import productRouter from './routes/products/product.routes.js'
import wishlistRouter from './routes/wishlists/wishlist.routes.js'
import addressRouter from './routes/addresses/address.routes.js'
import ordersRouter from './routes/orders/order.route.js'
import paymentRouter from './routes/payment/payment.route.js'
import checkoutRouter from './routes/checkout/checkout.route.js'

export const app = express();
const port = 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

// app routes
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/address', addressRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/checkout', checkoutRouter)


app.get('/', (req, res)=>{
    return res.send('hello from -/ get route');
})


app.listen(port, () =>{
    console.log(`Server is successfully running on http://localhost:${port}`);
})