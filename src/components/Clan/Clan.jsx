import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Clan.css";

import clan from "../../assets/blank_clan.svg";
import api from "../../assets/cfg";

export default function Clan({ token, username, clanInfo }) {
  const [team, setTeam] = useState({
    tag: "...",
    name: "...",
    avatar: "",
  });
  const [inClan, setInClan] = useState(false);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        let response = await axios.get(`${api}/team/check/member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.data !== null) {
          setTeam(response.data.data);
          setInClan(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function FetchProfileTeamData() {
      try {
        let response = await axios.get(`${api}/account/profile/${username}`);
        let team = await axios.get(`${api}/team/${response.data.team_tag}`);
        setTeam(team.data);
        setInClan(true);
      } catch (err) {
        console.log(err);
      }
    }
    if (token) {
      fetchTeamData();
    }
    if (!token && !clanInfo) {
      FetchProfileTeamData();
    }
    if (clanInfo) {
      setTeam(clanInfo);
      setInClan(true);
    }
  }, [token, username, clanInfo]);

  return (
    <>
      {inClan ? (
        <div style={{ marginTop: "15px", marginBottom: "15px" }}>
          <div style={{ display: "flex" }}>
            <img
              src={team.avatar ? team.avatar : clan}
              style={{ width: "75px", height: "75px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginLeft: "15px",
                }}
              >
                <h5 className="tag">[{team.tag}]</h5>
                <h4>{team.name}</h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Не в клане</p>
      )}
    </>
  );
}
