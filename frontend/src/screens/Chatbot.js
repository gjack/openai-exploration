import React, {useState, useEffect} from "react"
import "./styles/style.css"
import axios from "axios"

function Chatbot() {
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [jresult, setJresult] = useState("")
    const [selectedOption, setSelectedOption] = useState()
    const [messages, setMessages] = useState([
        { role: "system", content: "You are an assistant" }
    ])

    const personalities = [
        {
            title: "Thomas Alva Edison",
            description: "American inventor and businessman",
            image: "edison.jpeg"
        },
        {
            title: "Albert Einstein",
            description: "German physicist and Nobel prize winner",
            image: "einstein.jpeg"
        }
    ]

    const handleSubmit = async (event) => {
        event.preventDefault()
        // We'll send a request only if there is an input
        if (inputValue) {
           try {
             const updatedMessages = [...messages, { role: "user", content: inputValue.trim() }]
             setMessages(updatedMessages)

             const response = await axios.post("/api/chatbot", { messages: updatedMessages })
             const serverResponse = response.data

             // add server response to messages array
             const serverUpdatedMessages = [...updatedMessages, { role: "assistant", content: serverResponse.data.choices[0].message.content }]
             
             setMessages(serverUpdatedMessages)
             setInputValue("") // clear the input
             
             setJresult(JSON.stringify(serverResponse, null, 2))
           } catch (error) {
             console.log("An error occurred", error)
             setError('An error occurred')
           }
        }
    }

const handleOptionSelect = (option) => {
  setMessages([{
    role: "system",
    content: `I want you to act as ${option}`
  }])
  setSelectedOption(option)
}

useEffect(() => {
  const chatContainer = document.getElementById("chat_container")
  const scrollOptions = {
    top: chatContainer.scrollHeight, // make it scroll to the bottom
    behaviour: "smooth"
}
  chatContainer.scrollTo(scrollOptions)
}, [messages])

    return (
    <div>
        <div className="d-flex flex-column chat-page">
            <div id="personalities" className="text-center">
              <h3>{selectedOption ? "You are chatting with" : "Please, select a character"}</h3>
              <div className="d-flex justify-content-evenly mr-10">
                {personalities.map((personality, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={`images/${personality.image}`}
                        alt={personality.title}
                        className={`img-thumbnail rounded-circle ${selectedOption === personality.title ? 'selected' : ''}`}
                        style={{ maxWidth: "150px" }}
                        onClick={() => handleOptionSelect(personality.title)}
                      />
                      <h6>{personality.title}</h6>
                      <p>{personality.description}</p>
                    </div>
                ))}
              </div>
            </div>
            <div id="chat_container" className="flex-fill overflow-auto">
                {messages.map((message, index) => message.role !== "system" && (
                <div 
                  key={index}
                  className={`${message.role === 'user' ? 'alert alert-info' : 'alert alert-success'}`}
                >
                  {message.content}  
                </div>))}
              <div>

              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
            <form className="form-horizontal mb-3 container-fluid" onSubmit={handleSubmit}>
                <div className="row form-group mt-2">
                    <div className="col-sm-11">
                    <div className="form-floating">
                        <input
                            className="form-control custom-input"
                            id="floatingInput"
                            placeholder="Enter a prompt"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Input</label>
                    </div>
                    </div>
                    <div className="col-sm-1">
                    <button className="btn btn-primary custom-button" type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
        {jresult && (<pre className="alert alert-info mt-3"><code>{jresult}</code></pre>)}
    </div>
    )
    
}

export default Chatbot