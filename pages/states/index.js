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
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { colors } from "../../styles/colors.js";

export const getStaticProps = async () => {
  const date = Math.floor(new Date().getTime() / 1000);
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv?${date} `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  return {
    props: { stateVals: data },
  };
};

const States = ({ stateVals }) => {
  const [stateFilter, setStateFilter] = useState("");
  const handleSearch = (event) => setStateFilter(event.target.value);

  return (
    <Container maxW="5xl">
      <HStack mt={10}>
        <Heading>All States </Heading>
        <Spacer />

        <Link href={"/countries"}>
          <Button
            size="sm"
            style={{ backgroundColor: `${colors.yellowGreen}` }}
          >
            View countries
          </Button>
        </Link>
      </HStack>

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
          value={stateFilter}
          onChange={handleSearch}
          placeholder="Search by state name"
        />
        <InputRightElement mr={3}>
          <SearchIcon />
        </InputRightElement>
      </InputGroup>

      {stateVals
        .filter((state) =>
          state.Location.toLowerCase().includes(stateFilter.toLowerCase())
        )
        .map((stateVal) => (
          <Box
            key={stateVal.Location}
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
                    {stateVal.Location}
                  </Heading>
                  <Text>
                    Currently active cases:{" "}
                    {parseInt(stateVal.Cases).toLocaleString()}
                  </Text>
                </div>
              </Center>

              <Spacer />
              <Center>
                <Link href={"/states/" + stateVal.Location}>
                  <Button>
                    <a>View data</a>
                  </Button>
                </Link>
              </Center>
            </Flex>
          </Box>
        ))}
    </Container>
  );
};

export default States;
