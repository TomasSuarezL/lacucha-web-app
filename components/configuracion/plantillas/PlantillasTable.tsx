import { Box, Table, Thead, Tr, Th, Tbody, Td, CloseButton } from "@chakra-ui/react";
import React from "react";
import { Plantilla } from "../../../models/Plantilla";

interface PlantillasTableProps {
  plantillas: Plantilla[];
  onClickPlantilla: (plantilla: Plantilla) => void;
  onClickDeletePlantilla: (plantilla: Plantilla) => void;
}

export const PlantillasTable: React.FC<PlantillasTableProps> = ({
  plantillas,
  onClickPlantilla,
  onClickDeletePlantilla,
}) => {
  return (
    <Box boxShadow="xl" bg="white" w="full" overflow="auto" flex="1">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Nivel</Th>
            <Th display={["none", "none", "none", "table-cell"]}>Objetivo</Th>
            <Th display={["none", "none", "none", "table-cell"]}>Organizacion</Th>
            <Th display={["none", "none", "none", "none", "table-cell"]} isNumeric>
              Sesiones Por Semana
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {plantillas.map((p) => (
            <Tr
              key={p.idPlantilla}
              cursor="pointer"
              role="group"
              _hover={{ bg: "gray.100" }}
              onClick={(_e) => onClickPlantilla(p)}
            >
              <Td whiteSpace="nowrap">{p.nombre}</Td>
              <Td>{p.nivel?.descripcion}</Td>
              <Td display={["none", "none", "none", "table-cell"]}>{p.objetivo?.descripcion}</Td>
              <Td display={["none", "none", "none", "table-cell"]}>
                {p.organizacion?.descripcion}
              </Td>
              <Td display={["none", "none", "none", "none", "table-cell"]} isNumeric>
                {p.sesionesPorSemana}
              </Td>
              <Td opacity={[0]} _groupHover={{ opacity: 1 }}>
                <CloseButton size={"sm"} onClick={() => onClickDeletePlantilla(p)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
