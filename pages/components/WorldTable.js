import * as React from "react";
import { useState, useEffect, useMemo } from "react";
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

  useEffect(() => {
    const url =
      "https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/MPX-Cases-by-Country.csv ";

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
    <TableContainer maxHeight={400} overflowY="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Country</Th>
            <Th>Cases</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map(({ Country, Cases }) => (
              <Tr key={Country}>
                <Td>{Country}</Td>
                <Td>{Cases}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
