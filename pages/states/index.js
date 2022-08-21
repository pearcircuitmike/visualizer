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
  return (
    <Container maxW="5xl">
      <Heading mt={10}>All states</Heading>
      <Text mt={5}>
        Select a country to view more details about their Monkeypox situation.
        Each country has a situation report, automatically generated from the
        most recent data. You can also view graphs of the disease activity in
        each country, and review data in tabular form. Data is sourced from Our
        World In Data and the US CDC.
      </Text>

      {stateVals.map((stateVal) => (
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
                <Text>Currently active cases: {stateVal.Cases}</Text>
              </div>
            </Center>

            <Spacer />
            <Center>
              <Button>
                <Link href={"/states/" + stateVal.Location}>
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

export default States;
