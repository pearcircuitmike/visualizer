import React, { useState } from "react";

import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Bar, Line } from "react-chartjs-2";
import {
  Select,
  Box,
  Text,
  Center,
  Heading,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

export const getStaticPaths = async () => {
  // paths come from this source, because it's deduped already
  const url =
    "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-by-Country.csv";

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  const paths = data.map((countryVal) => {
    return {
      params: { country: countryVal.Country.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const country = context.params.country;
  const countryDataUrl =
    "https://raw.githubusercontent.com/owid/notebooks/main/EdouardMathieu/monkeypox/owid-monkeypox-data.csv";

  const res = await fetch(countryDataUrl);
  const text = await res.text();
  const jsonArray = await csv().fromString(text);
  const filteredJsonArray = jsonArray.filter((x) => x.location === country);

  console.log(filteredJsonArray);
  return {
    props: { country: filteredJsonArray },
  };
};

const CountryDetails = ({ country }) => {
  const filteredDates = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["total_cases"];
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["new_cases"];
      })
    )
  );
  const filteredNewCasesPerMillion = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["new_cases_per_million"];
      })
    )
  );
  const filteredTotalCasesPerMillion = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["total_cases_per_million"];
      })
    )
  );

  const filteredTotalDeaths = JSON.parse(
    JSON.stringify(
      country.map((y) => {
        return y["total_deaths"];
      })
    )
  );

  const chartDataTotalCases = {
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
  const chartDataTotalCasesPerMillion = {
    labels: filteredDates,
    datasets: [
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
    ],
  };
  const chartDataTotalDeaths = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Deaths",
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
        data: filteredTotalDeaths,
      },
    ],
  };

  const [copied, setCopied] = useState(false);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }

  return (
    <Container maxW="5xl" mt={35}>
      <Heading as="h1" size="4xl">
        {country[0].location}
      </Heading>
      <Heading as="h2" size="md">
        Monkeypox Outbreak: Country Details
      </Heading>

      <Heading as="h3" size="sm" mt={10}>
        {country[0].location}: Monkeypox Situation Report
      </Heading>
      <Text>
        This page shows data for the Monkeypox outbreak currently taking place
        in{" "}
        {country[0].location === "United States"
          ? `the ` + country[0].location
          : country[0].location}
        .
        <br />
        <br />
        In the last 24 hours, health authorities in{" "}
        {country[0].location === "United States"
          ? `the ` + country[0].location
          : country[0].location}{" "}
        have reported {country[country.length - 1].new_cases} new case
        {country[country.length - 1].new_cases == 1 ? `` : `s`} and{" "}
        {country[country.length - 1].new_deaths
          ? country[country.length - 1].new_deaths
          : 0}{" "}
        new death
        {country[country.length - 1].new_deaths == 1 ? `` : `s`}. The people of{" "}
        {country[0].location === "United States"
          ? `the ` + country[0].location
          : country[0].location}{" "}
        have experienced {country[country.length - 1].total_cases} total case
        {country[country.length - 1].total_cases == 1 ? `` : `s`} and{" "}
        {country[country.length - 1].total_deaths
          ? country[country.length - 1].total_deaths
          : 0}{" "}
        total deaths since the start of the outbreak.
        <br />
        <br />
        You can use the charts on this page to explore the spread of Monkeypox
        in{" "}
        {country[0].location === "United States"
          ? `the ` + country[0].location
          : country[0].location}
        . You can also refer to the{" "}
        {country[0].location === "United States"
          ? `the ` + country[0].location
          : country[0].location}{" "}
        case history table provided below. Lastly, you can see how the{" "}
        {country[0].location} Monkeypox situation compares with the situation
        globally on the{" "}
        <Link href="/">
          <a>MonkeypoxTracker homepage</a>
        </Link>
        .
      </Text>
      <Button onClick={copy} mt={5}>
        {!copied ? "Copy report URL" : "Copied link!"}
      </Button>

      <SimpleGrid columns={[1, null, 2]}>
        <GridItem w="100%" mt={10}>
          <Heading as="h3" size="sm">
            <Center mb={1}>{country[0].location}: Total Monkeypox Cases</Center>
          </Heading>
          <Line data={chartDataTotalCases} />
        </GridItem>
        <GridItem w="100%" mt={10}>
          <Heading as="h3" size="sm">
            <Center mb={1}>
              {country[0].location}: Monkeypox Cases per Million
            </Center>
          </Heading>
          <Line data={chartDataTotalCasesPerMillion} />
        </GridItem>
        <GridItem w="100%" mt={10}>
          <Heading as="h3" size="sm">
            <Center mb={1}>{country[0].location}: Monkeypox Deaths</Center>
          </Heading>
          <Bar data={chartDataTotalDeaths} />
        </GridItem>
      </SimpleGrid>

      <Text mb={5} mt={10} color={"gray.500"}>
        Source:{" "}
        <a href={"https://ourworldindata.org/monkeypox"}>OurWorldInData</a>.
        Last update: {Date().toLocaleString().substring(0, 16)}
      </Text>
    </Container>
  );
};

export default CountryDetails;
