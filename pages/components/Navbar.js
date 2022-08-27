import Link from "next/link";
import Script from "next/script";
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
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`}
      </Script>
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
              <Link href="/us/testing" aria-label="Countries" m={5} w="100%">
                <a>US testing</a>
              </Link>
              <Link href="/about" aria-label="About" m={5} w="100%">
                <a>About</a>
              </Link>
              <Link href="/faq" aria-label="FAQ" m={5} w="100%">
                <a>FAQ</a>
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
            <Link href="/countries" aria-label="Countries" m={2} w="100%">
              <a onClick={() => changeDisplay("none")}>Country data</a>
            </Link>
            <Link href="/states" aria-label="States" m={2} w="100%">
              <a onClick={() => changeDisplay("none")}>State data</a>
            </Link>
            <Link href="/us/testing" aria-label="US testing" m={2} w="100%">
              <a onClick={() => changeDisplay("none")}>US Testing</a>
            </Link>
            <Link href="/about" aria-label="About" m={2} w="100%">
              <a onClick={() => changeDisplay("none")}>About</a>
            </Link>
            <Link href="/faq" aria-label="FAQ" m={2} w="100%">
              <a onClick={() => changeDisplay("none")}>FAQ</a>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
