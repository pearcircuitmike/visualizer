import React, { useState } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Line } from "react-chartjs-2";
import {
  Text,
  Center,
  Heading,
  Container,
  GridItem,
  SimpleGrid,
  Grid,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Breadcrumb,
  BreadcrumbItem,
  Box,
  Stack,
} from "@chakra-ui/react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import Chart from "chart.js/auto";

import Link from "next/link";

export const getStaticPaths = async () => {
  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const url = "https://api.countrystatecity.in/v1/states";

  const res = await fetch(url, requestOptions);
  const text = await res.text();
  const data = await JSON.parse(text);

  // encode the country and state iso2 codes into the URL
  const paths = data.map((stateVal) => {
    return {
      params: {
        state: `${stateVal.country_code.toString()}_${stateVal.iso2.toString()}`,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  //destructure to URL into the country and state iso2 codes
  const codesArray = context.params.state.toString().split("_");
  const countryIso2 = codesArray[0].toString();
  const stateIso2 = codesArray[1].toString();

  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const countryDetailsUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}`;
  const countryDetailsRes = await fetch(countryDetailsUrl, requestOptions);
  const countryDetailsText = await countryDetailsRes.text();
  const countryDetails = await JSON.parse(countryDetailsText);

  const countryDataUrl =
    "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";
  const res = await fetch(countryDataUrl);
  const text = await res.text();
  const jsonArray = await csv().fromString(text);
  const filteredJsonArray = jsonArray.filter(
    (x) => x.location === countryDetails.name
  );

  const stateDataUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateIso2}`;

  const stateDataRes = await fetch(stateDataUrl, requestOptions);
  const stateDataText = await stateDataRes.text();
  const stateDataDetails = await JSON.parse(stateDataText);

  return {
    props: {
      countryCaseData: filteredJsonArray,
      countryDetails: countryDetails,
      stateDetails: stateDataDetails,
    },
  };
};

const CountryDetails = ({ countryCaseData, countryDetails, stateDetails }) => {
  const filteredDates = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_cases"];
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_cases"];
      })
    )
  );
  const filteredNewCasesPerMillion = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_cases_per_million"];
      })
    )
  );
  const filteredTotalCasesPerMillion = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_cases_per_million"];
      })
    )
  );

  const filteredNewDeaths = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_deaths"];
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
  const chartDataNewDeaths = {
    labels: filteredDates,
    datasets: [
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
  const [stateName, setStateName] = useState(
    stateDetails.name ? stateDetails.name : ""
  );
  const [countryName, setCountryName] = useState(
    countryDetails.name ? countryDetails.name : ""
  );
  const [countryNewCases, setCountryNewCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_cases
      : ""
  );
  const [countryNewDeaths, setCountryNewDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_deaths
      : "0"
  );

  const [countryTotalCases, setCountryTotalCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_cases
      : "0"
  );
  const [countryTotalDeaths, setCountryTotalDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_deaths
      : "0"
  );

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>
          Monkeypox in {stateName}, {countryName} as of {currentMonth}{" "}
          {currentYear} | Monkeypox Cases
        </title>
        <meta
          name="description"
          content={`Monkeypox cases in ${stateName}, ${countryName} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from the monkeypox virus disease outbreak in ${stateName}.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox in ${stateName}, ${countryName} as of ${currentMonth} ${currentYear} | Monkeypox Tracker - Monkeypox Statistics`}
        />
        <meta
          property="og:description"
          content={`Monkeypox cases in ${stateName}, ${countryName} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from the monkeypox virus disease outbreak in ${stateName}.`}
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
          content={`Monkeypox cases in ${stateName}, ${countryName} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from the monkeypox virus disease outbreak in ${stateName}.`}
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
            <Link href="/">
              <a>Home</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/`}>
              <a>Countries</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails.iso2}`}>
              <a>{countryDetails.name}</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails.iso2}`}>
              <a>States</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/countries">
              <a>{stateDetails.name}</a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" size="4xl">
          {stateName} {countryDetails.emoji}
        </Heading>
        <Heading as="h2" size="md">
          Monkeypox Outbreak: State Details
        </Heading>{" "}
        <Heading as="h2" mt={10} mb={5}>
          Monkeypox virus disease outbreak in {stateName}, {countryName}: case
          counts, deaths, and statistics
        </Heading>
        <Text>
          Monkeypox is a rare disease caused by infection with the monkeypox
          virus. Monkeypox virus is part of the same family of viruses as
          variola virus, the virus that causes smallpox. Monkeypox symptoms are
          similar to smallpox symptoms, but milder, and monkeypox is rarely
          fatal.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the monkeypox disease outbreak currently
          taking place in <b>{stateName}</b>, located in the {countryName}. This
          outbreak is part of the larger outbreak taking place in{" "}
          {countryDetails.region}, specifically in {countryDetails.subregion}.
          <br />
          <br />
        </Text>
        <Heading as="h2" size="sm">
          {stateName}-level data
        </Heading>
        {countryDetails.iso2 == "US" ? (
          <Text>
            Monkeypox case data for {stateDetails.name} is available under the
            US state data tab, which you can also click{" "}
            <Link href={"/usstates"}>
              <a style={{ color: `${colors.blueMunsell}` }}>here</a>
            </Link>{" "}
            to view.
            <br />
            <br />
          </Text>
        ) : (
          <Text>
            At present, we do not have data specific to {stateName} monkeypox
            cases or deaths. However, we do have {countryName}-level data, which
            is presented below.
            <br />
            <br />
          </Text>
        )}
        <Heading as="h2" size="sm">
          {countryName}-level data
        </Heading>
        <Text>
          Based on the most recent reports available from the government in{" "}
          {countryDetails.capital}, health authorities in {countryName} have
          reported {countryNewCases.toLocaleString()} new case
          {countryNewCases == 1 ? `` : `s`} and{" "}
          {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0} new death
          {countryNewDeaths == 1 ? `` : `s`}. The people of {countryName} have
          experienced {countryTotalCases.toLocaleString()} total case
          {countryTotalCases == 1 ? `` : `s`} since the start of the outbreak.
          <br />
          <br />
          You can use the charts on this page to explore the spread of Monkeypox
          in {countryName}. Lastly, you can see how the {countryName} Monkeypox
          situation compares with the situation globally on the{" "}
          <Link href="/">
            <a style={{ color: `${colors.blueMunsell}` }}>
              MonkeypoxTracker homepage
            </a>
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
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalCases}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Monkeypox Cases per Million</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalCasesPerMillion}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Monkeypox Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataNewDeaths}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
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
