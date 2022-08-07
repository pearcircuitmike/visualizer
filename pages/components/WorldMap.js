import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

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
                  .domain([0, 3000])
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
