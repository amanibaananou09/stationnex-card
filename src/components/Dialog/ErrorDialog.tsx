import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface DialogConfig {
  title?: string;
  message?: string;
}

export const useError = (props?: DialogConfig) => {
  const { t } = useTranslation();

  const { title, message } = props || {};

  const [isOpen, setOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig>({
    title,
    message,
  });

  const toggle = () => setOpen(!isOpen);
  const close = () => setOpen(false);

  const openDialog = (conf?: DialogConfig) => {
    if (conf) {
      setConfig((prev) => ({
        title: conf?.title ?? prev.title,
        message: conf?.message ?? prev.message,
      }));
    }
    toggle();
  };

  const ErrorDialog = ({ children }: { children?: React.ReactNode }) => {
    return (
      <Modal isOpen={isOpen} onClose={toggle} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="red.500" fontSize="sm" textColor="white" mb="10px">
            {config.title}
          </ModalHeader>
          <ModalBody>{children ? children : config.message}</ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={toggle}>
              {t("common.errorDialog.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return { ErrorDialog, showError: openDialog, close };
};
