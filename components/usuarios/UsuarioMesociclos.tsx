import {
  Box,
  Button,
  Flex,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMesociclos } from "../../hooks/useMesociclos";
import { Mesociclo } from "../../models/Mesociclo";
import { Usuario } from "../../types/Usuario.type";

interface MesocicloTableProps {
  mesociclos: Mesociclo[];
  setMesociclo: React.Dispatch<React.SetStateAction<Mesociclo>>;
}

const MesociclosTable: React.FC<MesocicloTableProps> = ({ mesociclos, setMesociclo }) => {
  return (
    <Box w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Fecha Inicio</Th>
            <Th display={["table-cell", "none", "table-cell"]}>Fecha Fin</Th>
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
          {mesociclos.map((m: Mesociclo) => (
            <Tr
              key={m.idMesociclo}
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => setMesociclo(m)}
            >
              <Td>{m.getFechaInicio().toLocaleDateString()}</Td>
              <Td display={["table-cell", "none", "table-cell"]}>
                {m.fechaFinReal ? new Date(m.fechaFinReal).toLocaleDateString() : "-"}
              </Td>
              <Td>{m.estado.descripcion}</Td>
              <Td display={["none", "none", "none", "table-cell"]}>{m.nivel.descripcion}</Td>
              <Td
                whiteSpace="nowrap"
                display={["none", "none", "none", "none", "none", "table-cell"]}
              >
                {m.objetivo.descripcion}
              </Td>
              <Td
                whiteSpace="nowrap"
                display={["none", "none", "none", "none", "none", "table-cell"]}
              >
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
  const { isLoading, isFetching, isSuccess, data, isError, error } = useMesociclos(
    usuario.idUsuario
  );

  return (
    <Flex direction="column" p={[1, 2]} align="center">
      <Flex
        direction={["column", "column", "row"]}
        align={["flex-start", "flex-start", , "center"]}
        w="full"
        m={[1]}
      >
        <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
          Mesociclos{" "}
        </Text>
        <Spacer />
        <Link href={`/usuarios/${usuario.uuid}/nuevoMesociclo`}>
          <Button size="sm" mx={[1, 2]}>
            <AiOutlinePlus /> <Text ml={[1]}>Crear Mesociclo</Text>
          </Button>
        </Link>
      </Flex>
      {isLoading ? (
        <Spinner m={[2, 3, 4]} size="lg" />
      ) : (
        <>
          <Flex direction={["column", "column", "row"]} w="full" p={[1, 2]}>
            <MesociclosTable mesociclos={data} setMesociclo={setMesociclo} />
          </Flex>
        </>
      )}
    </Flex>
  );
};
