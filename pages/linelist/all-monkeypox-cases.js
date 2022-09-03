import Head from "next/head";
import { Container, Heading, Text } from "@chakra-ui/react";
import LineListTable from "../components/LineListTable.js";

const History = () => {
  return (
    <>
      <Head>
        <title>Monkeypox Tracker | All cases</title>
        <meta
          name="description"
          content="All detected monkeypox cases and monkeypox deaths. Inspired by the BNO Monkeypox tracker."
        />

        <meta property="og:title" content="Monkeypox Tracker | About" />
        <meta
          property="og:description"
          content="All detected monkeypox cases and monkeypox deaths. Inspired by the BNO Monkeypox tracker."
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
          content="All detected monkeypox cases and monkeypox deaths. Inspired by the BNO Monkeypox tracker."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Container mt={10} mb={10} maxW={"5xl"}>
          <Heading as="h1">All cases detected</Heading>
          <Text>Source: OurWorldInData.</Text>
        </Container>
      </div>
    </>
  );
};

export default History;
