// Prefix for the localStorage settings.
var PREFIX = "restrict_facebook_";

// The overlay HTML template.
var HTML = '\
<div id="overlay">\
  <div id="message">\
    <h1>Dude, get some work done !</h1>\
    <p>Boss, you need some serious attention</p>\
  </div>\
</div>';

// Settings variable, abstracts the way settings are stored.
var settings = {
    get: function(key) {
        return JSON.parse(localStorage[PREFIX + key]);
    },
    set: function(key, value) {
        localStorage[PREFIX + key] = JSON.stringify(value);
    }
};

// Options for the extension.
var options = {
    delay: 15, // The delay before the overlay appears.
    strict: true, // If the user can close the dialog or not.
    messages: [], // The set of messages that the user might see.
}

var overlay = {
    show: function() {
        $("#overlay").fadeIn('fast', 'swing');
        $("._li").addClass("blur");
        $(".uiGrid").addClass("blur");
    },
    hide: function () {
        $("#overlay").fadeOut("fast");
        $("._li").removeClass("blur");
    }
};

function init() {
    $("body").append(HTML);
    overlay.show();
}

$(document).ready(function() {
    init();
});