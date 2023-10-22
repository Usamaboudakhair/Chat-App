import React, { useContext, useState ,useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { useEffect } from 'react'
import { Timestamp } from 'firebase/firestore'
function Message({message}) {
    const {currentUser}=useContext(AuthContext)
    const {data}=useContext(ChatContext)
    const ref=useRef()
    const [time,settime]=useState('');
   
    useEffect(()=>{
        ref.current?.scrollIntoView({ behavior: "smooth" })
        const date= ((Timestamp.now()-message.date)/60);
        if(date<1){
            settime("Just now")
        }else if(date>=60){
            settime((date/60).toFixed(0)+" h")
        }else if((date/60)>=24){
            settime(((date/60)/24).toFixed(0)+" days")
        }else{
            settime((date).toFixed(0)+" min")
        }
    },[message])
    return (
        <>
        <div  className='message py-2 '>
            <div ref={ref} className={'w-full px-1 text-start '+((message.senderId!=currentUser.uid)?"flex flex-row":"flex flex-row-reverse text-end ")}>
                <img src={(message.senderId==currentUser.uid)?currentUser.photoURL:data.user?.photoURL} alt="" title='' className='w-10 h-10 min-w-[2.5rem]   rounded-full'  />
                <div className='  space-y-1 px-2 pt-1 '>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{time}</p>
                    
                    <div  hidden={message.textarea!=""?"":"hidden"} className={''}>
                        <p   className={((message.senderId!=currentUser.uid)?"rounded-bl-2xl rounded-e-2xl ":" rounded-l-2xl rounded-b-2xl ")+((message.textarea.split(' ').pop().length>10)?"break-all":"")+" text-left  shadow-sm  bg-white dark:bg-slate-600 font-normal inline-block text-gray-700 dark:text-gray-200 py-2 px-2  whitespace-normal  "}>{message.textarea}</p>
                    </div>
                    <img hidden={message.img!=""?"":"hidden"}  className={"w-48 rounded-lg "+((message.senderId!=currentUser.uid)?"":" float-right")} src={message.img} alt="" />
                    
                </div>
            </div> 
        </div>
        </>
    )
}

export default Message
