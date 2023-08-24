import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function Search({ callback, t, page }) {
  const [searchValue, setSearchValue] = useState("");

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const search = () => {
    callback(searchValue);
  };

  return (
    <div className="searchbar">
      <input
        className="search"
        style={{ display: "inline" }}
        onChange={searchHandler}
        placeholder={
          page === "home"
            ? t("searchbar.placeholder")
            : page === "teams"
            ? "Тег или название команды"
            : null
        }
      ></input>
      {searchValue ? (
        <button
          className="searchBtn"
          style={{ display: "inline" }}
          onClick={search}
        >
          {t("searchbar.buttonText")}
        </button>
      ) : (
        <button
          className="searchBtn unable"
          disabled
          style={{ display: "inline" }}
          onClick={search}
        >
          {t("searchbar.buttonText")}
        </button>
      )}
    </div>
  );
}
