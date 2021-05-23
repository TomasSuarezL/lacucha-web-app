import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import React from "react";
import { Usuario } from "../../types/Usuario.type";

interface UsuariosTableProps {
  usuarios: Usuario[];
  setUsuario: React.Dispatch<React.SetStateAction<Usuario>>;
}

export const UsuariosTable: React.FC<UsuariosTableProps> = ({ usuarios, setUsuario }) => {
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
            <Tr key={u.uuid} cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => setUsuario(u)}>
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
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
