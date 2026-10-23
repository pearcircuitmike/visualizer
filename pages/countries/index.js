// pages/countries/index.js
import Head from "next/head";
import {
  Container,
  Heading,
  Flex,
  Text,
  Box,
  Spacer,
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors.js";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import WorldMap from "../components/WorldMap.js";

export const getStaticProps = async () => {
  // request countries (small)
  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const countrySummaryUrl = "https://api.countrystatecity.in/v1/countries";
  const countrySummaryRes = await fetch(countrySummaryUrl, requestOptions);
  const countries = await countrySummaryRes.json();

  return {
    props: { countryList: countries },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

const Countries = ({ countryList }) => {
  const [countryFilter, setCountryFilter] = useState("");
  const handleSearch = (event) => setCountryFilter(event.target.value);
  const [content, setContent] = useState("");

  // runtime-loaded case totals (tiny)
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/monkeypox/countries-summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!alive) return;
        setSummary(json?.byLocation || {});
      })
      .catch(() => {
        if (!alive) return;
        setSummary({});
      });

    return () => {
      alive = false;
    };
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countryFilter.trim().toLowerCase();
    if (!q) return countryList;
    return countryList.filter((c) => c.name.toLowerCase().includes(q));
  }, [countryList, countryFilter]);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />
        <title>
          Worldwide monkeypox cases {currentMonth} {currentYear}
        </title>
        <meta
          name="description"
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
        />

        <meta property="og:title" content="Monkeypox Tracker | Countries" />
        <meta
          property="og:description"
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
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
          content={`${currentMonth} ${currentYear} monkeypox virus outbreak case totals and deaths. Charts, maps, and data.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl">
        <Heading as="h1" mt={5}>
          Monkeypox cases and deaths by country
        </Heading>

        <Link href={"/usstates/"} passHref>
          <Button
            as="a"
            size="sm"
            m={5}
            style={{ backgroundColor: `${colors.yellowGreen}` }}
          >
            View US states
          </Button>
        </Link>

        <Container maxW={"5xl"} mt={5}>
          <WorldMap setTooltipContent={setContent} tooltipId="pages-countries-index-js-map-1" />
          <ReactTooltip
            id="pages-countries-index-js-map-1"
            content={content}
            hidden={!content}
            float
          />
        </Container>

        <Text mt={5}>
          Select a country to view more details about their Monkeypox situation.
        </Text>

        <InputGroup mt={5}>
          <Input
            variant="outline"
            value={countryFilter}
            onChange={handleSearch}
            placeholder="Search by country name"
          />
          <InputRightElement mr={3}>
            <SearchIcon />
          </InputRightElement>
        </InputGroup>

        {filteredCountries.map((c) => {
          const totalCases =
            summary && summary[c.name] ? summary[c.name].total_cases : null;

          return (
            <Box
              key={c.name}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              pt={2}
              pb={3}
              pr={10}
              pl={10}
              mt={5}
            >
              <Flex spacing={8} direction="row">
                <Center>
                  <div>
                    <Heading size="md" mt={1}>
                      {c.name}
                    </Heading>
                    <Text>
                      Currently active cases:{" "}
                      {totalCases === null
                        ? "Loading…"
                        : totalCases.toLocaleString()}
                    </Text>
                  </div>
                </Center>

                <Spacer />
                <Center>
                  <Link href={"/countries/" + c.iso2} passHref>
                    <Button as="a">View data</Button>
                  </Link>
                </Center>
              </Flex>
            </Box>
          );
        })}
      </Container>
    </>
  );
};

export default Countries;
