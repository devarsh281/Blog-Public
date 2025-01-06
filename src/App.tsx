import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Display from "./Components/Display";
import PostDetail from "./Components/PostDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Display/>} />
        <Route path="/posts/:id" element={<PostDetail/>} />
      </Routes>
    </Router>
  );
};

export default App;
