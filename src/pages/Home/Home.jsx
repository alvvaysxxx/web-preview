import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import { Helmet } from "react-helmet";

import "./Home.css";
import "react-circular-progressbar/dist/styles.css";

import Search from "../../components/Search/Search";
import BlankAvatar from "../../components/BlankAvatar/BlankAvatar";
import Avatar from "../../components/Avatar/Avatar.jsx";
import Metrics from "../../components/Metrics/Metrics";

import teamSvg from "../../assets/team.svg";
import Clan from "../../components/Clan/Clan";
import api from "../../assets/cfg";
import KDChart from "../../components/KDChart/KDChart";

export default function Home({ token, t }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [standoff2_id, setStandoff2_id] = useState();
  const [team, setTeam] = useState();
  const [avatar, setAvatar] = useState();
  const [stats, setStats] = useState({
    kills: 0,
    deaths: 0,
    wins: 0,
    loses: 0,
  });
  const [kd_history, setKd_history] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(`${api}/account/parsing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(response.data.username);
      let userInfoResponse = await axios.get(
        `http://localhost:3000/account/profile/${response.data.username}`
      );
      setStandoff2_id(userInfoResponse.data.standoff2_id);
      setStats(userInfoResponse.data.statistic);
      setAvatar(userInfoResponse.data.avatar);
      setTeam(userInfoResponse.data.team);
      setKd_history(userInfoResponse.data.kd_history);
    }
    fetchData();
  }, []);

  const handleSearch = async (search) => {
    navigate(`/profile/${search}`);
  };

  return (
    <div className="homepage">
      <Helmet>
        <title>AIT Homepage</title>
        <meta
          name="description"
          content={"Главная страница киберспортивной платформы AIT Standoff 2"}
        />
      </Helmet>
      <Search t={t} callback={handleSearch} page="home" />

      <div style={{ marginBottom: "25px" }}>
        {avatar ? <Avatar url={avatar} /> : <BlankAvatar token={token} />}
        <h1 style={{ marginTop: "15px" }}>
          {t("homepage.title")}
          {username}
        </h1>
        <p>
          {t("homepage.gameid")} {standoff2_id}
          <Clan token={token} />
        </p>
      </div>

      <div className="homepage-body">
        <div>
          <h4
            style={{
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {t("homepage.stats")}
          </h4>
          <Metrics stats={stats} />
        </div>
        <div>
          <h4 className="text-center" style={{ marginBottom: "15px" }}>
            График K/D
          </h4>
          <div className="KDStats-container outline-card">
            {kd_history.length !== 0 ? (
              <KDChart data={kd_history} />
            ) : (
              <h2 className="text-center">История пуста</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
