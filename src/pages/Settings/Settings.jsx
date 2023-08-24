import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Settings.css";
import ReturnBtn from "../../components/ReturnBtn/ReturnBtn";
import Avatar from "../../components/Avatar/Avatar";
import { Helmet } from "react-helmet";
import api from "../../assets/cfg";

export default function Settings({ token, t, user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.avatar);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const changeAvatar = async () => {
    if (!selectedImage) {
      return true;
    }

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    try {
      const response = await axios.post(`${api}/account/avatar/set`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("URL загруженного изображения:", response.data.url);
      return true;
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      setAvatarError(true);
      return false;
    }
  };

  const changePassword = async () => {
    if (!newPassword) {
      return true;
    }

    try {
      const passwordResponse = await axios.post(
        `${api}/account/password/update`,
        {
          username: user.username,
          old_pass: oldPassword,
          new_pass: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return true;
    } catch (err) {
      console.error(err);
      setPasswordError(true);
      return false;
    }
  };

  const applyChanges = async () => {
    setLoading(true);

    try {
      setPasswordError(false); // Сбрасываем состояние passwordError перед вызовом функций
      setAvatarError(false); // Сбрасываем состояние avatarError перед вызовом функций

      const [avatarChanged, passwordChanged] = await Promise.all([
        changeAvatar(),
        changePassword(),
      ]);

      setLoading(false);

      if (avatarChanged && passwordChanged) {
        navigate(-1);
      }
    } catch (error) {
      setLoading(false);
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>AIT SETTINGS</title>
        <meta
          name="description"
          content={"Настройки аккаунта AIT Standoff 2"}
        />
      </Helmet>
      <ReturnBtn />
      <h4 style={{ marginTop: "25px" }} className="text-center">
        {t("settings.title")}
      </h4>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "25px" }}>
        <Avatar url={previewImage} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "5px",
            marginLeft: "10px",
          }}
        >
          <h4>{user.username}</h4>
          <label htmlFor="fileInput">
            <p style={{ color: "cyan" }}>{t("settings.upload-avatar")}</p>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="changePassword">
        <h4>{t("settings.change-password")}</h4>
        <div style={{ marginTop: "15px" }}>
          <input
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t("settings.old-password")}
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("settings.new-password")}
          />
        </div>
      </div>
      <button
        style={{ marginTop: "65px" }}
        onClick={applyChanges}
        disabled={loading}
      >
        {loading ? t("settings.applying") : t("settings.apply-changes")}
      </button>
      {avatarError && <p>Ошибка загрузки аватара</p>}
      {passwordError && <p>Неправильно указан старый пароль!</p>}
    </div>
  );
}
