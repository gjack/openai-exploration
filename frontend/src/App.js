import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "./styles/bootstrap-custom.scss"
import Stream from "./screens/Stream";
import PdfSummary from "./screens/PdfSummary/PdfSummary";
import Chats from "./screens/Chats";


function App(params) {
    return (
      <Router>
        <Routes>
          <Route path="/" Component={Home}></Route>
          <Route path="/stream" Component={Stream}></Route>
          <Route path="/pdfsummary" Component={PdfSummary}></Route>
          <Route path="/chats" Component={Chats}></Route>
        </Routes>
      </Router>
    )
}

export default App