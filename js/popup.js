var N_ID = 'TRAFFIC_LIGHT_NOTIFICATION';

$(document).ready(function () {
  console.log("ready!");
  chrome.storage.sync.get({
    redurl: "",
    greenurl: "",
    yellowurl: "",
    redmethod: "",
    greenmethod: "",
    yellowmethod : ""
  }, function (items) {
    console.log(items);
    setButtonData("red", items.redurl, items.redmethod);
    setButtonData("green", items.greenurl, items.greenmethod);
    setButtonData("yellow", items.yellowurl, items.yellowmethod);
  });

  $("#settings").click(function () {
    chrome.runtime.openOptionsPage();
  });

  $("a[trafficlight]").click(function () {

    doPostRequest($(this).attr('button-color'), $(this).attr('button-url'), $(this).attr('request-method-type'));
  });
});

function setButtonData(color, url, requestMethodType) {
  $("a[button-color=" + color + "]").attr('button-url', url);
  $("a[button-color=" + color + "]").attr('request-method-type', requestMethodType);

  var title = url;
  if (url.length == 0)
    title = "This button has no URL";

  $("a[button-color=" + color + "]>span[class=round]").text(title);
}

function doPostRequest(color, url, requestMethodType) {
    console.log("doPostRequest: "+color+" URL = "+url+" requestMethodType = "+requestMethodType);

  url = url.trim();
  if (url.length == 0) {
    chrome.notifications.clear(N_ID);
    chrome.notifications.create(N_ID, {
      type: "basic",
      title: color + " clicked",
      message: "This button has no URL",
      iconUrl: "/img/" + color + ".png"
    });
    return;
  }

  
  $.ajax({
    method: requestMethodType,
    url: url, 
    dataType: "text",
    beforeSend: function( xhr, settings ) {
      chrome.browserAction.setBadgeText({
        text: "..."
      });

      chrome.notifications.clear(N_ID);
      chrome.notifications.create(N_ID, {
        type: "basic",
        title: "Do "+requestMethodType+ " Request",
        message: "Waiting for response from \n"+url,
        iconUrl: "/img/" + color + ".png"
      });
    }
  })
    .done(function( data ) {
      console.log(data);

      chrome.notifications.clear(N_ID);
      chrome.notifications.create(N_ID, {
        type: "basic",
        title: color + " clicked",
        message: data,
        iconUrl: "/img/" + color + ".png"
      });
    })
    .fail(function() {
      chrome.notifications.clear(N_ID);
      chrome.notifications.create(N_ID, {
        type: "basic",
        title: color + " clicked",
        message: "Error happens when request "+url,
        iconUrl: "/img/" + color + ".png"
      });
    })
    .always(function() {
      chrome.browserAction.setBadgeText({
        text: ""
      });
    });

}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('on receive message from popup.js ...')

    if (request.updateOptionSuccess == true) {
      sendResponse({
        farewell: "goodbye"
      });
      return true;

    }
  });