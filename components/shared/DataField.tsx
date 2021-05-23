import { Flex, Text } from "@chakra-ui/react";
import React from "react";

interface DataFieldProps {
  value: string;
  label: string;
}

const DataField: React.FC<DataFieldProps> = ({ value, label }) => {
  return (
    <Flex direction={["column", "column"]} align="flex-start" w="full">
      <Text fontSize={["xs", "sm"]} width={["full", "full"]} fontWeight="bold">
        {label}
      </Text>
      <Text
        fontSize={["sm", "lg"]}
        width={["full", "full"]}
        fontWeight="normal"
        bg="gray.100"
        px={[1, 2]}
        p={1}
      >
        {value}
      </Text>
    </Flex>
  );
};

export default DataField;
