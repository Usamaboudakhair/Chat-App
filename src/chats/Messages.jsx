import React ,{useContext, useEffect, useRef ,useState} from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import Message from './Message'


export default function Messages() { 
    const {currentUser}=useContext(AuthContext)
    const {data}=useContext(ChatContext)
    const [messages,setmessages]=useState([])
    
    useEffect(()=>{
        const unsub =onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
            doc.exists() && setmessages(doc.data().messages)
        })
        return ()=>{
            unsub()
        }
    },[data.chatId])
   
    return (
       
        <>
            {messages.map(m=>(
                    <div key={m.id}>
                        <Message  message={m} />
                    </div>
                  
            ))}

        
        </>
    )
}


