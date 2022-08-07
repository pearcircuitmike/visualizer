import * as React from "react";
import { useState, useEffect, useMemo } from "react";
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

import { useTable, useSortBy } from "react-table";

export default function DataTable() {
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
    <TableContainer>
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
