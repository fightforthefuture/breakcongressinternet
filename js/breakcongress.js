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

var modal = document.getElementById('twitter_modal');

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