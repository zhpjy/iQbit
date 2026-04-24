import React, { ReactElement, ReactNode } from "react";
import { zhCN } from "./locales/zh-CN";
import {
  CategoryView,
  ConfigView,
  MainView,
  PluginView,
  QueryView,
  SizeView,
  TabsView,
  TrendView,
} from "./pageViews";
import { pageIcons } from "./page-icons";

export type PageNames =
  | "sideNav"
  | "bottomNav"
  | "sideNavBottom"
  | "mobileConfigList"
  | "tabSelector";

export type PageId =
  | "downloads"
  | "search"
  | "trending"
  | "categories"
  | "fontSize"
  | "settings"
  | "searchPlugins"
  | "tabSelector";

type PageObject = {
  id: PageId;
  title: string;
  url: string;
  component: ReactNode;
  Icon: {
    active: (props: any) => ReactElement;
    inactive: (props: any) => ReactElement;
  };
  visibleOn: PageNames[];
  layout?: (props: any) => ReactNode;
};

const legacyPageLabelToId: Record<string, PageId> = {
  [["Down", "loads"].join("")]: "downloads",
  [["Sea", "rch"].join("")]: "search",
  [["Trend", "ing"].join("")]: "trending",
  [["Catego", "ries"].join("")]: "categories",
  [["Font", " Size"].join("")]: "fontSize",
  [["Set", "tings"].join("")]: "settings",
  [["Sea", "rch Plugins"].join("")]: "searchPlugins",
  [["Tab", " Selector"].join("")]: "tabSelector",
};

export const normalizePageId = (
  value?: string | null
): PageId | undefined => {
  if (!value) {
    return undefined;
  }

  if (value in legacyPageLabelToId) {
    return legacyPageLabelToId[value];
  }

  return value as PageId;
};

export const Pages: PageObject[] = [
  {
    id: "downloads",
    title: zhCN.nav.downloads,
    url: "/",
    component: <MainView />,
    Icon: pageIcons.download,
    visibleOn: ["bottomNav"],
  },
  {
    id: "search",
    title: zhCN.nav.search,
    url: "/search",
    component: <QueryView />,
    Icon: pageIcons.query,
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
  {
    id: "trending",
    title: zhCN.nav.trending,
    url: "/trending",
    component: <TrendView />,
    Icon: pageIcons.trend,
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
  {
    id: "search",
    title: zhCN.nav.search,
    url: "/search/:query",
    component: <QueryView />,
    Icon: pageIcons.query,
    visibleOn: [],
  },
  {
    id: "categories",
    title: zhCN.nav.categories,
    url: "/categories",
    component: <CategoryView />,
    Icon: pageIcons.category,
    visibleOn: ["sideNavBottom", "mobileConfigList", "tabSelector"],
  },
  {
    id: "fontSize",
    title: zhCN.nav.fontSize,
    url: "/font-size",
    component: <SizeView />,
    Icon: pageIcons.size,
    visibleOn: ["sideNavBottom"],
  },
  {
    id: "settings",
    title: zhCN.nav.settings,
    url: "/settings",
    component: <ConfigView />,
    Icon: pageIcons.config,
    visibleOn: ["bottomNav", "sideNavBottom"],
  },
  {
    id: "searchPlugins",
    title: zhCN.nav.searchPlugins,
    url: "/plugins",
    component: <PluginView />,
    Icon: pageIcons.plugin,
    visibleOn: ["mobileConfigList", "sideNav"],
  },
  {
    id: "tabSelector",
    title: zhCN.nav.tabSelector,
    url: "/tab-selector",
    component: <TabsView />,
    Icon: pageIcons.plugin,
    visibleOn: ["mobileConfigList"],
  },
];
