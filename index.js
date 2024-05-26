const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to get completion from OpenAI
async function requestOpenAi(messages) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages
    });
    console.log('OpenAI Chat response:', response);
    return response.choices[0].message.content;
}

// Function to save result to file
function saveOpenAiResults(content) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `results-${timestamp}.txt`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, content, 'utf8');
    return filePath;
}

// Main function
async function run(messages) {
    try {
        const completion = await requestOpenAi(messages);
        const filePath = saveOpenAiResults(completion);
        console.log(`Result saved to ${filePath}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const userPrompt = "Hello, how are you?";
const systemPrompt = 'Translate the user prompt into pirate language';
const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
];

run(messages);
