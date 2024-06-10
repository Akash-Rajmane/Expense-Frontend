import React, {useState,useEffect,useContext} from 'react'
import Dropdown from '../components/Form/Dropdown';
import "./ExpenseReport.css";
import ExpenseTable from '../components/UI/ExpenseTable';
import Button from '../components/Form/Button';
import { AuthContext } from '../context/AuthContext';
import DowloadedFilesTable from '../components/UI/DowloadedFilesTable';
import Pagination from '../components/UI/Pagination';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import useThrottle from '../hooks/useThrottle';


const ExpenseReport = () => {
    const [selectedCategory, setSelectedCategory] = useState("monthly");
    const [expenseDataByInterval,setExpenseDataByInterval] = useState([]);
    const [isLoadingInterval,setIsLoadingInterval] = useState(false);
    const [allExpenses,setAllExpenses] = useState([]);
    const [isLoadingAllExpenses,setIsLoadingAllExpenses] = useState(false);
    const [currPage,setCurrPage] = useState(1);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [lastPage,setLastPage] = useState(null); 
    const [hasNextPage,setHasNextPage] = useState(null);
    const [hasPrevPage,setHasPrevPage] = useState(null);
    const [urls, setUrls] = useState([]);
    const [isLoadingFiles,setIsLoadingFiles] = useState(false);
    const {token,isPremiumUser} = useContext(AuthContext);
    const [perPage,setPerPage] = useState(localStorage.getItem('limit') ? Number(localStorage.getItem('limit')) : 5); 
   

    const perPageChangeHandler = (e) => {
        setPerPage(e.target.value);
        localStorage.setItem("limit",e.target.value);
    }

    const fetchExpenseData = async (selectedCategory) => {
        setIsLoadingInterval(true);
        const response = await fetch(`${process.env.REACT_APP_BE_HOST}/premium/get-expenses-by-interval/${selectedCategory}`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        //console.log(data);
        setIsLoadingInterval(false);
        if (data.success) {
            setExpenseDataByInterval(data.data);
        } else {
            console.log(data.message);
            setExpenseDataByInterval([]);
        }
    }

    const fetchDownloadedFilesData = async () => {
        setIsLoadingFiles(true);
        const response = await fetch(`${process.env.REACT_APP_BE_HOST}/premium/get-downloaded-files-data`,{
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        //console.log(data);
        setIsLoadingFiles(false);
        if (data.success) {
            setUrls(data.expensesUrls);
        } else {
            alert(data.message);
            setUrls([]);
        }
    }


    const fetchAllExpenses = async () => {
        setIsLoadingAllExpenses(true);
        const response =  await fetch(`${process.env.REACT_APP_BE_HOST}/get-expenses/?page=${currPage}&limit=${perPage}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });
        const data = await response.json();
        //console.log(data);
        setIsLoadingAllExpenses(false);
        if(data.message){
            console.log(data.message);
            setAllExpenses([]);
        }else{
            const { expenses, currPage, nextPage, prevPage, hasNextPage, hasPrevPage, lastPage } = data;
            setAllExpenses(expenses);
            setCurrPage(currPage);
            setNextPage(nextPage);
            setPrevPage(prevPage);
            setLastPage(lastPage);
            setHasNextPage(hasNextPage);
            setHasPrevPage(hasPrevPage);
        }
        
    }

    useEffect(()=>{
        if(isPremiumUser){
            fetchExpenseData(selectedCategory);
        }
    },[selectedCategory,isPremiumUser])

    useEffect(()=>{
        fetchAllExpenses();
    },[currPage,perPage])

    useEffect(()=>{
        if(isPremiumUser){
            fetchDownloadedFilesData();
        }  
    },[isPremiumUser])

  

    const categoryChangeHandler = (e) => {
        setSelectedCategory(e.target.value);
    }

    const downloadHandler = async () => {
       
        const response = await fetch(`${process.env.REACT_APP_BE_HOST}/premium/download-expenses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
       
        if (data.success) {
            let a = document.createElement('a');
            a.href = data.fileUrl;
            a.click();
            fetchDownloadedFilesData();
        } else {
            alert(data.message);
        }
    }

    const throttledDownloadHandler = useThrottle(downloadHandler,2000);


  return (
    <div className='reportBox'>
        <p>Full Expense Report</p>
        {isLoadingAllExpenses ? <Loader type="Audio" color="#208dd2" height={40} width={40}/>  :<ExpenseTable data={allExpenses}/>}
        {!isLoadingAllExpenses && <Pagination
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
        {allExpenses.length>0  && <Button
         label={"Download Report ↓"}
         onClick={throttledDownloadHandler}
         size="large"
         type="button"
         disabled={!isPremiumUser} 
         style={{"marginTop":"20px"}}
        />}
        {isPremiumUser && 
        <div className='premiumFeatures'>  
            {isLoadingInterval ? <Loader type="Audio" color="#208dd2" height={40} width={40} className={"intervalReport"}/> : <div className='intervalReport'>
                <Dropdown
                label={"Choose Report Category"}
                value={selectedCategory}
                options={["monthly","daily","weekly","yearly"]}
                onChangeHandler={categoryChangeHandler}
                style={{"marginBottom":"0"}}
                />
                
                <p>{selectedCategory.charAt(0).toUpperCase()+selectedCategory.substring(1)} Expense Report</p>
                <ExpenseTable data={expenseDataByInterval}/>
            </div>}
            <div className='downloadedFiles'>
                <p>Previously Downloaded Files</p>
                {isLoadingFiles ? <Loader type="Audio" color="#208dd2" height={40} width={40}/> : <DowloadedFilesTable data={urls}/>}
            </div>
        </div>
        }
    </div>
  )
}

export default ExpenseReport;