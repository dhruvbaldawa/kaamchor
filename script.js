// Prefix for the localStorage settings.
var PREFIX = "restrict_facebook_";

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
}

var overlay = {
    show: function() {
        $("#overlay").fadeIn('fast', 'swing');
        $("body").addClass("blur");
    },
    hide: function () {
        $("#overlay").fadeOut("fast");
        $("body").removeClass("blur");
    }
};

function init() {
    $("body").append('<div id="overlay"></div>');
    overlay.show();
}

$(document).ready(function() {
    init();
});