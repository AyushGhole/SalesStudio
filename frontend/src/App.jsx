import "./App.css";
import Main from "./components/Main.jsx";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/signUp.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
