import React,{ useEffect, useState} from 'react';
import Input from "../components/Form/Input";
import Button from '../components/Form/Button';
import "./Auth.css";
import { useNavigate } from 'react-router-dom';


const EMAILREGEX = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");


const ForgotPassword = () => {
  const [email,setEmail] = useState("");
  const [emailFlag,setEmailFlag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    if(email){
      setEmailFlag(!EMAILREGEX.test(email));
    }else{
      setEmailFlag(false);
    }
   
  }, [email]);

  


  const formHandler = async (e) => {
    e.preventDefault();
    if (!email) {
        alert("Please enter data in all the fields");
        return;
    }
    if (emailFlag) {
        alert("Please enter valid emailId");
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BE_HOST}/password/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });
        
        const data = await response.json();
        console.log(data);
        
        if (response.ok) {
          alert("Reset Password Link is sent to your email successfully!");
          setEmail("");
          navigate("/auth");
        } else {
          if (response.status === 500) {
            alert("Something went wrong");
          } else if(response.status === 404){
            alert("User not found");
          } 
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred. Please try again later.");
      }
  }

  

  return (
    <div className='auth'>
        <form className='form' onSubmit={formHandler}>
            <h1 className='formTitle'>{"Forgot Password"}</h1>
            <Input type="email" label="email" errorFlag={emailFlag} errorText={"Please enter vaild email"} value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete={"on"}/>
            <Button
                label={ "Submit"}
                color="blue"
                size="large"
                type="submit"
            />
        </form>
    </div>
  )
}

export default ForgotPassword;