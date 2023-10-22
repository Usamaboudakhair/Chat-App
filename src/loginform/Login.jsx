import React ,{ useRef, useState ,useEffect }  from 'react'
import {  Link, useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from '../firebase';
import Mymodal from '../modal/Mymodal';

function Login() {
  const [showmodal,setshowmodal]=useState(null)
  const [typemodal,settypemodal]=useState(null)
  const [messagemodal,setmessagemodal]=useState(null) 
  const navigate =useNavigate()
    const  formref =useRef(null)
    const [inputlogin,setinputlogin]=useState({
        email:'',
        password: ''
      })
      const [errorlogin,seterrorlogin]=useState({
        email:'',
        password: '',
      })
      const onInputChangelogin = (e) => {
        const { name, value } = e.target;
        setinputlogin(prev => ({
          ...prev,
          [name]: value
        }));
        
        validateInputlogin(e);
      }
      const validateInputlogin =(e)=>{
        const {name , value} = e.target ;
        seterrorlogin(prev=>({...prev,[name]:""}))
        switch (name){
          case "email":
            if(!value){
              seterrorlogin(prev=>({...prev,[name]:"Please enter email."}))
            }
            break;
          case "password":
            if(!value){
                seterrorlogin(prev=>({...prev,[name]:"Please enter password."}))
            }
            default:
            break ;
        } 
      }
        // hundle login

      const hundleLogin = async (e)=>{
        e.preventDefault();
      
        if(errorlogin.email==="" && errorlogin.password==="" && inputlogin.password.length>6 ){
            try {
             await signInWithEmailAndPassword(auth, inputlogin.email, inputlogin.password)
              setshowmodal(true)
              settypemodal("Success")
              setmessagemodal("Great , you are now logged in !")
              
            } catch (err) {
              setshowmodal(true)
              settypemodal("Error")
              setmessagemodal("Incorrect login information , try again !")
            }
          }
        else if(inputlogin.password.length<=6){
            seterrorlogin(prev=>({...prev,["password"]:"Enter at least 6 characters"}))
          }
      } 
      useEffect(()=>{
        if(showmodal===false && typemodal==="Success") navigate('/', { replace: true });
        console.log(showmodal)
      },[showmodal])
      
    return (
    <>  
    <div className="flex  items-center justify-center px-6 py-8 mx-auto w-full min-h-screen sm:py-4 md:py-0 ">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
            </h1>
        <form ref={formref} onSubmit={hundleLogin}   className="space-y-2 md:space-y-4" action="#">
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input required type="email"  value={inputlogin.email} onBlur={validateInputlogin} onChange={onInputChangelogin} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                <span className='text-red-400 text-xs'>{errorlogin.email}</span>
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input  required type="password" value={inputlogin.password} onBlur={validateInputlogin} onChange={onInputChangelogin} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                <span className='text-red-400 text-xs'>{errorlogin.password}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                    <input  id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                </div>
                <Link to="/reset" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full  text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500"  >Sign up</Link>
            </p>
        </form>
            </div>
        </div>
    </div>
         {
          showmodal  && <Mymodal visible={showmodal} setvisible={setshowmodal} type={"Success"} message={messagemodal} />
         } 
    </>
    )
}

export default Login
