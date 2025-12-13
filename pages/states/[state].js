// pages/states/[state].js
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Text,
  Heading,
  Container,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";

const CSC_BASE = "https://api.countrystatecity.in/v1";
const CSC_API_KEY =
  process.env.CSC_API_KEY || process.env.NEXT_PUBLIC_CSC_API_KEY;

function getCscHeaders() {
  if (!CSC_API_KEY) throw new Error("Missing CSC API key");
  return { "X-CSCAPI-KEY": CSC_API_KEY };
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps = async (context) => {
  const raw = String(context?.params?.state || "");
  const [countryIso2Raw, stateIso2Raw] = raw.split("_");
  const countryIso2 = (countryIso2Raw || "").toUpperCase();
  const stateIso2 = (stateIso2Raw || "").toUpperCase();

  if (!countryIso2 || !stateIso2) return { notFound: true, revalidate: 60 };

  try {
    const headers = getCscHeaders();

    const [countryRes, stateRes] = await Promise.all([
      fetch(`${CSC_BASE}/countries/${countryIso2}`, { headers }),
      fetch(`${CSC_BASE}/countries/${countryIso2}/states/${stateIso2}`, {
        headers,
      }),
    ]);

    if (!countryRes.ok || !stateRes.ok)
      return { notFound: true, revalidate: 60 };

    const [countryDetails, stateDetails] = await Promise.all([
      countryRes.json(),
      stateRes.json(),
    ]);

    return {
      props: { countryDetails, stateDetails },
      revalidate: 60 * 60 * 24,
    };
  } catch {
    return { notFound: true, revalidate: 60 };
  }
};

export default function StatePage({ countryDetails, stateDetails }) {
  const countryName = countryDetails?.name || "";
  const stateName = stateDetails?.name || "";

  return (
    <>
      <Head>
        <title>
          Monkeypox cases in {stateName}, {countryName} | Monkeypox Cases
        </title>
        <meta
          name="description"
          content={`Monkeypox overview for ${stateName}, ${countryName}.`}
        />
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
            <Link href="/countries">Countries</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails?.iso2 || ""}`}>
              {countryName}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text as="span">{stateName}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" size="4xl">
          {stateName} {countryDetails?.emoji}
        </Heading>

        <Text mt={4}>
          This page exists for SEO and navigation. State-level case charts load
          on country pages. For US states, use the US state tab.
        </Text>

        <Text mt={4}>
          View country charts:{" "}
          <Link href={`/countries/${countryDetails?.iso2 || ""}`}>
            {countryName}
          </Link>
        </Text>
      </Container>
    </>
  );
}
