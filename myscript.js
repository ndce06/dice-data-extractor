chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getDOM")
        sendResponse({ dom: document.getElementsByTagName('body')[0].innerHTML });
    else
        sendResponse({}); // Send nothing..
});
