import { csv } from "csvtojson";
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
  InputAddon,
  InputRightElement,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

import Link from "next/link";
import React, { useState } from "react";

export const getStaticProps = async () => {
  const date = Math.floor(new Date().getTime() / 1000);
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-Deaths-by-Country.csv?v=${date} `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  return {
    props: { countryVals: data },
  };
};

const Countries = ({ countryVals }) => {
  const [countryFilter, setCountryFilter] = useState("");
  const handleSearch = (event) => setCountryFilter(event.target.value);

  return (
    <Container maxW="5xl">
      <Heading mt={10}>All countries</Heading>
      <Text mt={5}>
        Select a country to view more details about their Monkeypox situation.
        Each country has a situation report, automatically generated from the
        most recent data. You can also view graphs of the disease activity in
        each country, and review data in tabular form. Data is sourced from Our
        World In Data and the US CDC.
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

      {countryVals
        .filter((country) =>
          country.Country.toLowerCase().includes(countryFilter.toLowerCase())
        )
        .map((countryVal) => (
          <Box
            key={countryVal.Country}
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
                    {countryVal.Country}
                  </Heading>
                  <Text>
                    Currently active cases:{" "}
                    {parseInt(countryVal.Cases).toLocaleString(undefined)}
                  </Text>
                </div>
              </Center>

              <Spacer />
              <Center>
                <Button>
                  <Link href={"/countries/" + countryVal.Country}>
                    <a>View data</a>
                  </Link>
                </Button>
              </Center>
            </Flex>
          </Box>
        ))}
    </Container>
  );
};

export default Countries;
