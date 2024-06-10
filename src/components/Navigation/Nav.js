import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink, useNavigate } from "react-router-dom";
import Button from '../Form/Button';
import "./Nav.css";
import MenuIcon from "../util/MenuIcon";


export const Nav = () => {
    const {logout,token,isPremiumUser,setIsPremiumUser} = useContext(AuthContext);
    const [showSideBar,setShowSideBar] = useState(false);
    const navigate = useNavigate();

    const isPremiumUserHandler = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BE_HOST}/is-premium-user`,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setIsPremiumUser(data.isPremiumUser);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        isPremiumUserHandler();
    }, []);

    const loadScript = (src) => {
        return new Promise((resolve)=>{
            const script = document.createElement("script");

            script.src = src;
            script.async = true;

            script.onload = () => {
                resolve(true);
            }

            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })
    }



    const premiumHandler = async (event) => {
        event.preventDefault();
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js"); 
        if(!res){
            alert("Something went wrong");
        }
        const response = await fetch(`${process.env.REACT_APP_BE_HOST}/purchase/premium-membership`, {
            headers: {
                "Authorization":  `Bearer ${token}`
            }
        })
        const data = await response.json();
        let options = {
            "key": data.key_id,
            "order_id": data.order.id,
            "handler": async function (response) {
                await fetch(`${process.env.REACT_APP_BE_HOST}/purchase/update-transaction-status`, {
                    method: "POST",
                    body: JSON.stringify({
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }),
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                alert("You are a Premium User now!");
                isPremiumUserHandler();
            }
        };
        const paymentObj = new window.Razorpay(options);
        paymentObj.open();

        paymentObj.on('payment.failed', async function (response) {
            console.log(response);
            await fetch(`${process.env.REACT_APP_BE_HOST}/purchase/payment-failed`, {
                method: "POST",
                body: JSON.stringify({
                    order_id: data.order.id
                }),
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            alert('Something went wrong');
        })
    };

    

  return (
    <header className='header'>
        <div className='menuBox'>
            <MenuIcon className="menu" onClick={()=>setShowSideBar(true)}/>
            <h1 onClick={()=>navigate("/")}>Expense Tracker</h1>
        </div>
        <nav className={ showSideBar ? 'sidebar' : 'navMenu'}>
            <button onClick={()=>setShowSideBar(false)} className='closeBtn'>X</button>
            <ul className='navList'>
                {isPremiumUser && <li>
                    <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
                </li>}
                <li>
                    <NavLink to={"/expense-report"}>Report</NavLink>
                </li>
               
            </ul>
        </nav>
        <div className='btnBox'>
        { !isPremiumUser ? 
                    <Button 
                    label={"Buy Premium"}
                    onClick={premiumHandler}
                    color="blue"
                    size="normal"
                    type="button"
                    />
                : <h3 className='premiumUser'>Premium+</h3>}
            <Button
            onClick={logout}
            label={ "Log Out"}
            color="blue"
            size="normal"
            type="button"
            />
        </div>
                
    </header>
  )
}
