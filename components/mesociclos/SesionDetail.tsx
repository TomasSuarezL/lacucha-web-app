import { Button, Divider, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { useImmer } from "use-immer";
import React, { useState } from "react";
import { AiFillEdit, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Bloque, EjerciciosXBloque, Sesion } from "../../models/Mesociclo";
import DataField from "../shared/DataField";
import EjercicioSelectModal from "./EjercicioSelectModal";
import { DeleteButton, SaveButton } from "../shared/Buttons";
import { NumberInputLabeled } from "../shared/Inputs";
import { useMutation } from "react-query";
import { sesionesApi } from "./Sesion.api";

interface BloqueDetailProps {
  bloque: Bloque;
  onBloqueEdit: (numBloque: number, bloque: Bloque) => void;
  onBloqueDelete: (numBloque: number) => void;
  onEjercicioEdit: (numBloque: number, numEjercicio: number, ejercicio: EjerciciosXBloque) => void;
  editable: boolean;
}

const BloqueDetail: React.FC<BloqueDetailProps> = ({
  bloque,
  onEjercicioEdit,
  onBloqueEdit,
  onBloqueDelete,
  editable,
}) => {
  const [ejercicio, setEjercicio] = useState<EjerciciosXBloque | null>(null);

  const onSave = (ejercicioNuevo: EjerciciosXBloque) => {
    onEjercicioEdit(bloque.numBloque, ejercicio.numEjercicio, ejercicioNuevo);
    setEjercicio(null);
  };

  const onBloqueSeriesEdit = (v: number) => {
    onBloqueEdit(bloque.numBloque, { ...bloque, series: v });
  };

  const onBloqueEjercicioAdd = () => {
    let nuevoBloque = {
      ...bloque,
      ejercicios: [...bloque.ejercicios, { numEjercicio: bloque.ejercicios.length + 1 } as EjerciciosXBloque],
    };
    onBloqueEdit(bloque.numBloque, nuevoBloque);
  };

  const onBloqueEjercicioDelete = (numEjercicio: number) => {
    let nuevoBloque = {
      ...bloque,
      ejercicios: bloque.ejercicios
        .filter((e) => e.numEjercicio != numEjercicio)
        .map((e, idx) => ({ ...e, numEjercicio: idx + 1 })),
    };

    onBloqueEdit(bloque.numBloque, nuevoBloque);
  };

  return (
    <Flex direction="column" m={[1, 2, 3]}>
      <Flex role="group" direction={["column", "row"]} bg="gray.200" p={[1, 2]} align="center">
        <Text fontSize={["xs", "sm"]} fontWeight="bold">{`Bloque: ${bloque.numBloque}`}</Text>
        <Spacer></Spacer>
        <Button
          variant="ghost"
          opacity="0"
          mx={[1]}
          _hover={{ bg: "gray.300" }}
          _groupHover={{ opacity: 1 }}
          size="sm"
          onClick={() => onBloqueEjercicioAdd()}
          disabled={!editable}
        >
          <AiOutlinePlus /> Agregar Ejercicio
        </Button>
        <Button
          variant="ghost"
          opacity="0"
          mx={[1, 2]}
          _hover={{ bg: "red.100" }}
          _groupHover={{ opacity: 1 }}
          size="sm"
          onClick={() => onBloqueDelete(bloque.numBloque)}
          disabled={!editable}
        >
          <AiOutlinePlus /> Eliminar Bloque
        </Button>
        <Flex maxWidth="6rem">
          <NumberInputLabeled
            value={bloque?.series}
            onChangeNumber={(_s, v: number) => onBloqueSeriesEdit(v)}
            step={1}
            label="Series"
            direction="row"
            isReadOnly={!editable}
            size="xs"
          />
        </Flex>
      </Flex>
      <Flex direction="column">
        {bloque?.ejercicios?.map((e) => {
          return (
            <Flex key={e.numEjercicio} direction="column">
              <Divider />
              <Flex
                role="group"
                direction={["column", "row"]}
                p={[1]}
                _hover={{ bg: "gray.100" }}
                align="center"
              >
                <Text flex="1">{e.numEjercicio}</Text>
                <Text flex="1">{e.ejercicio?.nombre}</Text>
                <Text flex="1">{e.ejercicio?.patron}</Text>
                <Text flex="1">{e?.carga} Kgs.</Text>
                <Text flex="1">{e?.repeticiones} reps.</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  opacity="0"
                  _groupHover={{ opacity: 1 }}
                  onClick={(ev) => {
                    setEjercicio(e);
                  }}
                  disabled={!editable}
                >
                  <AiFillEdit />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  opacity="0"
                  _groupHover={{ opacity: 1 }}
                  onClick={() => onBloqueEjercicioDelete(e.numEjercicio)}
                  disabled={!editable}
                >
                  <AiOutlineClose />
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      {ejercicio && (
        <EjercicioSelectModal
          ejercicio={ejercicio}
          onClose={() => setEjercicio(null)}
          onSave={(e: EjerciciosXBloque) => onSave(e)}
        />
      )}
    </Flex>
  );
};

interface SesionDetailProps {
  sesion: Sesion;
  updateSesion: (sesion: Sesion) => void;
}

export const SesionDetail: React.FC<SesionDetailProps> = ({ sesion, updateSesion }) => {
  const mutation = useMutation(
    (sesion: Sesion) => {
      if (sesion.idSesion) return sesionesApi.putSesion(sesion);
      else return sesionesApi.postSesion(sesion);
    },
    {
      onSuccess: (data) => {
        updateSesion(data);
      },
    }
  );
  const [sesionEdit, setSesionEdit] = useImmer<Sesion>(sesion);

  const onEjercicioEdit = (numBloque: number, numEjercicio: number, ejercicio: EjerciciosXBloque) => {
    setSesionEdit((draft) => {
      let _idBloque = draft.bloques.findIndex((b) => b.numBloque === numBloque);
      let _idEjercicio = draft.bloques[_idBloque].ejercicios.findIndex(
        (e) => e.numEjercicio === numEjercicio
      );
      draft.bloques[_idBloque].ejercicios[_idEjercicio] = ejercicio;
    });
  };

  const onBloqueEdit = (numBloque: number, bloque: Bloque) => {
    setSesionEdit((draft) => {
      let _idBloque = draft.bloques.findIndex((b) => b.numBloque === numBloque);
      draft.bloques[_idBloque] = bloque;
    });
  };

  const onBloqueAdd = () => {
    setSesionEdit((draft) => {
      draft.bloques.push({ numBloque: sesionEdit.bloques.length + 1, ejercicios: [] } as Bloque);
    });
  };

  const onBloqueDelete = (numBloque) => {
    setSesionEdit((draft) => {
      draft.bloques = draft.bloques
        .filter((b) => b.numBloque != numBloque)
        .map((b, idx) => ({ ...b, numBloque: idx + 1 }));
    });
  };

  const onFinalizarSesion = () => {
    sesion.finalizar();
    mutation.mutate(sesion);
  };

  const finalizada = sesionEdit.estaFinalizada();

  console.log(sesion);

  return (
    <Flex direction="column">
      <Text fontSize={["lg", "xl"]} fontWeight="bold" mx={[2, 2, 4]} alignSelf="flex-start">
        {`Sesion del ${new Date(sesionEdit.fechaEmpezado).toLocaleString()}`}
      </Text>
      <Stack direction={["column", "column", "row"]} m={[2, 2, 4]} spacing={["2", "3"]}>
        <DataField value={sesionEdit.fechaFinalizado ? "Terminada" : "Pendiente"} label="Estado" />
        {sesionEdit.fechaFinalizado && (
          <DataField
            value={`${Math.floor(
              (new Date(sesionEdit.fechaFinalizado).getTime() -
                new Date(sesionEdit.fechaEmpezado).getTime()) /
                60000
            ).toString()} min.`}
            label="Duración"
          />
        )}
      </Stack>
      <Divider my={[1, 2]} />
      <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
        Bloques
      </Text>
      <Flex direction="column">
        {sesionEdit?.bloques?.map((b) => (
          <BloqueDetail
            key={b.idBloque}
            bloque={b}
            onBloqueEdit={onBloqueEdit}
            onBloqueDelete={onBloqueDelete}
            onEjercicioEdit={onEjercicioEdit}
            editable={!finalizada}
          />
        ))}
      </Flex>
      <Flex direction="row" justify="center">
        <Button
          variant="solid"
          mx={[1, 2, 4]}
          _hover={{ bg: "gray.300" }}
          size="sm"
          onClick={() => onBloqueAdd()}
          disabled={finalizada}
        >
          <AiOutlinePlus /> Agregar Bloque
        </Button>
      </Flex>
      <Spacer m={[1, 2]} />
      {!finalizada && (
        <Flex>
          <SaveButton
            onClick={() => mutation.mutate(sesionEdit)}
            isLoading={mutation.isLoading}
            loadingText="Guardando"
          >
            Guardar Sesión
          </SaveButton>
          {!mutation.isLoading && (
            <DeleteButton onClick={() => onFinalizarSesion()}>Finalizar Sesión</DeleteButton>
          )}
        </Flex>
      )}
    </Flex>
  );
};
