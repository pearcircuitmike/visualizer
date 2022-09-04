import Head from "next/head";

import { FaTwitter } from "react-icons/fa";

import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
  HStack,
  Show,
  Button,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import Link from "next/link";
import { colors } from "../styles/colors.js";

import WorldMapChart from "./components/WorldMap.js";
import DataTable from "./components/WorldTable.js";
import WorldTrends from "./components/WorldTrends.js";

import { useState, useEffect } from "react";
import { csv } from "csvtojson";
import ReactTooltip from "react-tooltip";
import USMapChart from "./components/USMap.js";

export default function Home() {
  const [content, setContent] = useState("");

  const [data, setData] = useState([]);
  const [latestCaseTotal, setLatestCaseTotal] = useState("");
  const [filterLocation, setFilterLocation] = useState("World");
  const toast = useToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); //this helps

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsPageLoaded(true);
      const url =
        "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

      const fetchData = async () => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const jsonArray = await csv().fromString(text);
          setData(jsonArray);
          const worldCaseData = jsonArray.filter((location) =>
            location.location.includes("World")
          );
          setLatestCaseTotal(
            ~~worldCaseData[worldCaseData.length - 1].total_cases
          );
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
    }
  }, [isLoaded]);

  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Monkeypox Tracker | Monkeypox Statistics</title>
        <meta
          name="description"
          content="Statistics and information on the 2022 Monkeypox virus disease outbreak, including maps, charts, and tables from sources around the world. Inspired by the BNO Monkeypox tracker."
        />

        <meta
          property="og:title"
          content="Monkeypox Tracker - Monkeypox Statistics"
        />
        <meta
          property="og:description"
          content="Statistics and information on the 2022 Monkeypox virus disease outbreak, including maps, charts, and tables from sources around the world. Inspired by the BNO Monkeypox tracker."
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
          content="Statistics and information on the 2022 Monkeypox virus disease outbreak, including maps, charts, and tables from sources around the world. Inspired by the BNO Monkeypox tracker."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxW={"5xl"}>
          <Stack
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 5, md: 10 }}
            py={{ base: 10, md: 20 }}
          >
            <Heading as="h1" size="3xl">
              Monkeypox Tracker:{" "}
              <Text as={"span"}>
                {latestCaseTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>{" "}
              Monkeypox cases detected
            </Heading>
            <Text color={"gray.500"} maxW={"5xl"}>
              This site is dedicated to tracking the spread of the 2022
              monkeypox virus disease outbreak, and is updated every few hours.
              You can{" "}
              <Link href="/countries">
                <a style={{ color: `${colors.blueMunsell}` }}>
                  view the countries listing page
                </a>
              </Link>{" "}
              for a more detailed breakdown. You can also{" "}
              <Link href="/states">
                <a style={{ color: `${colors.blueMunsell}` }}>
                  view the states listing page
                </a>
              </Link>{" "}
              for a breakdown of U.S. cases by state.
            </Text>
            <Show above="sm">
              <HStack spacing={4}>
                <Link href={"/countries"}>
                  <Button size="lg">Explore global data</Button>
                </Link>
                <Link href={"/states"}>
                  <Button size="lg">Explore US data</Button>
                </Link>
              </HStack>
            </Show>
            <a
              style={{ marginTop: "15px !important" }}
              href="https://twitter.com/monkeypox_stats"
            >
              <Button colorScheme="twitter" leftIcon={<FaTwitter />}>
                Follow updates on Twitter
              </Button>
            </a>
          </Stack>
        </Container>

        <Container maxW={"5xl"}>
          <Box textAlign={"center"}>
            <Heading as="h2" size="lg">
              US confirmed Monkeypox cases
            </Heading>
            <Text size="md">Click on a state to view more details</Text>
          </Box>
          <USMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}

          <Box textAlign={"center"}>
            <Heading as="h2" size="lg" mt={"50px"}>
              Global confirmed Monkeypox cases
            </Heading>
            <Text size="md" mb={5}>
              Click on a country to view more details
            </Text>
          </Box>
          {/*
         <WorldMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
          */}

          <Box textAlign={"center"}>
            <Heading as="h2" size="lg" mb={5} mt={"50px"}>
              Global Monkeypox virus spread over time
            </Heading>
          </Box>
          <WorldTrends />

          <DataTable />
        </Container>

        <Container>
          <Text mt={12} mb={12}>
            Want to raise awareness? You can share this site on social media.{" "}
            <br /> <br />
            Check back for daily updates.
          </Text>
        </Container>
      </main>
    </>
  );
}
