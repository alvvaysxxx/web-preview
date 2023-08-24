import React from "react";

import "./Banned.css";
import logo from "../../assets/logo.svg";
import { Helmet } from "react-helmet";

export default function Banned({ user, t }) {
  return (
    <div className="banned">
      <Helmet>
        <title>BANNED!</title>
        <meta
          name="description"
          content={"Вы забанены на киберспортивной платформе AIT Standoff 2"}
        />
      </Helmet>
      <div className="banned-body">
        <img src={logo} style={{ width: "100px" }} />
        <h2 className="text-center">{t("banned.title")}</h2>
        <h4 style={{ marginTop: "20px" }} className="text-center">
          {t("banned.ban_giver")}
          {user.Ban.ban_giver}
        </h4>
        <h4 style={{ marginTop: "15px" }} className="text-center">
          {t("banned.reason")}
        </h4>
        <p className="text-center">{user.Ban.reason}</p>
      </div>
    </div>
  );
}
