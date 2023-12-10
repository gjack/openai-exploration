import React, {useState} from "react"
import "./styles/style.css"

function Home() {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [result, setResult] = useState("")
    const [prompt, setPrompt] = useState("")
    const [jresult, setJresult] = useState("")

    const handleSubmit = (event) => { }

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
              <div className="btn btn-primary custom-button" type="submit">Submit</div>
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