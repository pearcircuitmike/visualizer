import "../styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";

import ReactTooltip from "react-tooltip";
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
