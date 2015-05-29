// Check for outdated browsers
var isIE = navigator.userAgent.match(/MSIE (\d+)\./);
if (isIE) {
    var version = +isIE[1];
    if (version < 10) {
        alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
    }
}

if (navigator.userAgent.match(/Android 2\.3/)) {
    alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
}



var GLITCHINESS = 0.2;
var MAX_COORD_GLITCH = 40;
var COORD_GLITCH_MAX_ADJACENT = 10;
var MAX_COORD_GLITCH_TIME = 200;

setInterval(function() {
    var rand = Math.random();
    if (rand < GLITCHINESS)
        glitch();
    
}, 100);

var glitch = function() {
    horizontalGlitch();
}

var horizontalGlitch = function() {
    var startRow = Math.floor(Math.random() * ROWS);
    var numRows = Math.floor(Math.random() * COORD_GLITCH_MAX_ADJACENT);
    var amount = Math.floor(Math.random() * MAX_COORD_GLITCH*2) - MAX_COORD_GLITCH;

    for (var j=startRow; j<startRow+numRows && j<ROWS; j++)
        setTranslateX(divs[j], amount)

    setTimeout(function() {
        for (var j=startRow; j<startRow+numRows && j<ROWS; j++)
            setTranslateX(divs[j], -amount);
    }, Math.floor(Math.random() * MAX_COORD_GLITCH_TIME));
}

var setTranslateX = function(el, pix) {
    el.style["-webkit-transform"] = "translate("+ pix +"px, 0px)";
    el.style["-moz-transform"] = "translate(" + pix +"px, 0px)";
    el.style["-ms-transform"] = "translate(" + pix + "px, 0px)";
    el.style["-o-transform"] = "translate(" + pix  + "px, 0px)";
    el.style["transform"] = "translate(" + pix + "px, 0px)";
}

$(function() { /////////////////////////////////////////////////////////////////

var isScrolledIntoView = function(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
var doLoadMore = function() {
    if (loading_more || photos_initially_loaded == false)
        return;

    document.querySelector('#load_more a.moar').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';

    console.log('loading more!');
    loading_more = true;
    doLoad();

}
document.querySelector('#load_more a.moar').addEventListener('click', function(e) {
    e.preventDefault();
    doLoadMore();
}, false);

$(window).scroll(function(e) {
    
    if (isScrolledIntoView('#load_more')) {
        doLoadMore();
    }
});

var promotedPage = 0;
var promotedPerPage = 60;
var fillSize = 60;
var finishedPromoted = false;
var processed = 0;

var addItem = function(item) {

    if (document.getElementById(item.username+'_'+item._id)) {
        console.log('skipping duplicate');
        return;
    }
    var img = new Image();
    var photoDivs = document.getElementById('photos').childNodes;

    if (typeof photoDivs[processed] == 'undefined') {
        var docfrag = document.createDocumentFragment();
        for (var i = 0; i < 4; i++)
            docfrag.appendChild(document.createElement('div'))
        document.getElementById('photos').appendChild(docfrag);
    }
    div = photoDivs[processed];
    div.id = item.username+'_'+item._id;
    div.style.backgroundImage = 'url('+item.photo_url_s3.replace('http:', 'https:')+')';
    div.style.backgroundSize = 'auto 100%';
    div.style.backgroundRepeat = 'no-repeat';
    div.style.backgroundPosition = 'center center';
    div.style.backgroundColor = '#333';
    div.addEventListener('click', function(e) {
        if (window.DEBUG)
            console.log(item);
        showModal(item);
    }, false);
    
    processed++;
    
    img.src = item.photo_url_s3.replace('http:', 'https:');
    img.onload = function() {
        document.getElementById(item.username+'_'+item._id).style.opacity = 1;
    }
    setTimeout(function() {
        document.getElementById(item.username+'_'+item._id).style.opacity = 1;
    }, 2000);
}

var showModal = function(item) {
    // console.log('photo: ', item);
    var overlay = document.createElement('div');
    overlay.className = 'overlay invisible';

    var gutter = document.createElement('div');
    gutter.className = 'gutter';

    var modal = document.createElement('div');
    modal.className = 'modal photo';
    
    var img = document.createElement('div');
    img.className = 'photo';
    img.style.background = 'white url('+item.photo_url_s3.replace('http:', 'https:')+') center center no-repeat';
    img.style.backgroundSize = 'auto 100%';
    modal.appendChild(img);

    var tweet = document.createElement('div');
    if (!item.share) {
        tweet.className = 'tweet';
    
        var avatar = document.createElement('a');
        avatar.className = 'avatar';
        avatar.href = item.original_url;
        avatar.target = '_blank';
        var avimg = document.createElement('img');
        avimg.src = item.user_avatar_s3;
        avatar.appendChild(avimg);
        tweet.appendChild(avatar);

        var username = document.createElement('a');
        username.href = item.original_url;
        username.target = "_blank";
        username.textContent = item.username + ":";
        tweet.appendChild(username);

        if (item.caption.length <= 140)
            var caption = item.caption;
        else
            var caption = item.caption.substr(0, 140) + '…';

        var text = document.createElement('span');
        text.src = item.user_avatar_s3;
        text.textContent = ' ' + caption;
        tweet.appendChild(text);
    } else {
        tweet.className = 'tweet share';
        var shareLink = SITE_URL+'/photo/'+item.permalink_slug;

        if (item.landing) {
            var post = document.createElement('a');
            post.className = 'share join';
            post.href = '#';
            post.textContent = 'Join in';
            post.addEventListener('click', function(e) {
                e.preventDefault();
                close_modal();
                show_modal("participate_modal");
                trackOptimizely('click_participate');
            }, false);
            tweet.appendChild(post);
        } else {
            var span = document.createElement('span');
            span.textContent = 'Now, share your photo and @tag your friends to add theirs!';
            tweet.appendChild(span);
        }

        var fb = document.createElement('a');
        fb.className = 'share fb';
        fb.href = '#';
        fb.textContent = 'Share';
        fb.addEventListener('click', function(e) {
            e.preventDefault();
            trackOptimizely('share');
            window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareLink));
        }, false);
        tweet.appendChild(fb);

        var tw = document.createElement('a');
        tw.className = 'share tw';
        tw.href = '#';
        tw.textContent = 'Tweet';
        tw.addEventListener('click', function(e) {
            e.preventDefault();
            trackOptimizely('share');
            window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT+' '+shareLink+' '+(item.photo_display_url ? item.photo_display_url : item.photo_url_s3)));
        }, false);
        tweet.appendChild(tw);
    }

    var close = document.createElement('a');
    close.href = '#';
    close.className = 'close';
    close.addEventListener('click', function(e) {
        e.preventDefault();
        close_modal();
    }, false);
    modal.appendChild(close);


    modal.appendChild(tweet);
    
    gutter.appendChild(modal);
    overlay.appendChild(gutter);
    document.body.appendChild(overlay);

    var close_modal = function() {
        overlay.className = 'overlay invisible';
        setTimeout(function() {
            document.body.removeChild(overlay);
        }, 400);
    }

    gutter.addEventListener('click', function(e) {
        if (e.target == gutter)
            close_modal();
    }, false);

    overlay.style.display = 'block';
    setTimeout(function() { overlay.className = 'overlay'; }, 50);
}

var addItems = function(items) {
    for (var i=0; i < items.length; i++) {
        addItem(items[i]);
    }
}

var doLoad = function(sofar) {
    sofar || (sofar = 0);

    var apiUrl = 'https://ifeelnaked-api.herokuapp.com';
    // var apiUrl = 'http://metacube:9000';

    if (finishedPromoted == false) {
        var skip = promotedPage * promotedPerPage;
        $.ajax(apiUrl+'/promoted/'+promotedPerPage+'/'+skip, {
            success: function(data) {
                // console.log('got promoted: ', data.length, data);
                setTimeout(function(){ loading_more = false; }, 500); // not so fast
                photos_initially_loaded = true;
                addItems(data);
                hide_spinner();
                if (data.length != promotedPerPage) {
                    // console.log('finished with promoted');
                    finishedPromoted = true;
                } else {
                    promotedPage++;
                }
                sofar += data.length;
                if (sofar < fillSize) {
                    doLoad(sofar);
                }
            }
        });
    } else {
        // console.log('getting random approved');
        $.ajax(apiUrl+'/random/'+(fillSize-sofar), {
            success: function(data) {
                hide_spinner();
                setTimeout(function(){ loading_more = false; }, 500); // not so fast
                photos_initially_loaded = true;
                addItems(data)
            }
        });
    }

}
if (window.location.href.indexOf('pg=1') == -1)
    doLoad();
else
    document.getElementById('nakedpics').style.display = 'none';

var hide_spinner = function() {
    document.querySelector('#load_more a.moar').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
}

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.blackoutcongress.org%2F');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:?subject='+encodeURIComponent(EMAIL_SUBJECT)+'&body=http%3A%2F%2Fwww.blackoutcongress.org%2F';
    }, false);
}

}); ////////////////////////////////////////////////////////////////////////////