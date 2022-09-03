import Head from "next/head";
import Script from "next/script.js";
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
  InputAddon,
  InputRightElement,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors.js";
import ReactTooltip from "react-tooltip";

import { SearchIcon } from "@chakra-ui/icons";

import Link from "next/link";
import React, { useState } from "react";
import WorldMap from "../components/WorldMap.js";

export const getStaticProps = async () => {
  const date = Math.floor(new Date().getTime() / 1000);
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-Deaths-by-Country.csv?v=${date} `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  return {
    props: { countryVals: data },
  };
};

const Countries = ({ countryVals }) => {
  const [countryFilter, setCountryFilter] = useState("");
  const handleSearch = (event) => setCountryFilter(event.target.value);
  const [content, setContent] = useState("");

  return (
    <>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}

        <title>Monkeypox Tracker | Countries</title>
        <meta
          name="description"
          content="Monkeypox case counts, deaths, confirmed cases, and new cases for countries around the world."
        />

        <meta property="og:title" content="Monkeypox Tracker | FAQ" />
        <meta
          property="og:description"
          content="Monkeypox case counts, deaths, confirmed cases, and new cases for countries around the world."
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
          content="Monkeypox case counts, deaths, confirmed cases, and new cases for countries around the world."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="5xl">
        <HStack mt={10}>
          <Heading>All Countries </Heading>
          <Spacer />
          <Link href={"/states"}>
            <Button
              size="sm"
              style={{ backgroundColor: `${colors.yellowGreen}` }}
            >
              View states
            </Button>
          </Link>
        </HStack>
        <Container maxW={"5xl"} mt={5}>
          <WorldMap setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
        </Container>

        <Text mt={5}>
          Select a country to view more details about their Monkeypox situation.
          Each country has a situation report, automatically generated from the
          most recent data. You can also view graphs of the disease activity in
          each country, and review data in tabular form. Data is sourced from
          Our World In Data and the US CDC.
        </Text>

        <InputGroup mt={5}>
          <Input
            variant="outline"
            value={countryFilter}
            onChange={handleSearch}
            placeholder="Search by country name"
          />
          <InputRightElement mr={3}>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>

        {countryVals
          .filter((country) =>
            country.Country.toLowerCase().includes(countryFilter.toLowerCase())
          )
          .map((countryVal) => (
            <Box
              key={countryVal.Country}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              pt={2}
              pb={3}
              pr={10}
              pl={10}
              mt={5}
            >
              <Flex spacing={8} direction="row">
                <Center>
                  <div>
                    <Heading size="md" mt={1}>
                      {countryVal.Country}
                    </Heading>
                    <Text>
                      Currently active cases:{" "}
                      {parseInt(countryVal.Cases).toLocaleString(undefined)}
                    </Text>
                  </div>
                </Center>

                <Spacer />
                <Center>
                  <Link href={"/countries/" + countryVal.Country}>
                    <Button>
                      <a>View data</a>
                    </Button>
                  </Link>
                </Center>
              </Flex>
            </Box>
          ))}
      </Container>
    </>
  );
};

export default Countries;
