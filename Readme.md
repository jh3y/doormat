#doormat
_an alternative way to navigate through your site content_

__doormat__ is an alternative to __curtains.js__ that doesn't have any dependencies on external frameworks like jQuery.

Unfortunately, __curtains.js__ is no longer maintained and there had been some reports of issues with newer versions of jQuery.

The code is quite minimal for doormat and you can achieve mostly the same main effect.

###usage
To create your doormat.

1. Decide whether you want a single doormat or a multiple doormat.
2. Set up the DOM accordingly.

  i. For single, a header element(doesn't have to be `header`) followed by an element containing page content;

  ```html
    <header>my awesome site!</header>
    <div>my awesome sites' awesome content</div>
  ```

  ii. For multiple, a list element whether it be `ol` or `ul`;

  ```html
    <ol>
      <li>Awesome</li>
      <li>Site</li>
      <li>Content</li>
    </ol>
  ```

3. Make sure that both `doormat.js` and `doormat.css` are included.
4. Create your doormat with a small bit of javascript, for example the following;

  i. for a single;

  ```javascript
    var myDoormat = new doormat(document.getElementsByTagName('header')[0]);
  ```

  ii.for a double;

  ```javascript
    var myMultDoormat = new doormat(document.getElementsByTagName('ol')[0], true);
  ```


####That's all there is to it.

###Browser support?
So far it's mainly been good news in terms of browser support. However, there always tends to be something. In webkit Safari, there is a repaint issue when scrolling up using a multiple doormat. I've played with a few approaches to no avail :(

###Issues?
Unfortunately, there is one major one. iOS' buggy implementation of CSS viewport units means that the iOS use of doormat is a little experimental. Single doormat seems to work fine but multiple... well just goes horrible.

###Contributing
Don't hesitate to post an issue or suggestion or get in touch about something.

###License
MIT
