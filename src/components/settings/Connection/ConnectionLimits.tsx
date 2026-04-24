import React from "react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsBox from "../SettingsBox";
import { zhCN } from "../../../locales/zh-CN";

export interface ConnectionLimitsProps {}

const ConnectionLimits = (props: ConnectionLimitsProps) => {
  return (
    <SettingsBox title={zhCN.settingsLabels.connectionLimits}>
      <SettingsTextInput
        label={zhCN.settingsLabels.globalMaxConnectionLimit}
        settingKey={"max_connec"}
        withToggle
        disableDefaultValue={"500"}
      />
      <SettingsTextInput
        label={zhCN.settingsLabels.maxConnectionLimitPerTorrent}
        settingKey={"max_connec_per_torrent"}
        withToggle
        disableDefaultValue={"100"}
      />
      <SettingsTextInput
        label={zhCN.settingsLabels.globalMaxUploadSlotsLimit}
        settingKey={"max_uploads"}
        withToggle
        disableDefaultValue={"20"}
      />
      <SettingsTextInput
        label={zhCN.settingsLabels.maxUploadSlotsLimitPerTorrent}
        settingKey={"max_uploads"}
        withToggle
        disableDefaultValue={"4"}
      />
    </SettingsBox>
  );
};

export default ConnectionLimits;
