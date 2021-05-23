import { Box, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { useMesociclos } from "../../hooks/useMesociclos";
import { Mesociclo } from "../../models/Mesociclo";
import { Usuario } from "../../types/Usuario.type";

const MesociclosTable = ({ mesociclos, setMesociclo }) => {
  return (
    <Box w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Fecha Fin</Th>
            <Th>Estado</Th>
            <Th display={["none", "none", "none", "table-cell"]}>Nivel</Th>
            <Th display={["none", "none", "none", "none", "none", "table-cell"]}>Objetivo</Th>
            <Th display={["none", "none", "none", "none", "none", "table-cell"]}>Organizacion</Th>
            <Th display={["none", "none", "none", "table-cell"]} isNumeric>
              Duracion (semanas)
            </Th>
            <Th display={["none", "none", "none", "table-cell"]} isNumeric>
              Sesiones Por Semana
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {mesociclos.map((m) => (
            <Tr
              key={m.idMesociclo}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => setMesociclo(m)}
            >
              <Td>{new Date(m.creadoEn).toLocaleDateString()}</Td>
              <Td>{m.fechaFinReal ? new Date(m.fechaFinReal).toLocaleDateString() : "-"}</Td>
              <Td>{m.estado.descripcion}</Td>
              <Td display={["none", "none", "none", "table-cell"]}>{m.nivel.descripcion}</Td>
              <Td whiteSpace="nowrap" display={["none", "none", "none", "none", "none", "table-cell"]}>
                {m.objetivo.descripcion}
              </Td>
              <Td whiteSpace="nowrap" display={["none", "none", "none", "none", "none", "table-cell"]}>
                {m.organizacion.descripcion}
              </Td>
              <Td display={["none", "none", "none", "table-cell"]} isNumeric>
                {m.semanasPorMesociclo}
              </Td>
              <Td display={["none", "none", "none", "table-cell"]} isNumeric>
                {m.sesionesPorSemana}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

interface UsuarioMesociclosProps {
  usuario: Usuario;
  setMesociclo: React.Dispatch<React.SetStateAction<Mesociclo>>;
}

export const UsuarioMesociclos: React.FC<UsuarioMesociclosProps> = ({ usuario, setMesociclo }) => {
  const { isLoading, isFetching, isSuccess, data, isError, error } = useMesociclos(usuario.idUsuario);

  console.log(data);

  return (
    <Flex direction="column" m={[1, 2]} p={[1, 2, 3]} align="center">
      <Text fontSize={["xl", "2xl"]} mx={[2, 2, 6]} alignSelf="flex-start">
        Mesociclos{" "}
      </Text>
      {isLoading ? (
        <Spinner m={[2, 3, 4]} size="lg" />
      ) : (
        <>
          <Flex direction={["column", "column", "row"]} w="full" p={[2, 3, 4]}>
            <MesociclosTable mesociclos={data} setMesociclo={setMesociclo} />
          </Flex>
        </>
      )}
    </Flex>
  );
};
