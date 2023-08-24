import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Register.css";

import logo from "../../assets/logo.svg";
import { Helmet } from "react-helmet";
import api from "../../assets/cfg";

export default function Register({ setToken }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [standoff_id, setStandoff_id] = useState(0);
  const [error, setError] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleid = (e) => {
    setStandoff_id(e.target.value);
  };

  const register = async () => {
    try {
      let response = await axios.post(`${api}/account/register`, {
        username,
        password,
        standoff_id: parseInt(standoff_id, 10),
      });
      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="register">
      <Helmet>
        <title>AIT - Sign Up</title>
        <meta
          name="description"
          content={"Присоединяйтесь к киберспортивной платформе AIT Standoff 2"}
        />
      </Helmet>
      <div className="registerform outline-card">
        <img
          src={logo}
          style={{ width: "100px", height: "100px", marginBottom: "20px" }}
        />
        <h2 className="text-center" style={{ marginBottom: "10px" }}>
          Еще нет аккаунта на платформе? Создайте!
        </h2>
        <input onChange={handleUsername} placeholder="Никнейм" />
        <input type="password" onChange={handlePassword} placeholder="Пароль" />
        <input
          type="number"
          onChange={handleid}
          placeholder="ID (как в игре)"
        />
        {error ? (
          <p className="text-center">
            Имя пользователя или ID уже зарегистрировано
          </p>
        ) : null}
        <button onClick={register}>Зарегистрироваться</button>
        <div className="existingAccount">
          <p>Уже есть аккаунта?</p>
          <Link to="/login">
            <p style={{ color: "lightblue", textDecoration: "underline" }}>
              Вход
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
