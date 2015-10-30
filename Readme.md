#doormat
_an alternative way to navigate through your site content_

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/doormat.jpg)

`doormat` provides a slightly different way to traverse through your site content.

It's small, has no dependencies and is easy to use.

##Usage

To create your doormat.

1. Include `doormat.js` and `doormat.css` in the DOM.
2. Set up the DOM accordingly. The structure needs to be a container with children that will become the sliding panels. `ol` and `ul` are fitting elements.
```html
  <ol>
    <li>Awesome</li>
    <li>Site</li>
    <li>Content</li>
  </ol>
```
3. Invoke the `doormat` function passing in the containing element as a parameter;
```javascript
var container = document.querySelector('ul');
var myDoormat = new doormat(container);
```

##Why not use curtain.js?
A fair question. I was unaware of `curtain.js` when creating `doormat` initially. I was experimenting with different implementations of parallax style effects and messing about with viewport units.

`curtain.js` is a more feature rich solution and provides some different behavior and hooks. It does however depend on `jQuery`.

Unfortunately, `curtain.js` is no longer maintained and there are reports of issues with newer versions of jQuery.

My aim with `doormat` was to keep the solution minimal with no dependencies to provide the basic effect. It was a result of curiosity and playing with code.

##Contributing
Don't hesitate to post an issue or suggestion or get in touch by tweeting me [@_jh3y](https://twitter.com/_jh3y)!

##License
MIT

jh3y 2015
