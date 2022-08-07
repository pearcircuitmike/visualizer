import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

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
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
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
                  .domain([0, 1500])
                  .range(["#ebf7f9", "#189ed3"]);
                return (
                  <Geography
                    key={geo.properties.name}
                    geography={geo}
                    stroke="#ffffff"
                    strokeWidth={1}
                    onMouseEnter={() => {
                      d
                        ? setTooltipContent(`${geo.properties.name} ${d.Cases}`)
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
  );
};

export default memo(MapChart);
