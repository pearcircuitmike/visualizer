// pages/states/[state].js

import React, { useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import csv from "csvtojson";

import { colors } from "../../styles/colors.js";
import { ChevronRightIcon } from "@chakra-ui/icons";
import TwitterButton from "../components/social/TwitterButton";

import {
  Text,
  Center,
  Heading,
  Container,
  GridItem,
  SimpleGrid,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";

/**
 * Client-only charts (keeps Chart.js out of the server build)
 */
const Line = dynamic(
  async () => {
    await import("chart.js/auto");
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

// Prefer server-only secret; fallback to your existing var
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
 * Cache OWID parse once per server process (build/ISR worker)
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

        const slim = {
          location: r.location,
          date: r.date,
          total_cases: r.total_cases,
          total_cases_per_million: r.total_cases_per_million,
          new_cases: r.new_cases,
          new_cases_per_million: r.new_cases_per_million,
          new_deaths: r.new_deaths,
          total_deaths: r.total_deaths,
        };

        (byLoc[loc] ||= []).push(slim);
      }

      return byLoc;
    })();
  }

  return owidByLocationPromise;
}

/**
 * Key change: do NOT prebuild every state page at deploy time
 */
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (context) => {
  const raw = String(context?.params?.state || "");
  const [countryIso2Raw, stateIso2Raw] = raw.split("_");

  const countryIso2 = (countryIso2Raw || "").toUpperCase();
  const stateIso2 = (stateIso2Raw || "").toUpperCase();

  if (!countryIso2 || !stateIso2) {
    return { notFound: true, revalidate: 60 };
  }

  const headers = getCscHeaders();

  try {
    const [countryRes, stateRes, owidByLoc] = await Promise.all([
      fetch(`${CSC_BASE}/countries/${countryIso2}`, { headers }),
      fetch(`${CSC_BASE}/countries/${countryIso2}/states/${stateIso2}`, {
        headers,
      }),
      getOwidByLocation(),
    ]);

    if (!countryRes.ok || !stateRes.ok) {
      return { notFound: true, revalidate: 60 };
    }

    const [countryDetails, stateDetails] = await Promise.all([
      countryRes.json(),
      stateRes.json(),
    ]);

    const countryCaseData = owidByLoc[countryDetails.name] || [];

    return {
      props: {
        countryCaseData,
        countryDetails,
        stateDetails,
      },
      // refresh at most every 12 hours
      revalidate: 60 * 60 * 12,
    };
  } catch {
    // network error / rate limit / transient failure
    return { notFound: true, revalidate: 60 };
  }
};

function toNumberOrZero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const StateDetailsPage = ({
  countryCaseData,
  countryDetails,
  stateDetails,
}) => {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
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
  const stateName = stateDetails?.name || "";

  const lastRow =
    countryCaseData && countryCaseData.length
      ? countryCaseData[countryCaseData.length - 1]
      : null;

  const countryNewCases = lastRow ? toNumberOrZero(lastRow.new_cases) : 0;
  const countryNewDeaths = lastRow ? toNumberOrZero(lastRow.new_deaths) : 0;
  const countryTotalCases = lastRow ? toNumberOrZero(lastRow.total_cases) : 0;
  const countryTotalDeaths = lastRow ? toNumberOrZero(lastRow.total_deaths) : 0;

  const {
    dates,
    totalCases,
    newCases,
    totalCasesPerMillion,
    newCasesPerMillion,
    newDeaths,
  } = useMemo(() => {
    const out = {
      dates: [],
      totalCases: [],
      newCases: [],
      totalCasesPerMillion: [],
      newCasesPerMillion: [],
      newDeaths: [],
    };

    for (const r of countryCaseData || []) {
      out.dates.push(r.date);
      out.totalCases.push(toNumberOrZero(r.total_cases));
      out.newCases.push(toNumberOrZero(r.new_cases));
      out.totalCasesPerMillion.push(toNumberOrZero(r.total_cases_per_million));
      out.newCasesPerMillion.push(toNumberOrZero(r.new_cases_per_million));
      out.newDeaths.push(toNumberOrZero(r.new_deaths));
    }

    return out;
  }, [countryCaseData]);

  const chartDataTotalCases = useMemo(
    () => ({
      labels: dates,
      datasets: [
        {
          label: "Total Cases",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.spaceCadet,
          borderColor: colors.spaceCadet,
          pointRadius: 1,
          data: totalCases,
        },
        {
          label: "New Cases",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.aquamarine,
          borderColor: colors.aquamarine,
          pointRadius: 1,
          data: newCases,
        },
      ],
    }),
    [dates, totalCases, newCases]
  );

  const chartDataCasesPerMillion = useMemo(
    () => ({
      labels: dates,
      datasets: [
        {
          label: "Total Cases Per Million",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.blueMunsell,
          borderColor: colors.blueMunsell,
          pointRadius: 1,
          data: totalCasesPerMillion,
        },
        {
          label: "New Cases Per Million",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.yellowGreenPale,
          borderColor: colors.yellowGreenPale,
          pointRadius: 1,
          data: newCasesPerMillion,
        },
      ],
    }),
    [dates, totalCasesPerMillion, newCasesPerMillion]
  );

  const chartDataNewDeaths = useMemo(
    () => ({
      labels: dates,
      datasets: [
        {
          label: "New Deaths",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.kineticBlack,
          borderColor: colors.kineticBlack,
          pointRadius: 1,
          data: newDeaths,
        },
      ],
    }),
    [dates, newDeaths]
  );

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />
        <title>
          Monkeypox cases in {stateName}, {countryName} as of {currentMonth}{" "}
          {currentYear} | Monkeypox Cases
        </title>
        <meta
          name="description"
          content={`Monkeypox cases in ${stateName}, ${countryName} as of ${currentMonth} ${currentYear}.`}
        />
        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
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

          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails?.iso2 || ""}`}>
              {countryName}
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text as="span">{stateName}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {stateName} {countryDetails?.emoji}
        </Heading>

        <Heading as="h2" size="md">
          Monkeypox Outbreak: State Details
        </Heading>

        <Heading as="h2" mt={10} mb={5}>
          Monkeypox outbreak in {stateName}, {countryName}
        </Heading>

        <Heading as="h2" size="sm">
          {countryName}-level data
        </Heading>

        <Text>
          Latest: {countryNewCases.toLocaleString()} new case
          {countryNewCases === 1 ? "" : "s"} and{" "}
          {countryNewDeaths.toLocaleString()} new death
          {countryNewDeaths === 1 ? "" : "s"}. Total:{" "}
          {countryTotalCases.toLocaleString()} cases and{" "}
          {countryTotalDeaths.toLocaleString()} deaths.
        </Text>

        <Button onClick={copy} mt={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>

        <TwitterButton />

        <SimpleGrid columns={[1, null, 2]}>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Total Cases</Center>
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
              <Center mb={1}>{countryName}: Cases per Million</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData?.[0] ? (
                <Line
                  data={chartDataCasesPerMillion}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>

          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: New Deaths</Center>
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
        </Text>
      </Container>
    </>
  );
};

export default StateDetailsPage;
