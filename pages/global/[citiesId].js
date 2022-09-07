import { Country, State, City } from "country-state-city";
// Import Interfaces
import { ICountry, IState, ICity } from "country-state-city";
import React, { useEffect, useState } from "react";
import { csv } from "csvtojson";
import Head from "next/head.js";
import Link from "next/link";
import {
  ComposableMap,
  Graticule,
  ZoomableGroup,
  Geographies,
  Marker,
  Geography,
  Annotation,
} from "react-simple-maps";

import { colors } from "../../styles/colors.js";
import { Line } from "react-chartjs-2";
import {
  Text,
  Center,
  Heading,
  Container,
  GridItem,
  SimpleGrid,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";

export const getStaticPaths = async () => {
  let cities = City.getAllCities();
  let citiesId = Object.keys(cities);

  const paths = citiesId.map((cityVal) => {
    return {
      params: { citiesId: cityVal.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const cityId = context.params.citiesId;
  const country = Country.getCountryByCode(
    City.getAllCities()[cityId].countryCode
  );
  const state = State.getStateByCodeAndCountry(
    City.getAllCities()[cityId].stateCode,
    City.getAllCities()[cityId].countryCode
  );

  return {
    props: { cityId: cityId, stateData: state, countryData: country },
  };
};

const CityDetails = ({ cityId, stateData, countryData }) => {
  const cityData = City.getAllCities()[cityId];
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonArray = await csv().fromString(text);
        setData(jsonArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  const filter = data.filter((x) =>
    x.location.toLowerCase().includes(countryData.name.toLowerCase())
  );

  let countryNewCases = "0";
  let countryNewDeaths = "0";
  let countryTotalCases = "0";
  let countryTotalDeaths = "0";

  if (filter[0]) {
    countryNewCases = ~~filter[filter.length - 1].new_cases;
    countryNewDeaths = ~~filter[filter.length - 1].new_deaths;
    countryTotalCases = ~~filter[filter.length - 1].total_cases;
    countryTotalDeaths = ~~filter[filter.length - 1].total_deaths;
  }

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

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <title>{cityData.name} | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`Monkeypox cases in ${cityData.name}, ${stateData.name} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from ${countryData.name} .`}
        />

        <meta
          property="og:title"
          content={`Monkeypox cases in ${cityData.name}, ${stateData.name} | Monkeypox Tracker - Monkeypox Cases`}
        />
        <meta
          property="og:description"
          content={`Monkeypox cases in ${cityData.name}, ${stateData.name} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from ${countryData.name} .`}
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
          content={`Monkeypox cases in ${cityData.name}, ${stateData.name} in ${currentMonth} ${currentYear}, including Monkeypox case counts, Monkeypox deaths, other Monkeypox data from ${countryData.name} .`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container mt={5} maxW="5xl">
        <Heading as="h1">
          Monkeypox in {cityData.name}, {countryData.name} {countryData.flag}
        </Heading>
        <Heading as="h2" size="md" mb={5}>
          Tracking case counts and deaths in the {stateData.name} region of{" "}
          {countryData.name}
        </Heading>

        <div data-tip="">
          <ComposableMap projection="geoMercator">
            <Graticule stroke="#f2f0f0" />

            <ZoomableGroup
              filterZoomEvent={(evt) => {
                return evt.type === "wheel" ? false : true;
              }}
            >
              <Geographies geography="/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#DDD"
                      stroke="#FFF"
                    />
                  ))
                }
              </Geographies>
              <Marker coordinates={[cityData.longitude, cityData.latitude]}>
                <circle r={8} fill={colors.spaceCadet} />
                <text
                  y="20"
                  textAnchor="top"
                  alignmentBaseline="middle"
                  fill={colors.spaceCadet}
                >
                  {cityData.name}, {countryData.name}
                </text>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <SimpleGrid m={10} columns={[1, null, 3]}>
          <GridItem>
            <Stat>
              <StatLabel>City:</StatLabel>
              <StatNumber>{cityData.name}</StatNumber>
              <StatHelpText>City or MSA</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Region:</StatLabel>
              <StatNumber>
                {stateData.name} ({stateData.isoCode})
              </StatNumber>
              <StatHelpText>State or Province</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Country</StatLabel>
              <StatNumber>
                {countryData.name} {countryData.flag} ({countryData.isoCode})
              </StatNumber>
              <StatHelpText>Country</StatHelpText>
            </Stat>
          </GridItem>
        </SimpleGrid>

        <Text>
          Monkeypox is a rare disease caused by infection with the monkeypox
          virus. Monkeypox virus is part of the same family of viruses as
          variola virus, the virus that causes smallpox. Monkeypox symptoms are
          similar to smallpox symptoms, but milder, and monkeypox is rarely
          fatal.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the monkeypox outbreak currently taking place
          in {cityData.name}, located in the {stateData.name} region of{" "}
          {countryData.name}.
          <br />
          <br />
        </Text>
        <Heading as="h2" size="md">
          How many monkeypox cases are there in {cityData.name}?
        </Heading>
        <Text>
          Based on the most recent reports available, health authorities in{" "}
          {countryData.name} have reported {countryNewCases.toLocaleString()}{" "}
          new case
          {countryNewCases == 1 ? `` : `s`} and{" "}
          {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0} new death
          {countryNewDeaths == 1 ? `` : `s`}. The people of {countryData.name}{" "}
          have experienced {countryTotalCases.toLocaleString()} total case
          {countryTotalCases == 1 ? `` : `s`} and{" "}
          {countryTotalDeaths ? countryTotalDeaths.toLocaleString() : 0} total
          deaths since the start of the outbreak.
          <br />
          <br />
          You can use the charts on this page to explore the spread of Monkeypox
          in {countryData.name}. You can also refer to the {countryData.name}{" "}
          case history table provided below. Lastly, you can see how the{" "}
          {countryData.name} Monkeypox situation compares with the situation
          globally on the{" "}
          <Link href="/">
            <a style={{ color: `${colors.blueMunsell}` }}>
              MonkeypoxTracker homepage
            </a>
          </Link>
          .
        </Text>
        <Button onClick={copy} mt={5}>
          {!copied ? "Copy sharing link" : "Copied link!"}
        </Button>

        <Text>(Charts and tables coming soon!)</Text>
      </Container>
    </>
  );
};

export default CityDetails;
