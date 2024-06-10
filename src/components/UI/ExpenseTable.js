import React from 'react';
import "./ExpenseTable.css";

const ExpenseTable = ({ data }) => {
  if(!data || data.length===0){
    return <h1 className='noDataFound'>No data found!</h1>
  }

  return (
      <table className='expenseTable'>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.createdAt).toLocaleString()}</td> 
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default ExpenseTable;
