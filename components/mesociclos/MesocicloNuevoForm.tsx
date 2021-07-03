import { Flex, Spacer, VStack, Spinner, Text, Button, Heading } from "@chakra-ui/react";
import { plainToClass } from "class-transformer";
import React, { useEffect, useState } from "react";
import { usePlantillas } from "../../hooks/usePlantillas";
import { Ejercicio } from "../../models/Ejercicio";
import {
  Mesociclo,
  Objetivo,
  Objetivos,
  Organizacion,
  Organizaciones,
} from "../../models/Mesociclo";
import { Plantilla } from "../../models/Plantilla";
import { Sesion } from "../../models/Sesion";
import { SaveButton } from "../shared/Buttons";
import {
  RadioCardsLabeled,
  NumberInputLabeled,
  EjercicioSelectLabeled,
  SelectLabeled,
} from "../shared/Inputs";
import { SesionesTable } from "./SesionTable";

export interface MesocicloNuevoFormProps {
  mesociclo: Mesociclo;
  setMesociclo: React.Dispatch<React.SetStateAction<Mesociclo>>;
  semana: Sesion[];
  setSemana: React.Dispatch<React.SetStateAction<Sesion[]>>;
  onClickSesion: (sesion: Sesion) => void;
  onSave: () => void;
}

export const MesocicloNuevoForm: React.FC<MesocicloNuevoFormProps> = ({
  mesociclo,
  setMesociclo,
  semana,
  setSemana,
  onClickSesion,
  onSave,
}) => {
  const { data: plantillas, isLoading, error, isError } = usePlantillas();
  const [formValido, setFormValido] = useState<Boolean>(true);
  const [loadingSesiones, setLoadingSesiones] = useState<Boolean>(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null);

  const onMesocicloChange = (
    key: string,
    value: string | number | Objetivo | Organizacion | Ejercicio
  ) => {
    setMesociclo(plainToClass(Mesociclo, { ...mesociclo, [key]: value }));
  };

  const onMesocicloSemanaGenerar = async () => {
    if (
      mesociclo.objetivo &&
      mesociclo.organizacion &&
      mesociclo.sesionesPorSemana &&
      mesociclo.semanasPorMesociclo &&
      mesociclo.principalTrenSuperior &&
      mesociclo.principalTrenInferior
    ) {
      // Crear las sesiones de una semana (que despues se van a repetir durante el mesociclo)
      // Por ahora se crean con ejercicios random
      setLoadingSesiones(true);
      let _semana = await mesociclo.generarSemana();
      semana && setMesociclo(plainToClass(Mesociclo, { ...mesociclo, sesiones: null }));
      setSemana(_semana);
      !formValido && setFormValido(true);
      setLoadingSesiones(false);
    } else {
      setFormValido(false);
    }
  };

  const onMesocicloSesionesGenerar = async () => {
    const _sesiones = mesociclo.generarSesiones(semana);
    setMesociclo(plainToClass(Mesociclo, { ...mesociclo, sesiones: _sesiones }));
  };

  const onChangePlantilla = (ev) => {
    const _plantilla = plantillas.filter((p) => p.idPlantilla.toString() === ev.target.value)[0];
    setSelectedPlantilla(_plantilla);
    setMesociclo(
      plainToClass(Mesociclo, {
        ...mesociclo,
        ..._plantilla,
        sesiones: null,
      })
    );
    _plantilla && setSemana(mesociclo.generarSemanaDesdePlantilla(_plantilla));
  };

  return (
    <Flex direction="column">
      <Heading as="h4" fontSize={["xl", "2xl"]} mx={[2]}>
        Nuevo Mesociclo
      </Heading>
      <Spacer p={[1, 2]} />
      <VStack m={[1, 2]} spacing={[1, 2, 3]} align="start">
        {!isLoading && (
          <SelectLabeled
            label={"Plantilla"}
            value={selectedPlantilla?.idPlantilla || 0}
            onChange={onChangePlantilla}
            options={plantillas.map((p) => ({
              key: p.idPlantilla,
              value: p.idPlantilla,
              description: p.nombre,
            }))}
            defaultOption={"Ninguna"}
          />
        )}
        <RadioCardsLabeled
          label={"Objetivo"}
          options={Objetivos.map((o) => o.descripcion)}
          onChangeHandler={(v: string) =>
            onMesocicloChange("objetivo", Objetivos.filter((o) => o.descripcion === v)[0])
          }
          isInvalid={!mesociclo.objetivo}
          selectedValue={mesociclo.objetivo?.descripcion}
        />
        <RadioCardsLabeled
          label={"Organización"}
          options={Organizaciones.map((o) => o.descripcion)}
          onChangeHandler={(v: string) =>
            onMesocicloChange("organizacion", Organizaciones.filter((o) => o.descripcion === v)[0])
          }
          isInvalid={!mesociclo.organizacion}
          selectedValue={mesociclo.organizacion?.descripcion}
        />
        <Flex direction={["column", "row"]}>
          <NumberInputLabeled
            label="Sesiones por Semana"
            value={mesociclo.sesionesPorSemana}
            onChangeNumber={(_s, v) => onMesocicloChange("sesionesPorSemana", v)}
            step={1}
            maxWidth={["10rem", "15rem"]}
            min={0}
          />
          <Spacer p={[1, 2]} />
          <NumberInputLabeled
            label="Semanas por Mesociclo"
            value={mesociclo.semanasPorMesociclo}
            onChangeNumber={(_s, v) => onMesocicloChange("semanasPorMesociclo", v)}
            step={1}
            maxWidth={["10rem", "15rem"]}
            min={0}
          />
        </Flex>
        <Flex direction={["column", "column", "row"]} w="full">
          <EjercicioSelectLabeled
            label="Ejercicio Tren Superior Principal"
            ejercicio={mesociclo.principalTrenSuperior}
            onChangeHandler={(ejercicio) => onMesocicloChange("principalTrenSuperior", ejercicio)}
            patrones={["Empuje", "Tracción"]}
            w="full"
          />
          <Spacer p={[1, 2]} />
          <EjercicioSelectLabeled
            label="Ejercicio Tren Inferior Principal"
            ejercicio={mesociclo.principalTrenInferior}
            onChangeHandler={(ejercicio) => onMesocicloChange("principalTrenInferior", ejercicio)}
            patrones={["Rodilla", "Cadera"]}
            w="full"
          />
        </Flex>
      </VStack>
      <Spacer p={[1]} />
      {loadingSesiones ? (
        <Flex justify="center" w="full">
          <Spinner />
        </Flex>
      ) : (
        <Flex direction="column">
          <Flex direction="row" align="center">
            <Text>Generar Semana: </Text>
            <Button onClick={() => onMesocicloSemanaGenerar()} size="sm" m={[1, 2]}>
              {"Aleatoria"}
            </Button>
            {!formValido && <Text>Uno o mas campos son incorrectos.</Text>}
          </Flex>
          {mesociclo.sesiones?.length > 0 ? (
            <Flex my={[2, 3]} direction="column">
              <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
                Sesiones
              </Text>
              <Spacer p={[1, 2]} />
              <SesionesTable sesiones={mesociclo.sesiones} setSesion={() => {}} />
              <Spacer p={[2]} />
              <SaveButton onClick={onSave}>Crear Mesociclo</SaveButton>
            </Flex>
          ) : (
            semana && (
              <Flex my={[2, 3]} direction="column">
                <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
                  Sesiones por Semana
                </Text>
                <Spacer p={[1, 2]} />
                <SesionesTable
                  sesiones={semana}
                  setSesion={(sesion: Sesion) => onClickSesion(sesion)}
                />
                <Spacer p={[2]} />
                <SaveButton onClick={() => onMesocicloSesionesGenerar()}>Crear Sesiones</SaveButton>
              </Flex>
            )
          )}
        </Flex>
      )}
    </Flex>
  );
};
