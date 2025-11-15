import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Position } from './pages/position';
import { NewPosition } from './pages/newPosition';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth'>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path='/positions'>
            <Route index element={<Position />} />
            <Route path="new" element={<NewPosition />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
