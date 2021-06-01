import { Flex, Spacer, VStack, Spinner, Text, Button } from "@chakra-ui/react";
import { plainToClass } from "class-transformer";
import React, { useState } from "react";
import {
  Ejercicio,
  Mesociclo,
  Objetivo,
  Objetivos,
  Organizacion,
  Organizaciones,
  Sesion,
} from "../../models/Mesociclo";
import { SaveButton } from "../shared/Buttons";
import { RadioCardsLabeled, NumberInputLabeled, EjercicioSelectLabeled } from "../shared/Inputs";
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
  const [formValido, setFormValido] = useState<Boolean>(true);
  const [loadingSesiones, setLoadingSesiones] = useState<Boolean>(false);

  console.log(mesociclo);

  const onMesocicloChange = (key: string, value: string | number | Objetivo | Organizacion | Ejercicio) => {
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
      // Crear meso
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

  return (
    <Flex direction="column">
      <Text fontSize={["xl", "2xl"]} mx={[2]}>
        Nuevo Mesociclo
      </Text>
      <Spacer p={[1, 2]} />
      <VStack m={[1, 2]} spacing={[1, 2, 3]} align="start">
        <RadioCardsLabeled
          label={"Objetivo"}
          options={Objetivos.map((o) => o.descripcion)}
          onChangeHandler={(v: string) =>
            onMesocicloChange("objetivo", Objetivos.filter((o) => o.descripcion === v)[0])
          }
          isInvalid={!mesociclo.objetivo}
        />
        <RadioCardsLabeled
          label={"Organización"}
          options={Organizaciones.map((o) => o.descripcion)}
          onChangeHandler={(v: string) =>
            onMesocicloChange("organizacion", Organizaciones.filter((o) => o.descripcion === v)[0])
          }
          isInvalid={!mesociclo.organizacion}
        />
        <Flex direction={["column", "row"]}>
          <NumberInputLabeled
            label="Semanas por Mesociclo"
            value={mesociclo.semanasPorMesociclo}
            onChangeNumber={(_s, v) => onMesocicloChange("semanasPorMesociclo", v)}
            step={1}
            maxWidth={["10rem", "15rem"]}
            min={0}
          />
          <Spacer p={[1, 2]} />
          <NumberInputLabeled
            label="Sesiones por Semana"
            value={mesociclo.sesionesPorSemana}
            onChangeNumber={(_s, v) => onMesocicloChange("sesionesPorSemana", v)}
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
            <Button onClick={() => onMesocicloSemanaGenerar()} size="sm" m={[1, 2]}>
              {semana ? "Recrear Semana" : "Crear Semana"}
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
                  Sesiones
                </Text>
                <Spacer p={[1, 2]} />
                <SesionesTable sesiones={semana} setSesion={(sesion: Sesion) => onClickSesion(sesion)} />
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
