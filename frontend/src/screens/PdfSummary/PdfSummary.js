import React, {useState} from "react"
import "../styles/style.css"
import axios from "axios"

function PdfSummary() {
    const [error, setError] = useState("")
    const [result, setResult] = useState("")
    const [jresult, setJresult] = useState("")
    const [maxWordsNumber, setMaxWordsNumber] = useState(100)
    const [selectedFile, setSelectedFile] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (!maxWordsNumber) {
            setError("Please, enter a number of words")
            setResult("")
            setJresult("")
            return
        }

        try {
            const formData = new FormData()
            formData.append('pdf', selectedFile)
            formData.append('maxWordsNumber', maxWordsNumber)
            
            // fetch is not that great for submitting form-data so we use axios instead
            const response = await axios.post("/api/pdfsummary", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            if (response.data.error) {
                setError(response.data.error)
                return
            }

            setError("")
            setJresult(JSON.stringify(response.data, null, 2))
        } catch (error) {
            console.log(error)
            setResult("")
            setError("An error ocurred while submitting the form.")
        } finally {
            setLoading(false)
        }
     }

    const handleFileChange = (e) => {
      const file = e.target.files[0]
      setSelectedFile(file)
    }

    return (
    <div className="container">
        <div className=" hero d-flex align-items-center justify-content-center text-center flex-column p-3">
            <h1 className="display-4">PDF Summaries</h1>
            <p className="lead">Summarize PDF documents for efficient reading!</p>
            <form className="w-100" onSubmit={handleSubmit}>
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
        {jresult && (<pre className="alert alert-info mt-3"><code>{jresult}</code></pre>)}
    </div>
    )
    
}

export default PdfSummary