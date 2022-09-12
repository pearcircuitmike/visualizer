import * as React from "react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Select, Box, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors.js";

import { csv } from "csvtojson";

export default function WorldTrends() {
  const [data, setData] = useState([]);
  const [filterLocation, setFilterLocation] = useState("World");

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

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

  const nonUniqueLocationOptions = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["location"];
      })
    )
  );
  const uniqueLocationOptions = [...new Set(nonUniqueLocationOptions)];
  const filter = data.filter((x) => x.location === filterLocation);
  const filteredDates = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return Math.max(y["total_cases"]);
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["new_cases"];
      })
    )
  );
  const filteredNewCasesPerMillion = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["new_cases_per_million"];
      })
    )
  );
  const filteredTotalCasesPerMillion = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["total_cases_per_million"];
      })
    )
  );

  const filteredNewDeaths = JSON.parse(
    JSON.stringify(
      filter.map((y) => {
        return y["new_deaths"];
      })
    )
  );

  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Cases",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.spaceCadet,
        borderColor: colors.spaceCadet,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.spaceCadet,
        pointBackgroundColor: colors.spaceCadet,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.spaceCadet,
        pointHoverBorderColor: colors.spaceCadet,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalCases,
      },
      {
        label: "Total Cases Per Million",
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
        data: filteredTotalCasesPerMillion,
      },
      {
        label: "New Cases",
        fill: true,
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
        data: filteredNewCases,
      },
      {
        label: "New Cases Per Million",
        fill: true,
        lineTension: 0.1,
        backgroundColor: colors.yellowGreenPale,
        borderColor: colors.yellowGreenPale,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.yellowGreenPale,
        pointBackgroundColor: colors.yellowGreenPale,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.yellowGreenPale,
        pointHoverBorderColor: colors.yellowGreenPale,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNewCasesPerMillion,
      },

      {
        label: "New Deaths",
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
        data: filteredNewDeaths,
      },
    ],
  };

  return (
    <>
      <Box mt={2} mb={20}>
        <Select onChange={(e) => setFilterLocation(e.target.value)}>
          <option defaultValue={"World"}>World</option>
          {uniqueLocationOptions &&
            uniqueLocationOptions.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
        </Select>

        <div style={{ minHeight: "50vh" }}>
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>

        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a href={"https://ourworldindata.org/monkeypox"}>OurWorldInData</a>.
          Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Box>
    </>
  );
}
