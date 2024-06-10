import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import "./AddExpense.css";
import Input from '../Form/Input';
import Button from '../Form/Button';
import Dropdown from '../Form/Dropdown';
import useThrottle from '../../hooks/useThrottle';

const AddExpense = ({fetchExpenses,lastPage,expenses,perPage}) => {
    const {token} = useContext(AuthContext);
    const [amount,setAmount] = useState("");
    const [description,setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("food");

    const amountChangeHandler = (e) => {
        setAmount(e.target.value);
    }   

    const descriptionChangeHandler = (e) => {
        setDescription(e.target.value);
    }

    const categoryChangeHandler = (e) => {
        setSelectedCategory(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        let newExpense =  {   
            amount: amount,
            description: description,
            category: selectedCategory
        }   
        
        try{
            let response = await fetch(`${process.env.REACT_APP_BE_HOST}/expenses/add-expense`,{
                method: "POST",
                body: JSON.stringify(newExpense),
                headers:{
                    "Content-Type":"application/json",
                    'Authorization': `Bearer ${token}`
                }
            })

            let result;
            if(response.ok){
                let arg;
                if(perPage===expenses.length){
                    arg = lastPage + 1;
                }else{
                    arg = lastPage
                }
                result = await response.json();
                fetchExpenses(arg);
                alert("Expense added successfully!");
                setAmount("");
                setDescription("");
                setSelectedCategory("food");
            }else{
                result = await response.json();
                throw new Error(result.error);
            }
        }catch(err){
            console.log(err);
            alert(err);
        }
       
    };

   const throttledSubmitHandler = useThrottle(submitHandler,2000); 

  return (
    <form  onSubmit={throttledSubmitHandler} className='expenseForm'>
        <h1 className='expenseFormTitle'>Add Expense</h1>
        <Input
            type="number" 
            step="0.01"
            label={"Amount"} 
            required 
            min={0}
            value={amount}
            onChange={amountChangeHandler}
        />
        <Input
        type='text'
        value={description}
        onChange={descriptionChangeHandler}
        pattern="^[a-zA-Z ]*$" 
        title="Only letters and spaces are allowed"
        required
        label={"Description"}
        />
        <Dropdown
            label={"Choose Category"}
            value={selectedCategory}
            selectedOption={selectedCategory}
            options={["food","fuel","electricity","other"]}
            onChangeHandler={categoryChangeHandler}
        />
       <Button
        type="submit"
        label="Add Expense"
        color="blue"
        size="large"
       />
    </form>
  )
}

export default AddExpense;