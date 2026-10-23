import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { csv } from "csvtojson";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Text,
  Heading,
  Container,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { colors } from "../../styles/colors.js";
import USMapChart from "../components/USMap.js";

const CDC_STATE_DATA_URL =
  "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv";

const MAP_TOOLTIP_ID = "us-state-details-map-tooltip";

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (context) => {
  const requestedState = context?.params?.state;

  if (typeof requestedState !== "string" || requestedState.trim() === "") {
    return {
      notFound: true,
    };
  }

  const res = await fetch(CDC_STATE_DATA_URL);

  if (!res.ok) {
    throw new Error(`CDC state data request failed: HTTP ${res.status}`);
  }

  const text = await res.text();

  if (/^\s*(?:<!doctype html|<html)/i.test(text)) {
    throw new Error("CDC state data endpoint returned HTML instead of CSV.");
  }

  const data = await csv().fromString(text);

  const validRows = data.filter(
    (row) => typeof row.Location === "string" && row.Location.trim() !== "",
  );

  if (validRows.length === 0) {
    throw new Error(
      "CDC state data response contained no valid Location values.",
    );
  }

  const normalizedState = requestedState.trim().toLowerCase();

  const matchingRows = validRows.filter(
    (row) => row.Location.trim().toLowerCase() === normalizedState,
  );

  if (matchingRows.length === 0) {
    return {
      notFound: true,
      revalidate: 3600,
    };
  }

  const state = matchingRows.map((row) => {
    const rawCases = String(row.Cases ?? "")
      .replace(/,/g, "")
      .trim();

    const cases = rawCases === "" ? NaN : Number(rawCases);

    if (!Number.isFinite(cases) || cases < 0) {
      throw new Error(
        `CDC state data contained an invalid Cases value for ${row.Location}.`,
      );
    }

    return {
      Location: row.Location.trim(),
      Cases: cases,
    };
  });

  return {
    props: {
      state,
    },
    revalidate: 3600,
  };
};

const StateDetails = ({ state }) => {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState("");

  const stateName = state[0].Location;
  const stateNewCases = state[state.length - 1].Cases;

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const currentYear = new Date().getFullYear();

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        return;
      }

      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);

      try {
        input.select();
        setCopied(document.execCommand("copy"));
      } finally {
        document.body.removeChild(input);
      }
    } catch {
      setCopied(false);
    }
  }

  return (
    <div key={router.asPath}>
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
        <meta
          property="og:url"
          content={`https://monkeypoxtracker.net/usstates/${encodeURIComponent(
            stateName,
          )}`}
        />
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

      <Container maxW="5xl" mt={35}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/usstates">States</Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text as="span">{stateName}</Text>
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
          <br />
          <br />
        </Text>

        <Text>
          This page shows data for the Monkeypox cases and deaths currently
          detected in {stateName}.
          <br />
          <br />
          Based on the most recent reports available, health authorities in{" "}
          {stateName} have reported {stateNewCases.toLocaleString()} monkeypox
          case{stateNewCases === 1 ? "" : "s"}.
          <br />
          <br />
          You can see how the {stateName} Monkeypox cases count compares with
          the monkeypox cases count globally on the{" "}
          <Link href="/" style={{ color: colors.blueMunsell }}>
            MonkeypoxTracker homepage
          </Link>
          .
          <br />
          <br />
        </Text>

        <Heading as="h3" size="md">
          How do people in {stateName} get monkeypox?
        </Heading>

        <Text>
          Monkeypox is primarily spread through contact with the blood, bodily
          fluids, or skin of infected animals, such as rodents or primates. It
          can also be spread through close contact with an infected person. This
          can include contact with an infected person&apos;s skin, especially if
          the person is experiencing a rash, or contact with an infected
          person&apos;s respiratory secretions, such as saliva, mucus, or semen.
          In addition, monkeypox can be spread through contact with objects that
          have been contaminated with the virus, such as bedding or clothing.
          <br />
          <br />
          Monkeypox is not as contagious as smallpox and is not as easily spread
          from person to person. However, the risk of infection is increased
          among people who live in or have recently traveled to areas where
          monkeypox is known to occur and among people who have had close
          contact with an infected person or animal.
          <br />
          <br />
          It&apos;s also important to note that people who have been vaccinated
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
          prevent further spread. It&apos;s important to note that monkeypox is
          rare and most people who are infected will recover without any serious
          problems. However, if you have a weakened immune system, you may be at
          a higher risk of complications. Your healthcare provider can provide
          you with more information on how to manage your symptoms and prevent
          the spread of the disease to others.
        </Text>

        <Button onClick={copy} mt={5} mb={5}>
          {copied ? "Copied link!" : "Copy report URL"}
        </Button>

        <Heading size="md">
          Click on another state to view more details.
        </Heading>

        <Container maxW="5xl">
          <USMapChart
            setTooltipContent={setContent}
            tooltipId={MAP_TOOLTIP_ID}
          />

          <ReactTooltip
            id={MAP_TOOLTIP_ID}
            content={content}
            hidden={!content}
            float
          />
        </Container>
      </Container>
    </div>
  );
};

export default StateDetails;
