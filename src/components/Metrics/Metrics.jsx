import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Metrics.css";

export default function Metrics({ stats }) {
  return (
    <div className="metrics outline-card">
      <div className="metrics-container">
        <div className="metric">
          <h4>K/D</h4>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <p className="text-center" style={{ color: "#45CB85" }}>
              KILLLS: <b>{stats.kills}</b>
            </p>
            <p className="text-center" style={{ color: "#FC406D" }}>
              DEATHS: <b>{stats.deaths}</b>
            </p>
          </div>
          <CircularProgressbar
            value={
              stats
                ? (
                    (stats.kills / (stats.kills + stats.deaths) || 0) * 100
                  ).toFixed(2)
                : 0
            }
            text={`${stats ? (stats.kills / stats.deaths || 0).toFixed(2) : 0}`}
            styles={{
              text: {
                fontFamily: "Montserrat",
                fill: "#ffffff",
                fontSize: "14px",
              },
              path: {
                stroke: "#45CB85",
              },
              trail: {
                stroke: "#FC406D",
              },
            }}
          />
        </div>

        <div className="metric">
          <h4>WINRATE</h4>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <p className="text-center" style={{ color: "#45CB85" }}>
              WINS: <b>{stats.wins}</b>
            </p>
            <p className="text-center" style={{ color: "#FC406D" }}>
              LOSES: <b>{stats.loses}</b>
            </p>
          </div>
          <CircularProgressbar
            value={
              stats
                ? (
                    (stats.wins / (stats.wins + stats.loses)) * 100 || 0
                  ).toFixed(2)
                : 0
            }
            text={`${
              stats
                ? (
                    (stats.wins / (stats.wins + stats.loses)) * 100 || 0
                  ).toFixed(1)
                : 0
            }%`}
            styles={{
              text: {
                fontFamily: "Montserrat",
                fill: "#ffffff",
                fontSize: "14px",
              },
              path: {
                stroke: "#45CB85",
              },
              trail: {
                stroke: "#FC406D",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
