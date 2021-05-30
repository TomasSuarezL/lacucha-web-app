import {
  Box,
  Flex,
  Input,
  InputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Select,
  SelectProps,
  FlexProps,
  Text,
  useRadio,
  useRadioGroup,
  Stack,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQueryCache } from "../../hooks/useQueryCache";
import { Ejercicio, PatronesMovimiento } from "../../models/Mesociclo";
import { ejerciciosApi } from "../mesociclos/Ejercicios.api";

interface InputLabeledProps extends InputProps {
  value: string;
  label: string;
  isNumber?: boolean;
}

export const InputLabeled = ({
  value,
  onChange: onChange,
  label,
  isNumber = false,
  ...props
}: InputLabeledProps) => {
  return (
    <Flex direction="column" w="full">
      <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
        {label}
      </Text>
      <Input
        value={value}
        onChange={onChange}
        placeholder={label}
        focusBorderColor="gray.400"
        bg="gray.100"
        borderRadius="0"
        size="sm"
        {...props}
      ></Input>
    </Flex>
  );
};

interface NumberInputLabeledProps extends NumberInputProps {
  value: number;
  label: string;
  isNumber?: boolean;
  direction?: "row" | "column";
  onChangeNumber: (valueAsString: string, valueAsNumber: number) => void;
}

export const NumberInputLabeled = ({
  value,
  label,
  onChangeNumber,
  direction = "column",
  ...props
}: NumberInputLabeledProps) => {
  return (
    <Flex direction="column" w="full">
      <Flex direction={direction} w="full">
        <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
          {label}
        </Text>
        <NumberInput
          value={value}
          precision={2}
          onChange={onChangeNumber}
          focusBorderColor="gray.400"
          bg="gray.100"
          borderRadius="0"
          size="sm"
          {...props}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      {value === undefined || value === null ? (
        <Text fontSize={["xs", "sm"]} fontWeight="light" m={[1, 1]} color="red.500">
          Valor inválido
        </Text>
      ) : (
        ""
      )}
    </Flex>
  );
};

interface SelectLabeledProps extends SelectProps {
  value: string | number;
  label: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { key: string | number; value: string | number; description: string }[];
  defaultOption?: string;
}

export const SelectLabeled: React.FC<SelectLabeledProps> = ({
  value,
  label,
  onChange,
  options,
  defaultOption,
  ...props
}) => {
  return (
    <Flex direction="column" w="full">
      <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
        {label}
      </Text>
      <Select value={value || "0"} onChange={onChange} bg="gray.100" size="sm" {...props}>
        {defaultOption && (
          <option key="0" value="0" selected>
            {defaultOption}
          </option>
        )}
        {options.map((o) => (
          <option key={o.key} value={o.value}>
            {o.description}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

interface DatePickerLabeledProps extends InputProps {
  dateValue: string | Date;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const DatePickerLabeled: React.FC<DatePickerLabeledProps> = ({
  dateValue,
  label,
  onChange,
  ...props
}) => {
  return (
    <Flex direction="column" w="full">
      <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
        {label}
      </Text>
      <Input
        type="date"
        value={new Date(dateValue).toISOString().slice(0, 10)}
        onChange={onChange}
        bg="gray.100"
        size="sm"
        {...props}
      ></Input>
    </Flex>
  );
};

interface RadioCardsLabeledProps extends FlexProps {
  label: string;
  options: string[];
  onChange: (v: string) => void;
  direction?: "row" | "column";
  isInvalid?: boolean;
}

export const RadioCardsLabeled: React.FC<RadioCardsLabeledProps> = ({
  options,
  onChange,
  label,
  direction = "column",
  isInvalid = false,
  ...props
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "react",
    onChange: onChange,
  });

  const group = getRootProps();

  const RadioCard = (props) => {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: "gray.700",
            color: "white",
            borderColor: "gray.700",
          }}
          _focus={{
            boxShadow: "outline",
          }}
          px={5}
          py={3}
        >
          {props.children}
        </Box>
      </Box>
    );
  };
  return (
    <Flex direction={direction} w="full">
      <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
        {label}
      </Text>
      <Stack direction={["column", "column", "row"]} {...group} {...props}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </Stack>
      {isInvalid ? (
        <Text fontSize={["xs", "sm"]} fontWeight="light" m={[1, 1]} color="red.500">
          Por favor seleccionar una opción
        </Text>
      ) : (
        <Text fontSize={["xs", "sm"]} fontWeight="light" m={[1, 1]}>
          Seleccionar una opción
        </Text>
      )}
    </Flex>
  );
};

export interface EjercicioSelectLabeledProps extends FlexProps {
  label: string;
  ejercicio: Ejercicio;
  onChange: (ejercicio: Ejercicio) => void;
  patrones?: string[];
}

export const EjercicioSelectLabeled: React.FC<EjercicioSelectLabeledProps> = ({
  label,
  ejercicio,
  onChange,
  patrones,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSave = (ejercicio: Ejercicio) => {
    onChange(ejercicio);
    setIsOpen(false);
  };

  const EjercicioModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (ejercicio: Ejercicio) => void;
    patrones: string[];
  }> = ({ isOpen, onClose, onSave, patrones }) => {
    const [ejercicio, setEjercicio] = useState<Ejercicio>(null);
    const [patron, setPatron] = useState(patrones[0]);
    const { data, isLoading, isError, error, isSuccess } = useQueryCache<Ejercicio[]>(
      ["ejercicios", patron],
      () => ejerciciosApi.getEjercicios(patron)
    );

    useEffect(() => {
      isSuccess &&
        setEjercicio({
          ...data[0],
        });
    }, [data]);

    const onChangeEjercicio = (ejercicio: Ejercicio) => {
      setEjercicio({ ...ejercicio });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
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
                options={patrones.map((p) => ({ key: p, value: p, description: p }))}
              />
              <Spacer my={[1, 2]} />
              {isLoading ? (
                <Spinner />
              ) : (
                <SelectLabeled
                  label="Ejercicio"
                  value={ejercicio?.idEjercicio || 0}
                  onChange={(ev) =>
                    onChangeEjercicio(data.filter((e) => e.idEjercicio.toString() === ev.target.value)[0])
                  }
                  options={data.map((e) => ({ key: e.nombre, value: e.idEjercicio, description: e.nombre }))}
                />
              )}
              <Spacer my={[1, 2]} />
            </ModalBody>
          )}
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={(_e) => onSave(ejercicio)}>
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

  return (
    <Flex direction={["column"]} {...props}>
      <Text fontSize={["xs", "sm"]} fontWeight="bold" m={[1, 1]}>
        {label}
      </Text>
      <Button bg="gray.100" p={[1, 2]} onClick={() => setIsOpen(true)}>
        {ejercicio?.nombre}
      </Button>
      <Text fontSize={["xs", "sm"]} fontWeight="light" m={[1, 1]} color="red.500">
        {ejercicio === undefined || ejercicio === null ? "Seleccionar un Ejercicio" : ""}
      </Text>
      {isOpen && (
        <EjercicioModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={(ejercicio) => onSave(ejercicio)}
          patrones={patrones ? patrones : PatronesMovimiento}
        />
      )}
    </Flex>
  );
};
