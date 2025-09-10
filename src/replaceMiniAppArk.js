import { findEvent } from "./findEvent.js";
import { checkChatType } from "./checkChatType.js";
import { replaceArk } from "./replaceArk.js";

const log =
  typeof global.Logs === "function"
    ? new global.Logs("替换小程序卡片")
    : (...args) => {
        console.log("[替换小程序卡片]", ...args);
      };

/**
 * 根据配置替换给定参数中的小程序卡片。
 *
 * @param {Array} args - 包含小程序卡片的参数数组。
 * @return {void} 此函数不返回任何值。
 */
function replaceMiniAppArk(...args) {
  // 接收到获取历史消息列表
  const msgList = args[2]?.msgList;
  if (msgList && msgList.length && checkChatType(msgList[0])) {
    // log("命中聊天记录事件");
    replaceMsgList(msgList);
  }
  // 接收到的新消息
  const onRecvMsg = findEvent(args, [
    "nodeIKernelMsgListener/onRecvMsg",
    "nodeIKernelMsgListener/onRecvActiveMsg",
    "nodeIKernelMsgListener/onMsgInfoListUpdate",
    "nodeIKernelMsgListener/onActiveMsgInfoUpdate",
  ]);
  if (onRecvMsg && checkChatType(args?.[2]?.payload?.msgList?.[0])) {
    // log("命中更新聊天记录事件");
    replaceMsgList(args[2].payload.msgList);
  }

  // 转发消息
  const onForwardMsg = findEvent(args, "nodeIKernelMsgListener/onAddSendMsg");
  if (onForwardMsg && checkChatType(args?.[2]?.payload?.msgRecord)) {
    // log("命中自身转发消息事件");
    replaceMsgList([args[2].payload.msgRecord]);
  }
}

/**
 * 将给定消息列表中的小程序卡片替换为 replaceArk 函数的结果。
 *
 * @param {Array} msgList - 包含小程序卡片的消息对象数组。
 * @return {void} 此函数不返回任何内容。
 */
function replaceMsgList(msgList) {
  try {
    msgList.forEach((msgItem) => {
      let msg_seq = msgItem.msgSeq;
      // 遍历消息内容数组
      msgItem.elements.forEach((msgElements) => {
        // 替换历史消息中的小程序卡片
        if (msgElements?.arkElement?.bytesData) {
          const json = JSON.parse(msgElements.arkElement.bytesData);
          if (json?.prompt?.includes("[QQ小程序]")) {
            msgElements.arkElement.bytesData = replaceArk(json, msg_seq);
            log("替换小程序卡片成功");
          }
        }
      });
    });
  } catch (err) {
    log("出现错误：", err);
  }
}

export { replaceMiniAppArk, log };
