// Prefix for the localStorage settings.
var PREFIX = "restrict_facebook_";

// The overlay HTML template.
var HTML = '\
<div id="overlay">\
  <div id="message">\
    <h1>{name}, get some work done !</h1>\
    <p>{message}</p>\
    <p>You have <strong>{n_friend_requests} friend requests</strong>, <strong>{n_messages} unread messages</strong> and <strong>{n_notifications} notifications</strong>.</p>\
  </div>\
</div>';

/*
* The string format function taken from:
* http://stackoverflow.com/a/6420040/972283
*/
String.prototype.format = function (args) {
    var newStr = this;
    for (var key in args) {
        newStr = newStr.replace('{' + key + '}', args[key]);
    }
    return newStr;
};

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

// Overlay object, for showing and hiding the overlay.
var overlay = {
    show: function() {
        $("#overlay").fadeIn("fast", "swing");
        $("._li").addClass("blur");
        //$(".uiGrid").addClass("blur");
    },
    hide: function () {
        $("#overlay").fadeOut("fast");
        $("._li").removeClass("blur");
        $(".uiGrid").removeClass("blur");
    }
};

// Takes values from Facebook DOM and displays it to the user.
var facebook = {
    get_notifications: function() {
        return parseInt($("#notificationsCountValue").text());
    },
    get_messages: function() {
        return parseInt($("#mercurymessagesCountValue").text());
    },
    get_friend_requests: function() {
        return parseInt($("#requestsCountValue").text());
    },
    get_name: function() {
        return $(".fbxWelcomeBoxName").text();
    }
};

function init() {
    values = {
        'name': facebook.get_name().split(' ')[0],
        'message': "Get a life, dude !",
        'n_friend_requests': facebook.get_friend_requests(),
        'n_messages': facebook.get_messages(),
        'n_notifications': facebook.get_notifications()
    }
    
    html = HTML.format(values);
    $("body").append(html);
    overlay.show();
}

$(document).ready(function() {
    init();
});