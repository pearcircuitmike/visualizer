import React, { useState, useEffect } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";

import {
  Text,
  Heading,
  Container,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import { useRouter } from "next/router.js";
import { ChevronRightIcon } from "@chakra-ui/icons";
import USMapChart from "../components/USMap.js";

export const getStaticPaths = async () => {
  const url =
    "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv";

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);
  const nonUniqueLocationOptions = JSON.parse(
    JSON.stringify(
      data.map((y) => {
        return y["Location"];
      })
    )
  );
  const uniqueLocationOptions = [...new Set(nonUniqueLocationOptions)];

  const paths = uniqueLocationOptions.map((stateVal) => {
    return {
      params: { state: stateVal },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const state = context.params.state;
  const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv? `;

  const res = await fetch(url);
  const text = await res.text();
  const data = await csv().fromString(text);
  const filteredData = data.filter((state) =>
    state.Location.includes(context.params.state)
  );

  return {
    props: { state: filteredData },
  };
};

const StateDetails = ({ state }) => {
  const router = useRouter();

  useEffect(() => {
    const filteredDates = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["date"];
        })
      )
    );
    const filteredTotalCases = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["Cases"];
        })
      )
    );
    const filteredNewCases = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["new_cases"];
        })
      )
    );
    const filteredNewCasesPerMillion = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["new_cases_per_million"];
        })
      )
    );
    const filteredTotalCasesPerMillion = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["total_cases_per_million"];
        })
      )
    );

    const filteredNewTotalDeaths = JSON.parse(
      JSON.stringify(
        state.map((y) => {
          return y["new_deaths"];
        })
      )
    );

    setStateName(state[0].Location);
  }, [useRouter().asPath]);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }
  const [copied, setCopied] = useState(false);

  const [content, setContent] = useState("");
  const [stateName, setStateName] = useState(
    state.length ? state[0].Location : ""
  );
  const [stateNewCases, setStateNewCases] = useState(
    state.length ? state[state.length - 1].Cases : ""
  );

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div key={router.pathname}>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          {stateName} Monkeypox in {currentMonth} {currentYear} | Monkeypox
          Cases, Monkeypox Vaccines
        </title>
        <meta
          name="description"
          content={`${stateName} monkeypox cases. Updated ${currentMonth} ${currentYear} monkeypox cases and monkeypox vaccines.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox in ${stateName} as of ${currentMonth} ${currentYear} | Monkeypox Tracker - Monkeypox Cases`}
        />
        <meta
          property="og:description"
          content={`${stateName} monkeypox cases. Updated ${currentMonth} ${currentYear} monkeypox cases and monkeypox vaccines.`}
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`${stateName} monkeypox cases. Updated ${currentMonth} ${currentYear} monkeypox cases and monkeypox vaccines.`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35} key={router.asPath}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <Link href="/">
              <a>Home</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/usstates">
              <a>States</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <a>{stateName}</a>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {stateName}
        </Heading>
        <Heading as="h2" size="md">
          Monkeypox Cases in {stateName}
        </Heading>

        <Heading as="h3" size="md" mt={10}>
          {stateName}: Monkeypox cases and monkeypox vaccination data
        </Heading>
        <Text>
          Monkeypox is a rare disease caused by infection with the monkeypox
          virus. Monkeypox virus is part of the same family of viruses as
          variola virus, the virus that causes smallpox. Monkeypox symptoms are
          similar to smallpox symptoms, but milder, and monkeypox is rarely
          fatal.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the Monkeypox cases and deaths currently
          detected in {stateName}.
          <br />
          <br />
          Based on the most recent reports available, health authorities in{" "}
          {stateName} have reported {parseInt(stateNewCases).toLocaleString()}{" "}
          monkeypox case
          {stateNewCases == 1 ? `` : `s`}.
          <br />
          <br />
          You can see how the {stateName} Monkeypox cases count compares with
          the monkeypox cases count globally on the{" "}
          <Link href="/">
            <a style={{ color: `${colors.blueMunsell}` }}>
              MonkeypoxTracker homepage
            </a>
          </Link>
          .<br />
          <br />
        </Text>

        <Heading as="h3" size="md">
          How do people in {stateName} get monkeypox?
        </Heading>
        <Text>
          Monkeypox is primarily spread through contact with the blood, bodily
          fluids, or skin of infected animals, such as rodents or primates. It
          can also be spread through close contact with an infected person. This
          can include contact with an infected person's skin, especially if the
          person is experiencing a rash, or contact with an infected person's
          respiratory secretions, such as saliva, mucus, or semen. In addition,
          monkeypox can be spread through contact with objects that have been
          contaminated with the virus, such as bedding or clothing.
          <br /> <br />
          Monkeypox is not as contagious as smallpox and is not as easily spread
          from person to person. However, the risk of infection is increased
          among people who live in or have recently traveled to areas where
          monkeypox is known to occur and among people who have had close
          contact with an infected person or animal.
          <br /> <br />
          It's also important to note that people who have been vaccinated
          against smallpox are at a lower risk of getting monkeypox.
          <br />
          <br />
        </Text>

        <Heading as="h3" size="md">
          What should I do if I get monkeypox in {stateName}?
        </Heading>

        <Text>
          If you suspect you have contracted monkeypox, it is important to seek
          medical attention as soon as possible. Here are some steps you can
          take: First, contact your healthcare provider and inform them of your
          symptoms and possible exposure to monkeypox. Then, follow their
          instructions on how to safely seek medical attention. Also, follow
          their guidelines on how to prevent the spread of the disease to
          others. Your healthcare provider will then report the case to the
          state health department, who will then notify the Centers for Disease
          Control and Prevention (CDC) and work to implement control measures to
          prevent further spread. It's important to note that monkeypox is rare
          and most people who are infected will recover without any serious
          problems. However, if you have a weakened immune system, you may be at
          a higher risk of complications. Your healthcare provider can provide
          you with more information on how to manage your symptoms and prevent
          the spread of the disease to others.
        </Text>
        <Button onClick={copy} mt={5} mb={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>

        <Heading size="md">
          Click on another state to view more details.
        </Heading>
        <Container maxW={"5xl"}>
          <USMapChart setTooltipContent={setContent} />
          {content && (
            <ReactTooltip>
              <Tooltip>{content}</Tooltip>
            </ReactTooltip>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default StateDetails;
