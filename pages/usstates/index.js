import Head from "next/head";
import { csv } from "csvtojson";
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
import Link from "next/link";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { colors } from "../../styles/colors.js";
import USMapChart from "../components/USMap.js";
import USVaccinationMap from "../components/USVaccinationMap.js";

const CDC_STATE_DATA_URL =
  "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv";

export const getStaticProps = async () => {
  try {
    const res = await fetch(CDC_STATE_DATA_URL);

    if (!res.ok) {
      throw new Error(`CDC request failed: HTTP ${res.status}`);
    }

    const text = await res.text();

    if (/^\s*(?:<!doctype html|<html)/i.test(text)) {
      throw new Error("CDC returned HTML instead of CSV.");
    }

    const data = await csv().fromString(text);

    const validRows = data.filter(
      (row) => typeof row?.Location === "string" && row.Location.trim() !== "",
    );

    if (validRows.length === 0) {
      throw new Error("CDC response contained no valid Location values.");
    }

    const statesByName = new Map();

    for (const row of validRows) {
      const location = row.Location.trim();
      const rawCases = String(row.Cases ?? "")
        .replace(/,/g, "")
        .trim();

      const parsedCases = rawCases === "" ? NaN : Number(rawCases);

      statesByName.set(location, {
        Location: location,
        Cases:
          Number.isFinite(parsedCases) && parsedCases >= 0 ? parsedCases : null,
      });
    }

    return {
      props: {
        stateVals: [...statesByName.values()],
        dataError: false,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error(
      "Unable to load CDC state data:",
      error instanceof Error ? error.message : String(error),
    );

    return {
      props: {
        stateVals: [],
        dataError: true,
      },
      revalidate: 60,
    };
  }
};

const States = ({ stateVals = [], dataError = false }) => {
  const [stateFilter, setStateFilter] = useState("");
  const [casesTooltip, setCasesTooltip] = useState("");
  const [vaccinationTooltip, setVaccinationTooltip] = useState("");

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const currentYear = new Date().getFullYear();

  const search = stateFilter.trim().toLowerCase();

  const filteredStates = (Array.isArray(stateVals) ? stateVals : []).filter(
    (state) =>
      typeof state?.Location === "string" &&
      state.Location.toLowerCase().includes(search),
  );

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          {currentMonth} {currentYear} Monkeypox cases by US state
        </title>

        <meta
          name="description"
          content={`${currentMonth} ${currentYear} Monkeypox virus disease outbreak case and death totals for U.S. states.`}
        />

        <meta property="og:title" content="Monkeypox Tracker | States" />
        <meta
          property="og:description"
          content={`${currentMonth} ${currentYear} Monkeypox virus disease outbreak case and death totals for U.S. states.`}
        />

        <meta
          property="og:url"
          content="https://monkeypoxtracker.net/usstates"
        />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`${currentMonth} ${currentYear} Monkeypox virus disease outbreak case and death totals for U.S. states.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl">
        <Heading as="h1" mt={5}>
          Monkeypox cases and deaths by state
        </Heading>

        <Link href="/countries" legacyBehavior passHref>
          <Button
            as="a"
            size="sm"
            mt={5}
            mb={5}
            style={{ backgroundColor: colors.yellowGreen }}
          >
            View countries
          </Button>
        </Link>

        <Text size="md">
          Click a state to view detail, or scroll down to search by name.
        </Text>

        <Container maxW="5xl">
          <USMapChart
            setTooltipContent={setCasesTooltip}
            tooltipId="us-states-cases-tooltip"
          />
          <ReactTooltip
            id="us-states-cases-tooltip"
            content={casesTooltip}
            hidden={!casesTooltip}
            float
          />
        </Container>

        <Container maxW="5xl">
          <USVaccinationMap
            setTooltipContent={setVaccinationTooltip}
            tooltipId="us-states-vaccination-tooltip"
          />
          <ReactTooltip
            id="us-states-vaccination-tooltip"
            content={vaccinationTooltip}
            hidden={!vaccinationTooltip}
            float
          />
        </Container>

        <Text mt={5}>
          Select a state to view more details about their Monkeypox situation.
          Each state has a situation report, automatically generated from the
          most recent data. You can also view graphs of the disease activity in
          each state, and review data in tabular form. Data is sourced from Our
          World In Data and the US CDC.
        </Text>

        {dataError ? (
          <Text mt={5} role="status">
            State case totals are temporarily unavailable because the CDC data
            feed could not be loaded.
          </Text>
        ) : (
          <>
            <InputGroup mt={5}>
              <Input
                variant="outline"
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
                placeholder="Search by state name"
              />
              <InputRightElement mr={3} pointerEvents="none">
                <SearchIcon />
              </InputRightElement>
            </InputGroup>

            {filteredStates.length === 0 && (
              <Text mt={5}>No states match your search.</Text>
            )}

            {filteredStates.map((stateVal) => (
              <Box
                key={stateVal.Location}
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
                        {stateVal.Location}
                      </Heading>
                      <Text>
                        Reported cases:{" "}
                        {Number.isFinite(stateVal.Cases)
                          ? stateVal.Cases.toLocaleString()
                          : "Unavailable"}
                      </Text>
                    </div>
                  </Center>

                  <Spacer />

                  <Center>
                    <Link
                      href={`/usstates/${encodeURIComponent(
                        stateVal.Location,
                      )}`}
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

export default States;
