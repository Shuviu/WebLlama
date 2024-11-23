import express from 'express'; // ESM import
import cors from 'cors'; // ESM import
import LLMHandler from './LLMHandler.js';

const app = express();
const port = 3001;
let llmHandler =  new LLMHandler();


app.use(cors({
    origin: '*' // Replace with your client's URL
}));

app.get('/', async (req, res) => {
    try{
        const userMessage = req.query.message;
        const response = await llmHandler.generateAnswer(userMessage);

        res.status(400)

        res.send(response.content);
    }catch (error){
        console.log(error)
        res.status(400).send(error.message);
    }


})

app.post('/updateLLM', async (req, res) => {
    try{
        const modelAddress = req.query.modelAddress;
        const modelName = req.query.modelName;

        llmHandler.updateCredentials(modelAddress, modelName);
        res.status(200).send();
    }catch(e){
        console.error(e);
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
