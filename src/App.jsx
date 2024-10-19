import react from 'react'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import Header from './Components/Header/Header'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home/Home'
import DeellarDetails from './Components/Deellar/DeellarDetails'
import BillDetails from './Components/Bill/BillDetails'

function App() {

  return (
    <> 
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dealer/:dealerId" element={<DeellarDetails/>} />
          <Route path="/bill/:billId" element={<BillDetails/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App