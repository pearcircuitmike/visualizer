import Head from "next/head";
import Image from "next/image";

import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";

import Link from "next/link";

import Script from "next/script";
import MapChart from "./components/WorldMap.js";
import DataTable from "./components/WorldTable.js";
import WorldTrends from "./components/WorldTrends.js";

import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <>
      <Head>
        <title>Monkeypox Tracker | Monkeypox Statistics</title>
        <meta
          name="description"
          content="Statistics and information on the 2022 Monkeypox outbreak, including maps, charts, and tables from sources around the world."
        />

        <meta
          property="og:title"
          content="Monkeypox Tracker - Monkeypox Statistics"
        />
        <meta
          property="og:description"
          content="Statistics and information on the 2022 Monkeypox outbreak, including maps, charts, and tables from sources around the world."
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
          content="Statistics and information on the 2022 Monkeypox outbreak, including maps, charts, and tables from sources around the world."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4489327921275613"
          crossOrigin="anonymous"
        />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DFXC4Y1G0E"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());

       gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`,
          }}
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
              There are <Text as={"span"}>41,034</Text> active cases.
            </Heading>
            <Text color={"gray.500"} maxW={"5xl"}>
              This site is dedicated to tracking the spread of the 2022
              monkeypox outbreak, and is updated every few hours. Click here to{" "}
              <Link href="/countries">
                <a>view the countries listing page</a>
              </Link>{" "}
              for a more detailed breakdown.
            </Text>
          </Stack>
        </Container>

        <Container maxW={"5xl"}>
          <WorldTrends />
          <MapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}

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
