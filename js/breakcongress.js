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

var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

if (window.location.href.indexOf('pg=1') == -1) {
    $(window).scroll(function(e) {
        
        if (isScrolledIntoView('#load_more')) {
            doLoadMore();
        }
    });
}

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

var show_modal = function(el) {
    var overlay = document.getElementById(el);
    overlay.style.display = 'block';
    setTimeout(function() { overlay.className = 'overlay'; }, 30);
}

var hide_modal = function(el) {
    var overlay = document.getElementById(el);
    overlay.className = 'overlay invisible';
    setTimeout(function() { overlay.style.display = 'none'; }, 400);
}

var bind_hide = function(el) {
    document.querySelector('#'+el+' .close.lite').addEventListener(
        'click', function(e) {
            e.preventDefault();
            hide_modal(el);
        }, false
    );
}

var close_modals = ['thanks_modal', 'calling_modal'];

document.querySelector('#fields form').addEventListener('submit', function(e) {
    e.preventDefault();

    var error = false;

    var first_name = document.getElementById('cta_first_name');
    var email = document.getElementById('cta_email');
    var address1 = document.getElementById('cta_street_address');
    var zip = document.getElementById('cta_postcode');

    var add_error = function(el) {
        console.log('error: ', el);
        el.className = 'error';
        error = true;
    };

    if (!first_name.value) add_error(first_name);
    if (!email.value) add_error(email);
    if (!address1.value) add_error(address1);
    if (!zip.value) add_error(zip);

    if (error) return alert('Please fill out all fields :)');

    var data = new FormData();
    data.append('guard', '');
    data.append('hp_enabled', true);
    data.append('member[first_name]', first_name.value);
    data.append('member[email]', email.value);
    data.append('member[street_address]', address1.value);
    data.append('member[postcode]', zip.value);
    data.append('action_comment', document.getElementById('action_comment').value);
    data.append('subject', 'Further action on surveillance reform is needed.');
    data.append('org', 'fftf');
    data.append('tag', 'blackoutcongress');

    var url = 'https://queue.fightforthefuture.org/action';
    show_modal('thanks_modal');

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('response:', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);

    document.getElementById('fields').style.display = 'none';
    document.getElementById('cta_thanks').style.display = 'block';
    
}, false);

var validate_phone = function(num) {
    num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
    num = num.replace("+", "").replace(/\-/g, '');

    if (num.charAt(0) == "1")
        num = num.substr(1);

    if (num.length != 10)
        return false;

    return num;
};

document.querySelector('#thanks_modal form').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Call submit');

    var phone = document.getElementById('call_phone').value;

    if (!validate_phone(phone))
        return alert('Please enter a valid US phone number!');

    var data = new FormData();
    data.append('campaignId', 'endsurveillance');
    data.append('zipcode', document.getElementById('cta_postcode').value);
    data.append('userPhone', validate_phone(phone));

    var url = 'https://call-congress.fightforthefuture.org/create';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('sent!', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);

    hide_modal('thanks_modal');
    show_modal('calling_modal');

}, false);

/*
document.querySelector('#cta_call').addEventListener('click', function(e) {
    e.preventDefault();
    show_modal('thanks_modal');
}, false);
*/

for (var i=0; i<close_modals.length; i++)
    bind_hide(close_modals[i]);

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

var leaderboard_url = 'https://battleforthenet.s3.amazonaws.com/leaderboards/ifeelnaked.display_widget.json';
$.ajax(leaderboard_url, {
    success: function(data) {

        var showLeaderboard = function(e) {
            if (e) e.preventDefault();
            var overlay = document.createElement('div');
            overlay.className = 'overlay invisible';

            var gutter = document.createElement('div');
            gutter.className = 'gutter';

            var modal = document.createElement('div');
            modal.className = 'modal leaderboard';

            var close = document.createElement('a');
            close.href = '#';
            close.className = 'close lite';
            close.addEventListener('click', function(e) {
                e.preventDefault();
                close_modal();
            }, false);
            modal.appendChild(close);

            var div = document.createElement('div');
            div.className = 'explanation';
            var p = document.createElement('p');
            var strong = document.createElement('strong');
            strong.textContent = numberWithCommas(data.sites_participating) + ' sites and counting!';
            p.appendChild(strong);
            var br = document.createElement('br');
            p.appendChild(br);
            var span = document.createElement('span');
            span.textContent = 'Thousands of web sites are blocking access to Congress, making the statement that mass surveillance must end forever. ';
            p.appendChild(span);
            var a = document.createElement('a');
            a.textContent = 'Join with your site!';
            a.href = 'https://members.internetdefenseleague.org/';
            a.target = '_blank';
            p.appendChild(a);
            div.appendChild(p);

            var ex = document.createElement('div');
            ex.className = 'example';
            var top = document.createElement('strong');
            top.textContent = 'Top 100 sites:';
            ex.appendChild(top);
            var ul = document.createElement('ul');
            ul.className = 'leaderboard';
            for (var site in data.sites_top) {
                if (data.sites_top.hasOwnProperty(site)) {
                    var li = document.createElement('li');
                    var a2 = document.createElement('a');
                    a2.textContent = site;
                    a2.href = 'http://'+site;
                    a2.target = '_blank';
                    li.appendChild(a2);
                    var s2 = document.createElement('span');
                    s2.textContent = ' ('+numberWithCommas(data.sites_top[site]).replace('.0', '')+')';
                    li.appendChild(s2);
                    ul.appendChild(li);
                }
            }
            ex.appendChild(ul);
            div.appendChild(ex);


            modal.appendChild(div);
            
            
            gutter.appendChild(modal);
            overlay.appendChild(gutter);
            document.body.appendChild(overlay);

            var close_modal = function() {
                overlay.className = 'overlay invisible';
                setTimeout(function() {
                    document.body.removeChild(overlay);
                    document.body.className = '';
                }, 400);
            }

            gutter.addEventListener('click', function(e) {
                if (e.target == gutter)
                    close_modal();
            }, false);

            overlay.style.display = 'block';
            setTimeout(function() { overlay.className = 'overlay'; }, 50);
            document.body.className = 'noscroll';
        }
        
        document.getElementById('leaderboard_link').textContent = numberWithCommas(data.sites_participating) + ' sites and counting!';
        document.getElementById('leaderboard_link').style.visibility = 'visible';
        document.getElementById('leaderboard_link').addEventListener('click', function(e) {
            showLeaderboard(e);
        }, false);
        
        if (window.location.href.indexOf('leaderboard=1') != -1) {
            console.log('open leaderboard');
            showLeaderboard();
        }
        
    }
});


}); ////////////////////////////////////////////////////////////////////////////