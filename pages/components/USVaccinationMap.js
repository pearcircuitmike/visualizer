import React, { memo, useEffect, useState } from "react";
import { geoCentroid } from "d3-geo";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Box, Text, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { csv } from "csvtojson";

import { colors } from "../../styles/colors.js";
import allStates from "../../public/allstates.json";

const USVaccinationMapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/Vaccines/mpx_vaccine_Jurisdiction%20map.csv`;

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
    }
  }, [isLoaded, useRouter().asPath]);

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  return (
    <Box mt={10}>
      <Box textAlign={"center"}>
        <Heading as="h2" size="lg">
          US total vaccine doses administered/mil
        </Heading>
        <Text size="md">Click on a state to view more details</Text>
      </Box>
      <div data-tip="">
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find((s) => s.val === geo.id);

                const d = data.find(
                  (s) => s[`Reporting Jurisdictions`] === geo.properties.name
                );
                const colorScale = scaleLinear()
                  .domain([0, 3000])
                  .range([colors.aquamarine, colors.spaceCadet]);

                return (
                  <Geography
                    key={geo.properties.name}
                    geography={geo}
                    stroke="#ffffff"
                    strokeWidth={1}
                    onMouseEnter={() => {
                      d.Total
                        ? setTooltipContent(
                            `${geo.properties.name}: ${parseInt(
                              d.Total.replace(/,/g, "")
                            ).toLocaleString()} vaccinations (${parseInt(
                              (1000000 * parseInt(d.Total.replace(/,/g, ""))) /
                                cur.pop
                            ).toLocaleString()}/mil)`
                          )
                        : setTooltipContent(`${geo.properties.name}: 0`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      d
                        ? router.push(`/usstates/${geo.properties.name}`)
                        : console.log("none");
                    }}
                    style={{
                      default: {
                        fill: d
                          ? colorScale(
                              `${
                                d.Total
                                  ? parseInt(
                                      (1000000 *
                                        parseInt(d.Total.replace(/,/g, ""))) /
                                        cur.pop
                                    )
                                  : 0
                              }`
                            )
                          : colors.yellowGreenPale,
                        outline: "none",
                      },
                      hover: {
                        fill: colors.blueMunsell,
                      },
                      pressed: {
                        fill: d
                          ? colorScale(
                              `${
                                d.Total
                                  ? parseInt(
                                      (1000000 *
                                        parseInt(d.Total.replace(/,/g, ""))) /
                                        cur.pop
                                    )
                                  : 0
                              }`
                            )
                          : colors.yellowGreen,
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
    </Box>
  );
};

export default memo(USVaccinationMapChart);
