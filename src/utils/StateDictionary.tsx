import { TorrTorrentInfoStateUnion } from "../types";

const stateDictionary: {
  [i in TorrTorrentInfoStateUnion]: { long: string; short: string };
} = {
  error: {
    long: "发生错误，通常对应已暂停的种子",
    short: "错误",
  },
  missingFiles: {
    long: "种子数据文件缺失",
    short: "文件缺失",
  },
  uploading: {
    long: "种子正在做种，数据传输中",
    short: "做种中",
  },
  pausedUP: {
    long: "种子已暂停，且已完成下载",
    short: "已暂停 / 已完成",
  },
  queuedUP: {
    long: "已启用队列，种子正在排队等待上传",
    short: "排队做种",
  },
  stalledUP: {
    long: "种子正在做种，但当前没有建立连接",
    short: "可做种",
  },
  checkingUP: {
    long: "种子已完成下载，正在校验文件",
    short: "校验文件中",
  },
  forcedUP: {
    long: "种子正在强制上传，忽略队列限制",
    short: "强制上传",
  },
  allocating: {
    long: "种子正在为下载分配磁盘空间",
    short: "分配空间中",
  },
  downloading: {
    long: "种子正在下载，数据传输中",
    short: "下载中",
  },
  metaDL: {
    long: "种子刚开始下载，正在获取元数据",
    short: "获取元数据中",
  },
  pausedDL: {
    long: "种子已暂停，且尚未完成下载",
    short: "已暂停",
  },
  queuedDL: {
    long: "已启用队列，种子正在排队等待下载",
    short: "排队下载",
  },
  stalledDL: {
    long: "种子正在下载，但当前没有建立连接",
    short: "无活动连接",
  },
  checkingDL: {
    long: "正在校验文件，但种子尚未完成下载",
    short: "校验文件中",
  },
  forcedDL: {
    long: "种子正在强制下载，忽略队列限制",
    short: "强制下载",
  },
  checkingResumeData: {
    long: "qBittorrent 启动时正在检查续传数据",
    short: "检查续传中",
  },
  moving: {
    long: "种子正在移动到其他位置",
    short: "移动中",
  },
  stoppedUP:{
    long: "种子当前未上传，但可用于做种",
    short: "可做种"
  },
  unknown: {
    long: "未知状态",
    short: "未知",
  },
};

export default stateDictionary;
