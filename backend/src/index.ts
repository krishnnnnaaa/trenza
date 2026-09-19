import express from 'express'

export const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res)=>{
    return res.send('hello from -/ get route');
})


app.listen(port, () =>{
    console.log(`Server is successfully running on http://localhost:${port}`);
})