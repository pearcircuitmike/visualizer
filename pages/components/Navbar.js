import Link from "next/link";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
  Center,
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <nav>
      <Box mt={6} mr={5} ml={5} style={{ marginLeft: "1rem" }}>
        <Text fontSize="2xl" as="b" mt={8} ml={5}>
          <Link href="/">
            <a>MonkeypoxTracker</a>
          </Link>
        </Text>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          mt={-9}
          mr={5}
        >
          <Center>
            <Link href="/countries">
              <a>By country</a>
            </Link>
            <Link pl={5} href="/states">
              <a>By state</a>
            </Link>
          </Center>
        </Stack>
      </Box>
    </nav>
  );
};

export default Navbar;
