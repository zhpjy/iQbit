import React, { PropsWithChildren, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";
import { useIsLargeScreen } from "../utils/screenSize";
import { PageId, Pages, normalizePageId } from "../Pages";
import Home from "../pages/Home";
import { NavLink, useLocation } from "react-router-dom";
import useScrollPosition from "../hooks/useScrollPosition";
import { useLogin } from "../utils/useLogin";
import { logout } from "../components/Auth";
import { isAndroid, isIOS } from "react-device-detect";
import { useReadLocalStorage } from "usehooks-ts";
import { defaultTabs } from "../pages/TabSelectorPage";
import { GlassContainer } from "../components/GlassContainer";
import { useIsPWA } from "../hooks/useIsPWA";
import { zhCN } from "../locales/zh-CN";

export interface DefaultLayoutProps {}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  const { handleLogin, localCreds } = useLogin();
  const { pathname } = useLocation();

  useEffect(() => {
    handleLogin({
      username: localCreds.username,
      password: localCreds.password,
    });
  }, [localCreds.username, localCreds.password, handleLogin]);

  const theme = useTheme();

  const activeColor = theme.colors.blue[500];

  const sharedNavButtonProps = {
    activeColor,
  };
  const iconProps: IconBaseProps = {
    size: 24,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  const isPWA = useIsPWA();
  const isLarge = useIsLargeScreen();

  const largeWorkAreaBgColor = useColorModeValue("white", "gray.900");

  const storedTabs = useReadLocalStorage<(PageId | "")[]>("tabs-v2");
  const tabsSelected =
    storedTabs?.map((tab) => normalizePageId(tab) || "") ?? defaultTabs;

  const middleTab = tabsSelected[0] || "trending";
  const rightTab = tabsSelected[1] || "search";

  const DownloadsPage = Pages.find((page) => page.id === "downloads")!;
  const SettingsPage = Pages.find((page) => page.id === "settings")!;
  const MiddleTab = Pages.find((page) => page.id === middleTab)!;
  const RightTab = Pages.find((page) => page.id === rightTab)!;

  return (
    <Box px={5} pb={100}>
      <Flex
        gap={isLarge ? 10 : undefined}
        as={"main"}
        mb={"30vh"}
        id={"app-container"}
      >
        <Box maxWidth={isLarge ? "400px" : undefined} width={"100%"}>
          {isLarge ? <Home /> : props.children}
        </Box>
        {isLarge && (
          <Flex
            flexGrow={1}
            mt={6}
            as={"aside"}
            backgroundColor={largeWorkAreaBgColor}
            height={"calc(100dvh - 40px)"}
            shadow={"lg"}
            rounded={12}
            overflow={"hidden"}
            position={"fixed"}
            width={"calc(100% - 470px)"}
            left={"450px"}
            id={"desktop-container"}
          >
            <Flex
              flexDirection={"column"}
              backgroundColor={"grayAlpha.300"}
              height={"100%"}
              justifyContent={"space-between"}
              p={5}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) => page.visibleOn.includes("sideNav")).map(
                  ({ url, Icon, title }) => (
                    <NavButton
                      key={url}
                      {...sharedNavButtonProps}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...activeIconProps,
                          ...iconProps,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={title}
                    />
                  )
                )}
              </Flex>
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) =>
                  page.visibleOn.includes("sideNavBottom")
                ).map(({ url, Icon, title }) => (
                  <NavButton
                    key={url}
                    {...sharedNavButtonProps}
                    path={url}
                    icon={{
                      active: Icon.active({
                        ...activeIconProps,
                        ...iconProps,
                      }),
                      inactive: Icon.inactive({ ...iconProps }),
                    }}
                    label={title}
                  />
                ))}
                <Divider my={2} />
                <Button
                  variant={"ghost"}
                  colorScheme={"red"}
                  size={"xs"}
                  fontWeight={"normal"}
                  fontSize={"sm"}
                  textAlign={"left"}
                  onClick={logout}
                >
                  {zhCN.nav.logout}
                </Button>
              </Flex>
            </Flex>
            <Flex
              flexDirection={"column"}
              height={"100%"}
              p={5}
              flexGrow={2}
              overflowY={"auto"}
              overflowX={"hidden"}
            >
              {pathname === "/"
                ? Pages.find((page) => page.id === "search")?.component
                : props.children}
            </Flex>
          </Flex>
        )}
      </Flex>
      {!isLarge && (
        <Flex
          width={"calc(100% - 40px)"}
          left={"20px"}
          position={"fixed"}
          bottom={isPWA ? "25px" : "5px"}
          gap={3}
          id={"mobile-container"}
        >
          <GlassContainer
            flexGrow={1}
            rounded={99999999}
            zIndex={1000}
            noTint
            overflow={"visible"}
          >
            <Flex as={"nav"} width={"100%"}>
              {[DownloadsPage, MiddleTab, SettingsPage].map(
                ({ url, Icon, title }) => {
                  return (
                    <NavButton
                      key={url}
                      {...sharedNavButtonProps}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...activeIconProps,
                          ...iconProps,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={title}
                    />
                  );
                }
              )}
            </Flex>
          </GlassContainer>
          <GlassContainer rounded={"100%"} h={16} aspectRatio={"1 / 1"} noTint>
            <NavButton
              {...sharedNavButtonProps}
              path={RightTab.url}
              icon={{
                active: RightTab.Icon.active({
                  ...activeIconProps,
                  ...iconProps,
                }),
                inactive: RightTab.Icon.inactive({ ...iconProps }),
              }}
              label={""}
            />
          </GlassContainer>
        </Flex>
      )}
    </Box>
  );
};

export default DefaultLayout;
