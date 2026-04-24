import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import { zhCN } from "../../../locales/zh-CN";

export interface WhenAddingTorrentProps {}

const WhenAddingTorrent = (props: WhenAddingTorrentProps) => {
  const createSubfolderOptions: SettingsSelectOption[] = [
    { label: "原始设置", value: "Original" },
    { label: "创建子文件夹", value: "Subfolder" },
    { label: "不创建子文件夹", value: "NoSubfolder" },
  ];

  return (
    <SettingsBox title={zhCN.downloads.whenAddingTorrent}>
      <SettingsSelect
        label={"种子内容布局"}
        settingKey={"torrent_content_layout"}
        options={createSubfolderOptions}
      />
      <SettingsSwitch
        label={zhCN.downloads.addTorrentInStoppedState}
        settingKey={"start_paused_enabled"}
      />
      <SettingsSwitch
        label={zhCN.downloads.autoDeleteDeprecated}
        settingKey={"auto_delete_mode"}
      />
    </SettingsBox>
  );
};

export default WhenAddingTorrent;
