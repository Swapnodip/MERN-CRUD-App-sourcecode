import React, { useEffect, useState } from "react"
import axios from "axios"
import './App.css';

function App() {

  //states
  const [data,setData] = useState([])
  const [showAdd,setShowAdd] = useState(false)
  const [addData,setAddData] = useState({name:"",ph_num:"",email:"",hobbies:""})
  const [addErrors,setAddErrors] = useState({})
  const [isAddSubmit,setIsAddSubmit] = useState(false)
  const [showUpdate,setShowUpdate] = useState(false)
  const [updateData,setUpdateData] = useState({name:"",ph_num:"",email:"",hobbies:""})
  const [updateErrors,setUpdateErrors] = useState({})
  const [isUpdateSubmit,setIsUpdateSubmit] = useState(false)
  const [updateID,setUpdateID] = useState("")
  const [sendErrors,setSendErrors] = useState("")

  //effects
  useEffect(()=> {
    if(Object.keys(addErrors).length ===0 && isAddSubmit) {
      if(!addData.name||!addData.email||!addData.ph_num||!addData.hobbies)
      return
      axios.post("/user",addData)
      .then(()=>{load();setShowAdd(false)})
      .then(()=>{setAddData({name:"",ph_num:"",email:"",hobbies:""})})
    }
  },[addErrors])

  useEffect(()=> {
    if(Object.keys(updateErrors).length ===0 && isUpdateSubmit) {
      if(!updateData.name&&!updateData.email&&!updateData.ph_num&&!updateData.hobbies)
      return
      let send = {...updateData,id:updateID}
      Object.keys(send).forEach(k=>{if(!send[k]){delete send[k]}})
      axios.put("/user",send)
      .then(()=>{load();setShowUpdate(false)})
      .then(()=>{setUpdateData({name:"",ph_num:"",email:"",hobbies:""})})
    }
  },[updateErrors])

  useEffect(()=>{load()},[])

  //functions
  const load = ()=>{
    fetch("/user")
    .then(res=>res.json())
    .then(json=>{setData(json);})  
  }

  const handleAddChange = (e) => {
    const {name, value} = e.target;
    setAddData({...addData,[name]:value});
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setAddErrors(validateAdd(addData))
    setIsAddSubmit(true)
  }

  const validateAdd = (values) => {
    const errors = {}
    const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const ph_regex = /^(?:\+?\d{2}[ -]?\d{3}[ -]?\d{5}|\d{4})$/
    if(!values.name)
    {
      errors.name="Please enter name"
    }
    if(!values.ph_num)
    {
      errors.ph_num="Please enter phone number"
    }
    else if(!ph_regex.test(values.ph_num))
    {
      errors.ph_num="Phone number is invalid"
    }
    if(!values.email)
    {
      errors.email="Please enter email id"
    }
    else if(!mail_regex.test(values.email))
    {
      errors.email="Email id is invalid"
    }
    if(!values.hobbies)
    {
      errors.hobbies="Please enter hobbies"
    }
    return errors
  }

  const handleUpdateChange = (e) => {
    const {name, value} = e.target;
    setUpdateData({...updateData,[name]:value});
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setUpdateErrors(validateUpdate(updateData))
    setIsUpdateSubmit(true)
  }

  const validateUpdate = (values) => {
    const errors = {}
    const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const ph_regex = /^(?:\+?\d{2}[ -]?\d{3}[ -]?\d{5}|\d{4})$/

    if(values.ph_num&&!ph_regex.test(values.ph_num))
    {
      errors.ph_num="Phone number is invalid"
    }
    if(values.email&&!mail_regex.test(values.email))
    {
      errors.email="Email id is invalid"
    }
    return errors
  }

  const deleteUser = (id) => {
    axios.delete("/user/"+id)
    .then(()=>{load()})
  }

  const sendData = () => {
    const selected = [...document.querySelectorAll('input[name=select]:checked')].map(e=>e.value);
    if(selected.length==0)
    {
      setSendErrors("No elements selected")
      return
    }
    const mail = document.getElementById("email_input").value
    const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    if(!mail)
    {
      setSendErrors("Please enter email id for sending data")
      return
    }
    else if(!mail_regex.test(mail))
    {
      setSendErrors("Email id is invalid")
      return
    }
    axios.post("/mail",{ids:selected,mail:mail})
    .then(res=>{
      if(res.data)
      {
        alert("Mail sent")
      }
      else
      {
        alert("Error")
      }
      setSendErrors("")
      document.getElementById("email_input").value=""
    })
  }

  //html
  return (
    <div className="App">
      <h2>User data</h2>
      <table className="data_table" border="1">
        <tbody>
          <tr>
            <td>Select</td>
            <td>ID</td>
            <td>Name</td>
            <td>Phone number</td>
            <td>Email</td>
            <td>Hobbies</td>
            <td>Operations</td>
          </tr>
          {
            data.map((e, i) =>
              <tr key={i}>
                <td><input type="checkbox" className="check" name="select" value={e._id}></input></td>
                <td>{i+1}</td>
                <td>{e.name}</td>
                <td>{e.ph_num}</td>
                <td>{e.email}</td>
                <td>{e.hobbies}</td>
                <td>
                  <button className="delete_button" onClick={() => deleteUser(e._id)}>
                    Delete
                  </button>
                  <button className="update_button" onClick={() => {
                    setUpdateID(e._id);
                    setUpdateData({name:e.name,ph_num:e.ph_num,email:e.email,hobbies:e.hobbies})
                    setShowUpdate(true)
                    }}>
                    Update
                  </button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
      <div className="buttons">
        <button className="add_button" onClick={()=>{setShowAdd(true)}}>Add</button>
        <br/>
        <button className="send_button" onClick={()=>{sendData()}}>Send</button>
        <br/>
        <label>Email id: </label>
        <input id="email_input" type="text"></input>
        <p>{sendErrors}</p>
      </div>
      {showAdd &&
      <div className="add_popup">
        <div className="add_area">
        <button className="add_close_button" onClick={()=>{setShowAdd(false)}}>Close</button>
        <h3>Add user</h3>
        <form className="add_form" onSubmit={handleAddSubmit}>
          <label>Name</label>
          <br/>
          <input id="a_name" name="name" type="text" onChange={handleAddChange} value={addData.name}></input>
          <p>{addErrors.name}</p>
          <label>Phone number</label>
          <br/>
          <input id="a_ph" name="ph_num" type="text" onChange={handleAddChange} value={addData.ph_num}></input>
          <p>{addErrors.ph_num}</p>
          <label>Email id</label>
          <br/>
          <input id="a_email" name="email" type="text" onChange={handleAddChange} value={addData.email}></input>
          <p>{addErrors.email}</p>
          <label>Hobbies</label>
          <br/>
          <input id="a_hobbies" name="hobbies" type="text" onChange={handleAddChange} value={addData.hobbies}></input>
          <p>{addErrors.hobbies}</p>
          <input id="a_submit" type="submit" value="Submit"></input>
        </form>
        </div>
      </div>
      }
      {showUpdate &&
      <div className="update_popup">
        <div className="update_area">
        <button className="update_close_button" onClick={()=>{setShowUpdate(false)}}>Close</button>
        <h3>Update user</h3>
        <form className="update_form" onSubmit={handleUpdateSubmit}>
          <label>Name</label>
          <br/>
          <input id="u_name" name="name" type="text" onChange={handleUpdateChange} value={updateData.name}></input>
          <p>{updateErrors.name}</p>
          <label>Phone number</label>
          <br/>
          <input id="u_ph" name="ph_num" type="text" onChange={handleUpdateChange} value={updateData.ph_num}></input>
          <p>{updateErrors.ph_num}</p>
          <label>Email id</label>
          <br/>
          <input id="u_email" name="email" type="text" onChange={handleUpdateChange} value={updateData.email}></input>
          <p>{updateErrors.email}</p>
          <label>Hobbies</label>
          <br/>
          <input id="u_hobbies" name="hobbies" type="text" onChange={handleUpdateChange} value={updateData.hobbies}></input>
          <p>{updateErrors.hobbies}</p>
          <input id="u_submit" type="submit" value="Submit"></input>
        </form>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
