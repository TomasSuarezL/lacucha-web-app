import { Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";

interface DataFieldProps extends FlexProps {
  value: string;
  label: string;
}

const DataField: React.FC<DataFieldProps> = ({ value, label, ...props }) => {
  return (
    <Flex {...props} direction={["column", "column"]} align="flex-start">
      <Text fontSize={["xs", "sm"]} width={["full", "full"]} fontWeight="bold" m={[1, 1]} whiteSpace="nowrap">
        {label}
      </Text>
      <Text fontSize={["sm", "lg"]} width={["full", "full"]} fontWeight="normal" bg="gray.100" p={[1, 2]}>
        {value}
      </Text>
    </Flex>
  );
};

export default DataField;
