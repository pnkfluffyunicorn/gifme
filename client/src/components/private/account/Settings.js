import React, { useState } from "react";
import axios from "axios";
import ErrorMessage from "../../../utils/errorMessage";
import {CheckPass} from "../../../utils/Checkpass";
import { UpdateUser } from "../../../utils/UpdateUser";
import { DeleteAccount } from "../../../utils/DeleteAccount";

const Account = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [trace, setTrace] = useState("");

  const V_Token = localStorage.getItem("myToken");
  
  const onChange = e => {
    setTrace([e.target.name]);
  };
  const config = {
    headers: {
      "x-auth-token": V_Token
    }
  };
  axios
    .get("api/auth", config)
    .then(res => {
      setUserName(res.data.name);
      setUserEmail(res.data.email);
    })
    .catch(err => {
      console.error(err.response);
      window.location.href = "/Settings";
    });
  return (
    <div>
      <div className="account_body">
        <div className="Title">Account</div>
        <div className="Container">
          <div className="Content">
            <h5>Name:</h5> {userName}{" "}
          </div>
          <div className="Content">
            <h5>Email:</h5> {userEmail}{" "}
          </div>
          <div className="Content">
            <h5>Password:</h5> ********{" "}
          </div>
        </div>
        <div className="Container">
          <button name="name" onClick={e => onChange(e)} className="Change">
            Edit your Name
          </button>
          <button name="email" onClick={e => onChange(e)} className="Change">
            Change Email
          </button>
          <button name="password" onClick={e => onChange(e)} className="Change">
            Change Password
          </button>
          <button
            className="delete_btn"
            name="delete"
            onClick={e => onChange(e)}
          >
            Delete Account
          </button>
        </div>
        <ToSwitch
        data={trace}
        UpdateName={(name) => setUserName(name)}
        UpdateEmail={(email) => setUserEmail(email)}
        />
      </div>
    </div>
  );
};

const ToSwitch = ({ data, UpdateName, UpdateEmail }) => {
  const [newData, setNewData] = useState({
    name: "",
    email: "",
    newpassword: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { name, email, newpassword, password } = newData;
  const V_Token = localStorage.getItem("myToken");

  const onChange = e => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (newpassword) {
        CheckPass(V_Token, password)
        .then(res => {
          if(res !== 'ok')
          {
            setError(res);
            return;
          }
          else {
            UpdateUser(V_Token, newpassword, null, null)
              .then(res => {
                if(res !== 'ok'){
                  setError(res);
                  return;
                  }
                  window.location.href = "/Settings";
                });
              }
            });
    } else if (password) {
      DeleteAccount(V_Token, password)
      .then(res => {
        if(res !== 'ok')
          setError(res);
      })
      localStorage.removeItem("myToken");
      window.location.href = "/";
    } else {
      UpdateUser(V_Token, newpassword, name, email)
      .then(res => {
        console.log('last UpdateUser:',res.data)

        if(res.data){
        UpdateName(res.data.name);
        UpdateEmail(res.data.email);
      } else {setError(res);}
      });
      //window.location.href = "/Settings";
    }
  };

  switch (data.toString()) {
    case "password":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                placeholder="Type your current password"
                required="required"
                className="edit_button"
              />

              <input
                name="newpassword"
                value={newpassword}
                onChange={e => onChange(e)}
                type="password"
                placeholder="Type your new password"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Change password
              </button>
            </form>
          </div>
        </div>
      );
    case "name":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="name"
                type="text"
                value={name}
                onChange={e => onChange(e)}
                placeholder="New name"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Edit name
              </button>
            </form>
          </div>
        </div>
      );
    case "email":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="email"
                type="text"
                value={email}
                onChange={e => onChange(e)}
                placeholder="New email"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Change email
              </button>
            </form>
          </div>
        </div>
      );
    case "delete":
      return (
        <div>
          <div className="Cont_edit">
            <ErrorMessage text={error} />

            <form onSubmit={e => onSubmit(e)} className="edit_form">
              <input
                name="password"
                type="password"
                value={password}
                onChange={e => onChange(e)}
                placeholder="Confirm your password"
                required="required"
                className="edit_button"
              />

              <button type="submit" className="edit_sign_button">
                Delete Account
              </button>
            </form>
          </div>
        </div>
      );
    default:
      return <div></div>;
  }
};

export default Account;
