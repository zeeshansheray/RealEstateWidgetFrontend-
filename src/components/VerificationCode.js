import React, { useState, useRef, useEffect } from "react";
import env from "../config";

const VerificationCode = ({ length, label, loader, onComplete, Validate}) => {
  const [code, setCode] = useState([...Array(length)].map(() => ""));
  // const [code, setCode] = useState(['1','2','3','4']);
  const inputs = useRef([]);

  const processInput = (e, slot) => {
    const num = e.target.value;
    if(!num) return // empty string handle in keyup function
   
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) inputs.current[slot + 1].focus();

    if(newCode.some(num => num === "") && Validate) Validate(false)

    if (newCode.every(num => num !== "") && onComplete) onComplete(newCode.join(""))
  };

  const onKeyUp = (e, slot) => {
    if(e.keyCode !== 8) return
    const newCode = [...code];


    if(slot === code.length -1 && code[slot]){
      newCode[slot] = "";
      setCode(newCode);
    } 
    
    if(!code[slot] && slot !== 0) {
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }

    if(newCode.some(num => num === "") && Validate) Validate(false)

  };

  const handleCopyEvent = async() => {

      let copiedText = await navigator.clipboard.readText().then(function(result) {
        return result;
     })

     if(copiedText){
      let copyCode = [];
      [0,1,2,3].map((idx)=>{
        copyCode[idx]=copiedText[idx]
      })
      setCode(copyCode)
      Validate(true)
      let newcode = "";
      [0,1,2,3].map((idx)=>{
        newcode = newcode+copyCode[idx]
      })
      onComplete(newcode);
     }
  }

  useEffect(()=>{
    document.getElementById("myInput").addEventListener("paste", handleCopyEvent);
  },[])

  return (  
    <div className="code-input">
      <label className="code-label">{label}</label>
      <div className="code-inputs">
        {code.map((num, idx) => {
          return (
            <input
              key={idx}
              id ="myInput"
              type="text"
              // inputMode="numeric"
              maxLength={1}
              value={num}
              autoFocus={!code[0].length && idx === 0}
              readOnly={loader}
              onChange={e => processInput(e, idx)}
              onKeyUp={e => onKeyUp(e, idx)}
              ref={ref => inputs.current.push(ref)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VerificationCode;
