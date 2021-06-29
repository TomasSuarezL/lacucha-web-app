import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface SaveButtonProps extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ children, onClick, ...props }) => {
  return (
    <Button
      onClick={onClick}
      bg="green.200"
      _hover={{ bg: "green.100" }}
      m={[2, 3]}
      size="sm"
      alignSelf="flex-start"
      {...props}
    >
      {children}
    </Button>
  );
};

interface DeleteButtonProps extends ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ children, onClick, ...props }) => {
  return (
    <Button
      onClick={onClick}
      bg="red.200"
      _hover={{ bg: "red.100" }}
      m={[2, 3]}
      size="sm"
      alignSelf="flex-start"
      {...props}
    >
      {children}
    </Button>
  );
};
