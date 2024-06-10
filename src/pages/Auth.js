import React,{ useState, useContext } from 'react';
import Input from "../components/Form/Input";
import Button from '../components/Form/Button';
import "./Auth.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useThrottle from '../hooks/useThrottle';




const Auth = () => {
  const {login} = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading,setIsLoading] = useState(false);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();



  const signUpHandler = async (e) => {
    e.preventDefault();
   
    if (!name || !email || !password) {
      alert("Please enter data in all the fields");
      return;
    }
  
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BE_HOST}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      
      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        login(data.token, null, data.user.id)
        alert("Sign up successful!");
        setName("");
        setEmail("");
        setPassword("");
        navigate("/");
      } else {
        if (response.status === 409 && data.message === 'Email already exists') {
          alert("User already exists");
          return;
        } else {
          alert("Failed to sign up. Please try again later.");
          return;
        }
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setIsLoading(false);
      alert("An error occurred. Please try again later.");
    }
  };

  const throttledSignUp = useThrottle(signUpHandler,1000);
  
  const logInHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please enter data in all the fields");
      return;
    }

    setIsLoading(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BE_HOST}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      //console.log(data.user.id);
      setIsLoading(false);
      
      if (response.ok) {
        login(data.token, null, data.user.id)
        alert("Login successful!");
        setName("");
        setEmail("");
        setPassword("");
        navigate("/");
      } else {
        if (response.status === 401 && data.message === 'Invalid credentials') {
          alert("Invalid credentials");
          return;
        } else if(response.status === 404 && data.message === 'User not found'){
          alert("User not found");
          return;
        } 
        else {
          alert("Failed to log in. Please try again later.");
          return;
        }
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setIsLoading(false);
      alert("An error occurred. Please try again later.");
    }
  };

  const throttledLogIn = useThrottle(logInHandler,1000);

  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
    setIsLoading(false);
  }

  const LoginMode = isLoading ? "...Logging In" : "Log In";
  const SignUpMode = isLoading ? "...Signing Up" : "Sign Up";
  

  return (
    <div className='auth'>
        <form className='form' onSubmit={isLoginMode ? throttledLogIn : throttledSignUp}>
            <h1 className='formTitle'>{isLoginMode? "Log In":"Sign Up"}</h1>
            { !isLoginMode && <Input type="text" label="name" pattern="^[a-zA-Z ]*$" title="Only letters and spaces are allowed" value={name} onChange={(e)=>setName(e.target.value)} required/>}
            <Input type="email" label="email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete={"on"} required/>
            <Input type="password" label="password" pattern="^(?=.*[a-z])(?=.*[A-Z]).{5,}$" title="Password should have at least 1 small letter, 1 capital letter and minimum 5 characters long"  value={password} onChange={(e)=>setPassword(e.target.value)}  autoComplete="on" required/>
            <Button
                label={ isLoginMode ? LoginMode : SignUpMode}
                color="blue"
                size="large"
                type="submit"
            />
            <p className='formText'>{!isLoginMode ? "Already existing user?" :"Not a registered user?" }<span className='link' onClick={switchModeHandler}>{!isLoginMode?"Log In":"Sign Up"}</span></p>
            {isLoginMode && <p className='link' onClick={()=>navigate("/forgot-password")}>Forgot password</p>}
        </form>
    </div>
  )
}

export default Auth;