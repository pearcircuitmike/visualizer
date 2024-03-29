import React, { useState } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Line, Bar } from "react-chartjs-2";
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
import TwitterButton from "../components/social/TwitterButton";

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

  const url = "https://api.countrystatecity.in/v1/countries";

  const res = await fetch(url, requestOptions);
  const text = await res.text();
  const data = await JSON.parse(text);

  //test build

  const paths = data.map((countryVal) => {
    return {
      params: { country: countryVal.iso2 },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const countryIso2 = context.params.country;

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

  const stateDataUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}/states`;

  const stateDataRes = await fetch(stateDataUrl, requestOptions);
  const stateDataText = await stateDataRes.text();
  const stateDataDetails = await JSON.parse(stateDataText);

  const filteredJsonArray = jsonArray.filter(
    (x) => x.location === countryDetails.name
  );

  return {
    props: {
      countryCaseData: filteredJsonArray,
      countryDetails: countryDetails,
      states: stateDataDetails,
    },
  };
};

const CountryDetails = ({ countryCaseData, countryDetails, states }) => {
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
        return y["new_cases_smoothed"];
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

  const filteredTotalDeaths = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
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
        label: "Total Cases Per Million",
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
        data: filteredTotalCasesPerMillion,
      },
    ],
  };
  const chartDataNewCases = {
    labels: filteredDates,
    datasets: [
      {
        label: "New Cases",
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

        data: filteredNewCases,
      },
      {
        label: "New Cases Per Million",
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
        pointHitRadius: 1,
        data: filteredNewCasesPerMillion,
      },
    ],
  };
  const chartDataNewDeaths = {
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
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Monkeypox in {countryName} as of {currentMonth} {currentYear} |
          Monkeypox Cases
        </title>
        <meta
          name="description"
          content={`${countryName} monkeypox cases. ${countryName} monkeypox ${currentMonth} ${currentYear} monkeypox case counts.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox cases in ${countryName} as of ${currentMonth} ${currentYear} | Monkeypox Tracker - Monkeypox Cases`}
        />
        <meta
          property="og:description"
          content={`${countryName} monkeypox cases outbreak. Updated ${currentMonth} ${currentYear} monkeypox cases and monkeypox deaths.`}
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
          content={`${countryName} monkeypox cases outbreak. Updated ${currentMonth} ${currentYear} monkeypox cases and monkeypox deaths.`}
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
            <Link href="/countries">
              <a>Countries</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <a>{countryName}</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" size="4xl">
          {countryName} {countryDetails.emoji}
        </Heading>
        <Heading as="h2" size="md">
          Monkeypox Outbreak: Country Details
        </Heading>{" "}
        <StatGroup mt={5} mb={5}>
          <Stat>
            <StatLabel>Total Cases</StatLabel>
            <StatNumber>
              {countryTotalCases ? countryTotalCases.toLocaleString() : 0}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewCases ? countryNewCases.toLocaleString() : 0}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>New Deaths</StatLabel>
            <StatNumber>
              {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0}
            </StatHelpText>
          </Stat>
        </StatGroup>
        <Heading as="h2" mt={10} mb={5}>
          Monkeypox virus disease outbreak in {countryName}: case counts,
          deaths, and statistics
        </Heading>
        <Text>
          Monkeypox is a rare disease caused by infection with the monkeypox
          virus. Monkeypox virus is part of the same family of viruses as
          variola virus, the virus that causes smallpox. Monkeypox symptoms are
          similar to smallpox symptoms, but milder, and monkeypox is rarely
          fatal.
          <br /> <br />
        </Text>
        <Heading as="h3" size="md">
          How do people in {countryName} get monkeypox?
        </Heading>
        <Text>
          Monkeypox is primarily spread through contact with the blood, bodily
          fluids, or skin of infected animals, such as rodents or primates. It
          can also be spread through close contact with an infected person. This
          can include contact with an infected person's skin, especially if the
          person is experiencing a rash, or contact with an infected person's
          respiratory secretions, such as saliva, mucus, or semen. In addition,
          monkeypox can be spread through contact with objects that have been
          contaminated with the virus, such as bedding or clothing.
          <br /> <br />
          Monkeypox is not as contagious as smallpox and is not as easily spread
          from person to person. However, the risk of infection is increased
          among people who live in or have recently traveled to areas where
          monkeypox is known to occur and among people who have had close
          contact with an infected person or animal.
          <br /> <br />
          It's also important to note that people who have been vaccinated
          against smallpox are at a lower risk of getting monkey pox.
        </Text>
        <Text>
          This page shows data for the monkeypox disease outbreak currently
          taking place in {countryName}. This outbreak is part of the larger
          outbreak taking place in {countryDetails.region}, specifically in{" "}
          {countryDetails.subregion}.
          <br />
          <br />
        </Text>
        <Heading as="h3" size="md">
          How many monkeypox cases are there in {countryName}?
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
          . <br />
          <br />
        </Text>
        <Button onClick={copy} mt={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>
        <TwitterButton />
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
              <Center mb={1}>{countryName}: New Monkeypox Cases </Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataNewCases}
                  options={{ maintainAspectRatio: false, barThickness: 5 }}
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
        <Heading as="h3" size="md">
          Are there limitations to the monkeypox case datae?
        </Heading>
        <Text>
          There are several limitations and shortcomings in official monkeypox
          case data that can make it difficult to fully understand the extent of
          the disease and its spread. Some of these include:
          <br />
          <br />
          <ul>
            <li>
              Underreporting: Monkeypox is a rare disease, and it can be
              difficult to diagnose. This means that many cases may go
              unreported, which can lead to an underestimation of the number of
              people affected by the disease.
            </li>
            <li>
              Limited surveillance: In some areas where monkeypox is known to
              occur, there may be limited surveillance systems in place to
              detect and report cases. This can make it difficult to accurately
              track the spread of the disease.
            </li>
            <li>
              Misclassification: Monkeypox can present with similar symptoms to
              other viral diseases, such as chickenpox, making it difficult to
              diagnose. This can lead to misclassification of cases and
              inaccurate data.
            </li>

            <li>
              Lack of laboratory confirmation: In some cases, monkeypox may be
              diagnosed clinically, without laboratory confirmation. This can
              lead to uncertainty in case classification, especially in regions
              where other similar diseases exist.
            </li>
            <li>
              Non-specific symptoms: Monkeypox symptoms are non-specific and can
              be easily confused with other diseases, this can make it hard to
              confirm the diagnosis.
            </li>
          </ul>
          <br />
          <br />
          Overall, the limitations and shortcomings in official monkeypox case
          data highlight the importance of ongoing surveillance and improved
          diagnostic tools to accurately detect and track the disease.
        </Text>
        <Heading mt={5} mb={5} as="h2" size="sm">
          View {countryName} outbreak by subregion
        </Heading>
        <SimpleGrid
          minChildWidth="100px"
          spacingX="40px"
          spacingY="15px"
          mb={5}
        >
          {states.map((state) => (
            <Box key={state.id}>
              <Link href={`/states/${countryDetails.iso2}_${state.iso2}`}>
                <a>
                  <Text noOfLines={1}>{state.name}</Text>
                </a>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default CountryDetails;
