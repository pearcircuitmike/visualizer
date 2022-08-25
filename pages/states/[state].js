import React, { useState } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Bar, Line } from "react-chartjs-2";
import {
  Select,
  Box,
  Text,
  Center,
  Heading,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

export const getStaticPaths = async () => {
  const url =
    "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv";

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);
  const nonUniqueLocationOptions = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Location"];
      })
    )
  );
  const uniqueLocationOptions = [...new Set(nonUniqueLocationOptions)];

  const paths = uniqueLocationOptions.map((stateVal) => {
    return {
      params: { state: stateVal },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const state = context.params.state;
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv? `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);
  const filteredData = data.filter((state) =>
    state.Location.includes(context.params.state)
  );

  return {
    props: { state: filteredData },
  };
};

const StateDetails = ({ state }) => {
  const filteredDates = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["Cases"];
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["new_cases"];
      })
    )
  );
  const filteredNewCasesPerMillion = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["new_cases_per_million"];
      })
    )
  );
  const filteredTotalCasesPerMillion = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["total_cases_per_million"];
      })
    )
  );

  const filteredTotalDeaths = JSON.parse(
    JSON.stringify(
      state.map((y) => {
        return y["total_deaths"];
      })
    )
  );

  const [copied, setCopied] = useState(false);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }
  const [stateName, setStateName] = useState(
    state.length ? state[0].Location : ""
  );
  const [stateNewCases, setStateNewCases] = useState(
    state.length ? state[state.length - 1].Cases : ""
  );

  return (
    <>
      <Head>
        <title>{stateName} | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${stateName}, including maps, charts, and tables.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox in ${stateName} | Monkeypox Tracker - Monkeypox Statistics`}
        />
        <meta
          property="og:description"
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${stateName}, including maps, charts, and tables.`}
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
          content={`Statistics and information on the 2022 Monkeypox outbreak in ${stateName}, including maps, charts, and tables.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/">
                <a>Home</a>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/states">
                <a>States</a>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              <a>{stateName}</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {stateName}
        </Heading>
        <Heading as="h2" size="md">
          Monkeypox Outbreak: State Details
        </Heading>

        <Heading as="h3" size="sm" mt={10}>
          {stateName}: Monkeypox Situation Report
        </Heading>
        <Text>
          Monkeypox is a rare disease caused by infection with the monkeypox
          virus. Monkeypox virus is part of the same family of viruses as
          variola virus, the virus that causes smallpox. Monkeypox symptoms are
          similar to smallpox symptoms, but milder, and monkeypox is rarely
          fatal.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the Monkeypox outbreak currently taking place
          in {stateName}.
          <br />
          <br />
          Based on the most recent reports available, health authorities in{" "}
          {stateName} have reported {parseInt(stateNewCases).toLocaleString()}{" "}
          case
          {stateNewCases == 1 ? `` : `s`}.
          <br />
          <br />
          You can see how the {stateName} Monkeypox situation compares with the
          situation globally on the{" "}
          <Link href="/">
            <a>MonkeypoxTracker homepage</a>
          </Link>
          .
        </Text>
        <Button onClick={copy} mt={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>

        <Text mb={5} mt={10} color={"gray.500"}>
          Source: <a href={"https://cdc.gov"}>US CDC</a>. Last update:{" "}
          {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Container>
    </>
  );
};

export default StateDetails;
