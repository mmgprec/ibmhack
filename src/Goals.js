import "./User.css";
import { useState, useEffect } from "react";
import { useStateValue } from "./stateProvider";
import { doc, updateDoc, arrayUnion,arrayRemove  } from "firebase/firestore";
import {db} from "./firebase.js";
import {  getDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
export default  function Weight(){
 const [{user}]=useStateValue();
 console.log(user.email);
 const [goal,setgoal]=useState("");
 const [goals,ugoals]=useState([]);
 const [wdate,uwdate]=useState([]);
 const [date,udate]=new useState("");
 ChartJS.register(...registerables);
 useEffect(()=>{
    
   getDoc(doc(db, "users", user.email)).then(docSnap => {
     if (docSnap.exists()) {
       console.log("Document data:",);
       console.log(docSnap.data());
       const k=docSnap.data().goals;
       
         ugoals(k);
       
       uwdate(docSnap.data().goalsDate);
      
     
     }
     
   })
   const mydate=new Date();
   udate(mydate.toLocaleString());
 });
 

 function addnewWeight(){
   const Ref = doc(db, "users", user.email);
   
   updateDoc(Ref, {
     goals: arrayUnion(goal)|| null,
  });
  
 

 }
 
 function removegoal(event){
    
    var datax = event.currentTarget.getAttribute('data');
    const Ref = doc(db, "users", user.email);
    updateDoc(Ref, {
        goals: arrayRemove(datax),
    });
    alert("reomved the goal");

 }
 
 return(
   <div class Name="card">
       <label >Set new goals</label>
       <br></br>
       <textarea rows="4" cols="50" value={goal} onChange={e=>setgoal(e.target.value)}></textarea>
       
       <button onClick={addnewWeight}>Add new weight</button>
        {
          goals.map((g,idx)=>{
            return( <div className="goal-card">
                <h5>{g}</h5>
                
              <IconButton className="my-btn" data={g} onClick={removegoal} aria-label="delete"  size="large">
                 <DeleteIcon />
                 </IconButton>
            </div>)
          })
        }
   </div>
   
 )
}
