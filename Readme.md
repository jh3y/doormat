#doormat
_an alternative way to navigate through your site content_

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/doormat.jpg)

`doormat` provides a slightly different way to traverse through your site content.

It's small(< 2kB), has no dependencies and is easy to use!

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

###Why not use curtain.js?
A fair question. I was unaware of `curtain.js` when creating `doormat` initially. I was experimenting with different implementations of parallax style effects and messing about with viewport units.

`curtain.js` is a more feature rich solution and provides some different behavior and hooks. It does however depend on `jQuery`.

Unfortunately, `curtain.js` is no longer maintained and there are reports of issues with newer versions of jQuery.

My aim with `doormat` was to keep the solution minimal with no dependencies to provide the basic effect. It was a result of curiosity and playing with code.

##Development
If you wish to hack about with the repo, it's simple to get going.

1. Fork and clone or simply clone the repo.

        git clone https://github.com/jh3y/doormat.git

2. Navigate into the repo and install the dependencies.

        cd doormat
        npm install

3. Run the `develop` task to get up and running with `browser-sync` etc.

        npm run develop

I would usually use a task runner like `gulp` in my projects. But, with `doormat` being minimal I had a go at using `npm run scripts` for all my build needs. So, to see all available build scripts, take a look at `package.json`.

##Contributing
Don't hesitate to post an issue or suggestion or get in touch by tweeting me [@_jh3y](https://twitter.com/_jh3y)!

##License
MIT

jh3y 2015
