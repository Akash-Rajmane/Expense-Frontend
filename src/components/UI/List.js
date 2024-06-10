import React, { useContext } from 'react';
import  "./List.css";
import Button from '../Form/Button';
import { AuthContext } from '../../context/AuthContext';


const List = ({expenses, fetchExpenses, currPage}) => {
  const {token} = useContext(AuthContext);

  const deleteHandler = async (expenseId) => {
    try{
      let response = await fetch(`${process.env.REACT_APP_BE_HOST}/expenses/${expenseId}`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        let arg;
        if(expenses.length===1){
          arg = currPage - 1;
        }else{
          arg = currPage
        }
        fetchExpenses(arg);
        alert("Expense deleted sucessfully");
      } else {
        alert('Failed to delete expense');
      }
    }catch(err){
      console.log(err);
    }
  }

  

  return (
    <ul className="list">
      { expenses.length===0 ? <p className='listText'>No expenses found!</p> :
        expenses.map(el=>{
            return(
                <li key={el.id} className='item'>
                    <div className='itemDesc'>
                        <span>Description: {el.description}</span>
                        <span>Amount: Rs {el.amount}</span>
                        <span>Category: {el.category}</span>
                    </div>
                    <div className='btnBox'>
                        <Button onClick={()=>deleteHandler(el.id)} label={"Delete"} color={"red"}  type="button" size={"normal"}/>
                    </div>
                </li>
            )
        })}
    </ul>
  )
}

export default List;