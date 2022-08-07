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

import { usePapaParse } from "react-papaparse";
import { csv2json } from "csvjson-csv2json";
import * as CSV from "csv-string";

export default function WorldTrends() {
  const [data, setData] = useState([]);
  const { readRemoteFile } = usePapaParse();

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/owid/notebooks/main/EdouardMathieu/monkeypox/owid-monkeypox-data.csv";

    const fetchData = async () => {
      try {
        //  const response = await fetch(url);
        //  const csv = await response;
        readRemoteFile(url, {
          complete: (results) => {
            setData(csv2json(CSV.stringify(results)));
            console.log(data);
          },
        });
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
