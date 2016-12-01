chrome.browserAction.onClicked.addListener(function(activeTab){
    chrome.tabs.create({ url: "http://svuxdsoa53:8080/CDNQA/"});
});