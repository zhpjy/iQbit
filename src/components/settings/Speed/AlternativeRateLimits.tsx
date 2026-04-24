import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsBox from "../SettingsBox";
import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import React from "react";
import { zhCN } from "../../../locales/zh-CN";

export function AlternativeRateLimits(props: {
  options: SettingsSelectOption[];
}) {
  return (
    <SettingsBox title={zhCN.settingsLabels.alternativeRateLimits}>
      <Text>{zhCN.settingsLabels.zeroMeansUnlimited}</Text>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <SettingsTextInput
          label={zhCN.settingsLabels.upload}
          settingKey={"alt_up_limit"}
          rightAddon={zhCN.speedUnits.kibs}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.download}
          settingKey={"alt_dl_limit"}
          rightAddon={zhCN.speedUnits.kibs}
        />
      </SimpleGrid>
      <SettingsBox title={zhCN.settingsLabels.scheduleAlternativeLimit}>
        <SettingsSwitch
          label={zhCN.settingsLabels.enableAlternativeRateLimitScheduler}
          settingKey={"scheduler_enabled"}
        />
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
          <Flex flexDirection={"column"}>
            <Heading size={"md"}>{zhCN.settingsLabels.from}</Heading>
            <SimpleGrid columns={2} gap={5}>
              <SettingsTextInput
                label={""}
                settingKey={"schedule_from_hour"}
                rightAddon={zhCN.timeUnits.hour}
              />
              <SettingsTextInput
                label={""}
                settingKey={"schedule_from_min"}
                rightAddon={zhCN.timeUnits.min}
              />
            </SimpleGrid>
          </Flex>
          <Flex flexDirection={"column"}>
            <Heading size={"md"}>{zhCN.settingsLabels.to}</Heading>
            <SimpleGrid columns={2} gap={5}>
              <SettingsTextInput
                label={""}
                settingKey={"schedule_to_hour"}
                rightAddon={zhCN.timeUnits.hour}
              />
              <SettingsTextInput
                label={""}
                settingKey={"schedule_to_hour"}
                rightAddon={zhCN.timeUnits.min}
              />
            </SimpleGrid>
          </Flex>
        </SimpleGrid>
        <SettingsSelect
          label={zhCN.settingsLabels.when}
          settingKey={"scheduler_days"}
          options={props.options}
        />
      </SettingsBox>
    </SettingsBox>
  );
}
