import { useEffect, useRef, useState } from "react"

export const Practice=()=>{

    const [inputName,setInputName]=useState("");
    const timeRef=useRef(null);

    const handleChange=(e)=>{
        setInputName(e.target.value);
    }

    const handleClick=(e)=>{
        e.preventDefault();
        console.log(inputName);
    }

    useEffect(()=>{
        if(timeRef.current){
            clearTimeout(timeRef.current);
        }
        timeRef.current=setTimeout(()=>{
            console.log(inputName);
        },1000)
        

        return () => clearTimeout(timeRef.current);
    },[inputName])

    return(
        <div style={{margin:"10rem"}}>
            <input type="text" placeholder="enter name..." name="name" value={inputName} onChange={handleChange}/>
            <button type="button" onClick={handleClick}>Click</button>
            <p>{inputName}</p>
        </div>
    )
}