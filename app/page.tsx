"use client";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Flex, Box, Button } from "@mantine/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";

import React, { useEffect, useRef, useState } from "react";

import { FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { DropzoneButton } from "../components/Dropzones/DropzoneButton";
import { DoubleNavbar } from "../components/DoubleNavbar/DoubleNavbar";

export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRestart, setIsRestart] = useState(false);

  const waveSurferRefs = useRef<(WaveSurfer | null)[]>([]);

  useEffect(() => {
    files.forEach((file, index) => {
      if (!waveSurferRefs.current[index]) {
        const waveSurfer = WaveSurfer.create({
          container: `#waveform-${index}`,
          waveColor: "violet",
          progressColor: "purple",
          plugins: [
            TimelinePlugin.create({
              container: `#waveform-timeline-${index}`,
            }),
          ],
        });

        waveSurfer.loadBlob(file);
        waveSurferRefs.current[index] = waveSurfer;
      }
    });
  }, [files]);

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
      <Box pr={120}>
        <ColorSchemeToggle />
      </Box>
      <Flex>
        <DoubleNavbar />
        <Modal
          opened={opened}
          onClose={close}
          title="Enter a Audio file "
          centered
        >
          <DropzoneButton setFiles={setFiles} />
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
        </Modal>

        {/* Display uploaded files */}
        {files.length > 0 && (
          <Box
            style={{
              position: "fixed",
              left: 0,
              bottom: 0,
              width: "100%",

              backgroundColor: "black",
              textAlign: "center",
            }}
          >
            {files.map((file, index) => (
              <div key={index}>
                <h3>{file.name}</h3>
                {file.type.startsWith("audio/") && (
                  <div>
                    <div id={`waveform-${index}`} />
                    <div id={`waveform-timeline-${index}`} />
                  </div>
                )}
              </div>
            ))}

            <Group justify="center">
              <Button
                m={10}
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
                onClick={() => {
                  if (isPlaying) {
                    waveSurferRefs.current.forEach((waveSurfer) =>
                      waveSurfer?.pause()
                    );
                  } else {
                    waveSurferRefs.current.forEach((waveSurfer) =>
                      waveSurfer?.play()
                    );
                  }
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
                onClick={() => {
                  waveSurferRefs.current.forEach((waveSurfer) =>
                    waveSurfer?.stop()
                  );
                  setIsPlaying(false);
                }}
              >
                <VscDebugRestart />
              </Button>
            </Group>
          </Box>
        )}
      </Flex>
    </>
  );
}
