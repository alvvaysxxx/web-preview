import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import Banned from "./pages/Banned/Banned";

import axios from "axios";

import { useTranslation } from "react-i18next";
import api from "./assets/cfg";

import "./index.css";

import "./App.css";
import Settings from "./pages/Settings/Settings";
import Teams from "./pages/Teams/Teams";
import TeamInfo from "./pages/TeamInfo/TeamInfo";

function App() {
  const image = `
                                             
                                             
                                             
                  .::^~^::.                  
            .::^~~^~^^:^^~^~~^::.            
      ..:^^^^^~^::.       .::^~^^^^^:..      
     .~^^^^:..                 ..:^^^^~.     
     .^^^.                         .^^^.     
     .^^^^^^^^^^.           .^^^^^^^^^^.     
     .~^^^^^^^^^^^.       .^^^^^^^^^^^~.     
     .~^~:   .^^^^^^:   :^^^^^^.   :~^~.     
      :~^~:    .^^^^^~^~^^^^^.    :~^~:      
       .~^^^     ~^^^^^^^^^~     ^^^~.       
         ^^^~.   .^^^^^^^^^.   .~^^^         
          :~^~.    .^~^~^.    .~^~:          
           .~^~:     .:.     :~^~.           
             ^^^^..       ..^^^^             
              :~^~~~.   .~~~^~:              
                    .   .                    
                                             
                                             
`;

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState({});
  const [isBanned, setIsBanned] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ru");

  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLang(language);
    localStorage.setItem("lang", language);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(`${api}/account/parsing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userInfoResponse = await axios.get(
        `${api}/account/profile/${response.data.username}`
      );
      setUser(userInfoResponse.data);
      if (userInfoResponse.data.Ban.status === true) {
        setIsBanned(true);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => console.log(image), []);

  // Banned the fuck outta platform

  if (isBanned) {
    return <Banned user={user} t={t} />;
  }

  //Unauthorized

  if (!token || token === "null") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    );
  }
  // Authorized
  return (
    <BrowserRouter>
      <Header setToken={setToken} handleLanguage={changeLanguage} t={t} />
      <Routes>
        <Route path="/" element={<Home token={token} t={t} />} />
        <Route path="/profile/:username" element={<Profile t={t} />} />
        <Route
          path="/settings"
          element={<Settings token={token} user={user} t={t} />}
        />
        <Route
          path="/teams"
          element={<Teams token={token} user={user} t={t} />}
        />
        <Route
          path="/teams/:clan"
          element={<TeamInfo token={token} user={user} t={t} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
