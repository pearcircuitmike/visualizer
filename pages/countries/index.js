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
} from "@chakra-ui/react";
import Link from "next/link";

export const getStaticProps = async () => {
  const url =
    "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-by-Country.csv";

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);

  return {
    props: { countryVals: data },
  };
};

const Countries = ({ countryVals }) => {
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

      {countryVals.map((countryVal) => (
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
                <Text>Currently active cases: {countryVal.Cases}</Text>
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
