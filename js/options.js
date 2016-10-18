/**
 * IMPORTANT:
 * To debug the options.js, you have to right-click on the body of the option popup window and select "inspect"
 * Because the option window is embedded into the page chrome://extension, if you just right click any other place and select inspect, it will show the content of chrome://extensions
 */
console.log('start options ... ');

// Saves options to chrome.storage
function save_options() {
    console.log('saving ...');
    var redurl = $('input[id=redurl]').val();
    var greenurl = $('input[id=greenurl]').val();
    var yellowurl = $('input[id=yellowurl]').val();
    var yellowmethod = $('select[name=yellowmethod]').val();
    var redmethod = $('select[name=redmethod]').val();
    var greenmethod = $('select[name=greenmethod]').val();

    var errmsg = isAcceptableUrlInput(redurl) ? "" : "Red URL is invalid";
    errmsg += isAcceptableUrlInput(greenurl) ? "" : "<br>Green URL is invalid";
    errmsg += isAcceptableUrlInput(yellowurl) ? "" : "<br>Yellow URL is invalid";

    if (errmsg.length > 0) {
        $('#status').html(errmsg);
        $('#status').fadeIn();
        return;
    }

    chrome.storage.sync.set({
        redurl: redurl,
        greenurl: greenurl,
        yellowurl: yellowurl,
        greenmethod: greenmethod,
        redmethod: redmethod,
        yellowmethod: yellowmethod
    }, function () {

        chrome.runtime.sendMessage({updateOptionSuccess: true}, function(response) {
            console.log('on receive message from options.js ...')
            console.log(response);
        });

        $('#status').html("Saved");
        $('#status').fadeIn();
        setTimeout(function () {
            $('#status').fadeOut();
            $('#status').html("");
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        redurl: "",
        greenurl: "",
        yellowurl: "",
        yellowmethod: "GET",
        redmethod: "GET",
        greenmethod: "GET"
    }, function (items) {
        console.log(items);
        $("input[name=redurl]").val(items.redurl);
        $("input[name=greenurl]").val(items.greenurl);
        $("input[name=yellowurl]").val(items.yellowurl);
        $('select[name=yellowmethod]').val(items.yellowmethod);
        $('select[name=redmethod]').val(items.redmethod);
        $('select[name=greenmethod]').val(items.greenmethod);

    });
}
$(function () {
    restore_options();
    $("button[id=save]").click(function () {
        save_options();
    })
});

function isAcceptableUrlInput(input) {
    var url = input.trim();
    if (url.length == 0)
        return true;
    else
        return isUrlValid(url);
}

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}