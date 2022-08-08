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
      <Heading>All countries</Heading>
      <Text>Desc</Text>

      {countryVals.map((countryVal) => (
        <Box
          key={countryVal.Country}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          pt={3}
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
                <a>View data</a>
              </Button>
            </Center>
          </Flex>
        </Box>
      ))}
    </Container>
  );
};

export default Countries;
