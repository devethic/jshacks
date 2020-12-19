const currentTabs = new Map();
var lastUpdatedTab;

chrome.windows.onCreated.addListener(function (win){
  // remove all window popup
  // TODO: try to filter opener's url
  if (win.type == "popup") {
    removeWin(win.id);
  }
});

chrome.tabs.onCreated.addListener(function(tab) {
  // remove tab opened by specific site for ads
  chrome.tabs.get(tab.openerTabId, (tParent) => {
    removeTab(/(?:liens-telechargement\.com)/i, tParent.url, tab.id);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (/(liens-telechargement\.com|uptobox\.com|1fichier\.com|ed-protect\.org)/i.test(tab.url)) {
      if(!currentTabs.has(tab.id))
        currentTabs.set(tab.id, tab);
      lastUpdatedTab = tab;
      if (/liens-telechargement\.com/i.test(tab.url)) {
        // we use alarm to delay content script actions because of jQuery
        // TODO do better
        chrome.alarms.create("liensTelechargementCom", {"delayInMinutes": 1}); // ~5 seconds !!!
      }
      else if (/ed-protect\.org/i.test(tab.url)) {
        chrome.alarms.create("edProtectFuckCaptcha", {"delayInMinutes": 0.1});
      }
      return;
    }
    // remove tab opened by specific site for ads
    if (tab.openerTabId) {
      chrome.tabs.get(tab.openerTabId, (tParent) => {
        if (!/(?:dl-protect1\.com|zone\-annuaire\.|^chrome\:\/\/|www\.google\.com\/search\?|translate\.google\.com|extreme\-down\.|extreme-protect\.com|ed-protect\.org|uptobox\.com|dl\.free\.fr|zt\-protect\.)/i.test(tab.url)) {
          removeTab(/(?:zone\-annuaire\.|linkcaptcha\.net|extreme\-down\.|libertyvf\.)/i, tParent.url, tab.id);
        }
      });
    }
});

chrome.alarms.onAlarm.addListener(alarm => {
  //interact with content script
  if (alarm.name == "liensTelechargementCom")
    chrome.tabs.sendMessage(lastUpdatedTab.id, "liensTelechargementCom");
});

chrome.downloads.onCreated.addListener(downloadItem => {
  // close tab after download started
  let r = new RegExp(escapeRegex(downloadItem.referrer),"i");
  currentTabs.forEach((tab, tabId) => {
    if (r.test(tab.url)) {
      removeTab(/.*/, tab.url, tab.id);
      currentTabs.delete(tabId);
      return;
    }
  });
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
    console.log("tab " + tabId + " removed : " + url);
    chrome.tabs.remove(tabId);
  }
}

function removeWin(winId) {
    console.log("window " + winId + " removed : " + "TODO url");
    chrome.windows.remove(winId);
}

function escapeRegex(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
