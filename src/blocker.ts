import puppeteer = require("puppeteer");
import { resolve } from "path";

/**
 * File extentions which are associated with media files.
 */
export const MEDIA_FILE_EXTENTIONS: string[] = ["png", "jpeg", "jpg", "webm", "ico", "gif", "css", "woff2", "mp4"];

/**
 * Resource types which are associated with media files.
 */
export const MEDIA_RESOURCE_TYPES: string[] = ["image", "font", "stylesheet", "media"];

/**
 * Blocks certain file extentions and resource types for all request of an puppeteer site made in the future.
 *
 * @param page The Puppeteer page for which the requests shall be blocked for.
 * @param filetypes The file extentions which shall be blocked as an array.
 * @param resourceTypes Array of ResourceTypes. Valid ResourceTypes are "document", "stylesheet", "image", "media", "font", "script", "texttrack", "xhr", "fetch", "eventsource", "websocket", "manifest" and "other"
 */
export function blockRequests(page: puppeteer.Page, fileExtentions: string[], resourceTypes: puppeteer.ResourceType[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    await page.setRequestInterception(true);
    page.on("request", req => {
      let resType = req.resourceType();
      for (let i in resourceTypes) {
        if (resType == resourceTypes[i]) {
          req.abort();
          return;
        }
      }
      let url = req.url();
      if (url.indexOf("?") != -1) url = url.split("?")[0];
      for (let i in fileExtentions) {
        if (url.toLowerCase().endsWith("." + fileExtentions[i].toLowerCase())) {
          req.abort();
          return;
        }
      }
      req.continue();
    });
    resolve();
  });
}