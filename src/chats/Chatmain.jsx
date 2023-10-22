import React, { useContext, useEffect, useState } from 'react'

import Users from './Users'
import Chat from './Chat'
import { auth,db } from '../firebase'
import { signOut } from 'firebase/auth'
import { AuthContext } from '../context/AuthContext'
import Mymodal from '../modal/Mymodal'
import ThemeMode from '../ThemeMode/ThemeMode'
import { Query, Timestamp, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'



export default function Chatmain() {
    const {currentUser}=useContext(AuthContext)
   
    const [showmessage,setshowmessage]=useState(null)
    const [findUser,setfindUser]= useState('')
    const [user,setuser]=useState(null);
    
    const hundlefindUser= async (user)=>{
        //check whether the group (chats in firestore) exists , if not create it
        const combinedID = (currentUser.uid > user.uid) ? (currentUser.uid + user.uid) : (user.uid + currentUser.uid) ;
       try {
        const res = await getDoc(doc(db,"chats",combinedID));
        if(!res.exists()){
           
            //create a chat in chats collection
            await setDoc(doc(db,"chats",combinedID),{messages:[]});
            // create user chats
            await updateDoc(doc(db,"userChats",currentUser.uid),{
                [combinedID+".userInfo"]:{
                    uid:user.uid,
                    displayName:user.displayName,
                    photoURL:user.photoURL
                },
                [combinedID+".date"]:serverTimestamp()
            });
            await updateDoc(doc(db,"userChats",user.uid),{
                [combinedID+".userInfo"]:{
                    uid:currentUser.uid,
                    displayName:currentUser.displayName,
                    photoURL:currentUser.photoURL
                },
                [combinedID+".date"]:serverTimestamp()
            });
        }
       } catch (error) {
        
       }
       setuser(null)
       setfindUser("")
        //create user chats
     }
    const hundlesearch = async (e)=>{
        e.preventDefault();
        try {
            if((findUser!=currentUser.displayName)){
                
                const q=query(
                    collection(db,"users"),
                    where("displayName", "==",findUser)
                );
                const querysnapshot= await getDocs(q)
           
                querysnapshot.forEach((doc)=>{
                    setuser(doc.data())
                   
                })
            }       
            }catch(err){
                console.log("Error")
            }
          }
          
    return (
        <>
          

            <div className=" flex justify-center items-center h-screen ">
                    <div className=" flex rounded-lg w-full h-full md:w-[75%] md:h-[90%] lg:w-[65%] lg:h-[80%]  overflow-hidden shadow-[#8589df]  shadow-md bg-gray-100 dark:bg-gray-900   ">
                            <div  className={(showmessage?"hidden md:block  ":"block ")+" md:w-[30%] w-full h-full "}>
                                <div className="nav  bg-[#2b4788] dark:bg-[#303e60]  p-0 h-16 w-full   ">
                                    <div className="section flex justify-between items-center h-full px-3 ">
                                        <div className=" relative profile flex justify-between items-center gap-1 lg:gap-3">
                                            <div className='relative cursor-pointer lg:cursor-default'>
                                                <img src={currentUser.photoURL} className='rounded-full shadow shadow-slate-400 h-12 w-12 object-cover' alt="Profile Image" />
                                                <i className='w-2 h-2  rounded-full absolute top-[2px] right-0 bg-green-400 animate-pulse'></i>
                                            </div>
                                            <p className='font-bold truncate text-[#e8e9ff]   text-sm lg:text-base mx-2 md:mx-0 ' title={currentUser.displayName}>{currentUser.displayName?currentUser.displayName.split("#")[0]:""}</p>
                                            <div className='mx-2'>
                                            <i onClick={()=>signOut(auth)} title='Logout' className='bi bi-box-arrow-in-right text-[#e8e9ff] cursor-pointer text-lg text-center md:hidden block '></i>
                                            </div>
                                        </div>
                                        <div className='text-gray-200 text-sm block md:hidden fixed top-0 my-2  '>
                                                <ThemeMode />
                                            </div>
                                        <div className="flex items-center cursor-pointer addprofile  space-x-3">
                                            <i onClick={()=>signOut(auth)} className='bi bi-box-arrow-in-right text-[#e8e9ff] cursor-pointer text-lg text-center md:block hidden'></i>
                                        </div>
                                    </div>
                                </div>
                                 <div className="friends w-full overflow-scroll overflow-x-hidden   bg-[#4e5192] dark:bg-[#272e49] h-[calc(100%-64px)] text-start  " data-te-perfect-scrollbar-init>
                                    <form onSubmit={hundlesearch}  className=' text-green-200 font-semibold flex justify-between items-center    focus:outline-none   my-1 text-center   py-2  w-full relative bg-inherit' action="">
                                       <input placeholder='Find a user#0000' value={findUser} onChange={(e)=>setfindUser(e.target.value)} className="w-full h-full text-sm font-semibold   text-gray-100 bg-inherit px-2 focus:outline-none border-none"/>
                                        <i onClick={hundlesearch} className='bi bi-search cursor-pointer '></i>
                                    </form >  
                                    <div  className={' w-full mb-2'}>
                                        {user && (
                                        
                                           <div key={user.uid} onClick={()=>hundlefindUser(user)} className="user flex justify-between items-center   w-full h-14 hover:bg-[#333667] dark:hover:bg-[#3a3a61] transition duration-150 ease-out hover:ease-in cursor-pointer ">
                                                <div className="profile flex justify-start items-center gap-3 px-2 h-full ">
                                                    <img src={user.photoURL} className='rounded-full  h-11 w-11 object-cover' alt="Profile Image" />
                                                    <p className='font-bold text-md  text-gray-100'>{user.displayName}</p>    
                                                </div>
                                                <i className=' bi-chat-dots-fill text-gray-300 text-xl  pb-2 px-2 block  md:hidden lg:block'></i>
                                            </div>
                                     
                                            )
                                        }
                                       
                                    </div>
                                   
                                    <div   className=' text-yellow-100 font-semibold cursor-pointer border-b  focus:outline-none   my-1 text-center    w-full relative bg-inherit' action="">
                                     
                                    </div > 
                                    <div   onClick={()=>setshowmessage(true)}>
                                        <div> <Users /></div>
                                    </div>
                                    
                                 </div>
                            </div>
                            <Chat showmessage={showmessage} setshowmessage={setshowmessage} />
                    </div>
            </div>
        </>
    )
}

