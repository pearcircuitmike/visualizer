import * as React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
const getCountryISO2 = require("country-iso-3-to-2");
import { colors } from "../../styles/colors";
import { GrAscend, GrDescend, GrUnsorted } from "react-icons/gr";

import { csv } from "csvtojson";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [didLoad, setDidLoad] = useState(false);
  const [order, setOrder] = useState("DSC");
  const [sortedCol, setSortedCol] = useState("location");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryCasesUrl =
          "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";
        const countryCasesRes = await fetch(countryCasesUrl);
        const countryCasesText = await countryCasesRes.text();
        const countriesCases = await csv().fromString(countryCasesText);
        const sortedArray = countriesCases.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const unique = sortedArray
          .map((e) => e["iso_code"])

          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)

          // eliminate the dead keys & store unique objects
          .filter((e) => sortedArray[e])
          .map((e) => sortedArray[e]);

        const uniqueSortedAlpha = unique.sort((a, b) => {
          var locationA = a.location.toLowerCase(),
            locationB = b.location.toLowerCase();
          if (locationA < locationB)
            //sort string ascending
            return -1;
          if (locationA > locationB) return 1;
          return 0; //default return value (no sorting)
        });
        setData(uniqueSortedAlpha);

        setDidLoad(true);
      } catch (error) {
        console.log("error", error);
      }
    };
    if (!didLoad) {
      fetchData();
    }
  }, []);

  const sorting = (col, datatype) => {
    setSortedCol(col);

    if (datatype === "string") {
      if (order === "ASC") {
        const sorted = [...data].sort((a, b) =>
          a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
        );
        setData(sorted);
        setOrder("DSC");
      }
      if (order === "DSC") {
        const sorted = [...data].sort((a, b) =>
          a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
        );
        setData(sorted);
        setOrder("ASC");
      }
    }
    if (datatype === "float") {
      if (order === "ASC") {
        const sorted = [...data].sort((a, b) =>
          parseFloat(a[col]) > parseFloat(b[col]) ? 1 : -1
        );
        setData(sorted);
        setOrder("DSC");
      }
      if (order === "DSC") {
        const sorted = [...data].sort((a, b) =>
          parseFloat(a[col]) < parseFloat(b[col]) ? 1 : -1
        );
        setData(sorted);
        setOrder("ASC");
      }
    }
  };

  return (
    <TableContainer maxHeight={400} overflowY="auto">
      <Table size="sm">
        <Thead position="sticky" top={0} bgColor="white">
          <Tr>
            <Th onClick={() => sorting("location", "string")}>
              Country{" "}
              {order === "ASC" && sortedCol === "location" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "location" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("new_cases", "float")}>
              New Cases
              {order === "ASC" && sortedCol === "new_cases" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "new_cases" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("total_cases", "float")}>
              Total Cases
              {order === "ASC" && sortedCol === "total_cases" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "total_cases" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("new_deaths", "float")}>
              New Deaths
              {order === "ASC" && sortedCol === "new_deaths" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "new_deaths" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("total_deaths", "float")}>
              Total deaths
              {order === "ASC" && sortedCol === "total_deaths" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "total_deaths" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("new_cases_per_million", "float")}>
              New Cases/Mil
              {order === "ASC" && sortedCol === "new_cases_per_million" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "new_cases_per_million" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("total_cases_per_million", "float")}>
              Total Cases/Mil
              {order === "ASC" && sortedCol === "total_cases_per_million" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "total_cases_per_million" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
            <Th onClick={() => sorting("date", "string")}>
              Updated
              {order === "ASC" && sortedCol === "date" && (
                <GrAscend style={{ display: "inline" }} />
              )}
              {order === "DSC" && sortedCol === "date" && (
                <GrDescend style={{ display: "inline" }} />
              )}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map(
              ({
                location,
                date,
                iso_code,
                new_cases,
                total_cases,
                new_deaths,
                total_deaths,
                new_cases_per_million,
                total_cases_per_million,
              }) => (
                <Tr key={location}>
                  <Td>
                    <a
                      href={`/countries/${getCountryISO2(iso_code)}`}
                      style={{
                        color: `${colors.blueMunsell}`,
                        textDecoration: "underline",
                      }}
                    >
                      {location}
                    </a>
                  </Td>
                  <Td>{parseInt(new_cases).toLocaleString()}</Td>
                  <Td>{parseInt(total_cases).toLocaleString()}</Td>
                  <Td>{parseInt(new_deaths).toLocaleString()}</Td>
                  <Td>{parseInt(total_deaths).toLocaleString()}</Td>
                  <Td>{parseFloat(new_cases_per_million)}</Td>
                  <Td>{parseFloat(total_cases_per_million)}</Td>
                  <Td>{date}</Td>
                </Tr>
              )
            )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
