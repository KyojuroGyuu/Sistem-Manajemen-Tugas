import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes, taskRoutes);

app.get('/', (req, res) => {
    res.send("API is running")
})

app.use('/uploads', express.static('uploads'))

app.use('/', (err, req, res, next) => {
    res.json({message: err})
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})