import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { Form } from "react-bootstrap";
import {ServicePage} from "../ServicePage";
import "../login.css";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();

  const [FormData, setFormData] = useState({
    password: "",
    confirmpassword: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    if (
      !FormData.userName ||
      !FormData.email ||
      !FormData.password ||
      !FormData.confirmpassword
    ) {
      return alert("Please fill out all fields");
    }
    try {
      ServicePage.Register({
        username: FormData.userName,
        email: FormData.email,
        password: FormData.password,
        cpassword: FormData.confirmpassword,
      })
        .then((response) => {
          alert("Sign Up Successful!");
        
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error updating user ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prevedata) => ({
      ...prevedata,
      [name]: value,
    }));
  };


  return (
    <div className="login-container">
      <div className="right-side">
        <div className="row m-auto text-center">
          <h4 className="mt-3 ">Register</h4>
          <div className="inputlogin ">
            <div
              class="input-group mb-4 mt-3"
              style={{ display: "block", width: "100%" }}
            >
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Name"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                  marginTop: "10px",
                }}
                name="userName"
                value={FormData.userName}
                onChange={handleChange}
              />
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Email"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                  marginTop: "10px",
                }}
                name="email"
                value={FormData.email}
                onChange={handleChange}
              />
              <Form.Control
                type="password"
                className="form-control mt-4"
                placeholder="Password"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                }}
                name="password"
                value={FormData.password}
                onChange={handleChange}
              />
              <Form.Control
                type="password"
                className="form-control mt-4"
                placeholder="Confirm Password"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                }}
                name="confirmpassword"
                value={FormData.confirmpassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center pt-3">
            <Button
              style={{
                width: "200px",
                padding: "4px",
                backgroundColor: "#a9042e",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={handleRegister}
            >
              Signup
            </Button>
          </div>
          <p
            style={{
              fontSize: "12px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <b>Never share your login details with anyone.</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
