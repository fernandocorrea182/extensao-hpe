chrome.browserAction.onClicked.addListener(function(activeTab){
    var newURL = "http://svuxdsoa53:8080/CDNQA/";
    chrome.tabs.create({ url: newURL });
});