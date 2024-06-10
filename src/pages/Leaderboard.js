import React, {useState, useEffect, useContext} from 'react';
import "./Leaderboard.css";
import { AuthContext } from '../context/AuthContext';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const Leaderboard = () => {
  const [expenseData,setExpenseData] = useState([]);
  const [isLoadingLB,setIsLoadingLB] = useState(false);
  const {token} = useContext(AuthContext);

  const fetchData = async () => {
    setIsLoadingLB(true);
    const response = await fetch(`${process.env.REACT_APP_BE_HOST}/premium/get-leaderboard`,{
      headers: {
          "Authorization": `Bearer ${token}`
      }
    })
    
    const data = await response.json();
    //console.log(data);
    setIsLoadingLB(false);
    if (data.success) {
        setExpenseData(data.data);
    } else {
        alert(data.message);
    }
  }

  useEffect(() => {
    fetchData();
  },[])

  return (
    <div className='leaderboardContent'>
      <p className='leaderboardTitle'>Leaderboard</p>
      { isLoadingLB ? <Loader type="Audio" color="#208dd2" height={40} width={40}/> :<table className='expenseTable'>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Total Expense (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {expenseData.map((el,index) => (
            <tr key={el.name}>
              <td>{index+1}</td>
              <td>{el.name}</td>
              <td>{el.totalExpense}</td> 
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default Leaderboard;