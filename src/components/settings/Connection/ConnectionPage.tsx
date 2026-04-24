import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { TorrSettingsBitTorrentProtocol } from "../../../types";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import ProxyServer from "./ProxyServer";
import ConnectionLimits from "./ConnectionLimits";
import IpFiltering from "./IP Filtering";
import { zhCN } from "../../../locales/zh-CN";

const ConnectionPage = () => {
  const protocolOptions: SettingsSelectOption[] = [
    { label: zhCN.protocols.tcpAndUtp, value: TorrSettingsBitTorrentProtocol.tcpANDutp },
    { label: zhCN.protocols.tcp, value: TorrSettingsBitTorrentProtocol.tcp },
    { label: zhCN.protocols.utp, value: TorrSettingsBitTorrentProtocol.utp },
  ];

  return (
    <>
      <SettingsBox>
        <SettingsSelect
          label={zhCN.settingsLabels.peerConnectionProtocol}
          settingKey={"bittorrent_protocol"}
          options={protocolOptions}
        />
      </SettingsBox>
      <SettingsBox title={zhCN.settingsLabels.listeningPort}>
        <SettingsTextInput
          label={zhCN.settingsLabels.portUsedForIncomingConnections}
          settingKey={"listen_port"}
        />
        <SettingsSwitch
          label={zhCN.settingsLabels.useUpnpPortForwarding}
          settingKey={"upnp"}
        />
      </SettingsBox>
      <ConnectionLimits />
      <ProxyServer />
      <IpFiltering />
    </>
  );
};

export default ConnectionPage;
