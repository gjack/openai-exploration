import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "./styles/bootstrap-custom.scss"
import Stream from "./screens/Stream";
import PdfSummary from "./screens/PdfSummary/PdfSummary";
import FunctionChats from "./screens/FunctionChats";


function App(params) {
    return (
      <Router>
        <Routes>
          <Route path="/" Component={Home}></Route>
          <Route path="/stream" Component={Stream}></Route>
          <Route path="/pdfsummary" Component={PdfSummary}></Route>
          <Route path="/function_chats" Component={FunctionChats}></Route>
        </Routes>
      </Router>
    )
}

export default App