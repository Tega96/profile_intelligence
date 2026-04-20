const errorHandler = (err, req, res, next) => {
    console.error('Error details: ', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });

    // Handle database errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(502).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }

    // Handle duplicate key error (should not happen due to idempotency Check
    if (err.code === '23505') {
        return res.status(404).json({
            status: 'error',
            message: 'Profile already exists'
        });
    }

    //Handle other database errors 
    if (err.code && err.code.statsWith('23')) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid data format'
        });
    }

    // Default server error 
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
}

const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    })
}

export {
    errorHandler, 
    notFoundHandler
}