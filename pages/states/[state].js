import React, { useState, useEffect } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";

import {
  Text,
  Heading,
  Container,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import Router, { useRouter } from "next/router.js";
import { ChevronRightIcon } from "@chakra-ui/icons";
import USMapChart from "../components/USMap.js";
import Faq from "../faq.js";

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
  const router = useRouter();

  useEffect(() => {
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

    setStateName(state[0].Location);
  }, [useRouter().asPath]);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }
  const [copied, setCopied] = useState(false);

  const [content, setContent] = useState("");
  const [stateName, setStateName] = useState(
    state.length ? state[0].Location : ""
  );
  const [stateNewCases, setStateNewCases] = useState(
    state.length ? state[state.length - 1].Cases : ""
  );

  return (
    <div key={router.pathname}>
      <Head>
        <title>{stateName} | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`The 2022 Monkeypox virus disease outbreak in ${stateName}, including ${stateName} Monkeypox case counts, ${stateName} Monkeypox case counts deaths, and ${stateName} Monkeypox data.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox in ${stateName} | Monkeypox Tracker - Monkeypox Statistics`}
        />
        <meta
          property="og:description"
          content={`Statistics and information on the 2022 Monkeypox virus disease outbreak in ${stateName}, including ${stateName} Monkeypox case counts, ${stateName} Monkeypox case counts deaths, and ${stateName} Monkeypox data.`}
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
          content={`Statistics and information on the 2022 Monkeypox virus disease outbreak in ${stateName}, including ${stateName} Monkeypox case counts, ${stateName} Monkeypox case counts deaths, and ${stateName} Monkeypox data.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35} key={router.asPath}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <Link href="/">
              <a>Home</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/states">
              <a>States</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <a>{stateName}</a>
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
            <a style={{ color: `${colors.blueMunsell}` }}>
              MonkeypoxTracker homepage
            </a>
          </Link>
          .
        </Text>
        <Button onClick={copy} mt={5} mb={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>

        <Heading size="md">
          Click on another state to view more details.
        </Heading>
        <Container maxW={"5xl"}>
          <USMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
        </Container>

        <Faq />
      </Container>
    </div>
  );
};

export default StateDetails;
