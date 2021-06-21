import { Stack, Button, Text, Spacer } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { PatronesMovimiento } from "../../../models/Mesociclo";
import { InputLabeled, SelectLabeled } from "../../shared/Inputs";

export interface EjerciciosControls {
  search: string;
  patron: typeof PatronesMovimiento[number] | "Todos";
}

export const EjerciciosControls = ({
  controls,
  setControls,
  onSearchClick,
  onCrearEjercicioClick,
}) => {
  return (
    <Stack
      direction={["column", "row"]}
      p={[2, 4]}
      alignItems="center"
      bg="white"
      boxShadow="xl"
      spacing={[2, 3]}
      w={["full", "auto"]}
    >
      <Stack direction={["column", "row"]}>
        <SelectLabeled
          value={controls.patron}
          label="Patron"
          options={["Todos", ...PatronesMovimiento].map((p) => ({
            key: p,
            description: p,
            value: p,
          }))}
          onChange={(e) => setControls({ ...controls, patron: e.target.value })}
          direction="row"
        />
        <InputLabeled
          value={controls.search}
          onChange={(e) => setControls({ ...controls, search: e.target.value })}
          label="Ejercicio"
          direction="row"
        />
      </Stack>
      <Spacer />
      <Button size="sm" mx={[1, 2]} onClick={(_e) => onCrearEjercicioClick()}>
        <AiOutlinePlus /> <Text ml={[1]}>Crear Ejercicio</Text>
      </Button>
    </Stack>
  );
};
