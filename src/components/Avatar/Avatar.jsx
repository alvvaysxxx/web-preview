import React from "react";
import { useState, useEffect } from "react";

import "./Avatar.css";

export default function Avatar({ url }) {
  return (
    <div>
      <img src={url} alt="avatar" className="avatar" />
    </div>
  );
}
