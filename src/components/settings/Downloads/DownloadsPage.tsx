import React from "react";
import WhenAddingTorrent from "./WhenAddingTorrent";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsBox from "../SettingsBox";
import SavingManagement from "./SavingManagement";
import RequestMoreSettings from "../RequestMoreSettings";
import { zhCN } from "../../../locales/zh-CN";

export interface DownloadsPageProps {}

const DownloadsPage = (props: DownloadsPageProps) => {
  return (
    <>
      <WhenAddingTorrent />
      <SettingsBox>
        <SettingsSwitch
          label={zhCN.downloads.preAllocation}
          settingKey={"preallocate_all"}
        />
        <SettingsSwitch
          label={zhCN.downloads.autoDeleteDeprecated}
          settingKey={"incomplete_files_ext"}
        />
      </SettingsBox>
      <SavingManagement />
      <RequestMoreSettings />
    </>
  );
};

export default DownloadsPage;
