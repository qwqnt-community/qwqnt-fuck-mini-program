import { replaceMiniAppArk, log } from "./replaceMiniAppArk.js";

try {
  IpcInterceptor.onIpcSend(replaceMiniAppArk);
  log("已加载");
} catch (err) {
  log("出现错误：", err);
}
