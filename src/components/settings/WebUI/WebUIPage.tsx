import React from "react";
import Language from "./Language";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsBox from "../SettingsBox";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import { Link, SimpleGrid } from "@chakra-ui/react";
import SettingsTextArea from "../Inputs/SettingsTextArea";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { TorrDynDNSService } from "../../../types";
import { zhCN } from "../../../locales/zh-CN";

export interface BehaviorPageProps {}

const WebUIPage = (props: BehaviorPageProps) => {
  const dynDNSOptions: SettingsSelectOption[] = [
    {
      value: TorrDynDNSService.UseDynDNS,
      label: "DynDNS",
    },
    {
      value: TorrDynDNSService.useNOIP,
      label: "NO-IP",
    },
  ];

  return (
    <>
      <Language />
      <SettingsBox title={zhCN.webui.title}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
          <SettingsTextInput
            label={zhCN.settingsLabels.ipAddress}
            settingKey={"web_ui_address"}
          />
          <SettingsTextInput label={zhCN.settingsLabels.port} settingKey={"web_ui_port"} />
        </SimpleGrid>
        <SettingsSwitch
          label={zhCN.settingsLabels.useUpnpPortForwardFromRouter}
          settingKey={"web_ui_upnp"}
        />
        <SettingsBox title={zhCN.settingsLabels.useHttpsInsteadOfHttp}>
          <SettingsTextInput
            label={zhCN.settingsLabels.certificatePath}
            settingKey={"web_ui_https_cert_path"}
          />
          <SettingsTextInput
            label={zhCN.settingsLabels.keyPath}
            settingKey={"web_ui_https_key_path"}
            helperText={
              <Link
                textDecoration={"underline"}
                target={"_blank"}
                href={
                  "https://httpd.apache.org/docs/current/ssl/ssl_faq.html#aboutcerts"
                }
                rel="noreferrer"
              >
                {zhCN.settingsLabels.informationAboutCertificates}
              </Link>
            }
          />
        </SettingsBox>
      </SettingsBox>
      <SettingsBox title={zhCN.settingsLabels.authentication}>
        <SettingsTextInput label={zhCN.settingsLabels.username} settingKey={"web_ui_username"} />
        <SettingsTextInput
          label={zhCN.settingsLabels.password}
          settingKey={"web_ui_password"}
          placeholder={"•••••••••••"}
        />
        <SettingsSwitch
          label={zhCN.settingsLabels.bypassAuthenticationForLocalhost}
          settingKey={"bypass_local_auth"}
        />
        <SettingsSwitch
          label={zhCN.settingsLabels.bypassAuthenticationForWhitelistedIPs}
          settingKey={"bypass_auth_subnet_whitelist"}
        />
        <SettingsTextArea
          label={zhCN.settingsLabels.whitelistedIPs}
          settingKey={"bypass_auth_subnet_whitelist"}
          helperText={"Example: 172.17.32.0/24, fdff:ffff:c8::/40"}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.failedAuthenticationLimit}
          settingKey={"web_ui_max_auth_fail_count"}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.banDuration}
          settingKey={"web_ui_ban_duration"}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.sessionTimeout}
          settingKey={"web_ui_session_timeout"}
        />
      </SettingsBox>
      <SettingsBox title={zhCN.settingsLabels.customWebUI}>
        <SettingsSwitch
          label={zhCN.settingsLabels.useAlternativeWebUI}
          settingKey={"alternative_webui_enabled"}
        />
        <SettingsTextInput
          label={zhCN.settingsLabels.alternativeWebUIPath}
          settingKey={"alternative_webui_path"}
        />
      </SettingsBox>
      <SettingsBox title={zhCN.settingsLabels.security}>
        <SettingsSwitch
          label={zhCN.settingsLabels.enableClickjackingProtection}
          settingKey={"web_ui_clickjacking_protection_enabled"}
        />
        <SettingsSwitch
          label={zhCN.settingsLabels.enableCsrfProtection}
          settingKey={"web_ui_csrf_protection_enabled"}
        />
        <SettingsSwitch
          label={zhCN.settingsLabels.enableCookieSecureFlag}
          settingKey={"web_ui_secure_cookie_enabled"}
        />
        <SettingsBox title={zhCN.settingsLabels.hostHeaderValidation}>
          <SettingsSwitch
            label={zhCN.settingsLabels.enabled}
            settingKey={"web_ui_host_header_validation_enabled"}
          />
          <SettingsTextInput
            label={zhCN.settingsLabels.serverDomains}
            settingKey={"web_ui_domain_list"}
          />
        </SettingsBox>
        <SettingsBox title={zhCN.settingsLabels.customHttpHeaders}>
          <SettingsSwitch
            label={zhCN.settingsLabels.enabled}
            settingKey={"web_ui_use_custom_http_headers_enabled"}
          />
          <SettingsTextArea
            label={zhCN.settingsLabels.httpHeaders}
            settingKey={"web_ui_custom_http_headers"}
          />
        </SettingsBox>
        <SettingsBox title={zhCN.settingsLabels.reverseProxySupport}>
          <SettingsSwitch
            label={zhCN.settingsLabels.enabled}
            settingKey={"web_ui_reverse_proxy_enabled"}
          />
          <SettingsTextArea
            label={zhCN.settingsLabels.trustedProxiesList}
            settingKey={"web_ui_reverse_proxies_list"}
          />
        </SettingsBox>
        <SettingsBox title={zhCN.settingsLabels.dynamicDNS}>
          <SettingsSwitch label={zhCN.settingsLabels.enabled} settingKey={"dyndns_enabled"} />
          <SettingsSelect
            label={zhCN.settingsLabels.dynamicDNSProvider}
            settingKey={"dyndns_service"}
            options={dynDNSOptions}
          />
          <SettingsTextInput label={zhCN.settingsLabels.domain} settingKey={"dyndns_domain"} />
          <SettingsTextInput
            label={zhCN.settingsLabels.username}
            settingKey={"dyndns_username"}
          />
          <SettingsTextInput
            label={zhCN.settingsLabels.password}
            settingKey={"dyndns_password"}
          />
        </SettingsBox>
      </SettingsBox>
    </>
  );
};

export default WebUIPage;
