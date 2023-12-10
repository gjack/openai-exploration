import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";


function App(params) {
    return (
        <>
          <Router>
            <Routes>
                <Route path="/" element={Home}></Route>
            </Routes>
          </Router>
        </>
    )
}

export default App