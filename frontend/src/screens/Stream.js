import React, {useState} from "react"
import "./styles/style.css"

function Stream() {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [result, setResult] = useState("")
    const [prompt, setPrompt] = useState("")
    const [jresult, setJresult] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!inputValue) {
            setError("Please, enter a value for prompt.")
            setPrompt("")
            setResult("")
            setJresult("")
            return
        }

        try {
            const controller = new AbortController()
            const signal = controller.signal

            const response = await fetch("/api/chatgpt_stream", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputValue }),
                signal: signal // abort signal
            })

            if (response.ok) {
                // we use the reader to read the data incrementally as it is sent in the stream
                const reader = response.body.getReader()
                // we need to decode the data as it is sent as buffers
                const decoder = new TextDecoder()
                let jresultData = []
                
                setPrompt(inputValue)
                setResult("")
                setInputValue("")
                setError("")
                
                let readerDone = false
                while (!readerDone) {
                    //The value property represents the data read from the stream.
                    //The done property indicates whether the reader has reached the end of the stream.
                    const { value, done } = await reader.read()
                    if (done) {
                       readerDone = true
                    } else {
                       let chunk = decoder.decode(value)
                       chunk = `[${chunk.replaceAll("}{", "},{")}]`
                       chunk = JSON.parse(chunk)
                       let text = ''
                       for (const part of chunk) {
                         text += part.choices[0].text
                       }
                       jresultData.push(chunk)

                       setResult(prevResult => (prevResult + text).replace("\n\n", "\n"))
                       setJresult(JSON.stringify(jresultData, null, 2))
                    }
                }
            } else {
                throw new Error("An error ocurred")
            }
        } catch (error) {
            console.log(error)
            setResult("")
            setError("An error ocurred while submitting the form.")
        }
     }

    return (
    <div className="container">
        <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="row form-group mt-2">
            <div className="col-sm-10">
            <div className="form-floating">
                <textarea
                    className="form-control custom-input"
                    id="floatingInput"
                    placeholder="Enter a prompt"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />
                <label htmlFor="floatingInput">Input</label>
            </div>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-primary custom-button" type="submit">Submit</button>
            </div>
        </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {prompt && <div className="alert alert-secondary mt-3">{prompt}</div>}
        {result && <div className="alert alert-success mt-3" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: result }}></div>}
        {result && (<pre className="alert alert-info mt-3"><code>{jresult}</code></pre>)}
    </div>
    )
    
}

export default Stream