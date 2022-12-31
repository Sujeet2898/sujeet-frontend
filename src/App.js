import "./App.css";
import { faLaughWink, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {  CSVDownload } from "react-csv";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from "react-router";
import { Link, Route, Switch, Redirect } from "react-router-dom";
function App() {
  //to hide/show the side navbar when the menu button on the top is clicked(for small screens)
  const [navshow, setnavshow] = useState("block");
  return (
    <div className="wholepage">
      {/*hides side nav bar when the menu button is clicked */}
      <div className="nav-bar" style={{ display: navshow }}>
        <Link className="link" to="/Dashboard">
          <div className="nav-items">
            <FontAwesomeIcon icon={faLaughWink} size="2x" /><span>Dashboard</span>
          </div>
        </Link>
        <Link className="link" to="/users">
          <div className="nav-items" >
            <FontAwesomeIcon icon={faList} size="1x" />
            List Users
          </div>
        </Link>
      </div>
      {/*creating a menubar on top */}
      <div>
        <div className="topnavbar">
          {/*when menu button is clicked, the side navbar toggles between hide/show. 
              This menu button is not available for large screens and the sidenavbar is always visible */}
          <button className="navtogglebutton" onClick={() => { navshow === "block" ? setnavshow("none") : setnavshow("block") }}><MenuIcon /></button>
          </div>
        <Routes />

        {/*creating a copyright content at the bottom of screen */}
        <div className="coyrightcontainer">Copyright © Your Website 2021</div>
      </div>

    </div>

  );
}
//route paths
function Routes() {
  return (
    <>
      <div className="container">
        <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/users">
            <Listusers />
          </Route>
          <Route path="/fetchUsers">
            <FetchUsers />
          </Route>
          {/* "/:id" is dynamic, which is formed when the corresponding button is clicked */}
          <Route path="/edit-user/:id">
            <Edituser />
          </Route>
          <Route path="/csv">
            <Csv />
          </Route>
          <Route exact path="/">
            <Redirect to="/Dashboard" />
          </Route>
        </Switch>
      </div>
    </>
  )
}
//creates the dashboard page 
function Dashboard() {
  return (
    <div className="dashboard-container">
      <Link className="dashboard-content" to="/fetchUsers">Fetch Users</Link><br />
      <Link className="dashboard-content" to="/users">Update Users</Link><br />
      <Link className="dashboard-content" to="/csv">Import CSV file (users)</Link>
    </div>
  )
}
//creates new users
function FetchUsers() {
  const [usersNumber, setUsersNumber] = useState(20);
  function AddUsers(number) {
    fetch(`https://gorest.co.in/public/v2/users?page=1&per_page=${number}`, {
      method: "GET"})
      .then((data) => data.json())
      .then((users) => store(users) );
  }
  function store(users) {
    fetch("https://sujeet-backend-ew7o0ufkc-sujeet2898.vercel.app/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(users)
    })
  }
  //alerts on screen when the new user is added to API
  function useralert() {
    alert("user added successfully");
  }
  return (
    <div className="new-input-boxes">
      <input type="number" className="input-box name-input" placeholder="enternumber of users to be fetched"
        onChange={(event) => setUsersNumber(event.target.value)} />
        
      <button className="input-button" onClick={() => { AddUsers(usersNumber); useralert(); }}>Add User</button><br/>
      <Link className="dashboard-content" to="/users">List Users</Link>

    </div>
  )
}
//lists the users with details
function Listusers() {
  const [newlist, setnewlist] = useState([]);
  const history = useHistory();
  //fetched data from API
  function getUsers() {
    fetch("https://sujeet-backend-ew7o0ufkc-sujeet2898.vercel.app/users", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((users) => setnewlist(users));
  }
  function editUser(id, name,email,gender,status){
    var user = {name:name,id:id,gender:gender,email:email,status:status};
    user = JSON.stringify(user);
    localStorage.setItem("user",user);
    history.push("/edit-user/" + id)
  }
  //deletes the user from API with the id
  function deleteUser(id) {
    fetch(`https://sujeet-backend-ew7o0ufkc-sujeet2898.vercel.app/deleteUser/${id}`, {
      method: "DELETE"
    })
      .then(() => history.push("/users"));
  }
  //To execute only once while loading
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="list-users">
      {!newlist.message ? newlist.map(({ id, name, email, gender, status, created_at, updated_at }) =>
        <div className="card">
          <div className="username">Name: {name}</div>
          <div className="profile">ID: {id}</div>
          <div className="profile">email: {email}</div>
          <div className="profile">Gender: {gender}</div>
          <div className="profile">Status: {status}</div>
          <div className="profile">created at: {created_at}</div>
          <div className="profile">updated at: {updated_at}</div>
          <div className="list-buttons">
            {/*routes to the new path with the current id, when edit button is clicked */}
            <button className="profile-button" onClick={() =>editUser(id,name,email,gender,status)}>Edit User</button>
            {/*removes the user with the current id from the list, when delete button is clicked */}
            <button className="delete-button" onClick={() => deleteUser(id)} >Delete User</button><br />
          </div>
        </div>):
        <div>{newlist.message}</div>}
    </div>
  )
}
//edits the user 
function Edituser() {
  const history = useHistory();
  /* takes the id from the dynamic path using the hook useparams */ 
  var user = localStorage.getItem("user");
  user = JSON.parse(user);
  const [userName, setUserName] = useState(user.name);
  // eslint-disable-next-line 
  const [ID, setId] = useState(user.id);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [status, setStatus] = useState(user.status);
  //edits the user in the APi with the id
  function edit(id) {
    fetch(`https://sujeet-backend-ew7o0ufkc-sujeet2898.vercel.app/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: userName, ID:ID,email:email,gender:gender, status:status })
    })
      .then((data) => data.json())
      .then(() => history.push("/users"));
  }
  //alerts on screen when data in API is edited
  function alertuser() {
    alert("user edited successfully");
  }
  return (
    <div className="new-input-boxes">
      {/* user details are changed when the value in the input box changes */}
      <input type="text" placeholder="Name" value = {userName} className="input-box name-input"
        onChange={(event) => setUserName(event.target.value)} />
        <input type="text" placeholder="email" value = {email} className="input-box name-input"
        onChange={(event) => setEmail(event.target.value)} />
        <input type="text" placeholder="gender" value = {gender} className="input-box name-input"
        onChange={(event) => setGender(event.target.value)} />
        <input type="text" placeholder="status" value = {status} className="input-box name-input"
        onChange={(event) => setStatus(event.target.value)} />
      <div>
      </div>
      <button onClick={() => { edit(ID); alertuser() }} className="input-button">Edit User</button><br/>
      <Link className="dashboard-content" to="/users">List Users</Link>
    </div>
  )
}

function Csv() {
  const [newlist, setnewlist] = useState([]);
  function getUsers() {
    fetch("https://sujeet-backend-ew7o0ufkc-sujeet2898.vercel.app/users", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((users) => setnewlist(users));
  }

  useEffect(()=>{
    getUsers();
  },[newlist])
  return(
    <div>
      {newlist.length > 0 ? 
      <CSVDownload data={newlist} target="_blank" />
    :
    <div>Please wait while fetching file</div>}
    </div>
  )
}

export default App;
