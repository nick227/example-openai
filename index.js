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
async function run() {
    try {
        const completion = await requestOpenAi(messages);
        const filePath = saveOpenAiResults(completion);
        console.log(`Result saved to ${filePath}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}


const systemPrompt2 = `You are a log processing machine. Analyze the user prompt and derive a response object. Response object contains the following properties: summary, category, keywords, customer, severity, location and product.`;
const tool_choice = 'analyze_log';
const tools = [
    {
        "type": "function",
        "function": {
            "name": "analyze_log",
            "description": "Analyzes log and returns response object",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {
                        "type": "string",
                        "description": "Summary of log"
                    },
                    "category": {
                        "type": "enum",
                        "description": "Category of log",
                        "enum": [
                            "error",
                            "warning",
                            "info",
                            "feeback"
                        ]
                    },
                    "keywords": {
                        "type": "array",
                        "description": "List of keywords",
                        "items": {
                            "type": "string",
                            "description": "Keyword"
                        }
                    },
                    "commands": {
                        "type": "array",
                        "description": "List of html command objects required to fulfill user request",
                        "items": {
                            "type": "object",
                            "description": "Html Command Object",
                            "properties": {
                                "command": {
                                    "type": "string",
                                    "description": "Command to execute",
                                    "enum": [
                                        "append",
                                        "prepend",
                                        "remove",
                                        "insert",
                                        "style",
                                        "edit",
                                        "publish"
                                    ]
                                },
                                "value": {
                                    "type": "string",
                                    "description": "object or html or css or string value for command"
                                },
                                "nodeId": {
                                    "type": "string",
                                    "description": "the target node id and data-node-id attribute value"
                                }
                            }
                        }
                    },
                    "response": {
                        "type": "string",
                        "description": "Informative, rich, proactive response to user prompt. Nice HTML formatting and interactive content rich. Helpful, suggestive, intelligent online form building expert."
                    }
                },
                "required": [
                    "response"
                ]
            }
        }
    }
]

const userPrompt = "Hello, how are you?";
const systemPrompt = 'Translate the user prompt into pirate language';
const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
]

run();
