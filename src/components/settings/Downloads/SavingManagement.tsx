import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import {Flex} from "@chakra-ui/react";
import {useSettingsCtx} from "../useSettings";
import { zhCN } from "../../../locales/zh-CN";

const SavingManagement = () => {
  const { settings } = useSettingsCtx();

  return (
    <>
      <SettingsBox title={zhCN.downloads.savingManagement}>
        <SettingsSwitch
          label={zhCN.downloads.autoManagement}
          settingKey={"auto_tmm_enabled"}
        />
        <SettingsSwitch
          label={"分类变更时重新定位种子"}
          settingKey={"torrent_changed_tmm_enabled"}
        />
        <SettingsSwitch
          label={"默认保存路径变更时重新定位种子"}
          settingKey={"save_path_changed_tmm_enabled"}
        />
        <SettingsSwitch
          label={"分类保存路径变更时重新定位种子"}
          settingKey={"category_changed_tmm_enabled"}
        />
        <SettingsTextInput
          label={zhCN.downloads.defaultSavePath}
          settingKey={"save_path"}
        />
        <Flex gap={3}>
          <SettingsSwitch
            labelAbove
            label={zhCN.downloads.keepIncompleteFolder}
            settingKey={"temp_path_enabled"}
          />
          <SettingsTextInput
            label={zhCN.downloads.incompleteFolder}
            settingKey={"temp_path"}
            disabled={!settings?.temp_path_enabled}
          />
        </Flex>
        <SettingsTextInput
          label={"复制 .torrent 文件到"}
          settingKey={"export_dir"}
        />
        <SettingsTextInput
          label={"将已完成下载的 .torrent 文件复制到"}
          settingKey={"export_dir_fin"}
        />
      </SettingsBox>
    </>
  );
};

export default SavingManagement;
