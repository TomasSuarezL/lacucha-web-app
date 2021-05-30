import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Usuario } from "../../types/Usuario.type";

interface UsuariosTableProps {
  usuarios: Usuario[];
}

export const UsuariosTable: React.FC<UsuariosTableProps> = ({ usuarios }) => {
  return (
    <Box boxShadow="xl" bg="white" w="full">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th display={["none", "none", "none", "table-cell"]}>Email</Th>
            <Th display={["none", "none", "none", "table-cell"]} isNumeric>
              Peso
            </Th>
            <Th display={["none", "none", "none", "table-cell"]} isNumeric>
              Altura
            </Th>
            <Th>Nivel</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usuarios.map((u) => (
            <Link key={u.uuid} href={`/usuarios/${u.uuid}`}>
              <Tr cursor="pointer" _hover={{ bg: "gray.100" }}>
                <Td>{`${u.nombre} ${u.apellido}`}</Td>
                <Td display={["none", "none", "none", "table-cell"]}>{u.email}</Td>
                <Td display={["none", "none", "none", "table-cell"]} isNumeric>
                  {u.peso}
                </Td>
                <Td display={["none", "none", "none", "table-cell"]} isNumeric>
                  {u.altura}
                </Td>
                <Td>{u.nivel.descripcion}</Td>
              </Tr>
            </Link>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
