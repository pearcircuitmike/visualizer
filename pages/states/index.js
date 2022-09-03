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
  InputAddon,
  InputRightElement,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import Script from "next/script.js";

import { SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { colors } from "../../styles/colors.js";
import ReactTooltip from "react-tooltip";

import USMapChart from "../components/USMap.js";

export const getStaticProps = async () => {
  const date = Math.floor(new Date().getTime() / 1000);
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv?${date} `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  return {
    props: { stateVals: data },
  };
};

const States = ({ stateVals }) => {
  const [stateFilter, setStateFilter] = useState("");
  const handleSearch = (event) => setStateFilter(event.target.value);

  const [content, setContent] = useState("");

  return (
    <>
      <Head>
        <title>Monkeypox Tracker | States</title>
        <meta
          name="description"
          content="Monkeypox virus disease outbreak case counts, deaths, confirmed cases, and new cases for U.S. states. Inspired by the BNO Monkeypox tracker."
        />

        <meta property="og:title" content="Monkeypox Tracker | FAQ" />
        <meta
          property="og:description"
          content="Monkeypox virus disease outbreak case counts, deaths, confirmed cases, and new cases for U.S. states. Inspired by the BNO Monkeypox tracker."
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Monkeypox virus disease outbreak case counts, deaths, confirmed cases, and new cases for U.S. states."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="5xl">
        <HStack mt={10}>
          <Heading>All States </Heading>

          <Spacer />

          <Link href={"/countries"}>
            <Button
              size="sm"
              style={{ backgroundColor: `${colors.yellowGreen}` }}
            >
              View countries
            </Button>
          </Link>
        </HStack>
        <Text size="md">
          Click a state to view detail, or scroll down to search by name.
        </Text>
        <Container maxW={"5xl"}>
          <USMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
        </Container>

        <Text mt={5}>
          Select a state to view more details about their Monkeypox situation.
          Each state has a situation report, automatically generated from the
          most recent data. You can also view graphs of the disease activity in
          each state, and review data in tabular form. Data is sourced from Our
          World In Data and the US CDC.
        </Text>

        <InputGroup mt={5}>
          <Input
            variant="outline"
            value={stateFilter}
            onChange={handleSearch}
            placeholder="Search by state name"
          />
          <InputRightElement mr={3}>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>

        {stateVals
          .filter((state) =>
            state.Location.toLowerCase().includes(stateFilter.toLowerCase())
          )
          .map((stateVal) => (
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
              <Flex spacing={8} direction="row">
                <Center>
                  <div>
                    <Heading size="md" mt={1}>
                      {stateVal.Location}
                    </Heading>
                    <Text>
                      Currently active cases:{" "}
                      {parseInt(stateVal.Cases).toLocaleString()}
                    </Text>
                  </div>
                </Center>

                <Spacer />
                <Center>
                  <Link href={"/states/" + stateVal.Location}>
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

export default States;
