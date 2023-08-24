import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

import logo from "../../assets/logo.svg";
import { Helmet } from "react-helmet";
import api from "../../assets/cfg";

export default function Login({ setToken }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errors, setErrors] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const login = async () => {
    try {
      let response = await axios.post(`${api}/account/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
      navigate("/");
    } catch (err) {
      setErrors(true);
    }
  };

  return (
    <div className="login">
      <Helmet>
        <title>AIT- Sign In</title>
        <meta
          name="description"
          content={"Присоединиться к киберспортивной платформе AIT Standoff 2"}
        />
      </Helmet>
      <div className="loginform outline-card">
        <img
          src={logo}
          style={{ width: "100px", height: "100px", marginBottom: "20px" }}
        />
        <h2 className="text-center" style={{ marginBottom: "10px" }}>
          Рады вас видеть снова на нашей платформе!
        </h2>
        <input onChange={handleUsername} placeholder="Никнейм" />
        <input type="password" onChange={handlePassword} placeholder="Пароль" />
        {errors ? (
          <p className="text-center">Неверное имя пользователя или пароль</p>
        ) : (
          <></>
        )}
        <button onClick={login}>Войти в аккаунт</button>
        <div className="existingAccount">
          <p>Еще нет аккаунта?</p>
          <Link to="/">
            <p style={{ color: "lightblue", textDecoration: "underline" }}>
              Зарегистрируйтесь
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
