import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Heading, Stack, Center, Box, Text } from "@chakra-ui/react";

import { usePapaParse } from "react-papaparse";
import { csv2json } from "csvjson-csv2json";
import * as CSV from "csv-string";

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);

  const { readRemoteFile } = usePapaParse();

  useEffect(() => {
    const url =
      "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-by-Country.csv ";

    const fetchData = async () => {
      try {
        readRemoteFile(url, {
          complete: (results) => {
            console.log("---------------------------");
            console.log("Results:", csv2json(CSV.stringify(results.data)));
            setData(csv2json(CSV.stringify(results.data)));
            console.log("---------------------------");
            console.log(data.cases);
          },
        });
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
          <Heading as="h2" mb={5}>
            Global confirmed cases
          </Heading>
        </Center>
      </Box>
      <div data-tip="">
        <ComposableMap projection="geoMercator">
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
                    .domain([0, 1000])
                    .range(["#ebf7f9", "#189ed3"]);

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
                      style={{
                        default: {
                          fill: d ? colorScale(`${d.Cases}`) : "#e0f2f7",
                          outline: "none",
                        },
                        hover: {
                          fill: d ? colorScale(`${d.Cases}`) : "#e0f2f7",
                          outline: "none",
                        },
                        pressed: {
                          fill: d ? colorScale(`${d.Cases}`) : "#e0f2f7",
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

export default memo(MapChart);
