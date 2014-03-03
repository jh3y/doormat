
build: components index.js progre-c-ss.css
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
