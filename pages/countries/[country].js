// pages/countries/[country].js
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import { colors } from "../../styles/colors";

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
import { ChevronRightIcon } from "@chakra-ui/icons";

const Line = dynamic(
  async () => {
    await import("chart.js/auto");
    const mod = await import("react-chartjs-2");
    return mod.Line;
  },
  { ssr: false }
);

const CSC_BASE = "https://api.countrystatecity.in/v1";
const CSC_API_KEY =
  process.env.CSC_API_KEY || process.env.NEXT_PUBLIC_CSC_API_KEY;

function getCscHeaders() {
  if (!CSC_API_KEY) throw new Error("Missing CSC API key");
  return { "X-CSCAPI-KEY": CSC_API_KEY };
}

export const getStaticPaths = async () => {
  // Do not prebuild 200+ pages
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps = async (context) => {
  const countryIso2 = String(context?.params?.country || "").toUpperCase();
  if (!countryIso2) return { notFound: true, revalidate: 60 };

  try {
    const headers = getCscHeaders();

    const [countryRes, statesRes] = await Promise.all([
      fetch(`${CSC_BASE}/countries/${countryIso2}`, { headers }),
      fetch(`${CSC_BASE}/countries/${countryIso2}/states`, { headers }),
    ]);

    if (!countryRes.ok) return { notFound: true, revalidate: 60 };

    const countryDetails = await countryRes.json();
    const states = statesRes.ok ? await statesRes.json() : [];

    return {
      props: { countryDetails, states },
      revalidate: 60 * 60 * 24, // 1 day
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function CountryDetails({ countryDetails, states }) {
  const countryName = countryDetails?.name || "";
  const [summary, setSummary] = useState(null);
  const [points, setPoints] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!countryName) return;

      const qs = encodeURIComponent(countryName);

      const [sRes, pRes] = await Promise.all([
        fetch(`/api/monkeypox/summary?location=${qs}`),
        fetch(`/api/monkeypox/country?location=${qs}&maxPoints=600`),
      ]);

      if (!alive) return;

      if (sRes.ok) setSummary(await sRes.json());
      if (pRes.ok) {
        const json = await pRes.json();
        setPoints(json.points || []);
      }
    }

    load().catch(() => {});
    return () => {
      alive = false;
    };
  }, [countryName]);

  const filteredDates = useMemo(
    () => (points || []).map((p) => p.date),
    [points]
  );
  const filteredTotalCases = useMemo(
    () => (points || []).map((p) => toNum(p.total_cases)),
    [points]
  );
  const filteredTotalCasesPerMillion = useMemo(
    () => (points || []).map((p) => toNum(p.total_cases_per_million)),
    [points]
  );
  const filteredNewCases = useMemo(
    () => (points || []).map((p) => toNum(p.new_cases_smoothed ?? p.new_cases)),
    [points]
  );
  const filteredNewCasesPerMillion = useMemo(
    () => (points || []).map((p) => toNum(p.new_cases_per_million)),
    [points]
  );
  const filteredTotalDeaths = useMemo(
    () => (points || []).map((p) => toNum(p.total_deaths)),
    [points]
  );

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
          pointRadius: 1,
          data: filteredTotalCases,
        },
        {
          label: "Total Cases Per Million",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.aquamarine,
          borderColor: colors.aquamarine,
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
          pointRadius: 1,
          data: filteredNewCases,
        },
        {
          label: "New Cases Per Million",
          fill: true,
          tension: 0.1,
          backgroundColor: colors.aquamarine,
          borderColor: colors.aquamarine,
          pointRadius: 1,
          data: filteredNewCasesPerMillion,
        },
      ],
    }),
    [filteredDates, filteredNewCases, filteredNewCasesPerMillion]
  );

  const chartDataDeaths = useMemo(
    () => ({
      labels: filteredDates,
      datasets: [
        {
          label: "Total Deaths",
          fill: false,
          tension: 0.1,
          backgroundColor: colors.kineticBlack,
          borderColor: colors.kineticBlack,
          pointRadius: 1,
          data: filteredTotalDeaths,
        },
      ],
    }),
    [filteredDates, filteredTotalDeaths]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  const totalCases = summary ? toNum(summary.total_cases) : 0;
  const newCases = summary ? toNum(summary.new_cases) : 0;
  const newDeaths = summary ? toNum(summary.new_deaths) : 0;

  return (
    <>
      <Head>
        <title>
          Monkeypox cases in {countryName} for {currentMonth} {currentYear} |
          Monkeypox Cases
        </title>
        <meta
          name="description"
          content={`${countryName} monkeypox cases. Charts and latest totals.`}
        />
        <meta
          property="og:title"
          content={`Monkeypox cases in ${countryName}`}
        />
        <meta
          property="og:description"
          content={`${countryName} monkeypox cases and deaths.`}
        />
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

        <StatGroup mt={5} mb={5}>
          <Stat>
            <StatLabel>Total Cases</StatLabel>
            <StatNumber>{totalCases.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {newCases.toLocaleString()}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>New Deaths</StatLabel>
            <StatNumber>{newDeaths.toLocaleString()}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {newDeaths.toLocaleString()}
            </StatHelpText>
          </Stat>
        </StatGroup>

        <Button onClick={copy} mt={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>

        <SimpleGrid columns={[1, null, 2]}>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Total Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {points ? (
                points[0] ? (
                  <Line
                    data={chartDataTotalCases}
                    options={{ maintainAspectRatio: false }}
                  />
                ) : (
                  <Center>No cases detected yet.</Center>
                )
              ) : (
                <Center>Loading…</Center>
              )}
            </div>
          </GridItem>

          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: New Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {points ? (
                points[0] ? (
                  <Line
                    data={chartDataNewCases}
                    options={{ maintainAspectRatio: false }}
                  />
                ) : (
                  <Center>No cases detected yet.</Center>
                )
              ) : (
                <Center>Loading…</Center>
              )}
            </div>
          </GridItem>

          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {points ? (
                points[0] ? (
                  <Line
                    data={chartDataDeaths}
                    options={{ maintainAspectRatio: false }}
                  />
                ) : (
                  <Center>No cases detected yet.</Center>
                )
              ) : (
                <Center>Loading…</Center>
              )}
            </div>
          </GridItem>
        </SimpleGrid>

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
}
