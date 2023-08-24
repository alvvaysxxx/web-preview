import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { Helmet } from "react-helmet";

import "./Profile.css";

import ReturnBtn from "../../components/ReturnBtn/ReturnBtn";
import LinkBtn from "../../components/LinkBtn/LinkBtn";
import Avatar from "../../components/Avatar/Avatar";
import Metrics from "../../components/Metrics/Metrics";

import team from "../../assets/team.svg";
import Clan from "../../components/Clan/Clan";
import api from "../../assets/cfg";
import KDChart from "../../components/KDChart/KDChart";

export default function Profile({ t }) {
  const navigate = useNavigate();

  const { username } = useParams();

  const [profileUsername, setProfileUsername] = useState();
  const [profileSo2ID, setProfileSO2ID] = useState();
  const [profileTeam, setProfileTeam] = useState();
  const [profileAvatar, setProfileAvatar] = useState();
  const [profileStats, setProfileStats] = useState({
    kills: 0,
    deaths: 0,
    wins: 0,
    loses: 0,
  });
  const [kd_history, setKd_History] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [banInfo, setBanInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(`${api}/account/profile/${username}`);
        setProfileUsername(response.data.username);
        setProfileTeam(response.data.team);
        setProfileSO2ID(response.data.standoff2_id);
        setProfileStats(response.data.statistic);
        setProfileAvatar(response.data.avatar);
        setIsBanned(response.data.Ban.status);
        setBanInfo(response.data.Ban);
        setKd_History(response.data.kd_history);
      } catch (err) {
        console.log(err);
        return navigate(-1);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>AIT - Profile</title>
        <meta
          name="description"
          content={"Профиль игрока на киберспортивной платформе AIT Standoff 2"}
        />
      </Helmet>
      <ReturnBtn />
      <div style={{ marginTop: "20px" }}>
        <div className="profile-body">
          <div className="profile outline-card">
            {isBanned ? (
              <div className="userBanned">
                <h4>Этот пользователь забанен на нашей платформе</h4>
                <p>Причина: {banInfo.reason}</p>
              </div>
            ) : (
              <></>
            )}
            <div
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar url={profileAvatar} />
              <h2 style={{ marginLeft: "10px" }}>{profileUsername}</h2>
            </div>
            <p>ID: {profileSo2ID}</p>
            <Clan username={profileUsername} />
            <LinkBtn
              text={t("profile.viewInGameButton")}
              link={
                profileSo2ID
                  ? `https://link.standoff2.com/ru/profile/view/${profileSo2ID}`
                  : null
              }
            />
          </div>
          <div>
            <h4 className="text-center" style={{ marginBottom: "15px" }}>
              {t("profile.metrics")}
              {profileUsername}
            </h4>
            <Metrics stats={profileStats} />
          </div>
          <div>
            <h4 className="text-center" style={{ marginBottom: "15px" }}>
              График K/D
            </h4>
            <div className="KDStats-container">
              {kd_history.length !== 0 ? (
                <KDChart data={kd_history} />
              ) : (
                <h2 className="text-center">История пуста</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
