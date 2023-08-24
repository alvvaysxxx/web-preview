import React from "react";
import { useState, useEffect, useRef } from "react";
import Clan from "../../components/Clan/Clan";
import axios from "axios";
import { Helmet } from "react-helmet";

import { useNavigate, useParams } from "react-router-dom";

import Modal from "react-modal";

import api from "../../assets/cfg";
import "./TeamInfo.css";
import Metrics from "../../components/Metrics/Metrics";
import ReturnBtn from "../../components/ReturnBtn/ReturnBtn";

export default function TeamInfo({ token, t }) {
  const navigate = useNavigate();

  const { clan } = useParams();

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [team, setTeam] = useState({
    name: "...",
    tag: "...",
  });
  const [inClan, setInClan] = useState(false);
  const [createTeamModalOpened, setCreateTeamModalOpened] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamTag, setTeamTag] = useState("");
  const [teamAvatar, setTeamAvatar] = useState("");
  const [teamCreationErrors, setTeamCreationErrors] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);
  const [stats, setStats] = useState({
    kills: 0,
    deaths: 0,
    wins: 0,
    loses: 0,
  });
  const [isOwner, setIsOwner] = useState(false);

  const forceRerender = () => {
    setRenderKey((prevKey) => prevKey + 1);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "black",
      width: "70vw",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
  };

  const confirmationStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "black",
      width: "40vw",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
  };

  useEffect(() => {
    async function fetchTeamData() {
      try {
        let response = await axios.get(`${api}/team/${clan}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.data !== null) {
          setTeam(response.data);
          setTeamAvatar(response.data.avatar);
          setInClan(true);
        } else {
          setInClan(false);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(true);
        navigate(-1);
      }
    }

    async function getOwner() {
      try {
        let response = await axios.get(`${api}/team/owner/info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let parsedUser = await axios.get(`${api}/account/parsing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let user = await axios.get(
          `${api}/account/profile/${parsedUser.data.username}`
        );

        if (user.data._id === response.data.owner) {
          setIsOwner(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchTeamData();
  }, [renderKey]);

  const handleImageUpdate = async () => {
    const formData = new FormData();
    formData.append("avatarFile", selectedImage);
    console.log("Form Data:", formData);
    try {
      let response = await axios.post(
        `${api}/team/action/set/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Image Update Response:", response);
    } catch (err) {
      console.log("Image Update Error:", err);
    }
    forceRerender();
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
    }

    reader.readAsDataURL(file);
    console.log("Selected Image:", selectedImage);
    console.log("Preview Image:", previewImage);
  };

  const openModal = () => {
    setCreateTeamModalOpened(true);
  };

  const closeModal = () => {
    setCreateTeamModalOpened(false);
  };

  const openConfirmation = () => {
    setConfirmationModalOpened(true);
  };

  const closeConfirmation = () => {
    setConfirmationModalOpened(false);
  };

  const handleTeamCreate = async () => {
    try {
      let response = await axios.post(
        `${api}/team/create`,
        {
          name: teamName,
          tag: teamTag,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.error === true) {
        return setTeamCreationErrors(true);
      }
      closeModal();
      forceRerender();
    } catch (err) {
      console.log(err);
      setTeamCreationErrors(true); // Установить состояние ошибки создания команды
    }
  };

  const leaveTeam = async () => {
    try {
      let response = await axios.get(`${api}/team/action/leave`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeConfirmation();
      forceRerender();
    } catch (err) {
      closeConfirmation();
    }
  };

  if (loading) {
    return (
      <div>
        <Helmet>
          <title>AIT - TEAMS</title>
          <meta name="description" content={"Команды на платформе AIT"} />
        </Helmet>
        <h2>{t("teams.title")}</h2>
        <div style={{ marginTop: "50px" }}>
          <h4 className="text-center">Загрузка данных...</h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>AIT - {team.name}</title>
        <meta
          name="description"
          content={`Команда ${teamName} на платформе AIT`}
        />
      </Helmet>
      <h2 style={{ marginBottom: "15px" }}>Информация о команде {team.name}</h2>
      <>
        <ReturnBtn />
        <div className="teamPage">
          <div className="team" style={{ marginTop: "25px" }}>
            <div className="team-body">
              <div className="team-container outline-card">
                <Clan clanInfo={team} />
                {isOwner ? (
                  <>
                    {" "}
                    <label htmlFor="fileInput">
                      <p
                        style={{
                          marginTop: "15px",
                          marginBottom: "5px",
                          color: "cyan",
                        }}
                      >
                        Сменить аватар команды
                      </p>
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      style={{ display: "none" }}
                    />
                    {selectedImage ? (
                      <>
                        <button onClick={handleImageUpdate}>
                          Загрузить изображение
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                          }}
                        >
                          Отмена
                        </button>
                        <p>Чтобы увидеть изменения, перезагрузите страницу</p>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : null}
              </div>

              <div className="teammates-container">
                <table>
                  <caption>{t("teams.teammates")}</caption>
                  <tbody>
                    <tr>
                      <p>ID: 44647395</p>
                      urionzzz
                    </tr>
                    <tr>
                      <p>ID: 44647395</p>
                      urionzzz
                    </tr>
                    <tr>
                      <p>ID: 44647395</p>
                      urionzzz
                    </tr>
                    <tr>
                      <p>ID: 44647395</p>
                      urionzzz
                    </tr>
                    <tr>
                      <p>ID: 44647395</p>
                      urionzzz
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="stats" style={{ marginTop: "25px" }}>
            <div className="stats-body">
              <h5 style={{ marginBottom: "15px" }}>{t("teams.stats")}</h5>
              <Metrics stats={stats} />
            </div>
            <Modal
              isOpen={confirmationModalOpened}
              onRequestClose={closeConfirmation}
              style={confirmationStyles}
              ariaHideApp={false}
              contentLabel="Confirmation"
            >
              <button onClick={closeConfirmation}>{t("teams.close")}</button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                    className="text-center"
                  >
                    {t("teams.areYouSure")}
                  </h2>
                </div>
                <button className="leave text-center" onClick={leaveTeam}>
                  {t("teams.leave")}
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </>
    </div>
  );
}
