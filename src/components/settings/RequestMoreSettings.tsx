import React from "react";
import {Box, Link, Text} from "@chakra-ui/react";
import SettingsBox from "./SettingsBox";
import SettingsSwitch from "./Inputs/SettingsSwitch";
import {IoOpen} from "react-icons/io5";

export interface RequestMoreSettingsProps {}

const RequestMoreSettings = (props: RequestMoreSettingsProps) => {
  return (
    <SettingsBox title={"还需要这个页面里的其他设置吗？"}>
      <Text>
        当前只暴露了常用设置项。
        <br />
        <br />
        如果你缺少某个设置，请使用下面的开关关闭此自定义界面，然后在原始 Web UI
        中修改需要的选项。
      </Text>
      <SettingsSwitch
        label={"使用自定义 Web UI"}
        settingKey={"alternative_webui_enabled"}
      />
      <Box>
        <Text>
          也可以为你需要的设置提交一个 Issue（如果还没有人提过的话）。
        </Text>
        <Link
          textDecoration={"underline"}
          href={"https://github.com/ntoporcov/iQbit/issues"}
          target={"_blank"}
          rel="noreferrer"
        >
          GitHub Issues <IoOpen style={{ display: "inline" }} />
        </Link>
      </Box>
    </SettingsBox>
  );
};

export default RequestMoreSettings;
