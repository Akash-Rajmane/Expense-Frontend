import React, {useState,useContext,useEffect} from 'react';
import AddExpense from '../components/UI/AddExpense';
import "./Home.css";
import List from '../components/UI/List';
import { AuthContext } from './../context/AuthContext';
import Pagination from "../components/UI/Pagination";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

const Home = () => {
  const {token} = useContext(AuthContext);
  const [expenses,setExpenses] = useState([]);
  const [isLoadingExpenses,setIsLoadingExpenses] = useState(false);
  const [currPage,setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [lastPage,setLastPage] = useState(null); 
  const [hasNextPage,setHasNextPage] = useState(null);
  const [hasPrevPage,setHasPrevPage] = useState(null);
  const [perPage,setPerPage] = useState(localStorage.getItem('limit') ? Number(localStorage.getItem('limit')) : 5); 

  const perPageChangeHandler = (e) => {
    setPerPage(e.target.value);
    localStorage.setItem("limit",e.target.value);
  }

  const fetchExpenses = async (page) => {
    setIsLoadingExpenses(true);
    const response =  await fetch(`${process.env.REACT_APP_BE_HOST}/get-expenses/?page=${page}&limit=${perPage}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    //console.log(data);
    setIsLoadingExpenses(false);
    if(data.message){
      console.log(data.message);
      setExpenses([]);
    }else{
      const { expenses, currPage, nextPage, prevPage, hasNextPage, hasPrevPage, lastPage } = data;
      setExpenses(expenses);
      setCurrPage(currPage);
      setNextPage(nextPage);
      setPrevPage(prevPage);
      setLastPage(lastPage);
      setHasNextPage(hasNextPage);
      setHasPrevPage(hasPrevPage);
    }
  }

  useEffect(() => {
    fetchExpenses(currPage);
  }, [token,currPage,perPage]);


 
 
  return (
    <div className='homeContent'>
      <AddExpense fetchExpenses={fetchExpenses} lastPage={lastPage} expenses={expenses} perPage={perPage}/>
      {isLoadingExpenses ? <Loader type="Audio" color="#208dd2" height={40} width={40}/> : <List expenses={expenses} fetchExpenses={fetchExpenses} currPage={currPage}/>}
      {!isLoadingExpenses && <Pagination
        currentPage={currPage}
        setCurrentPage={setCurrPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        nextPage={nextPage}
        prevPage={prevPage}
        lastPage={lastPage}
        perPage={perPage}
        perPageChangeHandler={perPageChangeHandler}
      />}
    </div>
  )
}

export default Home