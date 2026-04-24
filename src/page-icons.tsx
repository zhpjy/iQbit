import {
  IoCog,
  IoCogOutline,
  IoDownload,
  IoDownloadOutline,
  IoExtensionPuzzle,
  IoExtensionPuzzleOutline,
  IoPricetags,
  IoPricetagsOutline,
  IoSearch,
  IoSearchOutline,
  IoText,
  IoTextOutline,
  IoTrendingUp,
  IoTrendingUpOutline,
} from "react-icons/io5";

export const pageIcons = {
  download: {
    active: (props: any) => <IoDownload {...props} />,
    inactive: (props: any) => <IoDownloadOutline {...props} />,
  },
  query: {
    active: (props: any) => <IoSearch {...props} />,
    inactive: (props: any) => <IoSearchOutline {...props} />,
  },
  trend: {
    active: (props: any) => <IoTrendingUp {...props} />,
    inactive: (props: any) => <IoTrendingUpOutline {...props} />,
  },
  category: {
    active: (props: any) => <IoPricetags {...props} />,
    inactive: (props: any) => <IoPricetagsOutline {...props} />,
  },
  size: {
    active: (props: any) => <IoText {...props} />,
    inactive: (props: any) => <IoTextOutline {...props} />,
  },
  config: {
    active: (props: any) => <IoCog {...props} />,
    inactive: (props: any) => <IoCogOutline {...props} />,
  },
  plugin: {
    active: (props: any) => <IoExtensionPuzzle {...props} />,
    inactive: (props: any) => <IoExtensionPuzzleOutline {...props} />,
  },
} as const;
