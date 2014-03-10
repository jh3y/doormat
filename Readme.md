#doormat
##an alternative way to navigate through your site content.

__doormat__ is an alternative to __curtains.js__ that doesn't have any dependencies on external frameworks like jQuery.

__curtains.js__ is no longer maintained and there had been some reports of issues with newer versions of jQuery.

the code is quite minimal for doormat and you can achieve mostly the same main effect.

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
	
	iii.if using npm component, you'll need to precede this code with something like;
	
	```javascript
		var doormat = require('doormat');
	```
	
	
	
####That's all there is to it.

###browser support?
So far it's mainly been good news in terms of browser support. However, there always tends to be something. In webkit Safari, there is a repaint issue when scrolling up using a multiple doormat. I've played with a few approaches to no avail :(

###issues?
Unfortunately, there is one major one. iOS' buggy implementation of CSS viewport units means that the iOS use of doormat is a little experiemental. Single doormat seems to work fine but multiple... well just goes horrible.

###contributing
Don't hesitate to post an issue or suggestion or get in touch about something.

###license
MIT


doormat - http://jh3y.github.io/doormat
Licensed under the MIT license

Jhey Tompkins (c) 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
