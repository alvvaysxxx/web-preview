import React from "react";
import { useState, useEffect } from "react";
import { Popover } from "react-tiny-popover";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import cog from "../../assets/cog.svg";
import account from "../../assets/account.svg";
import { useLocation } from "react-router-dom";

import "./Header.css";

export default function Header({ setToken, handleLanguage, t }) {
  const [location, setLocation] = useState(
    useLocation().pathname.split("/")[1]
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState();

  const currentLocation = useLocation().pathname.split("/")[1];

  useEffect(() => {
    setLocation(currentLocation);
  }, [currentLocation]);

  return (
    <>
      <header>
        <img src={logo} alt="AIT SO2" style={{ width: "72px" }} />

        <div className="navButtons">
          <Link to="/">
            <button className={`headerBtn ${location === "" ? "active" : ""}`}>
              {t("header.homepage")}
            </button>
          </Link>
          <button
            className={`headerBtn ${
              location === "tournaments" ? "active" : ""
            }`}
          >
            {t("header.tournaments")}
          </button>
          <Link to="/teams">
            <button
              className={`headerBtn ${location === "teams" ? "active" : ""}`}
            >
              {t("header.teams")}
            </button>
          </Link>
          <button
            className={`headerBtn ${location === "leagues" ? "active" : ""}`}
          >
            {t("header.leagues")}
          </button>
        </div>

        <Popover
          isOpen={isPopoverOpen}
          onClickOutside={() => setIsPopoverOpen(false)}
          positions={["top", "bottom", "left", "right"]}
          content={
            <div className="popover-content">
              <Link to="/settings">
                <button className="popover-btn">
                  <img
                    src={cog}
                    style={{ verticalAlign: "middle", marginRight: "10px" }}
                  />
                  {t("header.settings")}
                </button>
              </Link>
              <button
                className="logout"
                onClick={() => {
                  setToken("");
                  localStorage.clear();
                }}
              >
                {t("header.logout")}
              </button>
            </div>
          }
        >
          <div>
            <button
              onClick={() => handleLanguage("en")}
              className="langBtn"
              style={{ display: "inline" }}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguage("ru")}
              className="langBtn"
              style={{ display: "inline" }}
            >
              RU
            </button>
            <img
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              src={account}
              alt="Аккаунт"
              style={{
                width: "25px",
                verticalAlign: "middle",
                marginLeft: "5px",
              }}
            />
          </div>
        </Popover>
      </header>
      <div className="navButtons-mobile">
        <Link to="/">
          <button className={`headerBtn ${location === "" ? "active" : ""}`}>
            {t("header.homepage")}
          </button>
        </Link>
        <button
          className={`headerBtn ${location === "tournaments" ? "active" : ""}`}
        >
          {t("header.tournaments")}
        </button>
        <Link to="/teams">
          <button
            className={`headerBtn ${location === "teams" ? "active" : ""}`}
          >
            {t("header.teams")}
          </button>
        </Link>
        <button
          className={`headerBtn ${location === "leagues" ? "active" : ""}`}
        >
          {t("header.leagues")}
        </button>
      </div>
    </>
  );
}
