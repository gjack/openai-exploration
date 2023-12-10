import React, {useState} from "react"
import "./styles/style.css"

function Home() {
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
            const response = await fetch("/api/chatgpt", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputValue })
            })

            if (response.ok) {
                const data = await response.json()
                setPrompt(inputValue)
                setResult(data.data.choices[0].text)
                setJresult(JSON.stringify(data.data, null, 2))
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
        {result && <div className="alert alert-success mt-3">{result}</div>}
        {result && (<pre className="alert alert-info mt-3"><code>{jresult}</code></pre>)}
    </div>
    )
    
}

export default Home