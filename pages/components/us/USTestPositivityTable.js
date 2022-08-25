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
  Text,
  Center,
  Heading,
} from "@chakra-ui/react";

import { csv } from "csvtojson";
import { json } from "d3-fetch";

export default function USTestPositivityTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const date = Math.floor(new Date().getDate() / 1000);
    const url = `https://www.cdc.gov/wcms/vizdata/poxvirus/monkeypox/data/labs/MPX_Lab_Data_Pos_Neg_Rate.csv?v=${date} `;

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
    <>
      <Center>
        <Heading as="h2" size="md" m={10}>
          Monkeypox positivity: Tabular data
        </Heading>
      </Center>
      <TableContainer maxHeight={400} overflowY="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Week</Th>
              <Th isNumeric>Positive</Th>
              <Th isNumeric>Negative</Th>
              <Th isNumeric>Total</Th>
              <Th isNumeric>Positivity Rate</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.map(
                ({
                  Week,
                  Positive,
                  Negative,
                  Total,
                  ["Positivity Rate"]: PostivityRate,
                }) => (
                  <Tr key={Week}>
                    <Td>{Week}</Td>
                    <Td isNumeric>{parseInt(Positive).toLocaleString()}</Td>
                    <Td isNumeric>{parseInt(Negative).toLocaleString()}</Td>
                    <Td isNumeric>{parseInt(Total).toLocaleString()}</Td>
                    <Td isNumeric>{PostivityRate}</Td>
                  </Tr>
                )
              )}
          </Tbody>
        </Table>
      </TableContainer>
      <Center>
        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a
            href={
              "https://www.cdc.gov/poxvirus/monkeypox/response/2022/2022-lab-test.html"
            }
          >
            US CDC
          </a>
          . Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Center>
    </>
  );
}
