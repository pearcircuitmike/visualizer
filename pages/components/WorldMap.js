import React, { memo, useEffect, useState } from "react";

import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { usePapaParse } from "react-papaparse";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy } from "react-table";

const colorScale = scaleLinear().domain([0, 500]).range(["#ebf7f9", "#189ed3"]);

const MapChart = ({ setTooltipContent }) => {
  return (
    <div data-tip="">
      <ComposableMap projection="geoMercator">
        <Geographies geography="/features.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                stroke="#ffffff"
                strokeWidth={1}
                onMouseEnter={() => {
                  setTooltipContent(`${geo.properties.name} `);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                style={{
                  default: {
                    fill:
                      `${geo.properties.cases}` >= 0
                        ? colorScale(`${geo.properties.cases}`)
                        : "#e0f2f7",
                    outline: "none",
                  },
                  hover: {
                    fill:
                      `${geo.properties.cases}` >= 0
                        ? colorScale(`${geo.properties.cases}`)
                        : "#e0f2f7",
                    outline: "none",
                  },
                  pressed: {
                    fill:
                      `${geo.properties.cases}` >= 0
                        ? colorScale(`${geo.properties.cases}`)
                        : "#e0f2f7",
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
