Blackout Congress JavaScript Widget
===================================

This is the JavaScript code provided by **[blackoutcongress.org][1]** to block
Congress from visiting any page that embeds it. Join the protest with your site!
We are blacking out Congress' Internet until they end all mass surveillance laws
and let the PATRIOT Act expire. By default, Congress will be taken to our
[landing page][1] with the following message, but you can customize the URL and
send to your own blackout page! Instructions below.

    **We are blocking your access until you end mass surveillance laws**

    You have conducted mass surveillance of everyone illegally and are now on
    record for trying to enact those programs into law. You have presented
    Americans with the false dichotomy of reauthorizing the PATRIOT Act or
    passing the USA Freedom Act. The real answer is to end all authorities used
    to conduct mass surveillance. Until you do, thousands of web sites have
    blocked your access, and more are joining every day.

### Installation Instructions

Super easy. Simply embed this code on your page before the closing </HEAD> tag:

```html
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```

### Customization Instructions

**Customize the blackout page URL**

If you want to use your own landing page for the blackout, add a script
containing the `fftf_redirectjs` config object before your embed. Like so:

```html
<script type="text/javascript">
fftf_redirectjs = {
    url: 'http://YOUR_URL.COM'  // your URL here
}
</script>
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```

**Always redirect (useful for testing)**

If, for some reason, you want to always redirect for everyone who visits your
page, regardless of if they're in Congress, add the `alwaysRedirect` property
to the `fftf_redirectjs` config object. This is mainly useful for testing.

```html
<script type="text/javascript">
fftf_redirectjs = {
    alwaysRedirect: true
}
</script>
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```

### Questions, comments?

Please email jeff@fightforthefuture.org, submit an Issue, a Pull Request, or
complain very loudly on Twitter. And we'd love to hear about any sites that are
adding the widget!


[1]: https://www.blackoutcongress.org