import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import "./styles/bootstrap-custom.scss"
import Stream from "./screens/Stream";


function App(params) {
    return (
      <Router>
        <Routes>
          <Route path="/" Component={Home}></Route>
          <Route path="/stream" Component={Stream}></Route>
        </Routes>
      </Router>
    )
}

export default App