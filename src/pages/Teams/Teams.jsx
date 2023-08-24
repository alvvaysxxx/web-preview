import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Clan from "../../components/Clan/Clan";
import axios from "axios";
import { Helmet } from "react-helmet";
import Modal from "react-modal";

import api from "../../assets/cfg";
import "./Teams.css";
import Metrics from "../../components/Metrics/Metrics";
import Search from "../../components/Search/Search";

export default function Teams({ token, t }) {
  const navigate = useNavigate();

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
        let response = await axios.get(`${api}/team/check/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.data.data !== null) {
          setTeam(response.data.data);
          setTeamAvatar(response.data.data.avatar);
          setInClan(true);
        } else {
          setInClan(false);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(true);
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
    getOwner();
  }, [renderKey]);

  const handleSearch = (search) => {
    navigate(`/teams/${search}`);
  };

  const handleImageUpdate = async () => {
    const formData = new FormData();
    formData.append("avatarFile", selectedImage);
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
        <title>AIT - TEAMS</title>
        <meta name="description" content={"Команды на платформе AIT"} />
      </Helmet>
      <Search t={t} page="teams" callback={handleSearch} />
      <h2>{t("teams.title")}</h2>
      {!inClan ? (
        <>
          <p>{t("teams.notInTeam")}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={openModal}
              style={{ paddingLeft: "25px", paddingRight: "25px" }}
            >
              {t("teams.createTeam")}
            </button>
          </div>

          <Modal
            isOpen={createTeamModalOpened}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Create Team"
          >
            <button onClick={closeModal}>{t("teams.close")}</button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <h2>{t("teams.createTeam")}</h2>
                <input
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={t("teams.teamName")}
                />
                <input
                  onChange={(e) => setTeamTag(e.target.value)}
                  placeholder={t("teams.teamTag")}
                />
              </div>
              <button onClick={handleTeamCreate}>{t("teams.create")}</button>
              {teamCreationErrors ? (
                <p
                  className="text-center"
                  style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                >
                  {t("teams.error")}
                </p>
              ) : null}
            </div>
          </Modal>
        </>
      ) : (
        <>
          <div className="teamPage">
            <div className="team" style={{ marginTop: "25px" }}>
              <div className="team-body">
                <h5 style={{ marginBottom: "15px" }}>
                  {t("teams.currentTeam")}
                </h5>
                <div className="team-container outline-card">
                  <Clan token={token} />
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
                  <button
                    onClick={openConfirmation}
                    className="leave"
                    style={{ marginBottom: "15px" }}
                  >
                    {t("teams.leave")}
                  </button>
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
      )}
    </div>
  );
}
