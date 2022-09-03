import Link from "next/link";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Container maxW={"5xl"} mb={5} mt={5}>
      <Button colorScheme="twitter" leftIcon={<FaTwitter />}>
        <a href="https://twitter.com/monkeypox_stats">
          Follow updates on Twitter
        </a>
      </Button>
    </Container>
  );
};

export default Footer;
