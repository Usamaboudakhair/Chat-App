import React, { useEffect, useState } from 'react'

function ThemeMode() {
    const [theme,settheme]=useState("light")
    useEffect(()=>{
      if(theme==="dark"){
        document.documentElement.classList.add("dark")
      }
        else{
          document.documentElement.classList.remove("dark") 
  
        }
        
    },[theme])
    return (
        <div onClick={()=>{theme==="dark"?settheme("light"):settheme("dark")}} className=' fixed cursor-pointer  flex justify-between py-1 m-0 mt-1 md:m-3   w-[4.5rem] right-0  rounded-full shadow bg-[#5055bc] dark:bg-[#494c78]   '>
            <i  className={(theme==="dark"?" bi bi-moon-fill  flex items-center   text-orange-300 ml-[2.5rem] duration-500":" bi bi-brightness-high-fill flex items-center  text-cyan-50 ml-2  duration-500 ")+'    text-xl py-1    '}></i>
         </div>
    )
}

export default ThemeMode
