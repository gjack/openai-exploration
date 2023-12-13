const express = require("express")
const dotenv = require("dotenv")
const app = express()

// accept json data in requests
app.use(express.json())

// setup environment variables
dotenv.config()

const { OpenAI } = require("openai")

const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`
})

// run completion

async function runCompletion(prompt) {
    const response = await openai.completions.create({
        prompt: prompt,
        model: 'text-davinci-003',
        max_tokens: 50
    }).asResponse()

    return await response.json()
}

// run completions in stream

async function startCompletionStream(prompt) {
    const stream = await openai.completions.create({
        prompt: prompt,
        model: 'text-davinci-003',
        max_tokens: 50,
        stream: true
    })

    return stream
}


app.post("/api/chatgpt", async function(req, resp) {
    try {
      const {text} = req.body

      const completion = await runCompletion(text)
      resp.json({ data: completion, ok: true })
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data)
            resp.status(error.response.status).json(error.response.data)
        } else {
            console.error("Error with OPENAI request:", error.message)
            resp.status(500).json({
                error: {
                    message: "An error ocurred during the request"
                }
            })
        }
    }
})

app.post("/api/chatgpt_stream", async function(req, resp) {
    try {
      const {text} = req.body
      
      const stream = await startCompletionStream(text)

      for await (const chunk of stream) {
        resp.write(JSON.stringify(chunk))
      }
      resp.end()

    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data)
            resp.status(error.response.status).json(error.response.data)
        } else {
            console.error("Error with OPENAI request:", error.message)
            resp.status(500).json({
                error: {
                    message: "An error ocurred during the request"
                }
            })
        }
    }
})

const multer = require('multer')
const path = require("path")
const { PDFExtract } = require('pdf.js-extract')
const upload = multer({ dest: path.join(__dirname, 'pdfsummaryfiles')})
const { encode } = require("gpt-3-encoder")

// calculate tokens

const calculateTokens = text => encode(text).length

// split large sentence into chunks

const splitSentence = (sentence, maxTokenSize = 2000) => {
    const sentenceChunks = []
    let partialChunk = ""

    const words = sentence.split(/\s/)

    for (const word of words) {
        if (calculateTokens(partialChunk + word) < maxTokenSize) {
           partialChunk += word + " " // we lose the space between words when we split them
        } else {
           sentenceChunks.push(partialChunk)
           partialChunk = word + " "
        }
    }
    if(partialChunk) {
      sentenceChunks.push(partialChunk)
    }
    return sentenceChunks
 }

// split text into chunks

function splitTextIntoChunks(text, maxTokenSize = 2000) {
    const chunks = []
    let currentChunk = ""

    // Break down in sentences. In the English language, a sentence can be considered to begin with a capital letter
    // and end with a period, exclamation mark or question mark, followed by some empty space
    const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")
    for (const sentence of sentences) {
      if (calculateTokens(currentChunk + sentence) < maxTokenSize) {
         currentChunk += sentence + " " // we lose the space between sentences when we split
      } else if (calculateTokens(sentence) < maxTokenSize) {
        chunks.push(currentChunk)
        currentChunk = sentence + " "
      } else {
        // push the currentChunk intto the array and split the sentence and push those chunks too
        chunks.push(currentChunk)
        const sentenceChunks = splitSentence(sentence, maxTokenSize)
        chunks.push(...sentenceChunks)
        // reset the currentChunk to an empty string
        currentChunk = " "
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk)
    }
    return chunks
 }

app.post("/api/pdfsummary", upload.single('pdf'), async function(req, resp) {
    try {
      const { maxWordsNumber } = req.body
      const pdfFile = req.file
      const extractor = new PDFExtract()
      const extractOptions = {
        firstPage: 1,
        lastPage: undefined, // we extract all the pages
        password: "", // these are not password protected
        verbosity: -1, // no logs
        normalizeWhitespace: false,
        disableCombinedTextItems: false
      }
      const data = await extractor.extract(pdfFile.path, extractOptions)
      const pdfText = data.pages.map(page => page.content.map(item => item.str).join("")).join(" ")
      
      // handle documents that have text only inside images and can't be parsed
      if (pdfText.length === 0) {
        resp.json({ error: "Could not extract text from this pdf document. Please try again with a different one."})
        return
      }

      resp.json({ chunks: splitTextIntoChunks(pdfText, 2000) })

    } catch (error) {
      console.error("An error occurred")
      resp.status(500).json({ error })
    }
})

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server started on port ${PORT}`))