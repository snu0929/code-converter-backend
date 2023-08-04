const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
// Function to call GPT API for code conversion
async function convertCodeWithGPT(code, targetLanguage) {
  const apiKey = process.env.OPENAI_API_KEY; // Access the API key from environment variable
  const gptEndpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await axios.post(
      gptEndpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Convert this ${targetLanguage} code to ${targetLanguage}:\n${code}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extracting the model's response message from the API response
    const convertedCode = response.data.choices[0].message.content;
    return convertedCode;
  } catch (error) {
    console.error("Error calling GPT API:", error.message);
    return `Error converting code: ${error.message}`;
  }
}

// Function to call GPT API for code debugging

async function debugCodeWithGPT(code) {
  const apiKey = process.env.OPENAI_API_KEY; // Access the API key from environment variable
  const gptEndpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await axios.post(
      gptEndpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Debug this code:\n${code}` }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extracting the model's response message from the API response
    const debuggedCode = response.data.choices[0].message.content;
    return debuggedCode;
  } catch (error) {
    console.error("Error calling GPT API:", error.message);
    return `Error debugging code: ${error.message}`;
  }
}

// Function to call GPT API for code quality check
async function checkCodeQualityWithGPT(code) {
  const apiKey = process.env.OPENAI_API_KEY; // Access the API key from environment variable
  const gptEndpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await axios.post(
      gptEndpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Check the quality of this code:\n${code}` },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extracting the model's response message from the API response
    const qualityReport = response.data.choices[0].message.content;
    return qualityReport;
  } catch (error) {
    console.error("Error calling GPT API:", error.message);
    return `Error checking code quality: ${error.message}`;
  }
}

// Code Conversion Endpoint
app.post("/api/convert", async (req, res) => {
  const { code, targetLanguage } = req.body;
  const convertedCode = await convertCodeWithGPT(code, targetLanguage);
  res.json({ convertedCode });
});

// Code Debugging Endpoint
app.post("/api/debug", async (req, res) => {
  const { code } = req.body;
  const debuggedCode = await debugCodeWithGPT(code);
  res.json({ debuggedCode });
});

// Code Quality Check Endpoint
app.post("/api/check", async (req, res) => {
  const { code } = req.body;
  const qualityReport = await checkCodeQualityWithGPT(code);
  res.json({ qualityReport });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
