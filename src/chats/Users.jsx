import React, { useContext, useEffect, useState } from 'react'
import { auth,db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import {  doc, onSnapshot } from 'firebase/firestore';
import { ChatContext } from '../context/ChatContext'
function Users() {
    const [select,setselect]=useState('')
    const {currentUser}=useContext(AuthContext)
    const {dispatch}=useContext(ChatContext)
    const [chats,setchats]=useState([])
    useEffect(()=>{
        const getchats=()=>{
            const unsub = onSnapshot(doc(db, "userChats",currentUser.uid), (doc) => {
                setchats(doc.data());
              });
              return () =>{
                unsub();
              };
        }
        currentUser.uid && getchats()
    },[currentUser.uid]);
    const handleSelect =(user,key)=>{
      dispatch({type:"CHANGE_USER",payload:user})
      setselect(key)

    }
    const tooglestyle=(key)=>{
      
      if(key==select){
        return " dark:bg-[#333667] bg-[#353d86]";
      }else{
        return " bg-none ";
      }
    }
    return (
        <>  {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map((chat,k)=>(
             <div key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo,chat[0])}  className={tooglestyle(chat[0])+" flex justify-between items-center  rounded-lg my-2     w-full h-14 hover:bg-[#3b3774] dark:hover:bg-[#3a3a61] transition duration-150 ease-out hover:ease-in cursor-pointer "}>
                <div className="profile flex justify-start items-center gap-3 px-2 h-full ">
                  <img src={chat[1].userInfo.photoURL} className='rounded-full  h-11 w-11 object-cover' alt="Profile Image" />
                    <div className="section ">
                        <p className='font-bold text-md   text-gray-100'>{chat[1].userInfo.displayName}</p>
                        <p className='truncate  w-48 md:w-24 lg:w-34  text-xs  text-gray-200'>{chat[1].lastMessage?.textarea}</p>
                    </div>
                    
                </div>
              </div>
        ))}
        </>
    )
}

export default Users
