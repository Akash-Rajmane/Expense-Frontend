import { useState } from 'react';
import './App.css';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import ExpenseReport from './pages/ExpenseReport';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import useAuth from './hooks/useAuth';
import { Nav } from './components/Navigation/Nav';

function App() {
  const { token, login, logout, userId } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/expense-report" element={<ExpenseReport/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/password/reset-password/:id" element={<ResetPassword/>}/>
        <Route path="*" element={<Navigate to="/auth" replace/>} />
      </Routes>
    );
  }
 
  
  return (
    <AuthContext.Provider
    value={{
      userId: userId,
      token: token,
      isPremiumUser: isPremiumUser,
      setIsPremiumUser: setIsPremiumUser,
      login: login,
      logout: logout,
    }}
    >
      {token && <Nav/>}
      {routes}
    </AuthContext.Provider>
  );
}

export default App;
