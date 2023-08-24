import React from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./ReturnBtn.css";
import close from "../../assets/close.svg";

export default function ReturnBtn() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleReturnBtn = () => {
    navigate(-1);
  };

  return (
    <>
      <button
        onClick={handleReturnBtn}
        style={{ lineHeight: "0", verticalAlign: "middle" }}
        className="returnBtn"
      >
        <img
          src={close}
          alt="Close"
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        {t("component.returnBtn")}
      </button>
    </>
  );
}
