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
            <br />
            <br />
          </Text>

          <Text>
            This site is dedicated to tracking the spread of the 2022 monkeypox
            virus disease outbreak, and is updated every few hours. You can view
            the countries listing page for a more detailed breakdown. You can
            also view the states listing page for a breakdown of U.S. cases by
            state. Follow us on twitter for more updates, or follow our partner
            Pandemic News for details about other health crises around the
            world.
          </Text>

          <Text>
            Data is primarily sourced from the US CDC and OurWorldInData, in
            partnership with Global.health. Global.health compiles data
            exclusively from publicly-available information. Sources for each
            case are listed{" "}
            <a href="https://github.com/globaldothealth/monkeypox/blob/main/latest.csv">
              here
            </a>
            . Should you identify any inconsistencies in the data or have
            additional information or questions, please get in touch with them
            on the Github page.
          </Text>
        </Container>
      </div>
    </>
  );
};

export default About;
