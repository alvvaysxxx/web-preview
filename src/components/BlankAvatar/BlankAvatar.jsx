import React, { useRef, useState } from "react";
import axios from "axios";
import "./BlankAvatar.css";

import api from "../../assets/cfg";
import blankAvatar from "../../assets/blankavatar.svg";

export default function BlankAvatar({ token }) {
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    // Устанавливаем флаг, чтобы клик по картинке был первичным
    const file = e.target.files[0];
    setSelectedImage(file);

    // Загружаем изображение на сервер сразу после выбора картинки
    handleUpload(file);
  };

  const handleUpload = async (imageFile) => {
    if (!imageFile) {
      return;
    }

    const formData = new FormData();
    formData.append("avatar", imageFile); // Поменяйте "image" на "avatarFile", чтобы соответствовать ожидаемому ключу на сервере.

    try {
      const response = await axios.post(`${api}/account/avatar/set`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Устанавливаем правильный заголовок для отправки файла
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("URL загруженного изображения:", response.data.url);
      // Здесь можно добавить логику обработки ответа с URL загруженного изображения
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
    }
  };

  return (
    <div>
      <label htmlFor="fileInput">
        <img
          src={blankAvatar}
          alt="blank avatar"
          style={{ width: "90px", marginTop: "15px", cursor: "pointer" }}
        />
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
  );
}
