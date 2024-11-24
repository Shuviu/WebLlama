// Dynamic Text adding
document.addEventListener("DOMContentLoaded", () => {
    // Clear the input field on page load
    const homeInputBar = document.getElementById("home-prompt-input");
    const promptInput = document.getElementById("conv-prompt-input");

    if (homeInputBar) homeInputBar.value = "";
    if (promptInput) promptInput.value = "";
});
//======== INPUT ACTION ========//
function onFirstInputSubmit(event) {
    event.preventDefault();
    // fetch html elements
    const homeInputBar = document.getElementById("home-prompt-input");
    const convChat = document.getElementById("conv-chat");
    const home = document.getElementById("home");
    const conversation = document.getElementById("conv");

    if (homeInputBar.value !== "") {
        // add conversation area for the chat
        home.replaceWith(conversation);
        conversation.style.display = "flex";
        const message = homeInputBar.value;
        homeInputBar.value = "";

        // Add the new messages (request animation frame to make sure the site is fully loaded)
        requestAnimationFrame(async () => {
            // Add the user message
            addNewMessage(convChat, message, 'user');

            // request the model message from the api
            const response = await fetchAnswer('http://localhost:3001/', message);
            // add the message to the chat
            addNewMessage(convChat, response, 'model');
        })
    }
}

async function onInputSubmit(event) {
    event.preventDefault();

    // fetch needed html elements
    const chat = document.getElementById("conv-chat");
    const promptInput = document.getElementById("conv-prompt-input");


    if (promptInput.value !== "") {
        // add user message
        const message = promptInput.value;
        promptInput.value = "";

        addNewMessage(chat, message, 'user');

        // fetch model response from the api
        const response = await fetchAnswer('http://localhost:3001', message);
        // add message to the chat
        addNewMessage(chat, response, 'model');
    }
}

function addNewMessage(container, message, type){
    // create new user message
    const newMessage = document.createElement("div");

    // prepare newTextField
    if (type === 'user'){
        newMessage.classList.add("user-text");
    }
    else if (type === 'model'){
        newMessage.classList.add("model-text");
    }
    newMessage.textContent = message;

    // insert the element
    container.insertBefore(newMessage, container.firstChild);
}

//======== INPUT MODEL ACTION ========//
// fetch the answer from the current model
async function fetchAnswer(url, userMessage) {
    try {
        const response =
            await fetch(`${url}?message=${encodeURIComponent(userMessage)}`, {
            method: 'GET',
        })

        if (response.status === 400){
            console.log(response.status);
            return "ALERT: Could not connect to the Ollama server. Make sure it is running!";
        }

        // return the message data
        return await response.text();

    }catch (error) {
        // catch and log error
        return "ALERT: Backend Server could not be reached.";
    }
}

//======== SELECTION MENU ========//

function onSelectionMenuClick(){
    const selectionMenu = document.getElementById("selection-menu");

    if (selectionMenu.style.display === 'flex'){
        selectionMenu.style.display = 'none';
    }
    else {
        selectionMenu.style.display = 'flex';
    }
}

// update the llm credentials on menuSubmit
async function onSelectionMenuSubmit(event) {
    event.preventDefault();
    // fetch params
    const modelAddressInput = document.getElementById("selection-menu-modeladdress");
    const modelNameInput = document.getElementById("selection-menu-modelname");
    // fetch POST API call
    try {
        // store the model params in a cookie
        createLLMCookie(modelAddressInput.value, modelNameInput.value);

        const response =
            await fetch(`http://localhost:3001/updateLLM?modellAdress=${encodeURIComponent(modelAddressInput.value)}&modelName=${encodeURIComponent(modelNameInput.value)}`, {
                method: 'POST',
            })

        // handle error owo
        if (response.status !== 200) {
            console.log("Failed to save the parameters");
            alert("Could not save the model parameters");
        }
    } catch (error) {
        // catch and log error
        console.log("Backend cant be reached");
        alert("Could not reach the backend server. Make sure it is running.")
    }

    document.getElementById("selection-menu").style.display = 'none';
}

function closeSelectionMenu(event){
    event.preventDefault();
    document.getElementById("selection-menu").style.display = 'none';
    readLLMCookie();
}

//======== COOKIE HANDLING ========//
function createLLMCookie(modelAddress, modelName){
    document.cookie = "modelAddress=" + modelAddress + "; Path=/; SameSite=Lax; Secure;";
    document.cookie = "modelName=" + modelName + "; Path=/; SameSite=Lax; Secure;";
}

function readLLMCookie(){
    console.log(document.cookie.toString());
}


