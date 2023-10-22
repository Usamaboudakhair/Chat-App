import React ,{ useRef, useState ,useEffect }  from 'react'
import {  Link, useNavigate } from "react-router-dom";
import {sendPasswordResetEmail} from "firebase/auth";
import { auth,db } from '../firebase';
import Mymodal from '../modal/Mymodal';
import { Query, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
function ForgotPassword() {
    const [showmodal,setshowmodal]=useState(null)
  const [typemodal,settypemodal]=useState(null)
  const [messagemodal,setmessagemodal]=useState(null) 
  const navigate =useNavigate()
    const  formref =useRef(null)
    const [inputReset,setinputReset]=useState({
        email:''
      })
      const [errorReset,seterrorReset]=useState({
        email:''
      })
      const onInputChange = (e) => {
        const { name, value } = e.target;
        setinputReset(prev => ({
          ...prev,
          [name]: value
        }));
        
        validateinputReset(e);
      }
      const validateinputReset =(e)=>{
        const {name , value} = e.target ;
        seterrorReset(prev=>({...prev,[name]:""}))
        switch (name){
          case "email":
            if(!value){
              seterrorReset(prev=>({...prev,[name]:"Please enter email."}))
            }
            default:
            break ;
        } 
      }
        // hundle login

      const hundleReset = async (e)=>{
        e.preventDefault();
      
        if(errorReset.email===""){
            
        
            try {
                const q= query(
                    collection(db,"users"),
                    where("email","==",inputReset.email)
                );
                const querysnapshot= await getDocs(q)
                if(querysnapshot.docs.length!==0){
                    await sendPasswordResetEmail(auth,inputReset.email)
                    setshowmodal(true)
                    settypemodal("Success")
                    setmessagemodal("Great , a reset link sent directly to you email Go check it")
                }else{
                    setshowmodal(true)
                    settypemodal("Error")
                    setmessagemodal("Incorrect Information , make sure you put the correct email !")
                }      
                
            } catch (err) {
              setshowmodal(true)
              settypemodal("Error")
              setmessagemodal("Sorry, Something went wrong try again !")
            }
          }

      }
      useEffect(()=>{
        if(showmodal===false && typemodal==="Success") navigate('/login', { replace: true });
      },[showmodal]) 
    return (
        <>
         <div className="flex  items-center justify-center px-6 py-8 mx-auto w-full min-h-screen sm:py-4 md:py-0 ">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Forgot password  
                </h1>
            <form ref={formref} onSubmit={hundleReset}   className="space-y-2 md:space-y-4" action="#">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your email</label>
                    <input required type="email"  value={inputReset.email} onBlur={validateinputReset} onChange={onInputChange} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                    <span className='text-red-400 text-xs'>{errorReset.email}</span>
                </div>
              
               
                <button type="submit" className="w-full  text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                 Remembred your Password ! <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500"  >Login</Link>
                </p>
            </form>
                </div>
            </div>
        </div>
          {
           showmodal  && <Mymodal visible={showmodal} setvisible={setshowmodal} type={typemodal} message={messagemodal} />
          } 
        </>
    )
}

export default ForgotPassword
