import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Heading, Stack, Center, Box, Text } from "@chakra-ui/react";

import { csv } from "csvtojson";

import { colors } from "../../styles/colors.js";

const WorldMapChart = ({ setTooltipContent }) => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const date = Math.floor(new Date("2012.08.10").getTime() / 1000);
    const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-Deaths-by-Country.csv?v=${date} `;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonArray = await csv().fromString(text);
        setData(jsonArray);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Box>
        <Center>
          <Heading as="h2" size="lg" mb={5}>
            Global confirmed cases
          </Heading>
        </Center>
      </Box>
      <div data-tip="">
        <ComposableMap projection="geoMercator">
          <Graticule stroke="#f2f0f0" />

          <ZoomableGroup
            filterZoomEvent={(evt) => {
              return evt.type === "wheel" ? false : true;
            }}
          >
            <Geographies geography="/features.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.Country === geo.properties.name);
                  const colorScale = scaleLinear()
                    .domain([0, 10000])
                    .range([colors.aquamarine, colors.spaceCadet]);

                  return (
                    <Geography
                      key={geo.properties.name}
                      geography={geo}
                      stroke="#ffffff"
                      strokeWidth={1}
                      onMouseEnter={() => {
                        d
                          ? setTooltipContent(
                              `${geo.properties.name} ${d.Cases}`
                            )
                          : setTooltipContent(`${geo.properties.name} 0`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        d
                          ? router.push(`/countries/${geo.properties.name}`)
                          : console.log("none");
                      }}
                      style={{
                        default: {
                          fill: d
                            ? colorScale(`${d.Cases}`)
                            : colors.yellowGreenPale,
                          outline: "none",
                        },
                        hover: {
                          fill: colors.blueMunsell,
                        },
                        pressed: {
                          fill: d
                            ? colorScale(`${d.Cases}`)
                            : colors.yellowGreen,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <Box>
        <Text mb={5} color={"gray.500"}>
          Source:{" "}
          <a
            href={
              "https://www.cdc.gov/poxvirus/monkeypox/response/2022/world-map.html"
            }
          >
            CDC.gov
          </a>
          . Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Box>
    </>
  );
};

export default memo(WorldMapChart);
