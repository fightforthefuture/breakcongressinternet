var trackOptimizely = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);
}

document.querySelector('.email_signup form').addEventListener('submit', function(e) {
    e.preventDefault();
    var tag = 'breakcongressinternet';

    if (!document.getElementById('email').value) {
        alert('Please enter your email address.');
        return document.getElementById('email').focus();
    }

    var data = new FormData();
    data.append('guard', '');
    data.append('hp_enabled', true);
    data.append('member[email]', document.getElementById('email').value);
    data.append('tag', tag);

    var url = 'https://queue.fightforthefuture.org/action';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('response:', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);
    document.getElementById('thanks').style.display = 'block';
    modal_show('share_modal');
    trackOptimizely('email_signup');
    setTimeout(function() {
        document.getElementById('thanks').style.opacity = 1;
    }, 50);
}, false);

function modal_show(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.style.display = 'table';
    setTimeout(function() {
        overlayNode.className = overlayNode.className.replace(/ ?invisible ?/, ' ');
    }, 50);
};
function modal_hide(id) {
    var overlayNode = document.getElementById(id);
    overlayNode.className += 'invisible';
    setTimeout(function() {
        overlayNode.style.display = 'none';
    }, 400);
}

document.getElementById('twitter-button').addEventListener('click', function(e) {
    e.preventDefault();
    modal_show('twitter_modal');
}, false);

var bindModalEvents = function(modal) {
    modal = document.getElementById(modal);
    modal.querySelector('.gutter').addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            e.preventDefault();
            modal_hide(modal.id);
        }
    }.bind(this), false);

    modal.querySelector('.modal .close').addEventListener('click', function(e) {
        e.preventDefault();
        modal_hide(modal.id);
    }.bind(this), false);
}
bindModalEvents('twitter_modal');
bindModalEvents('share_modal');

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.breakcongressinternet.com%2F');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

var ems = document.querySelectorAll('a.email');
for (var i = 0; i < ems.length; i++) {
    ems[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('mailto:?subject='+encodeURIComponent(EMAIL_SUBJECT)+'&body=https%3A%2F%2Fwww.breakcongressinternet.com%2F');
    }, false);
}

document.getElementById('twitter_signup_submit').addEventListener('click', function(e) {
    console.log('Twitter signup!');
    trackOptimizely('join_twitter');
}, false);