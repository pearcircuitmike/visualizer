import "../styles/globals.css";
import Layout from "./components/Layout";

import { ChakraProvider } from "@chakra-ui/react";

import ReactTooltip from "react-tooltip";
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
