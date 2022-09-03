import Head from "next/head";
import { Container, Heading, Text } from "@chakra-ui/react";
import Script from "next/script";

const About = () => {
  return (
    <>
      <Head>
        <title>Monkeypox Tracker | About</title>
        <meta
          name="description"
          content="More info about the MonkeypoxTacker.net website. Inspired by the BNO Monkeypox tracker."
        />

        <meta property="og:title" content="Monkeypox Tracker | About" />
        <meta
          property="og:description"
          content="More info about the MonkeypoxTacker.net website. Inspired by the BNO Monkeypox tracker."
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
          content="More info about the MonkeypoxTacker.net website. Inspired by the BNO Monkeypox tracker."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Container mt={10} mb={10} maxW={"5xl"}>
          <Heading as="h1">About</Heading>
          <Text>
            The first human case of monkeypox was recorded in 1970 in the
            Democratic Republic of Congo. Since then, monkeypox has been
            reported in humans in other central and western African countries.
            In 2022, an unusual amount of monkeypox cases around the world have
            prompted concern and interest from health officials and the public.
          </Text>
        </Container>
      </div>
    </>
  );
};

export default About;
