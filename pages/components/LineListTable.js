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
  Progress,
} from "@chakra-ui/react";

import { csv } from "csvtojson";
import { json } from "d3-fetch";

export default function LineListTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isPageLoaded, setIsPageLoaded] = useState(false); //this helps

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsPageLoaded(true);
      const url = `https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.csv`;

      const fetchData = async () => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const jsonArray = await csv().fromString(text);
          setData(jsonArray);
          setLoading(false);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
    }
  }, [isLoaded]);

  return (
    <>
      {loading && (
        <>
          <Progress isIndeterminate />
          <Text>
            Loading... Please be patient as this page can take up to several
            minutes to load.
          </Text>
        </>
      )}
      {!loading && (
        <TableContainer overflowY="auto">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>City</Th>
                <Th>Country</Th>
                <Th>Age</Th>
                <Th>Gender</Th>
                <Th>Date_confirmation</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data &&
                data.map(
                  ({ ID, City, Country, Age, Gender, Date_confirmation }) => (
                    <Tr key={ID}>
                      <Td>{City}</Td>
                      <Td>{Country}</Td>
                      <Td>{Age}</Td>
                      <Td>{Gender}</Td>
                      <Td>{Date_confirmation}</Td>
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
