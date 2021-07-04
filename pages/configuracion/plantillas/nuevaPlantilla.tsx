import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import ConfiguracionLayout from "../../../components/configuracion/ConfiguracionLayout";
import { PlantillaForm } from "../../../components/configuracion/plantillas/PlantillaForm";
import { usePlantillas } from "../../../hooks/usePlantillas";
import { Plantilla } from "../../../models/Plantilla";

export default function NuevaPlantillaPage() {
  const { createPlantillaMutation } = usePlantillas();

  return (
    <ConfiguracionLayout>
      <Flex direction="column" flex={[1]}>
        <Flex direction="column" m={[1, 6]} p={[3, 4, 6]} bg="white" boxShadow="lg" overflow="auto">
          <Flex>
            <Heading as="h4" fontSize={["xl", "2xl"]}>
              Nueva Plantilla
            </Heading>
          </Flex>
          <PlantillaForm
            onSubmitForm={(plantilla: Plantilla) => createPlantillaMutation.mutate(plantilla)}
            isLoading={createPlantillaMutation.isLoading}
          />
        </Flex>
      </Flex>
    </ConfiguracionLayout>
  );
}
