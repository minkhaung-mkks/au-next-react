import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './page/Home';
import Test from './page/Test';
function App() {

  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test_api" element={<Test />} />
      </Routes>
    </>
  )
}

export default App
