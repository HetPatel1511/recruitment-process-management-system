import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Position } from './pages/position';
import { NewPosition } from './pages/newPosition';
import { SinglePosition } from './pages/singlePosition';
import { ToastContainer } from 'react-toastify';
import { NewSkill } from './pages/newSkill';
import { ProtectedRoute } from './routes/protectedRoute';
import { PERMISSIONS, ROLES } from './permissions/permission';


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

          {/* Positions */}
          <Route path='/positions'>
            <Route index element={
              <ProtectedRoute permission={PERMISSIONS.READ_POSITIONS}>
                <Position />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute roles={[ROLES.RECRUITER]} permission={PERMISSIONS.CREATE_POSITIONS}>
                <NewPosition />
              </ProtectedRoute>
            } />
            <Route path=":id" element={
              <ProtectedRoute permission={PERMISSIONS.READ_POSITION}>
                <SinglePosition />
              </ProtectedRoute>
            } />
          </Route>

          {/* Skills */}
          <Route path='/skills'>
            <Route path="new" element={
              <ProtectedRoute roles={[ROLES.RECRUITER]} permission={PERMISSIONS.CREATE_SKILL}>
                <NewSkill />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
