import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useSpring, animated } from "react-spring";
import "../login.css";
import { useNavigate } from "react-router-dom";
import {ServicePage} from "../ServicePage";function Login() {
  const navigate = useNavigate();
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setpassword] = useState("");
  const Login = async () => {
    try {
      const res = await ServicePage.Login({
        email: emailOrName,
        password: password,
      });

      if (res.status === 200 || res.data.success) {
        localStorage.setItem("userdata", JSON.stringify(res.data));
        window.location.href = "/home";
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
    }
  };

  const animationProps = useSpring({
    from: { transform: "scale(1)" },
    to: { transform: "scale(0.3)" },
    config: { duration: 1000, ease: "easeInOut" },
  });
  return (
    <div className="login-container">
      <div className="left-side">
        {/* <animated.img
          src="./img/vhs.png"
          alt="Animated Image"
          className="nnc"
          style={animationProps}
        /> */}
        Urban Veggies
      </div>
      <div className="right-side">
        <div className="row m-auto text-center">
          <h4 className="mt-3 ">LOGIN TO YOUR ACCOUNT</h4>
          <div className="inputlogin " style={{ marginTop: "50px" }}>
            <div
              class="input-group mb-4 mt-3"
              style={{ display: "block", width: "100%" }}
            >
              <Form.Control
                type="email"
                className="form-control"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                  marginTop: "10px",
                }}
                onChange={(e) => setEmailOrName(e.target.value)}
              />
              <Form.Control
                type="password"
                className="form-control mt-4"
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{
                  width: "60%",
                  marginLeft: "20%",
                  borderRadius: "3px",
                }}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center pt-3">
            <Button
              style={{
                width: "60%",
           
                backgroundColor: "#10b981",
                border: "none",
                fontWeight: "bold",
              }}
              onClick={Login}
            >
              Login
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

export default Login;
