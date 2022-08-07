import * as React from "react";
import { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { Select, Box, Text, Center, Heading } from "@chakra-ui/react";
import { colors } from "../../styles/colors.js";

import { csv } from "csvtojson";

export default function WorldTrends() {
  const [data, setData] = useState([]);
  const [filterLocation, setFilterLocation] = useState("World");

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/owid/notebooks/main/EdouardMathieu/monkeypox/owid-monkeypox-data.csv";

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
        return y["total_cases"];
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
    ],
  };

  return (
    <>
      <Box mt={2} mb={20}>
        <Center>
          <Heading as="h2" mb={5}>
            Global confirmed cases over time
          </Heading>
        </Center>

        <Select onChange={(e) => setFilterLocation(e.target.value)}>
          <option defaultValue={"World"}>World</option>
          {uniqueLocationOptions &&
            uniqueLocationOptions.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
        </Select>
        <Line data={chartData} />
        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a href={"https://ourworldindata.org/monkeypox"}>OurWorldInData</a>.
          Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Box>
    </>
  );
}
