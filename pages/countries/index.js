import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Heading,
  Flex,
  Text,
  Box,
  Spacer,
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { colors } from "../../styles/colors.js";
import WorldMap from "../components/WorldMap.js";

export const getStaticProps = async () => {
  try {
    const apiKey =
      process.env.CSC_API_KEY || process.env.NEXT_PUBLIC_CSC_API_KEY;

    if (!apiKey) {
      throw new Error("Missing CSC API key.");
    }

    const res = await fetch("https://api.countrystatecity.in/v1/countries", {
      headers: {
        "X-CSCAPI-KEY": apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(`Country API request failed: HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Country API returned an object instead of an array.");
    }

    const countryList = data
      .filter(
        (country) =>
          typeof country?.name === "string" &&
          country.name.trim() !== "" &&
          typeof country?.iso2 === "string" &&
          /^[a-z]{2}$/i.test(country.iso2),
      )
      .map((country) => ({
        name: country.name.trim(),
        iso2: country.iso2.toUpperCase(),
      }));

    if (countryList.length === 0) {
      throw new Error("Country API returned no valid countries.");
    }

    return {
      props: {
        countryList,
        dataError: false,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.error(
      "Unable to load country list:",
      error instanceof Error ? error.message : String(error),
    );

    return {
      props: {
        countryList: [],
        dataError: true,
      },
      revalidate: 60,
    };
  }
};

const Countries = ({ countryList = [], dataError = false }) => {
  const [countryFilter, setCountryFilter] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSummary() {
      try {
        const res = await fetch("/api/monkeypox/countries-summary", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Case summary request failed: HTTP ${res.status}`);
        }

        const json = await res.json();
        const byLocation = json?.byLocation;

        if (
          !byLocation ||
          typeof byLocation !== "object" ||
          Array.isArray(byLocation)
        ) {
          throw new Error("Case summary returned an invalid response.");
        }

        if (!controller.signal.aborted) {
          setSummary(byLocation);
          setSummaryError(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to load country case totals:", error);
        setSummary({});
        setSummaryError(true);
      }
    }

    loadSummary();

    return () => controller.abort();
  }, []);

  const filteredCountries = useMemo(() => {
    const countries = Array.isArray(countryList) ? countryList : [];
    const query = countryFilter.trim().toLowerCase();

    return countries.filter(
      (country) =>
        typeof country?.name === "string" &&
        typeof country?.iso2 === "string" &&
        country.name.toLowerCase().includes(query),
    );
  }, [countryList, countryFilter]);

  function formatCases(countryName) {
    if (summaryError) return "Unavailable";
    if (summary === null) return "Loading…";

    const rawCases = summary[countryName]?.total_cases;

    if (
      rawCases === null ||
      rawCases === undefined ||
      (typeof rawCases !== "number" && typeof rawCases !== "string")
    ) {
      return "Unavailable";
    }

    const cleaned = String(rawCases).replace(/,/g, "").trim();
    const totalCases = cleaned === "" ? NaN : Number(cleaned);

    return Number.isFinite(totalCases) && totalCases >= 0
      ? totalCases.toLocaleString()
      : "Unavailable";
  }

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Worldwide monkeypox cases {currentMonth} {currentYear}
        </title>

        <meta
          name="description"
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
        />

        <meta property="og:title" content="Monkeypox Tracker | Countries" />
        <meta
          property="og:description"
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
        />
        <meta
          property="og:url"
          content="https://monkeypoxtracker.net/countries"
        />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl">
        <Heading as="h1" mt={5}>
          Monkeypox cases and deaths by country
        </Heading>

        <Link href="/usstates" legacyBehavior passHref>
          <Button
            as="a"
            size="sm"
            m={5}
            style={{ backgroundColor: colors.yellowGreen }}
          >
            View US states
          </Button>
        </Link>

        <Container maxW="5xl" mt={5}>
          <WorldMap
            setTooltipContent={setContent}
            tooltipId="countries-world-map-tooltip"
          />
          <ReactTooltip
            id="countries-world-map-tooltip"
            content={content}
            hidden={!content}
            float
          />
        </Container>

        <Text mt={5}>
          Select a country to view more details about their Monkeypox situation.
        </Text>

        {dataError ? (
          <Text mt={5} role="status">
            The country list is temporarily unavailable because its data source
            could not be loaded.
          </Text>
        ) : (
          <>
            <InputGroup mt={5}>
              <Input
                variant="outline"
                value={countryFilter}
                onChange={(event) => setCountryFilter(event.target.value)}
                placeholder="Search by country name"
              />
              <InputRightElement mr={3} pointerEvents="none">
                <SearchIcon />
              </InputRightElement>
            </InputGroup>

            {summaryError && (
              <Text mt={5} role="status">
                Country case totals are temporarily unavailable.
              </Text>
            )}

            {filteredCountries.length === 0 && (
              <Text mt={5}>No countries match your search.</Text>
            )}

            {filteredCountries.map((country) => (
              <Box
                key={country.iso2}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                pt={2}
                pb={3}
                pr={10}
                pl={10}
                mt={5}
              >
                <Flex direction="row">
                  <Center>
                    <div>
                      <Heading size="md" mt={1}>
                        {country.name}
                      </Heading>
                      <Text>Reported cases: {formatCases(country.name)}</Text>
                    </div>
                  </Center>

                  <Spacer />

                  <Center>
                    <Link
                      href={`/countries/${country.iso2}`}
                      legacyBehavior
                      passHref
                    >
                      <Button as="a">View data</Button>
                    </Link>
                  </Center>
                </Flex>
              </Box>
            ))}
          </>
        )}
      </Container>
    </>
  );
};

export default Countries;
