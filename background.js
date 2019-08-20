var currentTabs = new Map();
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
      if(!currentTabs.has(tab.url))
        currentTabs.set(tab.url, tab);
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
        if (!/(?:dl-protect1\.com|annuaire-telechargement\.com|^chrome\:\/\/|www\.google\.com\/search\?|translate\.google\.com|extreme-d0wn\.net|extreme-protect\.com|ed-protect\.org|uptobox\.com|dl\.free\.fr)/i.test(tab.url)) {
          removeTab(/(?:annuaire-telechargement\.com|extreme-d0wn\.net|linkcaptcha\.net|extreme-down\.)/i, tParent.url, tab.id);
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
  let t = currentTabs.get(downloadItem.referrer);
  if (t != undefined) {
    removeTab(/(uptobox\.com|1fichier\.com)/i, t.url, t.id);
    currentTabs.delete(downloadItem.referrer);
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
    console.log("tab " + tabId + " removed : " + url);
    chrome.tabs.remove(tabId);
  }
}

function removeWin(winId) {
    console.log("window " + winId + " removed : " + "TODO url");
    chrome.windows.remove(winId);
}
