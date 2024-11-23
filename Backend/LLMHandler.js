import { Ollama } from 'ollama'

class LLMHandler {
    modelAddress;
    modelName;

    constructor(modelAddress, modelName) {
        this.modelAddress = modelAddress;
        this.modelName = modelName;
    }

    updateCredentials(modelAddress, modelName) {
        this.modelAddress = modelAddress;
        this.modelName = modelName;
    }

    async generateAnswer(userMessage){
        const ollama = new Ollama({host: this.modelAddress})

        let response = await ollama.chat({
            model: this.modelName,
            messages: [{role: 'user', content: userMessage }],
        })

        return response.message;
    }
}

export default LLMHandler;