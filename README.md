[![NPM](https://nodei.co/npm/doormat.png?downloads=true)](https://nodei.co/npm/doormat/)

[![Build Status](https://travis-ci.org/jh3y/doormat.svg?branch=master)](https://travis-ci.org/jh3y/doormat)
![img](https://img.shields.io/badge/license-MIT-blue.svg)
![img](https://img.shields.io/badge/dependencies-none-green.svg)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Doormat 👞👡
_an alternative way to traverse through your site content_ 😎

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/GeneralUsage.gif)

## Index

* [How](https://github.com/jh3y/doormat#how)
* [Features](https://github.com/jh3y/doormat#features)
* [Browser support](https://github.com/jh3y/doormat#browser-support)
* [Usage](https://github.com/jh3y/doormat#usage)
  * [Options](https://github.com/jh3y/doormat#options)
  * [API](https://github.com/jh3y/doormat#api)
  * [Events](https://github.com/jh3y/doormat#events)
* [curtain.js?](https://github.com/jh3y/doormat#curtain.js?)
* [Customisation](https://github.com/jh3y/doormat#customisation)
  * [UI Effects](https://github.com/jh3y/doormat#ui-effects)
  * [Caveats](https://github.com/jh3y/doormat#caveats)
  * [Roll your own classes](https://github.com/jh3y/doormat#roll-your-own-classes)
* [Development](https://github.com/jh3y/doormat#development)
* [Contributing](https://github.com/jh3y/doormat#contributing)
* [License](https://github.com/jh3y/doormat#license)

## How
The trick is possible by making sections of the page `position: fixed` and `position: absolute` whilst setting a height for the container element equal to the combined height of the page sections.

Page sections are given an appropriate `top` value that gives some buffer space for scrolling and give the parallax like illusion against whichever section is currently `position: fixed`.

Dependent on the panel mode, as the `window` is scrolled panels come into or move out of the viewport to either reveal or cover up fixed position content.

## Features
* Provides alternative way to traverse content
* Configurable behavior
* Inbound and outbound traversal modes
* Panel snapping to either viewport or as a means of traversing panels
* API for programmatically traversing content
* Responsive
* Animated scrolling
* Simple to create custom effects/behavior with CSS with many possibilities.
* Supports overflowing content in outbound mode(_refer to caveats_:sweat_smile:)
* No dependencies! :tada:
* Scroll/Resize optimization via `requestAnimationFrame`

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/SnapViewport.gif)

## Browser support
| Chrome  | Firefox | Safari  | Opera   | Edge    | IE       |
|:-------:|:-------:|:-------:|:-------:|:-------:|:--------:|
| :smile: | :smile: | :smile: | :smile: | :smile: | :smile:  |

`v5` makes use of `requestAnimationFrame`, `viewport` units and the `Event` API. Most browsers should play nice except `Opera Mini` :-1:. `IE` support should be fine in version `11`.

## Usage
To create your doormat.

1. Include `doormat{.min}.js` and `doormat{.min}.css` in your page/bundle.

2. Create your DOM/Page structure. The containing element needs the classname `dm`. This could be `body`. `doormat` uses panels for each section of content. Therefore, the children of our container need the class `dm-pnl`. `ol` and `ul` make good container elements :wink: A structure like the following is ideal.

  ```html̨
    <body>
      <ol class="dm">
        <li class="dm__pnl">Awesome</li>
        <li class="dm__pnl">Site</li>
        <li class="dm__pnl">Content</li>
      </ol>
      <script src="doormat.min.js"/>
    </body>
  ```

3. Invoke the `Doormat` function passing in desired [options](#Options)(_explained below_) as a parameter;

  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
    var myDoormat = new Doormat();
  });
  ```

### Options
* `{number} snapDebounce - defaults to 150`: No need to trigger snapping behavior on every scroll so `snapDebounce` defines a debouncing duration in ms.
* `{number} scrollDuration - defaults to 250`: Defines the default duration in ms that a panel takes to snap to place or the duration of a programmatic doormat scroll that isn't overridden with the optional parameter.
* `{string} snapMode - defaults to 'viewport'`: Defines the "snap" style of `Doormat` panels. Whether it be `viewport` style, `travel` style or disabled with `false`. Setting to `false` will mean that users can scroll content so that it doesn't sit flush in the viewport.
* `{string} mode - defaults to 'outbound'`: Defines the traversal style. `outbound` will make panels slide out to the top of the viewport revealing content underneath. `inbound` will make panels slide in from the bottom covering content.
* `{number} snapThreshold - defaults to 30`: Define the percentage of the viewport that will trigger a "snap". For example, you start scrolling a panel but no more than `30%` of the viewport height. You stop scrolling and because `snapMode` is set to `viewport`, the panel scrolls back to fit flush with the viewport again :+1:

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/Inbound.gif)

### API
* `{number} activeIndex`: Getter for current active panel index. Useful for conditionals where content should only appear at certain times etc.
* `{Object} active`: Getter for current active panel element.
* `next`: Function to scroll to next panel.
* `prev`: Function to scroll to previous panel.
* `{Array} panels`: Getter for panels collection.
* `reset`: Function to reset Doormat instance. Used on viewport changes. Will instantly scroll to top with no animation and  set first panel as active.
* `{number} scrollPos`: Getter for current scroll position of instance.
* `scrollTo({number} scrollPosition, ?{number} speed)`: Function for scrolling to a specific position within instance. Accepts optional `speed` parameter in ms.
* `scrollToPanel({number} panelIndex, ?{number} speed)`:
Function for scrolling to a specific panel. Accepts optional `speed` parameter in ms.

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/ButtonTravel.gif)

### Events
`Doormat` offers an even that can be bound to for observing when a new panel becomes active. The event is `doormat:update`. Consider the following example that can be used for customisation to show controls once scrolled past the first panel :sunglasses:
```js
window.addEventListener('doormat:update', (e) => {
  if (doormatInstance.activeIndex > 1)
    document.body.classList.add('show-controls')
  else
    document.body.classList.remove('show-controls')
})
```

## curtain.js?
Unfortunately, `curtain.js` is no longer maintained and there were reports of issues with newer versions of jQuery.

`curtain.js` is a more feature rich solution and provides some different behavior and hooks. It does however depend on `jQuery`.

I was unaware of `curtain.js` when creating `Doormat`. Initially, I was experimenting with different implementations of parallax style effects and messing about with viewport units.

My aim with `Doormat` was to create the effect but keep the solution minimal with no dependencies. It was a result of curiosity and playing with code.

## Customisation
### UI Effects
One feature I like with `Doormat` is the ability to create custom effects with relative ease using CSS or conditionally based on the current active panel index of a `Doormat` instance.

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/Customise.gif)

For example, the effects in the above `GIF` are created by leveraging `CSS` transitions based on the current active panel of an instance. The important parts are;

```css
.dm-panel__content {
  opacity: 0;
  transform: scale(0);
  transition: opacity .25s ease 0s, transform .25s ease 0s;
}

.dm-panel--active .dm-panel__content {
  opacity: 1;
  transform: scale(1);
}
```

### Caveats
* If you use `inbound` mode, content larger than the viewport will get cut off as opposed to when using `outbound` mode. Solution? Make the content of the active panel scrollable :nerd_face:

```css
  .dm-panel--active .dm-panel__content {
    overflow: auto;
  }
```

### Roll your own classes
The classes for `Doormat` are config driven with `doormat.config.json`. In here you can alter the classnames for elements to your desire.

__Important::__ If you change the classnames in the config, you will also need to update any reference to them from within the JavaScript source. For example, by altering the `classes` property on the `Doormat` class.

Change the config and then run the build task with `make build`.



## Development
Want to play with the code?

1. Fork and clone or simply clone the repo direct.

        git clone https://github.com/jh3y/doormat.git

2. Navigate into the repo and run the setup task;

        cd doormat
        make setup

3. Run the `develop` task to get up and running with `browser-sync` etc.

        make develop

__NOTE::__ See all available build tasks by simply running `make` in the root of the directory :+1:
```shell
  make
```

![alt tag](https://raw.github.com/jh3y/pics/master/doormat/SnapTravel.gif)

## Contributing
Don't hesitate to post an issue or suggestion or get in touch by tweeting me [@_jh3y](https://twitter.com/_jh3y)!

## License
MIT

jh3y 2017

-----
Images courtesy of [Unsplash](https://unsplash.com/search/kitty) :cat:
