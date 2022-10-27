import Head from "next/head";

import { FaTwitter } from "react-icons/fa";
import dynamic from "next/dynamic.js";
import Chart from "chart.js/auto";

import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Tooltip,
  HStack,
  Show,
  Button,
} from "@chakra-ui/react";
import TwitterButton from "./components/social/TwitterButton.js";

import Link from "next/link";
import { colors } from "../styles/colors.js";

const WorldMapChart = dynamic(() => import("./components/WorldMap.js"), {
  ssr: false,
});
import DataTable from "./components/WorldTable.js";
const WorldTrends = dynamic(() => import("./components/WorldTrends.js"), {
  ssr: false,
});
const USMapChart = dynamic(() => import("./components/USMap.js"), {
  ssr: false,
});

import { useState, useEffect } from "react";
import { csv } from "csvtojson";
import ReactTooltip from "react-tooltip";

export default function Home() {
  const [content, setContent] = useState("");

  const [data, setData] = useState([]);
  const [latestCaseTotal, setLatestCaseTotal] = useState("");
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
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
        console.log("ok");
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Monkeypox Tracker | {currentMonth} {currentYear} Monkeypox cases
        </title>
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
              <Text as={"span"}>
                {latestCaseTotal.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Text>{" "}
              Monkeypox cases detected
            </Heading>
            <Text maxW={"5xl"}>
              This project is a collaboration with{" "}
              <Link href="https://bnonews.com/">
                <a style={{ color: `${colors.blueMunsell}` }}>BNO News</a>
              </Link>
              .
            </Text>
            <Text maxW={"5xl"}>
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
              for a breakdown of U.S. cases by state. Follow us on twitter for
              more updates, or check out{" "}
              <a
                href="https://twitter.com/mildanalyst"
                style={{ color: `${colors.blueMunsell}` }}
              >
                Pandemic News
              </a>{" "}
              for details about other health crises around the world.
            </Text>

            <TwitterButton style={{ margin: "!important;" }} />
          </Stack>
        </Container>
        <Container maxW={"5xl"}>
          <DataTable />

          <Box textAlign={"center"}>
            <Heading as="h2" size="lg" mb={5} mt={"50px"}>
              Global Monkeypox virus spread over time
            </Heading>
          </Box>
          <WorldTrends />

          <Box textAlign={"center"}>
            <Heading as="h2" size="lg" mt={"50px"}>
              Global confirmed Monkeypox cases
            </Heading>
            <Text size="md" mb={5}>
              Click on a country to view more details
            </Text>
          </Box>
          <WorldMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}

          <USMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
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
