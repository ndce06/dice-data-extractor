chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getDOM") {
        sendResponse({ dom: document.getElementsByTagName('body')[0].innerHTML });
    } else if(request.action == "goToNextPage") {
    	$('#dice_paging_top').find('span.icon-filled-arrow-66').parent().click();
    	sendResponse({ dom: document.getElementsByTagName('body')[0].innerHTML });
    } else {
        sendResponse({}); // Send nothing..
    }
});
