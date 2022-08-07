import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";

import Script from "next/script";
import MapChart from "./components/WorldMap.js";
import DataTable from "./components/WorldTable.js";

import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <div className={styles.container}>
      <Head>
        <title>Monkeypox Tracker - Monkeypox Statistics</title>
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
        <Box mt={6}>
          <Text fontSize="2xl" as="b" mt={8}>
            MonkeypoxTracker.net
          </Text>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            mt={-9}
          ></Stack>
        </Box>

        <Container maxW={"5xl"}>
          <Stack
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 5, md: 10 }}
            py={{ base: 20, md: 20 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              There are <Text as={"span"}>28,220</Text> active cases.
            </Heading>
            <Text color={"gray.500"} maxW={"5xl"}>
              The first human case of monkeypox was recorded in 1970 in the
              Democratic Republic of Congo. Since then, monkeypox has been
              reported in humans in other central and western African countries.
              In 2022, an unusual amount of monkeypox cases around the world
              have prompted concern and interest from health officials and the
              public.
              <br />
              <br />
              This site is dedicated to tracking the spread of the disease
              during this outbreak, and is updated every few hours.
            </Text>
          </Stack>
        </Container>

        <Container maxW={"5xl"}>
          <MapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}

          <DataTable />

          <Box mb={12} maxH={500}></Box>
          <Box mb={12}></Box>
          <Box mb={12} maxH={500}></Box>
        </Container>
        <Divider />
        <Container>
          <Text mt={12} mb={12}>
            Want to raise awareness? You can share this site on social media.{" "}
            <br /> <br />
            Check back for daily updates.
          </Text>
        </Container>
      </main>
    </div>
  );
}
