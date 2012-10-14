// Prefix for the localStorage settings.
var PREFIX = "restrict_facebook_";

// The overlay HTML template.
var HTML = '\
<div id="message">\
    <h1>{title}</h1>\
    <p>{message}</p>\
    <p>You have <a href="#">{n_friend_requests} friend requests</a>, <a href="#">{n_messages} unread messages</a> and <a href="#">{n_notifications} notifications</a>.</p>\
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
    delay: 1*1000, // The delay before the overlay appears.
    strict: true, // If the user can close the dialog or not.
    messages: [], // The set of messages that the user might see.
    interval: 5000, // Interval to check in.
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
    },
    update: function () {
        values = {
            'title': facebook.get_name().split(' ')[0] + ', why don\'t you do something meaningful ?',
            'message': "I don't think its worth checking on Facebook right now.",
            'n_friend_requests': facebook.get_friend_requests(),
            'n_messages': facebook.get_messages(),
            'n_notifications': facebook.get_notifications()
        };
        // Get the dialog ready and show it !
        html = HTML.format(values);
        $("#overlay").html(html);
    }
};

// Takes values from Facebook DOM and displays it to the user.
var facebook = {
    /**
    * Returns the user's unread notifications.
    */
    get_notifications: function() {
        return parseInt($("#notificationsCountValue").text());
    },
    /**
    * Returns the user's unread messages.
    */
    get_messages: function() {
        return parseInt($("#mercurymessagesCountValue").text());
    },
    /**
    * Returns the user's unread friend requests.
    */
    get_friend_requests: function() {
        return parseInt($("#requestsCountValue").text());
    },
    /**
    * Returns the user's name.
    */
    get_name: function() {
        return $(".fbxWelcomeBoxName").text();
    },
    /**
    * Returns the unread items on the user sidebar.
    * @TODO: add error checking code.
    */
    get_sidebar_unread: function() {
        return_obj = {};
        $(".hasCount:visible").each(function(i) {
            count = $(this).parent().prev().find('.countValue').text();
            text = $(this).text();
            return_obj[text] = count; 
        });
        return return_obj;
    }
};

// Let clicking on links hide the dialogs.
$("#overlay a").live('click', function() {
    overlay.hide();
});

/**
* The initialization function.
**/
function init() {
    $("body").append("<div id=\"overlay\"></div>");
    overlay.update();
    overlay.show();
}

/**
* The function which is executed repetitively after every `interval`.
**/
function repeat() {
    // Check if user is just fooling around, when the overlay is hidden.
    if (!$("#overlay").is(":visible")) {
        n = facebook.get_notifications();
        f = facebook.get_friend_requests();
        m = facebook.get_messages();

        // There is nothing to check. Update the timer, and show the overlay
        // after the `delay`.
        if (n + f + m == 0) {
            setTimeout(function() {
                overlay.update();
                overlay.show();
            }, options.delay);
        }
    }
    // Update the overlay if its visible.
    else {
        overlay.update();
    }
}

$(document).ready(function() {
    init();
    setInterval(function() {
        repeat();
    }, options.interval);
});