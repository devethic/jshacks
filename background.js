var currentTab;

chrome.tabs.onCreated.addListener(function(tab) {
  // remove tab opened by specific site for ads
  chrome.tabs.get(tab.openerTabId, (tParent) => {
    removeTab(/(?:liens-telechargement)\.com/i, tParent.url, tab.id);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (/liens-telechargement\.com/i.test(tab.url)) {
      // we use alarm to delay content script actions because of jQuery
      // TODO do better
      currentTab = tab;
      chrome.alarms.create("liensTelechargementCom", {"delayInMinutes": 0.1}); // ~5 seconds !!!
    }
});

chrome.alarms.onAlarm.addListener(alarm => {
  //interact with content script
  if (alarm.name == "liensTelechargementCom")
    chrome.tabs.sendMessage(currentTab.id, "liensTelechargementCom");
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
});

////////////////////////////////////////////////////////////////////////////////

function removeTab (regex, url, tabId) {
  if (regex.test(url)) {
    chrome.tabs.remove(tabId);
  }
}
