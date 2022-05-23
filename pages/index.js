import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  IconProps,
  Box, Divider, HStack
} from '@chakra-ui/react';


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Monkeypox Tracker - Monkeypox Statistics</title>
        <meta name="description" content="Statistics and information on the 2022 Monkeypox outbreak, including maps, charts, and tables from sources around the world." />

          <meta property="og:title" content="Monkeypox Tracker - Monkeypox Statistics" />
          <meta property="og:url" content="https://monkeypoxtracker.net/" />
          <meta property="og:image" content="public/socialImg.png" />
          <meta property="og:type" content="website">

          <meta name="twitter:card" content="summary_large_image">


        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Box mt={6}>
      <Text fontSize='2xl' as='b' mt={8}>MonkeypoxTracker.net</Text>
      <Stack flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          mt={-9}>
        <Button>
          Facebook
        </Button>
        <Button>
          Twitter
        </Button>
      </Stack>
      </Box>


      <Container maxW={'5xl'}>
           <Stack
             textAlign={'center'}
             align={'center'}
             spacing={{ base: 8, md: 10 }}
             py={{ base: 20, md: 28 }}>
             <Heading
               fontWeight={600}
               fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
               lineHeight={'110%'}>
               There are {' '}
               <Text as={'span'} color={'orange.400'}>
                 206
               </Text>
               {' '} active cases.
             </Heading>
             <Text color={'gray.500'} maxW={'3xl'}>
               The first human case of monkeypox was recorded in 1970 in the Democratic Republic of Congo.
               Since then, monkeypox has been reported in humans in other central and western African countries. In 2022, an unusual
               amount of monkeypox cases around the world have prompted concern and interest from health officials and the public.
               <br/><br/>
               This site is dedicated to tracking the spread of the disease during this outbreak, and is updated every few hours.
             </Text>
           </Stack>
       </Container>

      <Container >
      <Box mb={12}>
    <iframe title="Monkeypox cases by country"
    aria-label="Map"
    id="datawrapper-chart-req8A"
    src="https://datawrapper.dwcdn.net/req8A/2/"
    scrolling="no"
    frameBorder={0}
    style={{border: 0}}
    width={600}
    height={365}

    ></iframe>
    </Box>

    <Box mb={12}>
    <iframe
    title="Monkeypox cases by country"
    aria-label="Table"
    id="datawrapper-chart-gvUWM"
    src="https://datawrapper.dwcdn.net/gvUWM/3/"
    scrolling="no"
    frameBorder={0}
    style={{border: 0}}
    width={600}
    height={620}>
    </iframe>
    </Box>

    <Box mb={12}>
    <iframe title="Monkeypox cases over time"
    aria-label="Interactive line chart"
    id="datawrapper-chart-8BTii"
    src="https://datawrapper.dwcdn.net/8BTii/2/"
    scrolling="no"
    frameBorder={0}
    style={{border: 0}}
    width={600}
    height={400}></iframe>
    </Box>


</Container>
<Divider />
<Container>

<Text mt={12} mb={12}>Want to raise awareness? You can share this site on social media. <br/> <br/>Check back for daily updates.</Text>

</Container>

      </main>


    </div>
  )
}
