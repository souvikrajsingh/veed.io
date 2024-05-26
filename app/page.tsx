"use client";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import React, { useEffect } from "react";

import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { DropzoneButton } from "../components/Dropzones/DropzoneButton";
import { DoubleNavbar } from "../components/DoubleNavbar/DoubleNavbar";

export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    open();
  }, [open]);

  const handleFileUpload = (file: File) => {
    // Handle the uploaded file here
    console.log(file);
  };

  return (
    <>
      <DoubleNavbar />
      {/* 
      <Modal
      opened={opened}
      onClose={close}
      title="Enter a Audio file "
      centered
    >
      <DropzoneButton />
    </Modal>

    <ColorSchemeToggle /> */}
    </>
  );
}
