import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQueryCache } from "../../hooks/useQueryCache";
import { Ejercicio, EjerciciosXBloque } from "../../models/Mesociclo";
import { NumberInputLabeled, SelectLabeled } from "../shared/Inputs";
import { ejerciciosApi } from "./Ejercicios.api";

const PatronesMovimiento = ["Empuje", "Traccion", "Rodilla", "Cadera", "Core"];

interface EjercicioSelectModalProps {
  ejercicio: EjerciciosXBloque;
  onClose: () => void;
  onSave: (ejercicio: EjerciciosXBloque) => void;
}

const EjercicioSelectModal: React.FC<EjercicioSelectModalProps> = ({ ejercicio, onClose, onSave }) => {
  const [ejercicioEdit, setEjercicioEdit] = useState(ejercicio);
  const [patron, setPatron] = useState(ejercicio.ejercicio?.patron || "Empuje");
  const { data, isLoading, isError, error, isSuccess } = useQueryCache<Ejercicio[]>(
    ["ejercicios", patron],
    () => ejerciciosApi.getEjercicios(patron),
    { onSuccess: (data) => setEjercicioEdit({ ...ejercicioEdit, ejercicio: data[0] }) }
  );

  useEffect(() => {
    isSuccess && setEjercicioEdit({ ...ejercicioEdit, ejercicio: data[0] });
  }, []);

  const onChangeEjercicio = (key: string, value: Ejercicio | number) => {
    setEjercicioEdit({ ...ejercicioEdit, [key]: value });
  };

  return (
    <Modal isOpen={!!ejercicio} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Ejercicio</ModalHeader>
        {isError ? (
          <Text>{error.toString()}</Text>
        ) : (
          <ModalBody>
            <SelectLabeled
              label="Patrón"
              value={patron}
              onChange={(e) => setPatron(e.target.value)}
              options={PatronesMovimiento.map((p) => ({ key: p, value: p, description: p }))}
            />
            <Spacer my={[1, 2]} />
            {isLoading ? (
              <Spinner />
            ) : (
              <SelectLabeled
                label="Ejercicio"
                value={ejercicioEdit?.ejercicio?.idEjercicio || 0}
                onChange={(ev) =>
                  onChangeEjercicio(
                    "ejercicio",
                    data.filter((e) => e.idEjercicio.toString() === ev.target.value)[0]
                  )
                }
                options={data.map((e) => ({ key: e.nombre, value: e.idEjercicio, description: e.nombre }))}
              />
            )}
            <Spacer my={[1, 2]} />
            <Flex>
              <NumberInputLabeled
                value={ejercicioEdit?.repeticiones}
                onChangeNumber={(_s: string, v: number) => onChangeEjercicio("repeticiones", v)}
                step={1}
                label="Repeticiones"
              />
              <Spacer mx={[2, 3]} />
              <NumberInputLabeled
                value={ejercicioEdit?.carga}
                onChangeNumber={(_s: string, v: number) => onChangeEjercicio("carga", v)}
                step={0.5}
                label="Carga (Kg.)"
              />
            </Flex>
          </ModalBody>
        )}
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={(_e) => onSave(ejercicioEdit)}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EjercicioSelectModal;
