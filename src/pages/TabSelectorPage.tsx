import React from "react";
import {
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { PageId, Pages, normalizePageId } from "../Pages";
import { useLocalStorage } from "usehooks-ts";

export const defaultTabs: PageId[] = ["trending", "search"];

const TabSelectorPage = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const [storedTabs, setTabs] = useLocalStorage<(PageId | "")[]>(
    "tabs-v2",
    defaultTabs
  );
  const tabs = storedTabs.map((tab) => normalizePageId(tab) || "");

  return (
    <Flex flexDirection={"column"} gap={4}>
      {Pages.map((page) => {
        if (!page.visibleOn.includes("tabSelector")) {
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
              value={tabs.indexOf(page.id)}
              opacity={tabs.indexOf(page.id) === -1 ? 0.5 : 1}
              onChange={(e) =>
                setTabs((curr) =>
                  curr.map((value, index) => {
                    const currentValue = normalizePageId(value) || "";

                    if (e.target.value === "-1" && page.id === currentValue) {
                      return "";
                    }

                    if (index.toString() === e.target.value) {
                      return page.id;
                    } else {
                      return currentValue;
                    }
                  })
                )
              }
            >
              <option value={0}>位置 1</option>
              <option value={1}>位置 2</option>
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
          位置 1
        </Text>
        <span />
        <Text bg={"blue.400"} p={1} rounded={"md"}>
          位置 2
        </Text>
      </SimpleGrid>
    </Flex>
  );
};

export default TabSelectorPage;
