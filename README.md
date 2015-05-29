Blackout Congress JavaScript Widget
===================================

Join the protest with your site!
We are blacking out Congress' Internet until they end all mass surveillance laws
and let the PATRIOT Act expire. By default, Congress will be redirected to
[blackoutcongress.org][1], but you can customize the URL and
send to your own blackout page! You can also disable _#ifeelnaked_ photos to
keep your site rated PG.

### Installation Instructions

Super easy. Simply embed this code on your page before the closing /HEAD tag:

```html
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```

### Customization Instructions

**Customize the blackout page URL**

If you want to use your own landing page for the blackout, use this code (be
sure to customize YOUR_URL.COM):

```html
<script type="text/javascript">
fftf_redirectjs = {
    url: 'http://YOUR_URL.COM'  // your URL here
}
</script>
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```
----------------------------------------
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
----------------------------------------------------------------
**Use the default landing page, but no [#ifeelnaked][2] photos**

If you want to keep your site strictly PG-rated, you can link to the default
blackoutcongress.org landing page _minus_ all the shirtless photos of NSA
protestors. **([See example][3])** Just use the `noNudes` parameter.

```html
<script type="text/javascript">
fftf_redirectjs = {
    noNudes: true
}
</script>
<script type="text/javascript" src="https://www.blackoutcongress.org/detect.js"></script>
```

### Questions, comments?

Please email jeff@fightforthefuture.org, submit an Issue, a Pull Request, or
complain very loudly on Twitter. And we'd love to hear about any sites that are
adding the widget!


[1]: https://www.blackoutcongress.org
[2]: https://www.ifeelnaked.org
[3]: https://www.blackoutcongress.org/?pg=1
