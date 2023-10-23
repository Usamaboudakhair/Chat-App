import React, { useEffect, useState }  from 'react'

export default function Mymodal({visible,setvisible,message,type}) {
     const [typestyle,settypestyle]= useState('')
      const hundleclose = (e)=>{
        if(e.target.id==="container") setvisible(false)
      }
      useEffect(() => {
       
        if(type!="Info"){
            if(type=="Success"){
                
                settypestyle("bi bi-check-circle-fill text-green-500 animate-fade  text-7xl ")
            }
            else{
                settypestyle("bi bi-exclamation-triangle-fill text-red-500 animate-fade  text-7xl")
            }
            const timer = setTimeout(() => {
                setvisible(false)
            }, 9000);
            return () => clearTimeout(timer);
        }else{
            settypestyle("bi bi-opencollective text-blue-500 animate-spin   text-3xl ")
        }
        
      }, [type]);
    return (
       
            <div id='container'  onClick={hundleclose}  className={(!visible )?"hidden transition ease-in duration-300":""+'fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center transition ease-out duration-200 '}>
                <div  className="relative  max-w-xs max-h-screen">
               
                    <div className="relative w-72 h-60 bg-white rounded-lg shadow dark:bg-gray-200">
                        <i className='bi bi-x text-xl flex  justify-end cursor-pointer' onClick={()=>setvisible(false)}></i>
                        <div className="px-6 text-center">
                            <div className={type=="Info"?"spin animate-spin":""}>
                                <i className={typestyle}></i>
                            </div>
                            <h3 className=" mt-5 text-lg font-bold text-gray-600 dark:text-gray-800">{type}!</h3>
                            <p className="mt-5 text-sm font-normal text-gray-700 dark:text-gray-900">{message}</p>
                            
                        </div>
                    </div>
                </div>
            </div>
      
    )
}

