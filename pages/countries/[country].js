// pages/countries/[country].js

import React, { useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import csv from "csvtojson";

import { colors } from "../../styles/colors.js";
import TwitterButton from "../components/social/TwitterButton";
import { ChevronRightIcon } from "@chakra-ui/icons";

import {
  Text,
  Center,
  Heading,
  Container,
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
  Box,
} from "@chakra-ui/react";

/**
 * Chart.js + react-chartjs-2 should NOT load during SSR/build.
 * This avoids heavy server work and common build issues.
 */
const Line = dynamic(
  async () => {
    await import("chart.js/auto"); // registers controllers/scales/etc
    const mod = await import("react-chartjs-2");
    return mod.Line;
  },
  {
    ssr: false,
    loading: () => (
      <Center minH="40vh" color="gray.500">
        Loading chart…
      </Center>
    ),
  }
);

const CSC_BASE = "https://api.countrystatecity.in/v1";
const OWID_CSV_URL =
  "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

/**
 * Prefer a server-only secret env var.
 * If you only have NEXT_PUBLIC_CSC_API_KEY today, this still works.
 */
const CSC_API_KEY =
  process.env.CSC_API_KEY || process.env.NEXT_PUBLIC_CSC_API_KEY;

function getCscHeaders() {
  if (!CSC_API_KEY) {
    throw new Error(
      "Missing CSC API key. Set CSC_API_KEY (preferred) or NEXT_PUBLIC_CSC_API_KEY."
    );
  }
  return { "X-CSCAPI-KEY": CSC_API_KEY };
}

/**
 * Cache the OWID dataset once per server process (build/ISR worker).
 * This prevents “countries × full CSV parse”.
 */
let owidByLocationPromise = null;

async function getOwidByLocation() {
  if (!owidByLocationPromise) {
    owidByLocationPromise = (async () => {
      const res = await fetch(OWID_CSV_URL);
      if (!res.ok) {
        throw new Error(`OWID fetch failed: ${res.status} ${res.statusText}`);
      }

      const text = await res.text();
      const rows = await csv().fromString(text);

      const byLoc = Object.create(null);

      for (const r of rows) {
        const loc = r.location;
        if (!loc) continue;

        // Keep only fields used by the page (smaller payload + faster serialization)
        const slim = {
          location: r.location,
          date: r.date,
          total_cases: r.total_cases,
          total_cases_per_million: r.total_cases_per_million,
          new_cases_smoothed: r.new_cases_smoothed,
          new_cases_per_million: r.new_cases_per_million,
          total_deaths: r.total_deaths,
          new_cases: r.new_cases,
          new_deaths: r.new_deaths,
        };

        (byLoc[loc] ||= []).push(slim);
      }

      return byLoc;
    })();
  }

  return owidByLocationPromise;
}

/**
 * Key change:
 * - Don’t build hundreds of pages at deploy time.
 * - Generate on first request, then cache via ISR.
 */
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (context) => {
  const countryIso2 = String(context?.params?.country || "").toUpperCase();
  if (!countryIso2) {
    return { notFound: true, revalidate: 60 };
  }

  const headers = getCscHeaders();

  const countryDetailsUrl = `${CSC_BASE}/countries/${countryIso2}`;
  const statesUrl = `${CSC_BASE}/countries/${countryIso2}/states`;

  let countryDetailsRes;
  let statesRes;
  let owidByLoc;

  try {
    [countryDetailsRes, statesRes, owidByLoc] = await Promise.all([
      fetch(countryDetailsUrl, { headers }),
      fetch(statesUrl, { headers }),
      getOwidByLocation(),
    ]);
  } catch (e) {
    // If upstream is down, don’t fail the whole build or lock the route forever
    return { notFound: true, revalidate: 60 };
  }

  if (!countryDetailsRes?.ok) {
    return { notFound: true, revalidate: 60 };
  }

  const countryDetails = await countryDetailsRes.json();
  const states = statesRes?.ok ? await statesRes.json() : [];

  const countryCaseData = owidByLoc[countryDetails.name] || [];

  return {
    props: {
      countryCaseData,
      countryDetails,
      states,
    },
    // Rebuild this page at most every 12 hours (tune as you like)
    revalidate: 60 * 60 * 12,
  };
};

function toNumberOrZero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const CountryDetails = ({ countryCaseData, countryDetails, states }) => {
  // Use memo so we don’t rebuild huge arrays on every render
  const {
    filteredDates,
    filteredTotalCases,
    filteredNewCases,
    filteredNewCasesPerMillion,
    filteredTotalCasesPerMillion,
    filteredTotalDeaths,
  } = useMemo(() => {
    const dates = [];
    const totalCases = [];
    const newCases = [];
    const newCasesPerMil = [];
    const totalCasesPerMil = [];
    const totalDeaths = [];

    for (const row of countryCaseData || []) {
      dates.push(row.date);
      totalCases.push(toNumberOrZero(row.total_cases));
      newCases.push(toNumberOrZero(row.new_cases_smoothed));
      newCasesPerMil.push(toNumberOrZero(row.new_cases_per_million));
      totalCasesPerMil.push(toNumberOrZero(row.total_cases_per_million));
      totalDeaths.push(toNumberOrZero(row.total_deaths));
    }

    return {
      filteredDates: dates,
      filteredTotalCases: totalCases,
      filteredNewCases: newCases,
      filteredNewCasesPerMillion: newCasesPerMil,
      filteredTotalCasesPerMillion: totalCasesPerMil,
      filteredTotalDeaths: totalDeaths,
    };
  }, [countryCaseData]);

  const chartDataTotalCases = useMemo(
    () => ({
      labels: filteredDates,
      datasets: [
        {
          label: "Total Cases",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.spaceCadet,
          borderColor: colors.spaceCadet,
          pointBorderColor: colors.spaceCadet,
          pointBackgroundColor: colors.spaceCadet,
          pointRadius: 1,
          data: filteredTotalCases,
        },
        {
          label: "Total Cases Per Million",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.aquamarine,
          borderColor: colors.aquamarine,
          pointBorderColor: colors.aquamarine,
          pointBackgroundColor: colors.aquamarine,
          pointRadius: 1,
          data: filteredTotalCasesPerMillion,
        },
      ],
    }),
    [filteredDates, filteredTotalCases, filteredTotalCasesPerMillion]
  );

  const chartDataNewCases = useMemo(
    () => ({
      labels: filteredDates,
      datasets: [
        {
          label: "New Cases",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.blueMunsell,
          borderColor: colors.blueMunsell,
          pointBorderColor: colors.blueMunsell,
          pointBackgroundColor: colors.blueMunsell,
          pointRadius: 1,
          data: filteredNewCases,
        },
        {
          label: "New Cases Per Million",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.aquamarine,
          borderColor: colors.aquamarine,
          pointBorderColor: colors.aquamarine,
          pointBackgroundColor: colors.aquamarine,
          pointRadius: 1,
          data: filteredNewCasesPerMillion,
        },
      ],
    }),
    [filteredDates, filteredNewCases, filteredNewCasesPerMillion]
  );

  const chartDataNewDeaths = useMemo(
    () => ({
      labels: filteredDates,
      datasets: [
        {
          label: "Total Deaths",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.kineticBlack,
          borderColor: colors.kineticBlack,
          pointBorderColor: colors.kineticBlack,
          pointBackgroundColor: colors.kineticBlack,
          pointRadius: 1,
          data: filteredTotalDeaths,
        },
      ],
    }),
    [filteredDates, filteredTotalDeaths]
  );

  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // fallback for older browsers
      const el = document.createElement("input");
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    }
  }

  const countryName = countryDetails?.name || "";
  const lastRow =
    countryCaseData && countryCaseData.length
      ? countryCaseData[countryCaseData.length - 1]
      : null;

  const countryNewCases = lastRow ? toNumberOrZero(lastRow.new_cases) : 0;
  const countryNewDeaths = lastRow ? toNumberOrZero(lastRow.new_deaths) : 0;
  const countryTotalCases = lastRow ? toNumberOrZero(lastRow.total_cases) : 0;
  const countryTotalDeaths = lastRow ? toNumberOrZero(lastRow.total_deaths) : 0;

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Monkeypox cases in {countryName} for {currentMonth} {currentYear} |
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
            <Link href="/">Home</Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/countries">Countries</Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text as="span">{countryName}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {countryName} {countryDetails?.emoji}
        </Heading>

        <Heading as="h2" size="md">
          Monkeypox Outbreak: Country Details
        </Heading>

        <StatGroup mt={5} mb={5}>
          <Stat>
            <StatLabel>Total Cases</StatLabel>
            <StatNumber>{countryTotalCases.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewCases.toLocaleString()}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>New Deaths</StatLabel>
            <StatNumber>{countryNewDeaths.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewDeaths.toLocaleString()}
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
          <br />
          <br />
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
          <br />
          <br />
          Monkeypox is not as contagious as smallpox and is not as easily spread
          from person to person. However, the risk of infection is increased
          among people who live in or have recently traveled to areas where
          monkeypox is known to occur and among people who have had close
          contact with an infected person or animal.
          <br />
          <br />
          It's also important to note that people who have been vaccinated
          against smallpox are at a lower risk of getting monkey pox.
        </Text>

        <Text>
          This page shows data for the monkeypox disease outbreak currently
          taking place in {countryName}. This outbreak is part of the larger
          outbreak taking place in {countryDetails?.region}, specifically in{" "}
          {countryDetails?.subregion}.
          <br />
          <br />
        </Text>

        <Heading as="h3" size="md">
          How many monkeypox cases are there in {countryName}?
        </Heading>

        <Text>
          Based on the most recent reports available from the government in{" "}
          {countryDetails?.capital}, health authorities in {countryName} have
          reported {countryNewCases.toLocaleString()} new case
          {countryNewCases === 1 ? "" : "s"} and{" "}
          {countryNewDeaths.toLocaleString()} new death
          {countryNewDeaths === 1 ? "" : "s"}. The people of {countryName} have
          experienced {countryTotalCases.toLocaleString()} total case
          {countryTotalCases === 1 ? "" : "s"} since the start of the outbreak.
          <br />
          <br />
          You can use the charts on this page to explore the spread of Monkeypox
          in {countryName}. Lastly, you can see how the {countryName} Monkeypox
          situation compares with the situation globally on the{" "}
          <Link href="/" style={{ color: colors.blueMunsell }}>
            MonkeypoxTracker homepage
          </Link>
          .
          <br />
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
              {countryCaseData?.[0] ? (
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
              <Center mb={1}>{countryName}: New Monkeypox Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData?.[0] ? (
                <Line
                  data={chartDataNewCases}
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
              {countryCaseData?.[0] ? (
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

        <Text mb={5} mt={10} color="gray.500">
          Source:{" "}
          <a href="https://ourworldindata.org/monkeypox">OurWorldInData</a>.
          Last update: {new Date().toLocaleString().slice(0, 16)}
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
          {(states || []).map((state) => (
            <Box key={state.id}>
              <Link href={`/states/${countryDetails.iso2}_${state.iso2}`}>
                <Text noOfLines={1}>{state.name}</Text>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default CountryDetails;
