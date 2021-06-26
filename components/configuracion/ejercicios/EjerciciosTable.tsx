import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import React from "react";
import { Ejercicio } from "../../../models/Ejercicio";

interface EjerciciosTableProps {
  ejercicios: Ejercicio[];
  onClickEjercicio: (ejercicio: Ejercicio) => void;
}

export const EjerciciosTable: React.FC<EjerciciosTableProps> = ({
  ejercicios,
  onClickEjercicio,
}) => {
  return (
    <Box boxShadow="xl" bg="white" w="full" overflow="auto" flex="1">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Patron</Th>
            <Th display={["none", "none", "none", "table-cell"]} isNumeric>
              Peso Inicial
            </Th>
            <Th display={["none", "none", "none", "table-cell"]}>Es Temporal</Th>
            <Th display={["none", "none", "none", "none", "table-cell"]}>URL</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ejercicios.map((e) => (
            <Tr
              key={e.idEjercicio}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={(_e) => onClickEjercicio(e)}
            >
              <Td whiteSpace="nowrap">{e.nombre}</Td>
              <Td>{e.patron}</Td>
              <Td display={["none", "none", "none", "table-cell"]} isNumeric>
                {e.pesoInicial} Kg.
              </Td>
              <Td display={["none", "none", "none", "table-cell"]}>{e.esTemporal ? "Si" : "No"}</Td>
              <Td
                maxWidth={["19rem"]}
                whiteSpace="nowrap"
                overflow="hidden"
                wordBreak="break-all"
                textOverflow="ellipsis"
                display={["none", "none", "none", "none", "table-cell"]}
              >
                {e.urlVideo}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
