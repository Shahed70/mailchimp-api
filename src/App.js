import "./App.css";
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewForm from "./components/NewForm";
import { useState } from "react";
function App() {
  const [code, setCode] = useState("")
  return (
    <div className="container flex justify-center my-10">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm setCode={setCode} />}/>
          <Route path="/newForm" element={<NewForm code={code} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
