import Head from "next/head";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { colors } from "../styles/colors.js";
import Script from "next/script.js";

const Faq = () => {
  return (
    <>
      <Head>
        <title>Monkeypox Tracker | FAQ</title>
        <meta
          name="description"
          content="Frquently asked questions about Monkeypox as a disease, including symptom information, treatment information, vaccination information, and statistics."
        />

        <meta property="og:title" content="Monkeypox Tracker | FAQ" />
        <meta
          property="og:description"
          content="Frquently asked questions about Monkeypox as a disease, including symptom information, treatment information, vaccination information, and statistics."
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Frquently asked questions about Monkeypox virus, including symptom information, treatment information, vaccination information, and statistics."
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Container mt={10} mb={10} maxW={"5xl"}>
          <Heading as="h1">Frequently Asked Questions</Heading>
          <Text>
            This page is devoted to some frequently asked questions about
            MonkeypoxTracker.net and the Monkeypox disease. Information about
            Monkeypox is reported as provided by the U.S. CDC. Read on to learn
            more!
          </Text>
          <Accordion allowToggle allowMultiple mt={10} mb={10}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>What is Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Monkeypox is a rare disease caused by infection with the
                  monkeypox virus. Monkeypox virus is part of the same family of
                  viruses as variola virus, the virus that causes smallpox.
                  Monkeypox symptoms are similar to smallpox symptoms, but
                  milder, and monkeypox is rarely fatal.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Where does our data come from?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                We take a very conservative approach to reporting data. Numbers
                reported on this site are compiled by the expert team at
                OurWorldInData or the U.S. CDC. You will note call-outs beneath
                most data indicating which of the two sources provided the data
                displayed.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Are there different variants of Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  There are two types of monkeypox virus: West African and Congo
                  Basin. Infections in the current outbreak are from the West
                  African type.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>What should I do if I think I have Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  People who think they have monkeypox or have had close
                  personal contact with someone who has monkeypox should visit a
                  healthcare provider to help them decide if they need to be
                  tested for monkeypox. If they decide that you should be
                  tested, they will work with you to collect the specimens and
                  send them to a laboratory for testing.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>What are my chances of death if I have Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Infections with the type of monkeypox virus identified in this
                  outbreak—the West African type—are rarely fatal. Over 99% of
                  people who get this form of the disease are likely to survive.
                  However, people with weakened immune systems, children under 8
                  years of age, people with a history of eczema, and people who
                  are pregnant or breastfeeding may be more likely to get
                  seriously ill or die. The Congo Basin type of monkeypox virus
                  has a fatality rate around 10%.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>What are the symptoms of Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <p>Symptoms of monkeypox can include:</p>
                <ul>
                  <li>Fever </li>
                  <li>Headache</li>
                  <li>Muscle aches and backache</li>
                  <li>Swollen lymph nodes</li>
                  <li>Chills</li>
                  <li>
                    Respiratory symptoms (e.g. sore throat, nasal congestion, or
                    cough)
                  </li>
                  <li>
                    A rash that can look like pimples or blisters that appears
                    on the face, inside the mouth, and on other parts of the
                    body, like the hands, feet, chest, genitals, or anus. The
                    rash goes through different stages before healing
                    completely. The illness typically lasts 2-4 weeks.
                  </li>
                </ul>
                <p>
                  Sometimes, people get a rash first, followed by other
                  symptoms. Others only experience a rash.
                </p>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>How often is the data updated?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Data is updated every few hours. Note that our sources may not
                have any updates to their own data during this time, so
                sometimes it may appear as if data is stale or has not changed,
                even if we have fetched new numbers since your last visit.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>How can I view country-specific data?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                You can view data for specific countries by visiting the
                countries tab in the navigation, or by clicking on a country
                with data on the map on the homepage. Note that not all
                countries have data at this time, and thus not all countries
                have detail pages. You can also use this link to travel to the{" "}
                <Link href="/countries" aria-label="Countries" m={5} w="100%">
                  <a style={{ color: `${colors.blueMunsell}` }}>
                    countries listing
                  </a>
                </Link>{" "}
                page.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>How can I view U.S. state-specific data?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                You can view data for specific states by visiting the states tab
                in the navigation. Note that not all states have data at this
                time, and thus not all states have detail pages. You can also
                use this link to travel to the{" "}
                <Link href="/states" aria-label="States" m={5} w="100%">
                  <a style={{ color: `${colors.blueMunsell}` }}>
                    states listing
                  </a>
                </Link>{" "}
                page.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>How does Monkeypox spread?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Monkeypox can spread from person to person through direct
                  contact with the infectious rash, scabs, or body fluids. It
                  also can be spread by respiratory secretions during prolonged,
                  face-to-face contact, or during intimate physical contact,
                  such as kissing, cuddling, or sex. Monkeypox can spread from
                  the time symptoms start until the rash has fully healed and a
                  fresh layer of skin has formed. Anyone in close personal
                  contact with a person with monkeypox can get it and should
                  take steps to protect themselves.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Is Monkeypox a sexually transmitted infection (STI)?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Monkeypox can more accurately be described as “sexually
                  transmissible.” In other words, sex is just one of the ways
                  that monkeypox can be spread. In the past, monkeypox outbreaks
                  have been linked to direct exposure to infected animals and
                  animal products, with limited person-to-person spread. In the
                  current monkeypox outbreak, the virus is spreading primarily
                  through close personal contact. This may include contact with
                  infectious lesions or respiratory secretions via close,
                  sustained skin-to-skin contact that occurs during sex.
                  However, any close, sustained skin-to-skin contact with
                  someone who has monkeypox can spread the virus. The contact
                  does not have to be exclusively intimate or sexual.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>How can I avoid catching Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Avoid close, skin-to-skin contact with people who have a rash
                  that looks like monkeypox. Avoid contact with objects and
                  materials that a person with monkeypox has used. Wash your
                  hands often with soap and water or use an alcohol-based hand
                  sanitizer, especially before eating or touching your face and
                  after you use the bathroom.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Should I avoid crowded events?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  People can get monkeypox if they have close, skin-to-skin
                  contact with someone who has monkeypox. Early indications are
                  that events with activities in which people engage in close,
                  sustained skin-to-skin contact have resulted in cases of
                  monkeypox. If you plan to attend an event, consider how much
                  close, personal, skin-to-skin contact is likely to occur
                  there.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Is there a cure or treatment for Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  There are no treatments specifically for monkeypox virus
                  infections. However, because of genetic similarities in the
                  viruses, antiviral drugs used to treat smallpox may be used to
                  treat monkeypox infections.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Is there a vaccine for Monkeypox?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  Because monkeypox and smallpox viruses are genetically
                  similar, vaccines developed to protect against smallpox
                  viruses may be used to prevent monkeypox infections. The U.S.
                  government has two stockpiled vaccines—JYNNEOS and
                  ACAM2000—that can prevent monkeypox in people who are exposed
                  to the virus.
                </Text>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Who should get vaccinated?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                CDC recommends vaccination for people who have been exposed to
                monkeypox and people who may be more likely to get monkeypox,
                including:
                <ul>
                  <li>
                    People who have been identified by public health officials
                    as a contact of someone with monkeypox
                  </li>
                  <li>
                    People who know one of their sexual partners in the past 2
                    weeks has been diagnosed with monkeypox
                  </li>
                  <li>
                    People who had multiple sexual partners in the past 2 weeks
                    in an area with known monkeypox
                  </li>
                </ul>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <b>Can I get vaccinated?</b>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  If you think you may be eligible for vaccination, contact a
                  healthcare provider or your local health department. They can
                  help you determine if you should get vaccinated.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Container>
      </div>
    </>
  );
};

export default Faq;
