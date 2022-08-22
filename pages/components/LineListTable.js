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
import { json } from "d3-fetch";

export default function LineListTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.csv`;

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
            <Th>Id</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map(({ ID, Location }) => (
              <Tr key={ID}>
                <Td>{ID}</Td>
                <Td>{Location}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
