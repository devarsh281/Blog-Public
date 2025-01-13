import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Display from "./Components/Display";
import PostDetail from "./Components/PostDetail";
// import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Display/>} />
        <Route path="/posts/:id" element={<PostDetail/>} />
        {/* <Route path="/navbar" element={<Navbar/>} /> */}
      </Routes>
    </Router>
  );
};

export default App;
