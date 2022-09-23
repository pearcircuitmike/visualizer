import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Heading, Text, Box, Center } from "@chakra-ui/react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Bar, Line } from "react-chartjs-2";
import { colors } from "../../../styles/colors.js";

import { csv } from "csvtojson";
import { json } from "d3-fetch";
import { filter } from "d3";

export default function USTestPositivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const date = Math.floor(new Date().getDate() / 1000);
    const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/labs/MPX_Lab_Data_Pos_Neg_Rate.csv?v=${date} `;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonArray = await csv().fromString(text);

        setData(jsonArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  const filteredWeeks = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Week"];
      })
    )
  );
  const filteredPositives = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Positive"];
      })
    )
  );
  const filteredNegatives = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Negative"];
      })
    )
  );
  const filteredPercentPositives = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Positivity Rate"];
      })
    )
  );

  const chartData = {
    labels: filteredWeeks,
    datasets: [
      {
        yAxisID: "percent-positive",
        type: "line",
        label: "Percent Positive",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.kineticBlack,
        borderColor: colors.kineticBlack,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.kineticBlack,
        pointBackgroundColor: colors.kineticBlack,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.kineticBlack,
        pointHoverBorderColor: colors.kineticBlack,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,

        data: filteredPercentPositives,
      },
      {
        yAxisID: "total-positive",
        type: "bar",
        label: "Total Positives",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.blueMunsell,
        borderColor: colors.blueMunsell,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.blueMunsell,
        pointBackgroundColor: colors.blueMunsell,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.blueMunsell,
        pointHoverBorderColor: colors.blueMunsell,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredPositives,
      },
      {
        yAxisID: "total-negative",
        type: "bar",
        label: "Total Negatives",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.aquamarine,
        borderColor: colors.aquamarine,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.aquamarine,
        pointBackgroundColor: colors.aquamarine,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.aquamarine,
        pointHoverBorderColor: colors.aquamarine,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNegatives,
      },
    ],
  };

  return (
    <Box>
      <Center>
        <Heading as="h2" size="md" m={10}>
          Monkeypox testing from public health and select commercial
          laboratories
        </Heading>
      </Center>
      <div style={{ minHeight: "50vh" }}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              "percent-positive": {
                type: "linear",
                position: "left", // `axis` is determined by the position as `'y'`,
                max: 100,
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: function (value, index, ticks) {
                    return value + "%";
                  },
                },
              },
              "total-positive": {
                stacked: true,
                type: "linear",
                position: "right", // `axis` is determined by the position as `'y'`
                stacked: true,
              },
              "total-negative": {
                stacked: true,
                type: "linear",
                position: "left", // `axis` is determined by the position as `'y'`
                display: false,
              },
            },
          }}
        />
      </div>
      <Center>
        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a
            href={
              "https://www.cdc.gov/poxvirus/monkeypox/response/2022/2022-lab-test.html"
            }
          >
            {" "}
            US CDC
          </a>
          . Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Center>
    </Box>
  );
}
