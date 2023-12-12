import React, {useState} from "react"
import "../styles/style.css"

function PdfSummary() {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [result, setResult] = useState("")
    const [jresult, setJresult] = useState("")
    const [maxWordsNumber, setMaxWordsNumber] = useState(100)
    const [selectedFile, setSelectedFile] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!inputValue) {
            setError("Please, enter a value for prompt.")
            setResult("")
            setJresult("")
            return
        }

        try {
            const response = await fetch("/api/pdfsummary", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputValue })
            })

            if (response.ok) {
                const data = await response.json()
                setResult(data.data.choices[0].text)
                setJresult(JSON.stringify(data.data, null, 2))
                setInputValue("")
                setError("")
            } else {
                throw new Error("An error ocurred")
            }
        } catch (error) {
            console.log(error)
            setResult("")
            setError("An error ocurred while submitting the form.")
        }
     }

    const handleFileChange = () => {

    }

    return (
    <div className="container">
        <div className=" hero d-flex align-items-center justify-content-center text-center flex-column p-3">
            <h1 className="display-4">PDF Summaries</h1>
            <p className="lead">Summarize PDF documents for efficient reading!</p>
            <form className="w-100">
                <input type="file" accept=".pdf" onChange={handleFileChange}></input>
                <div className="form-group row">
                  <div className="col-sm-4 offset-sm-4 mt-3">
                    <input 
                      type="number" min={10} 
                      value={maxWordsNumber} 
                      onChange={(e => setMaxWordsNumber(e.target.value))} 
                      className="form-control">
                    </input>
                  </div>
                  <button type="submit" disabled={!selectedFile || loading} className="btn btn-primary custom-button mt-1">
                    {loading ? "Analysing PDF..." : `Summarize PDF in about ${maxWordsNumber} words`}
                  </button>
                </div>
            </form>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {result && <div className="alert alert-success mt-3">{result}</div>}
        {result && (<pre className="alert alert-info mt-3"><code>{jresult}</code></pre>)}
    </div>
    )
    
}

export default PdfSummary