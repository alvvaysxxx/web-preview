import React from "react";
import { useState, useEffect } from "react";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";

import "./KDChart.css";

export default function KDChart({ data }) {
  /*let sampleData = [
    { kd: 1 },
    { kd: 2.13 },
    { kd: 1.85 },
    { kd: 3 },
    { kd: 0.84 },
    { kd: 1.14 },
    { kd: 0.8 },
    { kd: 3 },
    { kd: 1.5 },
    { kd: 3.14 },
    { kd: 2.18 },
    { kd: 1.25 },
    { kd: 0.51 },
    { kd: 2 },
    { kd: 0.5 },
  ];*/

  const [kd_data, setKd_data] = useState(
    data.map((item, index) => {
      const { kd } = item;
      const kdValue = kd["$numberDecimal"];
      return { kd: parseFloat(kdValue) };
    })
  );

  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: "white",
          fontSize: 16,
          padding: 10,
          fontFamily: "Montserrat",
        },
      },
    },
  };

  return (
    <div>
      <VictoryChart height={224} width={260} theme={chartTheme}>
        <VictoryAxis
          dependentAxis
          crossAxis
          style={{
            grid: { stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 1.5 },
          }}
        />
        <VictoryLine
          y="kd"
          data={kd_data}
          style={{
            data: {
              stroke: "rgb(69, 203, 133)",
              strokeWidth: ({ active }) => (active ? 10 : 5),
            },
          }}
          animate={{
            duration: 5000,
            onLoad: { duration: 5000 },
          }}
        />
      </VictoryChart>
    </div>
  );
}
