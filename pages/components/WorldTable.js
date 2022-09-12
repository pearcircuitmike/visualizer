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

import { csv } from "csvtojson";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [didLoad, setDidLoad] = useState(false);

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

  return (
    <TableContainer maxHeight={400} overflowY="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Country</Th>
            <Th>New Cases</Th>
            <Th>Total Cases</Th>
            <Th>New Cases/Mil</Th>
            <Th>Total Cases/Mil</Th>
            <Th>Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map(
              ({
                location,
                date,
                new_cases,
                total_cases,
                new_cases_per_million,
                total_cases_per_million,
              }) => (
                <Tr key={location}>
                  <Td>{location}</Td>
                  <Td>{~~new_cases}</Td>
                  <Td>{~~total_cases}</Td>
                  <Td>{new_cases_per_million}</Td>
                  <Td>{total_cases_per_million}</Td>
                  <Td>{date}</Td>
                </Tr>
              )
            )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
