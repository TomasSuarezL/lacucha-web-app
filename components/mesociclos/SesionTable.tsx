import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import React from "react";
import { Sesion } from "../../models/Mesociclo";

export interface SesionTableProps {
  sesiones: Sesion[];
  setSesion: React.Dispatch<React.SetStateAction<Sesion>>;
}

export const SesionesTable = ({ sesiones, setSesion }: SesionTableProps) => {
  return (
    <Box w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Fecha</Th>
            <Th>Fecha Fin</Th>
            <Th display={["none", "table-cell"]} isNumeric>
              # Bloques
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sesiones.map((s) => (
            <Tr
              key={s.fechaEmpezado.toString()}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => setSesion(s)}
            >
              <Td>{s.numSesion}</Td>
              <Td>
                {s.fechaFinalizado
                  ? new Date(s.fechaEmpezado).toLocaleString()
                  : new Date(s.fechaEmpezado).toDateString()}
              </Td>
              <Td>{s.fechaFinalizado ? new Date(s.fechaFinalizado).toLocaleString() : "-"}</Td>
              <Td display={["none", "table-cell"]} isNumeric>
                {s.bloques?.length}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
