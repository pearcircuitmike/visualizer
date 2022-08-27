import React, { memo, useEffect, useState } from "react";
import { geoCentroid } from "d3-geo";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Heading, Stack, Center, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { csv } from "csvtojson";

import { colors } from "../../styles/colors.js";
import allStates from "../../public/allstates.json";

const USMapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const date = Math.floor(new Date("2012.08.10").getTime() / 1000);
    const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/USmap_counts.csv?v=${date} `;

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
  }, [useRouter().asPath]);

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
  const offsets = {
    VT: [50, -8],
    NH: [34, 2],
    MA: [30, -1],
    RI: [28, 2],
    CT: [35, 10],
    NJ: [34, 1],
    DE: [33, 0],
    MD: [47, 10],
    DC: [49, 21],
  };

  return (
    <>
      <div data-tip="">
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find((s) => s.val === geo.id);

                const d = data.find((s) => s.Location === geo.properties.name);
                const colorScale = scaleLinear()
                  .domain([0, 5400])
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
                            `${geo.properties.name}: ${parseInt(
                              d.Cases
                            ).toLocaleString()}`
                          )
                        : setTooltipContent(`${geo.properties.name}: 0`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      d
                        ? router.push(`/states/${geo.properties.name}`)
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
                        fill: d ? colorScale(`${d.Cases}`) : colors.yellowGreen,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
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

export default memo(USMapChart);
