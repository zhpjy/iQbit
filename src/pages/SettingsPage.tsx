import React, { Fragment, ReactElement, useState } from "react";
import { useIsLargeScreen } from "../utils/screenSize";
import {
  IoAlbums,
  IoChatbubble,
  IoChevronForward,
  IoCog,
  IoDownload,
  IoExtensionPuzzle,
  IoGitCompare,
  IoLink,
  IoLogoRss,
  IoPhonePortrait,
  IoPricetags,
  IoSpeedometer,
  IoText,
} from "react-icons/io5";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { smartMap } from "../utils/smartMap";
import WebUIPage from "../components/settings/WebUI/WebUIPage";
import { SettingsProvider } from "../components/settings/useSettings";
import DownloadsPage from "../components/settings/Downloads/DownloadsPage";
import SaveAndResetButtons from "../components/settings/SaveAndResetButtons";
import ConnectionPage from "../components/settings/Connection/ConnectionPage";
import SpeedPage from "../components/settings/Speed/SpeedPage";
import RequestMoreSettings from "../components/settings/RequestMoreSettings";
import { logout } from "../components/Auth";
import AllAnnouncementsPage from "../components/settings/AllAnnouncements";
import SearchPluginsPage from "./SearchPluginsPage";
import CategoriesPage from "./CategoriesPage";
import FontSizeSelection from "./FontSizeSelection";
import TabSelectorPage from "./TabSelectorPage";
import { GlassContainer } from "../components/GlassContainer";
import IntegrationsPage from "./IntegrationsPage";
import { zhCN } from "../locales/zh-CN";

export interface SettingsPageProps {}

type SettingsPageId =
  | "download"
  | "connection"
  | "speed"
  | "bitTorrent"
  | "rss"
  | "webUi"
  | "advanced"
  | "updates"
  | "searchPlugins"
  | "categories"
  | "fontSize"
  | "mobileTabs"
  | "integrations";

type SettingsPageGroup = "qbtGroup" | "otherGroup";

type SettingsPageObject = {
  title: string;
  icon: ReactElement;
  component: ReactElement;
  color: string;
  group: SettingsPageGroup;
  mobileOnly?: boolean;
};

const iconSize = 20;

const SettingsPages: Record<SettingsPageId, SettingsPageObject> = {
  download: {
    title: "Download",
    icon: <IoDownload size={iconSize} />,
    component: <DownloadsPage />,
    color: "cyan.500",
    group: "qbtGroup",
  },
  connection: {
    title: "Connection",
    icon: <IoLink size={iconSize} />,
    component: <ConnectionPage />,
    color: "purple.500",
    group: "qbtGroup",
  },
  speed: {
    title: "Speed",
    icon: <IoSpeedometer size={iconSize} />,
    component: <SpeedPage />,
    color: "green.600",
    group: "qbtGroup",
  },
  bitTorrent: {
    title: "BitTorrent",
    icon: <IoGitCompare size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "blue.500",
    group: "qbtGroup",
  },
  rss: {
    title: "RSS",
    icon: <IoLogoRss size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "orange.500",
    group: "qbtGroup",
  },
  webUi: {
    title: "Web UI",
    icon: <IoAlbums size={iconSize} />,
    component: <WebUIPage />,
    color: "pink.500",
    group: "qbtGroup",
  },
  advanced: {
    title: "Advanced",
    icon: <IoCog size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "gray.800",
    group: "qbtGroup",
  },
  updates: {
    title: zhCN.settings.updates,
    icon: <IoChatbubble size={iconSize} />,
    component: <AllAnnouncementsPage />,
    color: "telegram.600",
    group: "otherGroup",
  },
  searchPlugins: {
    title: zhCN.nav.searchPlugins,
    icon: <IoExtensionPuzzle size={iconSize} />,
    component: <SearchPluginsPage />,
    color: "orange.800",
    group: "otherGroup",
    mobileOnly: true,
  },
  categories: {
    title: zhCN.nav.categories,
    icon: <IoPricetags size={iconSize} />,
    component: <CategoriesPage />,
    color: "red.900",
    group: "otherGroup",
    mobileOnly: true,
  },
  fontSize: {
    title: zhCN.nav.fontSize,
    icon: <IoText size={iconSize} />,
    component: <FontSizeSelection />,
    color: "blue.700",
    group: "otherGroup",
    mobileOnly: true,
  },
  mobileTabs: {
    title: zhCN.nav.tabSelector,
    icon: <IoPhonePortrait size={iconSize} />,
    component: <TabSelectorPage />,
    color: "teal.600",
    group: "otherGroup",
    mobileOnly: true,
  },
  integrations: {
    title: zhCN.settings.integrations,
    icon: <IoExtensionPuzzle size={iconSize} />,
    component: <IntegrationsPage />,
    color: "purple.600",
    group: "otherGroup",
  },
};

const SettingsHeader = ({
  title,
  onBackButtonPress,
}: {
  title: string;
  onBackButtonPress?: () => void;
}) => {
  const isLarge = useIsLargeScreen();

  if (!onBackButtonPress) {
    return (
      <Heading size={isLarge ? "xl" : "3xl"} mt={isLarge ? 0 : 5} mb={5}>
        {title}
      </Heading>
    );
  }

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      pt={isLarge ? 0 : 7}
      pb={5}
      width={isLarge ? "calc(100% + (var(--chakra-space-5)) * 2)" : "100vw"}
      position={isLarge ? "relative" : "fixed"}
      left={isLarge ? -5 : 0}
      zIndex={20}
      data-group
    >
      <GlassContainer position={"absolute"} left={5} px={3} rounded={99999}>
        <Button
          size={"lg"}
          variant={"unstyled"}
          display={"flex"}
          alignItems={"center"}
          onClick={onBackButtonPress}
          color={"text"}
          _groupActive={{
            transform: "scale(1.15)",
            opacity: 1,
            background: "transparent",
          }}
        >
          <IoChevronForward size={18} style={{ transform: "rotate(180deg)" }} />
          {zhCN.common.back}
        </Button>
      </GlassContainer>
      <Heading size={"md"} alignItems={"center"}>
        {title}
      </Heading>
    </Flex>
  );
};

const SettingsPage = () => {
  const isLarge = useIsLargeScreen();
  const [page, setPage] = useState<SettingsPageId>();
  const mobileButtonBg = useColorModeValue("white", "gray.900");

  return (
    <SettingsProvider>
      <SettingsHeader
        title={page ? SettingsPages[page].title : zhCN.settings.title}
        onBackButtonPress={page ? () => setPage(undefined) : undefined}
      />
      <Flex minH={"100%"} flexDirection={"column"}>
        {!!page && (
          <Box flexGrow={2} pt={isLarge ? 0 : 24}>
            {SettingsPages[page].component}
          </Box>
        )}
        {!page &&
          (isLarge ? (
            <Box flexGrow={2}>
              <Grid
                gap={2}
                pt={2}
                width={"100%"}
                justifyContent={"flex-start"}
                templateColumns={"repeat( auto-fit, minmax(150px, 1fr) )"}
              >
                {Object.entries(SettingsPages).map(
                  ([pageId, { icon, mobileOnly, title }]) =>
                    !mobileOnly && (
                      <Button
                        minW={"150px"}
                        gap={2}
                        variant={"outline"}
                        flexDirection={"column"}
                        flexGrow={2}
                        key={pageId}
                        p={4}
                        height={"100%"}
                        onClick={() => setPage(pageId as SettingsPageId)}
                        colorScheme={"blue"}
                      >
                        {icon}
                        {title}
                      </Button>
                    )
                )}
              </Grid>
            </Box>
          ) : (
            <Box flexGrow={2}>
              <Flex mt={4} flexDirection={"column"}>
                {smartMap(
                  Object.entries(SettingsPages),
                  (
                    [pageId, { icon, color, group, title }],
                    { isFirst, isLast, prevItem, nextItem }
                  ) => {
                    const groupFirst = isFirst || group !== prevItem?.[1].group;
                    const groupLast = isLast || group !== nextItem?.[1].group;
                    const groupTitle =
                      group === "qbtGroup"
                        ? zhCN.settings.qbtGroup
                        : zhCN.settings.otherGroup;

                    return (
                      <Fragment key={pageId}>
                        {group !== prevItem?.[1].group && (
                          <Heading mt={!isFirst ? 10 : 3} mb={3}>
                            {groupTitle}
                          </Heading>
                        )}
                        <Button
                          mb={-1}
                          gap={2}
                          variant={"outline"}
                          justifyContent={"space-between"}
                          flexGrow={2}
                          px={4}
                          py={3}
                          height={"100%"}
                          onClick={() => setPage(pageId as SettingsPageId)}
                          rounded={0}
                          roundedTop={groupFirst ? "lg" : undefined}
                          roundedBottom={groupLast ? "lg" : undefined}
                          backgroundColor={mobileButtonBg}
                          border={"none"}
                          borderTop={groupFirst ? 0 : "1px"}
                          borderTopColor={"grayAlpha.300"}
                        >
                          <Flex as={"span"} alignItems={"center"}>
                            <Box
                              as={"span"}
                              p={2}
                              backgroundColor={color}
                              rounded={"md"}
                              color={"white"}
                              mr={3}
                            >
                              {icon}
                            </Box>
                            {title}
                          </Flex>
                          <IoChevronForward />
                        </Button>
                      </Fragment>
                    );
                  }
                )}
              </Flex>
            </Box>
          ))}
        <SaveAndResetButtons />
      </Flex>

      {!isLarge && !page && (
        <Button
          width={"100%"}
          colorScheme={"red"}
          variant={"ghost"}
          onClick={logout}
        >
          {zhCN.nav.logout}
        </Button>
      )}
    </SettingsProvider>
  );
};

export default SettingsPage;
