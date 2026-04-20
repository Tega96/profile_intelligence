import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors'
import { router as profileRouter } from './routes/profileRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/erroHandler.js';
import { initializeDatabase } from './db'

configDotenv()
const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
})

// Health check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use('/api/profile', profileRouter)

// 404 handler for undefined routes 
app.use(notFoundHandler);

// Error handling middleware 
app.use(errorHandler);

// Initialize database and start server
const startServer() {
    try {
        // Initialize database connection 
        initializeDatabase();
        console.log(`Database connected successfully`)

        // Start server
        const port = process.env.PORT || 3300;
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
            console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        })
        
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}


// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n Shutting down gracefully...');
    import { closeDatabase } from './db';
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n Shutting down gracefully...');
    import { closeDatabase } from './db';
    await closeDatabase();
    process.exit(0);
});


startServer();

export default app;
