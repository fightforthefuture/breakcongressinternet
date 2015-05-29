(function() { // Start closure.

    // With all due respect, we're owed our privacy back.
    var ranges = [
        // US House of Representatives
        '143.228.0.0/16',
        '143.231.0.0/16',
        '137.18.0.0/16',
        '12.185.56.0/29',
        '12.147.170.144/28',
        '74.119.128.0/22',

        // US Senate
        '156.33.0.0/16',

        // United States Department of Justice
        '149.101.0.0/16',

        // United States Department of Homeland Security
        '65.165.132.0/24',
        '204.248.24.0/24',
        '216.81.80.0/20',

        // Area 51
        /*
        '6.0.0.0/8',
        '7.0.0.0/8',
        '11.0.0.0/8',
        '21.0.0.0/8',
        '22.0.0.0/8',
        '25.0.0.0/8',
        '26.0.0.0/8',
        '29.0.0.0/8',
        '30.0.0.0/8',
        '49.0.0.0/8',
        '50.0.0.0/8',
        '55.0.0.0/8'
        */
    ];

    function main() {
        if (window.fftf_redirectjs && window.fftf_redirectjs.alwaysRedirect) {
            redirect();
            return;
        }

        // Get geolocation.
        var script = document.createElement('script');
        script.setAttribute('async', 'async');
        script.setAttribute('src', 'https://fftf-geocoder.herokuapp.com/?callback=redirect_js_callback');
        document.getElementsByTagName('head')[0].appendChild(script);

        // send leaderboard stat
        sendLeaderboardStat();
    }

    function redirect() {
        if (window.fftf_redirectjs && window.fftf_redirectjs.url)
            var url = window.fftf_redirectjs.url
        
        else {
            var url = 'https://www.blackoutcongress.org/'

            if (window.fftf_redirectjs && window.fftf_redirectjs.noNudes)
                url += '?pg=1';
        }
        location.replace(url);
    }

    window.redirect_js_callback = function(geolocation) {
        var ip = geolocation.ip;

        var match = false;
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i].split('/');
            var maskedIP = getMaskedNetworkAddress(ip, range[1]);

            if (maskedIP === range[0]) {
                match = true;
                break;
            }
        }

        if (match) {
            redirect();
        }
    }

    function getMaskedNetworkAddress(ip, mask) {
        var bits;
        var mbits = new Array(4);
        var SIZE_BYTE = 8; // Prevent the annoying WP smiley faces from showing up

        for (i = 0; i < mbits.length; i++) {
            if (mask >= SIZE_BYTE) {
                bits = Array(SIZE_BYTE + 1).join(1 + '');
                mask -= SIZE_BYTE;
            } else {
                bits = Array(mask + 1).join(1 + '');
                bits += Array(SIZE_BYTE + 1 - mask).join(0 + '');
                mask -= mask;
            }
            mbits[i] = parseInt(bits, 2);
        }
        var ibits = ip.split(".");
        var maskedip = '';
        for (i = 0; i < mbits.length; i++) {
            if (maskedip != '') {
                maskedip += '.';
            }
            ibits[i] = parseInt(ibits[i]);
            ibits[i] &= mbits[i];
            maskedip += ibits[i] + '';
        }

        return maskedip;
    }

    function sendLeaderboardStat() {
        var data = {
            campaign: 'blackoutcongress',
            stat: 'display_widget',
            data: null,
            host: window.location.host.replace('www.', ''),
            session: null
        };

        // Serialize data
        var params = '';
        for (var key in data) {
            if (params.length !== 0) {
                params += '&';
            }
            params += key + '=' + data[key];
        }

        var http = new XMLHttpRequest();
        var url = 'https://fftf-host-counter.herokuapp.com/log';
        http.open('POST', url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(params);
    }

    // Let's begin.
    main();

})(); // End closure.