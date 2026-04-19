import express from 'express';
import cors from 'cors'
import router from './routes/profileRoutes.js';

const app = express();

// Middlewares
app.use(cors());

// Routes
app.use('/profile', router)

app.get('/', (req, res) => {
    res.send('Hello World')
});


const port = 3300;
app.listen(port, () => {
    console.log(`Server is listening on ${'localhost'}:${port}`)
})