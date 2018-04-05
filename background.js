var currentTabs = new Map();
var lastUpdatedTab;

chrome.tabs.onCreated.addListener(function(tab) {
  // remove tab opened by specific site for ads
  chrome.tabs.get(tab.openerTabId, (tParent) => {
    removeTab(/(?:liens-telechargement)\.com/i, tParent.url, tab.id);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (/(liens-telechargement\.com|uptobox\.com|1fichier\.com)/i.test(tab.url)) {
      if(!currentTabs.has(tab.url))
        currentTabs.set(tab.url, tab);
      lastUpdatedTab = tab;
      if (/liens-telechargement\.com/i.test(tab.url)) {
        // we use alarm to delay content script actions because of jQuery
        // TODO do better
        chrome.alarms.create("liensTelechargementCom", {"delayInMinutes": 0.1}); // ~5 seconds !!!
      }
    }
});

chrome.alarms.onAlarm.addListener(alarm => {
  //interact with content script
  if (alarm.name == "liensTelechargementCom")
    chrome.tabs.sendMessage(lastUpdatedTab.id, "liensTelechargementCom");
});

chrome.downloads.onCreated.addListener(downloadItem => {
  let t = currentTabs.get(downloadItem.referrer);
  if (t != undefined) {
    removeTab(/(uptobox\.com|1fichier\.com)/i, t.url, t.id);
    currentTabs.delete(downloadItem.referrer);
    console.log("tab removed: "+t.url);
  }
  console.log("referrer: "+downloadItem.referrer);
});

//  chrome.webRequest.onBeforeRequest.addListener(details => {
// //   alert(details.url);
// console.log(details.url);
//    return {cancel:true};
// },
// {urls: ["<all_urls>"]},
// ["blocking"]);

// MARCHE PLUS ?!!!
chrome.webRequest.onBeforeRedirect.addListener(details => {
  removeTab(/pornhub\.com/i, details.url, details.tabId);
}, {urls:["<all_urls>"]});

////////////////////////////////////////////////////////////////////////////////

function removeTab (regex, url, tabId) {
  if (regex.test(url)) {
    chrome.tabs.remove(tabId);
  }
}
