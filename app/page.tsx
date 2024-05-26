"use client";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";

import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { DropzoneButton } from "../components/Dropzones/DropzoneButton";
import { DoubleNavbar } from "../components/DoubleNavbar/DoubleNavbar";

import WaveSurfer from "wavesurfer.js";

export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    open();
  }, [open]);

  const handleFileUpload = (file: File) => {
    // Handle the uploaded file here
    console.log(file);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  return (
    <>
      <DoubleNavbar />
      <Modal
        opened={opened}
        onClose={close}
        title="Enter a Audio file "
        centered
      >
        <DropzoneButton />
      </Modal>

      {/* Display uploaded files */}

      {files.length > 0 && (
        <div>
          <h3>Uploaded files</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
                {file.type.startsWith("audio/") && (
                  <audio controls src={URL.createObjectURL(file)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ColorSchemeToggle />
    </>
  );
}
