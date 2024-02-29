require('dotenv').config();
const { OpenAI } = require("openai");
const crypto = require('crypto');


// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a random string for user ID
function generateUserId() {
  return crypto.randomBytes(16).toString('hex'); // 16 bytes will generate a 32-character hex string
}

// Function to generate a random string for Bubbl ID
function generateBubblID() {
  return crypto.randomBytes(4).toString('hex'); // 4 bytes will generate an 8-character hex string
}

// Define your conversation content or import it from a file or database
const conversations = [
  // Your conversation objects go here
  [
    {
      Timestamp: '2024-02-28T10:47:18.227Z',
      prompttext: 'A barrier that stops the flow of water, and an anagram of "dam".',
      responsetext: 'Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser.',
      userid: 'AA00001',
      category: 'trivia',
      bubbltype: 'bubblxp',
      username: 'Amardeep Singh Sidhu',
      bubbidTimeStamp: 'ssddaa2233435',
      bubblid: 'ssddaa22',
      'userID#sessionID': 'AA00001AA11223345',
      bubblclass: 'chat'
    },
    {
      Timestamp: '2024-02-28T11:47:18.227Z',
      prompttext: 'Know any funny jokes about keys?',
      responsetext: 'A large language model is a language model notable for its ability to achieve general-purpose language generation and understanding. LLMs acquire these abilities by learning statistical relationships from text documents during a computationally intensive self-supervised and semi-supervised training process.',
      userid: 'AA00001',
      category: 'joke',
      bubbltype: 'bubblxp',
      username: 'Amardeep Singh Sidhu',
      bubbidTimeStamp: 'ssddaa22334455',
      bubblid: 'ssddaa23',
      'userID#sessionID': 'AA00001AA11223344',
      bubblclass: 'chat'
    }
  ]
];

console.log("conversations test for parameter",conversations.map((conversation, index)=>`${conversation[index]?.responsetext}`));
// Define the summarization request with the nested JSON format structure
const summarizationInstruction = "summarise the below chat in json format ensure that summatyTitle is meaningful and gives reader a jist of overall summary of all conversations that you have created. The format should be as follows:\n{\n  SummaryTitle:Give a meaningful title for this summary\n    Summary:{\n      conversation id:\n      title:\n      summary:\n      concepts:\n    }\n}";
// const conversationContent = summarizationInstruction + conversations.map((conversation, index) => `<conversations${index + 1}>\n${conversation.responsetext}`).join('\n');
const conversationContent = summarizationInstruction + conversations.map((conversation, index) => `<conversation${index + 1}>\n${conversation[index]?.responsetext}`).join('\n');
console.log("Modified conversationContent with nested JSON format summarization request: ", conversationContent);

async function summarizeConversation() {
  try {
    // Call the OpenAI summarization API with JSON response format
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or your preferred model
      messages: [{
        "role": "user",
        "content": conversationContent
      }],
      response_format: { type: "json_object" } // Correct way to enable JSON mode
    });

    // Log the summary to the console
    // console.log("Summary after scanning: ", summaryResponse);
    // console.log("Summary response: ", summaryResponse.choices[0].message.content);

    // Parse the JSON content from the response
    const summaryJson = JSON.parse(summaryResponse.choices[0].message.content);
    const summaryTitle = summaryJson.SummaryTitle;

    console.log("SummaryTitile is ", summaryTitle);
    console.log("SummaryJson is ", summaryJson);

    // Here you would handle the summaryJson as needed, such as saving to a database
    // Since we are not using DynamoDB in this script, the code for DynamoDB is omitted

  } catch (error) {
    console.error("Error:", error);
  }
}

// Invoke the summarization function
summarizeConversation();