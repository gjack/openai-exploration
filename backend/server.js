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

const PORT = process.env.PORT

app.listen(PORT, console.log(`Server started on port ${PORT}`))