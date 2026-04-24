import SettingsBox from "../SettingsBox";
import { SimpleGrid, Text } from "@chakra-ui/react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import React from "react";
import { zhCN } from "../../../locales/zh-CN";

export function GlobalRateLimits() {
  return (
    <SettingsBox title={zhCN.settingsLabels.globalRateLimits}>
      <Text>{zhCN.settingsLabels.zeroMeansUnlimited}</Text>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <SettingsTextInput
          label={zhCN.settingsLabels.upload}
          settingKey={"up_limit"}
          rightAddon={zhCN.speedUnits.kibs}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.download}
          settingKey={"up_limit"}
          rightAddon={zhCN.speedUnits.kibs}
        />
      </SimpleGrid>
    </SettingsBox>
  );
}
