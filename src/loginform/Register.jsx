import React ,{ useEffect, useRef, useState }  from 'react'
import { Link, Navigate ,useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,storage } from "../firebase";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Mymodal from '../modal/Mymodal';
import { doc, setDoc ,getFirestore } from "firebase/firestore"; 

function Register() {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};
    const navigate = useNavigate();
    const [showmodal,setshowmodal]=useState(null)
    const [typemodal,settypemodal]=useState(null)
    const [messagemodal,setmessagemodal]=useState(null)
    const [eyemodeconfirm,seteyemodeconfirm]=useState(false)
    const [eyemode,seteyemode]=useState(false)
    const [imagestatus, setimagestatus] = useState(false)
    const [isimage, setisimage] = useState(null)
    const  formref =useRef(null)
    const [passisconfirmed,setpassisconfirmed]=useState(false)
    const [downloaddoc,setdownloaddoc]=useState(null);
    const initialinput ={
       username: null,
       email:null,
       password: null,
       confirmPassword: null,
       file:null
     }
    const [input,setinput]=useState(initialinput)
    const [error,seterror]=useState(initialinput)
    const onInputChange = (e) => {
      const { name, value } = e.target;
      setinput(prev => ({
        ...prev,
        [name]: value
      }));
      
      validateInput(e);
    }
    const validateInput =(e)=>{
      const {name , value} = e.target ;
      const usernameRegex = /(^[A-Za-z]\w{3,8})+#+(\d{3,4})$/;
      seterror(prev=>({...prev,[name]:""}))
      switch (name){
        case "username":
          if(!value){
            seterror(prev=>({...prev,[name]:"Please enter Username."}))
          }else if(!usernameRegex.test(value)){
            if(value.length>14){
              seterror(prev=>({...prev,[name]:"Username so long"}))
            }else{
              seterror(prev=>({...prev,[name]:"Respect format name#0000"}))
            }
           
          }
          break;
        case "email":
          if(!value){
            seterror(prev=>({...prev,[name]:"Please enter email."}))
            
          }
          break;
          case "password":
            if(!value){
              seterror(prev=>({...prev,[name]:"Please enter password."}))
            }
     
            else if(input.confirmPassword && value!==input.confirmPassword){
              seterror(prev=>({...prev,["confirmPassword"]:"Password does not match."}))
              setpassisconfirmed(false)
            }else if(input.confirmPassword  && value===input.confirmPassword){
              seterror(prev=>({...prev,["confirmPassword"]:""}))
              seterror(prev=>({...prev,["password"]:""}))
              setpassisconfirmed(true)
            }
          break;
          case "confirmPassword":
            if(!value){
              seterror(prev=>({...prev,[name]:"Please enter confirm Password."}))
            }
   
           else if(input.password && value !== input.password ){
              seterror(prev=>({...prev,[name]:"Password does not match."}))
              setpassisconfirmed(false)
            }else if(input.password &&  value === input.password){
               setpassisconfirmed(true)
            }
          default:
          break ;
      }
      
    }

    const verifyfile = (e)=>{
      if(e.target.files[0].type.includes("image/")){
  
        setisimage(true)
        setinput((prev)=>({...prev,["file"]:e.target.files[0]}))
      }else{
        
        setisimage(false)
        
      }
      e.target.value?setimagestatus(true):setimagestatus(false)
      
    }


    // hundele submit
    const db = getFirestore();
    const hundleSubmit = async (e)=>{
      e.preventDefault();
      if((imagestatus && isimage) && passisconfirmed && error.email==="" && error.username==="" && input.password.length>=6 ){
        setisimage(true)
        setinput((prev)=>({...prev,["file"]:e.target[4].files[0]}))
        try {
          const res = await createUserWithEmailAndPassword(auth,input.email, input.password)  
          const storageRef = ref(storage,input.username+"_"+formatDate(new Date()));
          const uploadTask = uploadBytesResumable(storageRef, input.file);
          // Register three observers:
          uploadTask.on('state_changed',
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  setshowmodal(true)
                  settypemodal("Info")
                  setmessagemodal("Building ! "+progress+"% done") 
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
             console.log(error)
            }, 
            () => {
             
              getDownloadURL(storageRef).then(async (downloadURL) =>  {
                await updateProfile(res.user,{
                  displayName:input.username,
                  photoURL:downloadURL,
                });
                await setDoc(doc(db,"users",res.user.uid),{
                  uid:res.user.uid,
                  displayName:input.username,
                  email:input.email,
                  photoURL:downloadURL,
                })
                await setDoc(doc(db,"userChats",res.user.uid),{});
                setshowmodal(true)
                settypemodal("Success")
                setmessagemodal("Your account has been created successfuly !") 
                setdownloaddoc(downloadURL);
              });
              
            }
          );
         
          
        } catch (err) {
          setshowmodal(true)
          settypemodal("Error")
          setmessagemodal("Something went wrong , try again !")
        }
        
        }
       else if(!passisconfirmed && (imagestatus && isimage)){
           setisimage(true)
       }
       else if(input.password.length<=6){
          seterror(prev=>({...prev,["password"]:"Enter at least 6 characters"}))
          seterror(prev=>({...prev,["confirmPassword"]:"Enter at least 6 characters"}))
       }else if(error.username!=""){
        seterror(prev=>({...prev,[name]:"Enter username like name#0000"}))
       }
       else{
        setisimage(false)
      }
    }
    useEffect(()=>{
      if(showmodal===false && typemodal==="Success") navigate('/login', { replace: true });
      else{
        navigate('/register', { replace: true })
      }
    },[showmodal])
    
    return (
        <>
          <div className="flex  items-center justify-center px-6 py-8 mx-auto w-full min-h-screen sm:py-4 md:py-0 ">
                  <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create an account
                      </h1>
                <form ref={formref}  onSubmit={hundleSubmit}  className="space-y-2 md:space-y-4" encType='multipart/form-data' >
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username <i className={error.username==""?'bi bi-patch-check-fill text-green-700 text-sm':' '}></i> </label>
                        <input maxLength={18}   onBlur={validateInput} type="text" onChange={onInputChange} value={input.username?input.username:""} name="username" id="username" className={(error.username==""?"focus:outline-green-700  ":" ")+"bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} placeholder="name#0000" required/>
                        <span className='text-red-400 text-xs'>{error.username}</span>
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email  </label>
                        <input onBlur={validateInput}  type="email" onChange={onInputChange} value={input.email?input.email:""} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required/>
                        <span className='text-red-400 text-xs'>{error.email}</span>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password <i className={passisconfirmed?'bi bi-check-lg text-green-700 text-xl':''+''}> </i></label>
                        <div className='relative flex'>
                        <input  type={(eyemode?"text":"password")} min={8} onChange={onInputChange} value={input.password?input.password:""} name="password" id="password" placeholder="••••••••" className=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        <span hidden={input.password?"":"hidden"}>
                            <i onClick={()=>{(eyemode)?seteyemode(false):seteyemode(true)}}   className={(eyemode?'bi bi-eye-fill':'bi bi-eye-slash-fill')+` cursor-pointer h-4 w-4 right-0 mx-2 my-3 inline-flex align-middle absolute dark:text-gray-50 `} ></i>
                        </span>
                        </div>
                        <span className='text-red-400 text-xs'>{error.password}</span>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">confirm your password <i className={passisconfirmed?'bi bi-check-lg text-green-700 text-xl':''+''}> </i></label>
                        <div className="relative flex">
                        <input  type={(eyemodeconfirm?"text":"password")} onChange={onInputChange} value={input.confirmPassword?input.confirmPassword:""} name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                        <span hidden={input.confirmPassword?"":"hidden"}>
                            <i onClick={()=>{(eyemodeconfirm)?seteyemodeconfirm(false):seteyemodeconfirm(true)}}   className={(eyemodeconfirm?'bi bi-eye-fill':'bi bi-eye-slash-fill')+` cursor-pointer h-4 w-4 right-0 mx-2 my-3 inline-flex align-middle absolute dark:text-gray-50 `} ></i>
                        </span>
                        </div>
                        
                        <span className='text-red-400 text-xs'>{error.confirmPassword}</span>
                     </div>
                        <div className="flex items-center justify-start">
                        <label htmlFor="image" className="mb-2 inline-block h-14 w-14 rounded-sm cursor-pointer  "><img src={isimage?URL.createObjectURL(input.file):"./image.png"}  className='h-14 w-full rounded-full   object-cover  ' alt="" /></label>
                        <label htmlFor="image" className="mb-2 pl-4 text-gray-600 text-sm cursor-pointer">{(imagestatus && isimage)?"image Selected":"Add an avatar"}</label>
                        
                        <input className='hidden' type="file" id='image'  name="image" onChange={verifyfile} accept=".png, .jpg, .jpeg, .gif"  />
                        
                        </div>
                       
                        {isimage===false  &&  <span className='text-red-400 text-xs'> please chose an image with type png, jpeg, jpg </span>}
                        <button type="submit"  className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            I have an account  <Link to={"/login"} className="font-medium text-primary-600 hover:underline dark:text-primary-500" >Login</Link>
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

export default Register
