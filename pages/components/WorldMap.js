import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const colorScale = scaleLinear().domain([0, 500]).range(["#ebf7f9", "#189ed3"]);

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      "https://www.cdc.gov/poxvirus/monkeypox/modules/data-viz/mpx_confirmed_cases_data_bites_prod.json?v=2022-01-01T23%3A00%3A00.000Z ";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json.data);
        console.log(json.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

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
                  setTooltipContent(`${geo.properties.name} ${data[0].Cases}`);
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
