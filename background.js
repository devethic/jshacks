
chrome.tabs.onCreated.addListener(function(tab) {
  // remove tab opened by specific site for ads
  chrome.tabs.get(tab.openerTabId, (tParent) => {
    if (/liens-telechargement\.com/i.test(tParent.url))
      chrome.tabs.remove(tab.id);
  });
});
