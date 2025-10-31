import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth'>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
