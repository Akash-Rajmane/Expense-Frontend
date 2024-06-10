import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


let logoutTimer;
const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [userId,setUserId] = useState(null);
  const navigate = useNavigate();
  

  const login = useCallback((token, expirationDate, user) => {
    setToken(token);
    setUserId(user);
    
    const tokenExpirationDate =
      expirationDate instanceof Date ? expirationDate : new Date(new Date().getTime() + 1000 * 60 * 60);
    
    setTokenExpiration(tokenExpirationDate);
    
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: user,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpiration(null);
    localStorage.removeItem("userData");
    navigate("/auth");
  }, [navigate]);

  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiration]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    // Check if there's stored data and if the token has not expired
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.token,
        new Date(storedData.expiration),
        storedData.userId
      );
    }
   
  }, [login]);
  

  return { token, login, logout, userId};
};

export default useAuth;