import { useState } from "react";
import { UnstyledButton, Box, Tooltip, Title, rem } from "@mantine/core";
import { DropzoneButton } from "../Dropzones/DropzoneButton";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./DoubleNavbar.module.css";

const mainLinksMockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

const linksMockdata = [
  "Search",
  "Settings",
  "Media",
  "Audio",
  "Subtitle",
  "Text",
  "Elements",
  "Record",
];

export function DoubleNavbar() {
  const [active, setActive] = useState("Home");
  const [activeLink, setActiveLink] = useState("Settings");
  const [files, setFiles] = useState<File[]>([]);

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const links = linksMockdata.map((link) => (
    <a
      className={classes.link}
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        setActiveLink(link);
      }}
      key={link}
    >
      {link}
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <MantineLogo type="mark" size={30} />
          </div>
          {mainLinks}
        </div>
        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>

          <DropzoneButton setFiles={setFiles} />
          <Box m={100} p={50}>
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
          </Box>
        </div>
      </div>
    </nav>
  );
}
