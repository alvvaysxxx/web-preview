import React from "react";

import "./LinkBtn.css";
import linkSvg from "../../assets/link.svg";

export default function LinkBtn({ text, link }) {
  return (
    <>
      <a href={link} target="_blank">
        <button className="linkBtn">
          {text}
          <img className="linkSvg" src={linkSvg} alt="Поиск" />
        </button>
      </a>
    </>
  );
}
