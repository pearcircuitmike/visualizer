import Link from "next/link";
import {
  Container,
  Heading,
  HStack,
  Text,
  Box,
  Divider,
  Tooltip,
  Center,
  Flex,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Navbar = () => {
  const [display, changeDisplay] = useState("none");

  return (
    <nav>
      <Flex
        p={5}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"gray.200"}
      >
        <Flex top="1rem" right="1rem" align="center">
          {/*LOGO*/}
          <Heading fontSize="2xl">
            <Link href="/" aria-label="Home" my={5} w="100%">
              <a>MonkeypoxTracker</a>
            </Link>
          </Heading>
        </Flex>
        <Spacer />
        <Flex top="1rem" right="1rem" align="center">
          {/* DESKTOP */}

          <Flex display={["none", "none", "flex", "flex"]}>
            <HStack spacing={10}>
              <Link href="/countries" aria-label="Countries" m={5} w="100%">
                <a>Country data</a>
              </Link>
              <Link href="/states" aria-label="States" m={5} w="100%">
                <a>State data</a>
              </Link>
            </HStack>
          </Flex>

          {/* MOBILE */}
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            icon={<HamburgerIcon />}
            onClick={() => changeDisplay("flex")}
            display={["flex", "flex", "none", "none"]}
          ></IconButton>
        </Flex>

        {/* MOBILE CONTENT */}

        <Flex
          w="100vw"
          display={display}
          bgColor="gray.50"
          zIndex={20}
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          overflowY="auto"
          flexDir="column"
        >
          <HStack m={5}>
            <Flex top="1rem" align="center">
              {/*LOGO*/}
              <Heading fontSize="2xl">
                <Link href="/" aria-label="Home" my={5} w="100%">
                  <a onClick={() => changeDisplay("none")}>MonkeypoxTracker</a>
                </Link>
              </Heading>
            </Flex>
            <Spacer />
            <Flex>
              <IconButton
                mr={5}
                aria-label="Close Menu"
                size="lg"
                icon={<CloseIcon />}
                onClick={() => changeDisplay("none")}
              ></IconButton>
            </Flex>
          </HStack>
          <Flex flexDir="column" align="center">
            <Link href="/countries" aria-label="Countries" my={5} w="100%">
              <a onClick={() => changeDisplay("none")}>Country data</a>
            </Link>
            <Link pl={5} href="/states" aria-label="States" my={5} w="100%">
              <a onClick={() => changeDisplay("none")}>State data</a>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
