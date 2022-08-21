import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";

const About = () => {
  return (
    <div>
      <Container mt={10} mb={10} maxW={"5xl"}>
        <Heading as="h1">About</Heading>
        <Text>
          The first human case of monkeypox was recorded in 1970 in the
          Democratic Republic of Congo. Since then, monkeypox has been reported
          in humans in other central and western African countries. In 2022, an
          unusual amount of monkeypox cases around the world have prompted
          concern and interest from health officials and the public.
        </Text>
      </Container>
    </div>
  );
};

export default About;
