import React, { useEffect } from "react";
import SettingsBox from "../SettingsBox";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { TorrSettingsProxyType } from "../../../types";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import { Flex } from "@chakra-ui/react";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import { useSettingsCtx } from "../useSettings";
import { zhCN } from "../../../locales/zh-CN";

const ProxyServer = () => {
  const { settings, updateSetting } = useSettingsCtx();

  const ProxyWithAuth =
    settings?.proxy_type === TorrSettingsProxyType.HTTPWithAuth ||
    settings?.proxy_type === TorrSettingsProxyType.SOCKS5WithAuth;

  useEffect(() => {
    updateSetting("proxy_auth_enabled", ProxyWithAuth);
    // eslint-disable-next-line
  }, [settings?.proxy_type]);

  const proxyTypeOptions: SettingsSelectOption[] = [
    {
      label: zhCN.proxyTypes.none,
      value: TorrSettingsProxyType.disabled,
    },
    {
      label: zhCN.proxyTypes.socks4NoAuth,
      value: TorrSettingsProxyType.SOCKS4WithoutAuth,
    },
    {
      label: zhCN.proxyTypes.socks5WithoutAuth,
      value: TorrSettingsProxyType.SOCKS5WithoutAuth,
    },
    {
      label: zhCN.proxyTypes.socks5WithAuth,
      value: TorrSettingsProxyType.SOCKS5WithAuth,
    },
    {
      label: zhCN.proxyTypes.httpWithoutAuth,
      value: TorrSettingsProxyType.HTTPWithAuth,
    },
    {
      label: zhCN.proxyTypes.httpWithAuth,
      value: TorrSettingsProxyType.HTTPWithoutAuth,
    },
  ];

  return (
    <SettingsBox title={zhCN.settingsLabels.proxyServer}>
      <SettingsSelect
        label={zhCN.settingsLabels.type}
        settingKey={"proxy_type"}
        options={proxyTypeOptions}
      />
      {settings?.proxy_type !== TorrSettingsProxyType.disabled && (
        <>
          <Flex gap={3} flexDirection={{ base: "column", lg: "row" }}>
            <SettingsTextInput label={zhCN.settingsLabels.host} settingKey={"proxy_ip"} />
            <SettingsTextInput label={zhCN.settingsLabels.port} settingKey={"proxy_port"} />
          </Flex>
          <SettingsSwitch
            label={zhCN.settingsLabels.useProxyForPeerConnections}
            settingKey={"proxy_peer_connections"}
          />
          <SettingsSwitch
            label={zhCN.settingsLabels.useProxyOnlyForTorrents}
            settingKey={"proxy_torrents_only"}
          />
        </>
      )}
      {ProxyWithAuth && (
        <SettingsBox title={zhCN.settingsLabels.authentication}>
          <SettingsTextInput label={zhCN.settingsLabels.username} settingKey={"proxy_username"} />
          <SettingsTextInput
            label={zhCN.settingsLabels.password}
            settingKey={"proxy_password"}
            helperText={zhCN.settingsLabels.passwordSavedUnencrypted}
          />
        </SettingsBox>
      )}
    </SettingsBox>
  );
};

export default ProxyServer;
