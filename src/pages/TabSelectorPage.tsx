import React from "react";
import {
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Pages, TabPageId, normalizeTabPageId } from "../Pages";
import { useLocalStorage } from "usehooks-ts";
import { zhCN } from "../locales/zh-CN";

export const defaultTabs: TabPageId[] = ["trending", "search"];

const TabSelectorPage = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const [storedTabs, setTabs] = useLocalStorage<(TabPageId | "")[]>(
    "tabs-v2",
    defaultTabs
  );
  const tabValues = Array.isArray(storedTabs) ? storedTabs : defaultTabs;
  const tabs = tabValues.map((tab) => normalizeTabPageId(tab) || "");

  return (
    <Flex flexDirection={"column"} gap={4}>
      {Pages.map((page) => {
        const tabPageId = normalizeTabPageId(page.id);

        if (!page.visibleOn.includes("tabSelector") || !tabPageId) {
          return null;
        }

        return (
          <Flex
            key={page.url}
            py={3}
            pl={5}
            pr={3}
            rounded={"lg"}
            bgColor={bgColor}
            alignItems={"center"}
          >
            {page.Icon.inactive({ size: 45 })}
            <Heading w={"full"} size={"md"} ml={4}>
              {page.title}
            </Heading>
            <Select
              border={"none"}
              textAlign={"right"}
              pr={2}
              value={tabs.indexOf(tabPageId)}
              opacity={tabs.indexOf(tabPageId) === -1 ? 0.5 : 1}
              onChange={(e) =>
                setTabs((curr) =>
                  (Array.isArray(curr) ? curr : defaultTabs).map(
                    (value, index) => {
                    const currentValue = normalizeTabPageId(value) || "";

                    if (e.target.value === "-1" && tabPageId === currentValue) {
                      return "";
                    }

                    if (index.toString() === e.target.value) {
                      return tabPageId;
                    } else {
                      return currentValue;
                    }
                    }
                  )
                )
              }
            >
              <option value={0}>{zhCN.tabSelector.position1}</option>
              <option value={1}>{zhCN.tabSelector.position2}</option>
            </Select>
          </Flex>
        );
      })}
      <SimpleGrid
        left={0}
        width={"100vw"}
        columns={4}
        textAlign={"center"}
        gap={2}
        position={"fixed"}
        bottom={24}
      >
        <span />
        <Text bg={"blue.400"} p={1} rounded={"md"}>
          {zhCN.tabSelector.position1}
        </Text>
        <span />
        <Text bg={"blue.400"} p={1} rounded={"md"}>
          {zhCN.tabSelector.position2}
        </Text>
      </SimpleGrid>
    </Flex>
  );
};

export default TabSelectorPage;
