import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { addDays } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, useFormState, Controller } from "react-hook-form";
import { Objetivos, Organizaciones } from "../../../models/Mesociclo";
import { Plantilla, SesionXPlantilla } from "../../../models/Plantilla";
import { Sesion } from "../../../models/Sesion";
import { Niveles } from "../../../models/Usuario";
import { SesionDetail } from "../../mesociclos/SesionDetail";
import { SesionesTable } from "../../mesociclos/SesionTable";
import { SaveButton } from "../../shared/Buttons";
import {
  InputLabeled,
  NumberInputLabeled,
  RadioCardsLabeled,
  SelectLabeled,
} from "../../shared/Inputs";

interface PlantillaFormProps {
  plantilla?: Plantilla;
  onSubmitForm: (plantilla: Plantilla) => void;
  isLoading?: boolean;
}

export const PlantillaForm: React.FC<PlantillaFormProps> = ({
  plantilla,
  onSubmitForm,
  isLoading = false,
}) => {
  const router = useRouter();
  const { handleSubmit, control, watch } = useForm();
  const { errors } = useFormState({
    control,
  });
  const _form = watch(["objetivo", "organizacion"], {
    objetivo: plantilla?.objetivo.descripcion || Objetivos[0].descripcion,
    organizacion: plantilla?.organizacion.descripcion || Organizaciones[0].descripcion,
  });
  const sesionesPorSemana = watch("sesionesPorSemana", plantilla?.sesionesPorSemana || 0);
  const [sesiones, setSesiones] = useState<SesionXPlantilla[]>(plantilla?.sesiones || []);
  const [selectedSesion, setSelectedSesion] = useState<Sesion | null>(null);

  useEffect(() => {
    if (sesionesPorSemana > sesiones?.length) {
      let sesion = new Sesion(sesiones?.length + 1);
      sesion.fechaEmpezado = addDays(sesion.fechaEmpezado, sesiones?.length);
      setSesiones([...sesiones, { sesion }]);
    } else if (sesionesPorSemana < sesiones?.length) {
      setSesiones((old) => {
        old.pop();
        return [...old];
      });
    }
  }, [sesionesPorSemana]);

  const onSaveSesion = (sesion: Sesion) => {
    setSesiones((old) => {
      return old.map((s) => (s.sesion.numSesion === sesion.numSesion ? { sesion } : s));
    });
    setSelectedSesion(null);
  };

  const onSubmit = (data) => {
    data.objetivo = Objetivos.filter((o) => data.objetivo == o.descripcion)[0];
    data.organizacion = Organizaciones.filter((o) => data.organizacion == o.descripcion)[0];
    data.nivel = Niveles.filter((n) => data.nivel == n.descripcion)[0];
    data.sesiones = sesiones;
    console.log(data);
    onSubmitForm(data);
  };

  if (isLoading) {
    return (
      <Flex w="full" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (selectedSesion) {
    return (
      <Stack direction="column" p={[1, 2, 4]}>
        <Flex direction="row">
          <Heading as="h5" fontWeight={["light"]} fontSize={["lg", "xl"]}>
            Editar Sesion
          </Heading>
          <Spacer />
          <CloseButton onClick={() => setSelectedSesion(null)} />
        </Flex>
        <SesionDetail
          sesion={selectedSesion}
          isLoading={false}
          isNew={true}
          onSave={(sesion) => onSaveSesion(sesion)}
        />
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spinner margin="auto" display={Object.entries(_form).length === 0 ? "flex" : "none"} />
      <Stack
        direction="column"
        spacing={[1, 3, 5]}
        align="start"
        display={Object.entries(_form).length === 0 ? "none" : "flex"}
      >
        <Controller
          name="nombre"
          control={control}
          defaultValue={plantilla?.nombre || ""}
          render={({ field: { ref, ...rest } }) => (
            <InputLabeled label="Nombre" inputRef={ref} {...rest} error={errors.nombre?.message} />
          )}
          rules={{ required: "Por favor completar" }}
        />
        <Controller
          name="sesionesPorSemana"
          control={control}
          defaultValue={plantilla?.sesionesPorSemana || 0}
          render={({ field: { ref, ...rest } }) => (
            <NumberInputLabeled
              label="Sesiones Por Semana"
              min={0}
              max={7}
              precision={0}
              {...rest}
              error={errors.sesionesPorSemana?.message}
            />
          )}
          rules={{ required: "Por favor completar" }}
        />
        <Controller
          name="nivel"
          control={control}
          defaultValue={plantilla?.nivel.descripcion || Niveles[0].descripcion}
          render={({ field: { ref, ...rest } }) => (
            <SelectLabeled
              {...rest}
              label="Nivel"
              options={Object.values(Niveles).map((n) => ({
                key: n.idNivel,
                value: n.descripcion,
                description: n.descripcion,
              }))}
            />
          )}
        />
        <Controller
          name="objetivo"
          control={control}
          defaultValue={plantilla?.objetivo.descripcion || Objetivos[0].descripcion}
          render={({ field: { ref, ...rest } }) => (
            <RadioCardsLabeled
              label={"Objetivo"}
              options={Objetivos.map((o) => o.descripcion)}
              selectedValue={_form[0] || _form[0]?.toString()}
              inputRef={ref}
              {...rest}
            />
          )}
          rules={{ required: "Por favor completar" }}
        />
        <Controller
          name="organizacion"
          control={control}
          defaultValue={plantilla?.organizacion.descripcion || Organizaciones[0].descripcion}
          render={({ field: { ref, ...rest } }) => (
            <RadioCardsLabeled
              label={"Organizacion"}
              options={Organizaciones.map((o) => o.descripcion)}
              selectedValue={_form[1]?.descripcion || _form[1]?.toString()}
              inputRef={ref}
              {...rest}
            />
          )}
          rules={{ required: "Por favor completar" }}
        />
        <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
          Sesiones
        </Text>
        <Box p={[1, 2]} />
        <SesionesTable
          sesiones={sesiones.map((s) => s.sesion)}
          setSesion={(sesion: Sesion) => setSelectedSesion(sesion)}
        />
        <Spacer p={[1]}></Spacer>
        <Flex direction="row" alignItems={"center"}>
          <SaveButton type="submit">Guardar</SaveButton>
          <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
            Volver
          </Button>
        </Flex>
      </Stack>
    </form>
  );
};
