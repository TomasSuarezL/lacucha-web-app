import {
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
  Text,
} from "@chakra-ui/react";
import React from "react";

interface InputLabeledProps extends InputProps {
  value: string;
  label: string;
  isNumber?: boolean;
}

export const InputLabeled = ({ value, onChange, label, isNumber = false, ...props }: InputLabeledProps) => {
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
  );
};

interface SelectLabeled extends SelectProps {
  value: string | number;
  label: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { key: string | number; value: string | number; description: string }[];
  defaultOption?: string;
}

export const SelectLabeled: React.FC<SelectLabeled> = ({
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
