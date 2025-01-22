import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Display from "./Components/Display";
import PostDetail from "./Components/PostDetail";
import SignUpPage from "./Components/Authentication/SignUpPage";
import SignInPage from "./Components/Authentication/SignInPage";
import { AuthProvider } from "./Components/Authentication/AuthContext";

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Display/>} />
        <Route path="/posts/:id" element={<PostDetail/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/signin" element={<SignInPage/>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
