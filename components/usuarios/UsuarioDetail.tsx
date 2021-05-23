import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Select,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { UsuarioMesociclos } from "./UsuarioMesociclos";
import { Niveles, Usuario } from "../../types/Usuario.type";
import { InputLabeled, NumberInputLabeled, SelectLabeled } from "../shared/Inputs";
import { MesocicloDetail } from "../mesociclos/MesocicloDetail";
import { Mesociclo } from "../../models/Mesociclo";
import { SaveButton } from "../shared/Buttons";

interface UsuarioDatosProps {
  usuarioEdit: Usuario;
  setUsuarioEdit: React.Dispatch<React.SetStateAction<Usuario>>;
  setMesociclo: React.Dispatch<React.SetStateAction<Mesociclo>>;
  onClickCloseUsuario: () => void;
}

const UsuarioDatos = ({
  usuarioEdit,
  setUsuarioEdit,
  onClickCloseUsuario,
  setMesociclo,
}: UsuarioDatosProps) => {
  const onChangeNivel = (value: string) => {
    setUsuarioEdit({ ...usuarioEdit, nivel: Niveles.filter((n) => n.idNivel.toString() === value)[0] });
  };

  return (
    <Flex direction="column" m={[1, 6]} p={[3, 4, 6]} bg="white" boxShadow="lg">
      <Flex direction="row" justify="flex-end" m={[2, 3]}>
        <Text fontSize={["xl", "2xl"]} mx={[2, 2, 6]}>
          Datos{" "}
        </Text>
        <Spacer />
        <CloseButton colorScheme="gray" size="md" variant="ghost" onClick={onClickCloseUsuario}></CloseButton>
      </Flex>
      <Flex direction={["column", "column", "row"]}>
        {/* Columna Avatar + Email + username + Nivel */}
        <Flex direction="column" p={[1, 1, 4]} align="center">
          <Avatar size="2xl" m={[1, 2, 3]} name={usuarioEdit.nombre} src={usuarioEdit.imgUrl}></Avatar>
          <Spacer p={[1, 1]} />
          <Text fontWeight="bold" fontSize={["xs", "sm"]}>
            {usuarioEdit.email}
          </Text>
          <Text fontWeight="ligth" fontSize={["xs", "sm"]} as="em">
            {usuarioEdit.username}
          </Text>
          <Spacer p={[1, 1]} />
          <SelectLabeled
            label="Nivel"
            value={usuarioEdit.nivel.idNivel}
            onChange={(e) => onChangeNivel(e.target.value)}
            options={Niveles.map((n) => ({
              key: n.descripcion,
              value: n.idNivel,
              description: n.descripcion,
            }))}
          />
        </Flex>
        {/* Columna Datos */}
        <Stack direction="column" p={[1, 1, 4]} flex="1" spacing={[1, 2]}>
          {/* Nombre + Apellido */}
          <Flex direction={["column", "column", "row"]} w="full">
            <InputLabeled
              value={usuarioEdit.nombre}
              onChange={(e) => setUsuarioEdit((u: Usuario) => ({ ...u, nombre: e.target.value }))}
              label="Nombre"
            ></InputLabeled>
            <Spacer p={[0, 0, 3]} my={[1, 1, 0]} />
            <InputLabeled
              value={usuarioEdit.apellido}
              onChange={(e) => setUsuarioEdit((u: Usuario) => ({ ...u, apellido: e.target.value }))}
              label="Apellido"
            ></InputLabeled>
          </Flex>
          {/* Genero + Peso + Altura*/}
          <Flex direction={["column", "column", "row"]} w="full">
            <InputLabeled value={usuarioEdit.genero.descripcion} label="Genero" isReadOnly></InputLabeled>
            <Spacer p={[0, 0, 3]} my={[1, 1, 0]} />
            <NumberInputLabeled
              value={usuarioEdit.peso}
              onChangeNumber={(_s: string, v: number) => setUsuarioEdit((u) => ({ ...u, peso: v }))}
              step={0.5}
              label="Peso (Kg.)"
            ></NumberInputLabeled>
            <Spacer p={[0, 0, 3]} my={[1, 1, 0]} />
            <NumberInputLabeled
              value={usuarioEdit.altura}
              onChangeNumber={(_s: string, v: number) => setUsuarioEdit((u) => ({ ...u, altura: v }))}
              step={0.01}
              label="Altura (m.)"
            ></NumberInputLabeled>
          </Flex>
          {/* Fecha Nacimiento + Fecha Alta */}
          <Flex direction={["column", "column", "row"]} w="full">
            <InputLabeled
              value={
                usuarioEdit.fechaNacimiento ? new Date(usuarioEdit.fechaNacimiento)?.toLocaleString() : "-"
              }
              label="Fecha Nacimiento"
              isReadOnly
            ></InputLabeled>
            <Spacer p={[0, 0, 3]} my={[1, 1, 0]} />
            <InputLabeled
              value={new Date(usuarioEdit.creadoEn)?.toLocaleString()}
              label="Fecha Alta"
              isReadOnly
            ></InputLabeled>
          </Flex>
        </Stack>
      </Flex>
      <SaveButton onClick={() => {}}>Guardar Datos</SaveButton>
      <Divider my={[1, 2, 4]} />
      <UsuarioMesociclos usuario={usuarioEdit} setMesociclo={setMesociclo} />
      {/* Controles Atras + Guardar */}
    </Flex>
  );
};

interface UsuarioDetailProps {
  usuario: Usuario;
  onClickCloseUsuario: () => void;
}

export const UsuarioDetail: React.FC<UsuarioDetailProps> = ({ usuario, onClickCloseUsuario }) => {
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario>(usuario);
  const [mesociclo, setMesociclo] = useState<Mesociclo | null>(null);

  return (
    <Flex direction="column" flex="1">
      {!mesociclo ? (
        <UsuarioDatos
          usuarioEdit={usuarioEdit}
          setUsuarioEdit={setUsuarioEdit}
          onClickCloseUsuario={onClickCloseUsuario}
          setMesociclo={setMesociclo}
        />
      ) : (
        <MesocicloDetail
          mesociclo={mesociclo}
          onClickCloseMesociclo={() => setMesociclo(null)}
        ></MesocicloDetail>
      )}
    </Flex>
  );
};
