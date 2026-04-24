import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  LightMode,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { useIsLargeScreen } from "../utils/screenSize";
import IosActionSheet from "../components/ios/IosActionSheet";
import { TorrPlugin, TorrPublicPlugin } from "../types";
import { IoConstruct, IoEllipsisVertical, IoPerson } from "react-icons/io5";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import { StatWithIcon } from "../components/StatWithIcon";
import { zhCN } from "../locales/zh-CN";

const SearchPlugin = ({ plugin }: { plugin: TorrPlugin }) => {
  const pluginOptionsDisclosure = useDisclosure();

  const queryClient = useQueryClient();

  const { mutate: toggleEnable } = useMutation(
    "enablePluginToggle",
    () => TorrClient.togglePluginEnabled(plugin.name, !plugin.enabled),
    {
      onSuccess: () => {
        setTimeout(async () => {
          await queryClient.invalidateQueries(SearchPluginsPageQuery);
        }, 500);
      },
    }
  );

  const { mutate: uninstall } = useMutation(
    "uninstallPlugin",
    () => TorrClient.uninstallPlugin(plugin.name),
    {
      onSuccess: () => {
        setTimeout(async () => {
          await queryClient.invalidateQueries(SearchPluginsPageQuery);
        }, 500);
      },
    }
  );

  const isLarge = useIsLargeScreen();
  const backgroundColor = useColorModeValue(
    "white",
    isLarge ? "black" : "gray.900"
  );

  const deleteDisclosure = useDisclosure();

  return (
    <Box
      key={plugin.fullName}
      bgColor={backgroundColor}
      p={5}
      rounded={"lg"}
      w={"100%"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <span>
          <Flex alignItems={"center"} gap={3}>
            <Circle
              bgColor={plugin.enabled ? "green.500" : "gray.500"}
              size={4}
            />
            <Heading>{plugin.fullName}</Heading>
          </Flex>
          <Text opacity={0.5}>
            {zhCN.plugins.version} {plugin.version}
          </Text>
          <Text opacity={0.5}>{plugin.url}</Text>
        </span>
        <Flex>
          <IosActionSheet
            disclosure={deleteDisclosure}
            options={[
              {
                label: zhCN.plugins.confirmUninstall,
                onClick: uninstall,
                danger: true,
              },
            ]}
          />
          <IosActionSheet
            trigger={
              <Button
                variant={"ghost"}
                onClick={pluginOptionsDisclosure.onToggle}
              >
                <IoEllipsisVertical size={25} />
              </Button>
            }
            disclosure={pluginOptionsDisclosure}
            options={[
              {
                label: zhCN.plugins.uninstallPlugin,
                onClick: deleteDisclosure.onOpen,
                danger: true,
              },
              {
                label: plugin.enabled
                  ? zhCN.plugins.disablePlugin
                  : zhCN.plugins.enablePlugin,
                onClick: toggleEnable,
              },
            ]}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

const PublicPlugin = ({
  plugin,
  onSuccess,
  isInstalled,
}: {
  plugin: TorrPublicPlugin;
  onSuccess: (path: string) => void;
  isInstalled?: boolean;
}) => {
  const queryClient = useQueryClient();

  const { mutate: addPlugin, isLoading: addLoading } = useMutation(
    (path: string) => TorrClient.installPlugin(path),
    {
      onSuccess: (res, path) => {
        onSuccess(path);
        return queryClient.invalidateQueries(SearchPluginsPageQuery);
      },
    }
  );

  return (
    <Box p={4} borderColor={"grayAlpha.400"} borderWidth={1} rounded={5}>
      <Flex gap={2} alignItems={"center"}>
        <Image src={plugin.img} alt={"插件图标"} w={4} h={4} />
        <Heading size={"md"}>{plugin.name}</Heading>
      </Flex>

      <Flex columnGap={3} opacity={0.5} flexWrap={"wrap"}>
        <StatWithIcon icon={<IoPerson />} label={plugin.authors?.join(", ")} />
        <StatWithIcon icon={<IoConstruct />} label={plugin.lastUpdated} />
        <StatWithIcon
          icon={<></>}
          label={`${zhCN.plugins.version} ${plugin.version}`}
        />
      </Flex>
      <Heading size={"sm"} mt={2}>
        {zhCN.plugins.comments}
      </Heading>
      <Text>{plugin.comments}</Text>

      <LightMode>
        <Button
          isDisabled={addLoading || isInstalled}
          isLoading={addLoading}
          variant={isInstalled ? "unstyled" : undefined}
          colorScheme={"blue"}
          w={"100%"}
          size={"md"}
          mt={3}
          color={isInstalled ? "blue.500" : undefined}
          onClick={() => {
            if (!plugin.link) return;
            addPlugin(plugin.link);
          }}
        >
          {isInstalled ? zhCN.plugins.installed : zhCN.plugins.addPlugin}
        </Button>
      </LightMode>

      {plugin?.readme && (
        <Button
          variant={"ghost"}
          colorScheme={"blue"}
          w={"100%"}
          size={"md"}
          mt={3}
        >
          {zhCN.plugins.viewReadme}
        </Button>
      )}
    </Box>
  );
};

export const SearchPluginsPageQuery = "getPlugins";

export function MobileSettingsAddButton(props: {
  addPluginDisclosure: UseDisclosureReturn;
  onClick?: () => void;
}) {
  return (
    <Button
      size={"lg"}
      position={"fixed"}
      top={0}
      right={5}
      mt={4}
      variant={"unstyled"}
      color={"blue.500"}
      onClick={() => {
        props?.onClick && props.onClick();
        props.addPluginDisclosure.onToggle();
      }}
      zIndex={30}
    >
      {zhCN.plugins.add}
    </Button>
  );
}

const SearchPluginsPage = () => {
  const { data, refetch } = useQuery(
    SearchPluginsPageQuery,
    TorrClient.getInstalledPlugins
  );

  const [pluginLocation, setPluginLocation] = useState("");
  const [added, setAdded] = useState<string[]>([]);

  const { data: publicPlugins } = useQuery("getPublicPlugins", async () => {
    const { data } = await axios.get<TorrPublicPlugin[]>(
      "https://iqbit.app/api/plugins"
    );
    return data;
  });

  const { mutate: addPlugin, isLoading: addLoading } = useMutation(
    () => TorrClient.installPlugin(pluginLocation),
    {
      onSuccess: () => {
        setAdded((curr) => [...curr, pluginLocation]);
        return refetch();
      },
    }
  );

  const addPluginDisclosure = useDisclosure();
  const publicPluginsDisclosure = useDisclosure();
  const isLarge = useIsLargeScreen();

  return (
    <>
      {isLarge ? (
        <PageHeader
          title={zhCN.nav.searchPlugins}
          buttonLabel={zhCN.plugins.addPlugin}
          onAddButtonClick={addPluginDisclosure.onToggle}
        />
      ) : (
        <MobileSettingsAddButton addPluginDisclosure={addPluginDisclosure} />
      )}
      <Flex gap={2} mt={isLarge ? 5 : 0} w={"100%"} flexDirection={"column"}>
        {data?.map((plugin) => (
          <SearchPlugin key={plugin.fullName} plugin={plugin} />
        ))}
      </Flex>
      <IosBottomSheet
        title={zhCN.plugins.addPlugin}
        disclosure={addPluginDisclosure}
      >
        <FormControl>
          <Flex justifyContent={"space-between"} mb={2}>
            <FormLabel mb={0}>{zhCN.plugins.pluginLocation}</FormLabel>
            <FormHelperText>{zhCN.plugins.localPathOrUrl}</FormHelperText>
          </Flex>
          <Input
            value={pluginLocation}
            onChange={(e) => setPluginLocation(e.target.value)}
          />
          <LightMode>
            <Button
              colorScheme={"blue"}
              w={"100%"}
              mt={4}
              onClick={() => addPlugin()}
              isLoading={addLoading}
              isDisabled={addLoading}
            >
              {zhCN.plugins.addPlugin}
            </Button>
          </LightMode>
          <Button
            colorScheme={"blue"}
            w={"100%"}
            mt={4}
            variant={"ghost"}
            onClick={() => {
              addPluginDisclosure.onClose();
              publicPluginsDisclosure.onOpen();
            }}
          >
            {zhCN.plugins.viewPublicPlugins}
          </Button>
        </FormControl>
      </IosBottomSheet>
      <IosBottomSheet
        title={zhCN.plugins.publicPluginsTitle}
        disclosure={publicPluginsDisclosure}
        modalProps={{ size: "2xl" }}
      >
        <Text my={3}>
          {zhCN.plugins.publicPluginsWarning}
        </Text>
        <Flex gap={3} flexDirection={"column"}>
          {publicPlugins?.map((plugin, key) => {
            const isInstalled = added?.some((inst) => inst === plugin.link);

            return (
              <PublicPlugin
                key={key}
                plugin={plugin}
                onSuccess={async (path) => {
                  setAdded((curr) => [...curr, path]);
                }}
                isInstalled={isInstalled}
              />
            );
          })}
        </Flex>
      </IosBottomSheet>
    </>
  );
};

export default SearchPluginsPage;
