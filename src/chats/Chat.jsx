import React, { useContext, useEffect, useRef, useState } from 'react'
import Messages from './Messages'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import ReactDOM from "react-dom";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import {v4 as uuid} from 'uuid';
function Chat({showmessage,setshowmessage}) {
    const {currentUser}=useContext(AuthContext)
    const {data}=useContext(ChatContext)
    const input=useRef(null)
    const [textarea,settextarea]=useState('')
    const [image,setimage]=useState(null)
    const audioPlayer = useRef();
    const hundlesend = async ()=>{
       
        if(image){
            const storageRef = ref(storage,uuid());
            const uploadTask = uploadBytesResumable(storageRef,image);
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
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    console.log(error)
                }, 
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                    await updateDoc(doc(db,"chats",data.chatId),{
                        messages:arrayUnion({
                            id:uuid(),
                            textarea,
                            img:downloadURL,
                            senderId:currentUser.uid,
                            date:Timestamp.now(),
                            
                        })
                        
                      });
                      
                  });
                  
                  
                }
              );
        }
        else{
          await updateDoc(doc(db,"chats",data.chatId),{
            messages:arrayUnion({
                id:uuid(),
                textarea,
                senderId:currentUser.uid,
                date:Timestamp.now()
            })
          })
        } 

        await updateDoc(doc(db,"userChats",currentUser.uid),{
            [data.chatId + ".lastMessage"]:{
                textarea
            },
            [data.chatId+".date"]:serverTimestamp()
        });
        await updateDoc(doc(db,"userChats",data.user.uid),{
            [data.chatId + ".lastMessage"]:{
                textarea
            },
            [data.chatId+".date"]:serverTimestamp()
        });
        setimage(null)
        settextarea("")
    }
    return (
        <>
        {   
        
         <div className={(showmessage?"block animate-fade md:animate-none ":"hidden md:block")+" w-full md:w-[70%] h-full  dark:bg-gray-800 bg-[#ddddf7] "}>
            <div className={showmessage?"hidden":""+' md:flex justify-center items-center  gap-y-2 hidden h-full'}>
                <div className=''>
                    <img src="letstalk.gif" className='w-32 h-32 mb-4' alt="" />
                    <div className='flex w-full justify-between '>
                            <i style={{animationDelay:"0.3s"}} className='bg-blue-600 dark:bg-blue-400  w-6 h-6 rounded-full animate-bounce blue-circle'></i>
                            <i style={{animationDelay:"0.2s"}} className=' bg-green-600 dark:bg-green-400  w-6 h-6 rounded-full animate-bounce green-circle'></i>
                            <i style={{animationDelay:"0.1s"}} className='bg-yellow-600  dark:bg-yellow-400 w-6 h-6 rounded-full animate-bounce red-circle'></i>                       
                    </div>
                </div>
                
            </div>
            <div  className={(showmessage?"block animate-fade md:animate-none ":"hidden ")+' w-full h-full '}>
                <div className="nav  bg-[#496198]  dark:bg-[#3d5281]   p-0 h-16 w-full   ">
                    <div className="section flex  justify-between items-center h-full px-3 ">
                        <div className='flex items-center gap-2' >
                            <div  onClick={()=>setshowmessage(false)} title='return' className=' bg-opacity-25 bg-blue-950 rounded-md cursor-pointer flex items-center md:hidden visible  justify-center  w-10 h-8'>
                                <i  className="bi-caret-left-fill text-3xl  h-10 w-10 pb-0   text-white  "></i>
                            </div>
                            <div className=' flex items-center gap-1'>
                                    <img src={data.user?.photoURL} className='rounded-full  h-8 w-8 object-cover' alt="Profile Image" />
                                    <p className='font-semibold text-sm  text-gray-100'>{data.user?.displayName}</p>    
                            </div>
                        </div>
                        
                        <div className="addprofile  space-x-3">
                            <i className=' bi bi-camera-video-fill text-[#e8e9ff] cursor-pointer text-md'></i>
                            <i className=' bi bi-person-plus-fill text-[#e8e9ff] cursor-pointer text-lg'></i>
                            <i className=' bi bi-three-dots text-[#e8e9ff] cursor-pointer text-lg'></i>
                        </div>
                    </div>
                </div> 

                <div   className="   text-gray-800 dark:text-gray-100 w-full h-[calc(100%-128px)] overflow-scroll overflow-x-hidden    dark:bg-gray-800 bg-[#ddddf7] ">
                    <Messages  /> 
                </div>
                <div className="div   dark:bg-gray-800 bg-[#ddddf7] ">
                    <div  className=' flex  rounded-tl-md overflow-hidden' encType='multipart/form-data'>
                            <textarea autoFocus  value={textarea} onChange={(e)=>settextarea(e.target.value)}  className='dark:bg-gray-600 dark:text-gray-50 flex px-2  w-[calc(100%-128px)]  justify-start focus:outline-none resize-none h-16 pt-2  '  name="" id="" placeholder='Type something . . .'></textarea>
                            <div className='w-[128px]  flex justify-evenly  items-center  dark:bg-gray-600 bg-white'>
                                <button type='button' onClick={hundlesend} className=' py-0 px-0   focus:outline-none  border-none mb-1 rotate-6 ' ><i className ="bi bi-send-arrow-up-fill hover:text-green-600 dark:hover:text-green-300   text-xl  dark:text-gray-50"></i></button>
                                <label htmlFor='image' className='bi bi-file-earmark-image  text-xl dark:text-gray-50 cursor-pointer hover:text-green-600 dark:hover:text-green-300 '></label>
                                <input type="file"  onChange={(e)=>setimage(e.target.files[0])} name="image" id="image" hidden accept=".png, .jpg, .jpeg, .gif" />            
                                <i  className='bi bi-paperclip   text-xl  dark:text-gray-50 cursor-pointer hover:text-green-600 dark:hover:text-green-300 '></i>
                                {/* <input type="file" name="attach" id="attach" hidden   /> */}  
                            </div>
                      </div>
                 </div>
                </div>
                <audio ref={audioPlayer} src="mp3/send.mp3" />
            </div>
            }
       </>
    )
}

export default Chat
