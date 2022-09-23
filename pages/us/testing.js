import Head from "next/head";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import USTestPositivityTable from "../components/us/USTestPositivityTable";
import USTestPositivityChart from "../components/us/USTestPositivityChart";

const About = () => {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>U.S. Testing Information | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`Statistics and information on ${currentMonth} ${currentYear} Monkeypox testing data in the United States, including maps, charts, and tables. Inspired by the BNO Monkeypox tracker.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox Testing in the United States`}
        />
        <meta
          property="og:description"
          content={`Statistics and information on ${currentMonth} ${currentYear} Monkeypox testing data in the United States, including maps, charts, and tables. Inspired by the BNO Monkeypox tracker.`}
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/usTestingSocialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`Statistics and information on ${currentMonth} ${currentYear} Monkeypox testing data in the United States, including maps, charts, and tables. Inspired by the BNO Monkeypox tracker.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usTestingSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Container mt={10} mb={10} maxW={"5xl"}>
          <Heading as="h1">Testing Positivity</Heading>
          <Text>
            This page contains US-specific information provided by the CDC on
            Monkeypox testing. Positivity rate is based on specimens tested, not
            patients. Most patients have multiple specimens tested. Positivity
            rate is calculated as the number of positive specimens divided by
            the number of positive plus negative specimens per week. Results
            that are equivocal or inconclusive are not included.
          </Text>
          <USTestPositivityChart />
          <USTestPositivityTable />
        </Container>
      </div>
    </>
  );
};

export default About;
