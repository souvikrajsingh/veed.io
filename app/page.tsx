"use client";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Flex, Box, Button } from "@mantine/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";

import React, { useEffect, useRef, useState } from "react";

import { FaPlay, FaPause } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { DropzoneVid } from "../components/Dropzones/DropZoneVideo";
import { DropzoneButton } from "../components/Dropzones/DropzoneButton";
import { DoubleNavbar } from "../components/DoubleNavbar/DoubleNavbar";

export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRestart, setIsRestart] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoFile, setVideoFile] = useState<File[]>([]);

  function formatTime(seconds: number) {
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  const waveSurferRefs = useRef<(WaveSurfer | null)[]>([]);

  useEffect(() => {
    files.forEach((file, index) => {
      if (!waveSurferRefs.current[index]) {
        const waveSurfer = WaveSurfer.create({
          container: `#waveform-${index}`,
          waveColor: "#4F4A85",
          progressColor: "#383351",
          barWidth: 4,
          barGap: 3,
          barRadius: 2,
          plugins: [
            TimelinePlugin.create({
              container: `#waveform-timeline-${index}`,
            }),
          ],
        });

        waveSurfer.loadBlob(file);
        waveSurferRefs.current[index] = waveSurfer;

        waveSurfer.on("ready", () => {
          setDuration(waveSurfer.getDuration());
        });

        waveSurfer.on("audioprocess", () => {
          setCurrentTime(waveSurfer.getCurrentTime());
        });

        waveSurferRefs.current[index] = waveSurfer;
      }
    });
  }, [files]);

  useEffect(() => {
    open();
  }, [open]);

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
        {/* creating a section for Video */}
        <Box m={380}>
          <DropzoneVid setFiles={setVideoFile} />
          {files.length > 0 && (
            <div>
              <h3>Uploaded files</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    {file.type.startsWith("video/") && (
                      <div>
                        <video width="320" height="240" controls preload="none">
                          <source
                            src={URL.createObjectURL(file)}
                            type="video/mp4"
                          />
                          <track
                            src="/path/to/captions.vtt"
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Box>

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
              <span>
                Duration: {formatTime(duration)} | Current Time:{" "}
                {formatTime(currentTime)}
              </span>
            </Group>
          </Box>
        )}
      </Flex>
    </>
  );
}
