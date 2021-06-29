import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
} from "@chakra-ui/react";
import { Controller, useForm, useFormState } from "react-hook-form";
import {
  InputLabeled,
  NumberInputLabeled,
  SelectLabeled,
  SwitchLabeled,
} from "../../shared/Inputs";
import { PatronesMovimientoMap } from "../../../models/PatronMovimiento";
import { Ejercicio } from "../../../models/Ejercicio";

export const EjercicioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (ejercicio: Ejercicio) => void;
  ejercicioSelected?: Ejercicio;
}> = ({ isOpen, onClose, onSave, ejercicioSelected }) => {
  const { handleSubmit, control } = useForm<Ejercicio>();
  const { errors } = useFormState({
    control,
  });

  const onSubmit = (data) => {
    data.idEjercicio = ejercicioSelected?.idEjercicio;
    data.patron = PatronesMovimientoMap[data.patron];
    onSave(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>Ejercicio</ModalHeader>
          <ModalBody>
            <Stack direction="column" spacing={[1, 2]}>
              <Controller
                name="patron"
                control={control}
                defaultValue={
                  PatronesMovimientoMap[ejercicioSelected.patron as string]?.descripcion ||
                  Object.values(PatronesMovimientoMap)[0].descripcion
                }
                render={({ field: { ref, ...rest } }) => (
                  <SelectLabeled
                    {...rest}
                    label="Patrón"
                    options={Object.values(PatronesMovimientoMap).map((p) => ({
                      key: p.idPatron,
                      value: p.descripcion,
                      description: p.descripcion,
                    }))}
                  />
                )}
              />
              <Controller
                name="nombre"
                control={control}
                defaultValue={ejercicioSelected.nombre || ""}
                render={({ field: { ref, ...rest } }) => (
                  <InputLabeled
                    label="Nombre"
                    inputRef={ref}
                    {...rest}
                    error={errors.nombre?.message}
                  />
                )}
                rules={{ required: "Por favor completar" }}
              />
              <Controller
                name="urlVideo"
                control={control}
                defaultValue={ejercicioSelected.urlVideo || ""}
                render={({ field: { ref, ...rest } }) => (
                  <InputLabeled label="URL" inputRef={ref} {...rest} />
                )}
              />
              <Controller
                name="pesoInicial"
                control={control}
                defaultValue={ejercicioSelected.pesoInicial || 0}
                render={({ field: { ref, ...rest } }) => (
                  <NumberInputLabeled
                    label="Peso Inicial (Kgs)"
                    step={0.5}
                    min={0}
                    {...rest}
                    error={errors.pesoInicial?.message}
                  />
                )}
                rules={{ required: "Por favor completar" }}
              />
              <Controller
                name="esTemporal"
                control={control}
                defaultValue={ejercicioSelected.esTemporal || false}
                render={({ field: { ref, value, ...rest } }) => (
                  <SwitchLabeled
                    label="Es Temporal?"
                    inputRef={ref}
                    value={value.toString()}
                    {...rest}
                  />
                )}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="green" mr={3}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
