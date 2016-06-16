![img](https://img.shields.io/badge/license-MIT-blue.svg)
![img](https://img.shields.io/badge/dependencies-none-green.svg)

# doormat
_an alternative way to navigate through your site content_

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/doormat.jpg)

`doormat` provides a slightly different way to traverse through your site content.

## Usage

To create your doormat.

1. Include `doormat{.min}.js` and `doormat{.min}.css` in your page.

2. Create your DOM/Page structure. The structure needs to be a container with the classname `dm`. We are filling the page, so this could be `body`. It then needs to have children with the classname `dm__pnl`. `ol` and `ul` make fitting container elements within the body alternatively.

  ```html̨
    <body>
      <ol class="dm">
        <li class="dm__pnl">Awesome</li>
        <li class="dm__pnl">Site</li>
        <li class="dm__pnl">Content</li>
      </ol>
    </body>
  ```

3. Invoke the `Doormat` function passing in desired options(_explained below_) as a parameter;

  ```javascript
  var myDoormat = new Doormat();
  ```
  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
    var myDoormat = new Doormat({
      snapping: {
        travel: true,
        viewport: false,
        threshold: 15,
        debounce: 150,
        duration: 250
      }
    });
  });
  ```

## API options
* `snapping {object}` - Defines `snapping` behavior for doormat. There are two forms of the `snapping` effect. `travel` and `viewport`.
  * `travel {bool, defaults to false}` - enables "snapping" travel. References `threshold`. When scrolling "down", once the threshold is passed, the next slide is snapped into viewport. When scrolling "up" if the user stops scrolling __within__ the threshold, the previous slide snaps into viewport.
  * `viewport {bool, defaults to true}` - enables "snap to viewport" behavior. When a user scrolls the page and the current panel is slightly out of viewport by the given threshold, the panel will snap the panel which currently occupies the majority of the viewport into view.
  * `threshold {number, defaults to 30}` - defines the "snapping" threshold which is a percentage of the viewport height. For example; if the viewport was `1000px` tall and we set the `threshold` as `10`, then the `threshold` barrier will be the top and bottom `100px` of the panel.
  * `debounce {number, defaults to 150}` - we don't want to trigger our snapping behavior on every scroll. The `debounce` option defines a debouncing delay for our snapping behavior to trigger.
  * `duration {number, defaults to 250}` - defines the `transition-duration` for a snapping panel.

## How?
The trick is possible by making sections of the page `position: fixed` and then setting a height for the document `body` equal to the combined height of the page sections.

When the `window` is scrolled down we move our page sections upwards out of the viewport to reveal the content underneath. The opposite being that, when the `window` is scrolled up, we bring our sections back down into view in the same order in which they left(_dictated by the DOM structure_).

## curtain.js?
Unfortunately, `curtain.js` is no longer maintained and there were reports of issues with newer versions of jQuery.

`curtain.js` is a more feature rich solution and provides some different behavior and hooks. It does however depend on `jQuery`.

I was unaware of `curtain.js` when creating `doormat`. Initially, I was experimenting with different implementations of parallax style effects and messing about with viewport units.

My aim with `doormat` was to create the effect but keep the solution minimal with no dependencies. It was a result of curiosity and playing with code.

## Development
If you wish to play with the code, it's simple to get going.

1. Fork and clone or simply clone the repo.

        git clone https://github.com/jh3y/doormat.git

2. Navigate into the repo and install the dependencies.

        cd doormat
        npm setup

3. Run the `develop` task to get up and running with `browser-sync` etc.

        npm run develop

__NOTE::__ I would usually use a task runner like `gulp` in my projects. But, with `doormat` being minimal I had a go at using `npm run scripts` for all my build needs. So, to see all available build scripts, take a look at `package.json`.
```shell
npm run
```
### Roll your own
`doormat` development is config driven with `doormat.config.json`. In here you can alter the classnames for elements to your desire. It is __important__ to remember that if you change the classnames in the config though that you will also need to update any reference to them from within the JavaScript.

Change the config and then run the build task with `npm run publish`.

## Contributing
Don't hesitate to post an issue or suggestion or get in touch by tweeting me [@_jh3y](https://twitter.com/_jh3y)!

## License
MIT

jh3y 2016
