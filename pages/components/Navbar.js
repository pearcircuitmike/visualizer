import Link from "next/link";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
const Navbar = () => {
  return (
    <nav>
      <Box mt={6} mr={5} ml={5} style={{ marginLeft: "1rem" }}>
        <Text fontSize="2xl" as="b" mt={8}>
          MonkeypoxTracker.net
        </Text>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
          mt={-9}
        >
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/countries">
            <a>Countries Listing</a>
          </Link>
        </Stack>
      </Box>
    </nav>
  );
};

export default Navbar;
