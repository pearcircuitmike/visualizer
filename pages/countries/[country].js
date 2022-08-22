import React, { useState } from "react";
import Head from "next/head.js";
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

import { ChevronRightIcon } from "@chakra-ui/icons";

import Link from "next/link";

export const getStaticPaths = async () => {
  // paths come from this source, because it's deduped already
  const url =
    "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);
  const nonUniqueLocationOptions = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["location"];
      })
    )
  );
  const uniqueLocationOptions = [...new Set(nonUniqueLocationOptions)];

  const paths = uniqueLocationOptions.map((countryVal) => {
    return {
      params: { country: countryVal },
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
    "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

  const res = await fetch(countryDataUrl);
  const text = await res.text();
  const jsonArray = await csv().fromString(text);
  const filteredJsonArray = jsonArray.filter((x) => x.location === country);

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
  const [countryName, setCountryName] = useState(
    country.length ? country[0].location : ""
  );
  const [countryNewCases, setCountryNewCases] = useState(
    country.length ? ~~country[country.length - 1].new_cases : ""
  );
  const [countryNewDeaths, setCountryNewDeaths] = useState(
    country.length ? ~~country[country.length - 1].new_deaths : ""
  );

  const [countryTotalCases, setCountryTotalCases] = useState(
    country.length ? ~~country[country.length - 1].total_cases : ""
  );
  const [countryTotalDeaths, setCountryTotalDeaths] = useState(
    country.length ? ~~country[country.length - 1].total_deaths : ""
  );

  return (
    <>
      <Head>
        <title>{countryName} | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${countryName}, including maps, charts, and tables.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox in ${countryName} | Monkeypox Tracker - Monkeypox Statistics`}
        />
        <meta
          property="og:description"
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${countryName}, including maps, charts, and tables.`}
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${countryName}, including maps, charts, and tables.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/">
                <a>Home</a>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/countries">
                <a>Countries</a>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              <a>{countryName}</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {countryName}
        </Heading>
        <Heading as="h2" size="md">
          Monkeypox Outbreak: Country Details
        </Heading>

        <StatGroup mt={5} mb={5}>
          <Stat>
            <StatLabel>Total Cases</StatLabel>
            <StatNumber>
              {countryTotalCases.toLocaleString(undefined)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewCases.toLocaleString(undefined)}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Deaths</StatLabel>
            <StatNumber>
              {" "}
              {countryTotalDeaths.toLocaleString(undefined)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewDeaths.toLocaleString(undefined)}
            </StatHelpText>
          </Stat>
        </StatGroup>

        <Heading as="h3" size="sm" mt={10}>
          {countryName}: Monkeypox Situation Report
        </Heading>
        <Text>
          This page shows data for the Monkeypox outbreak currently taking place
          in {countryName}.
          <br />
          <br />
          Based on the most recent reports available, health authorities in{" "}
          {countryName} have reported{" "}
          {countryNewCases.toLocaleString(undefined)} new case
          {countryNewCases == 1 ? `` : `s`} and{" "}
          {countryNewDeaths ? countryNewDeaths.toLocaleString(undefined) : 0}{" "}
          new death
          {countryNewDeaths == 1 ? `` : `s`}. The people of {countryName} have
          experienced {countryTotalCases.toLocaleString(undefined)} total case
          {countryTotalCases == 1 ? `` : `s`} and{" "}
          {countryTotalDeaths
            ? countryTotalDeaths.toLocaleString(undefined)
            : 0}{" "}
          total deaths since the start of the outbreak.
          <br />
          <br />
          You can use the charts on this page to explore the spread of Monkeypox
          in {countryName}. You can also refer to the {countryName} case history
          table provided below. Lastly, you can see how the {countryName}{" "}
          Monkeypox situation compares with the situation globally on the{" "}
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
              <Center mb={1}>{countryName}: Total Monkeypox Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              <Line
                data={chartDataTotalCases}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Monkeypox Cases per Million</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              <Line
                data={chartDataTotalCasesPerMillion}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Monkeypox Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              <Line
                data={chartDataTotalDeaths}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </GridItem>
        </SimpleGrid>

        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a href={"https://ourworldindata.org/monkeypox"}>OurWorldInData</a>.
          Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Container>
    </>
  );
};

export default CountryDetails;
