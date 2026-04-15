import express from 'express';

const app = express();


app.get('/', (req, res) => {
    res.send('Hello World')
});


const port = 3300;
app.listen(port, () => {
    console.log(`Server is listening on ${'localhost'}:${port}`)
})