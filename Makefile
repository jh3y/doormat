PHONY: help

MODULES = ./node_modules/.bin
UGLIFY = $(MODULES)/uglifyjs
STYLUS = $(MODULES)/stylus
BABEL = $(MODULES)/babel
ESLINT = $(MODULES)/eslint
POSTCSS = $(MODULES)/postcss
CLEANCSS = $(MODULES)/cleancss
PUG = $(MODULES)/pug
GHPAGES = $(MODULES)/gh-pages
BS = $(MODULES)/browser-sync

FILE_NAME = doormat
OUTPUT_DIR = public
DIST_DIR = dist
SCRIPT_SRC = src/js/$(FILE_NAME).js
SCRIPT_DEST = $(OUTPUT_DIR)/js
STYLE_SRC = src/stylus
STYLE_DEST = $(OUTPUT_DIR)/css
MARKUP_SRC = src/pug
MARKUP_DEST = $(OUTPUT_DIR)



UGLIFY_OPTS = --compress --comments --mangle -o $(DIST_DIR)/$(FILE_NAME).min.js $(DIST_DIR)/$(FILE_NAME).js
CLEANCSS_OPTS = --s1 -o $(DIST_DIR)/$(FILE_NAME).min.css $(DIST_DIR)/$(FILE_NAME).css
POSTCSS_OPTS = --use autoprefixer -d $(STYLE_DEST)/ $(STYLE_DEST)/*.css

help:
	@grep -E '^[a-zA-Z\._-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

compile-scripts: ## compiles scripts
	$(BABEL) $(SCRIPT_SRC) -o $(SCRIPT_DEST)/$(FILE_NAME).js

watch-scripts: compile-scripts ## watch for script changes and compile
	$(BABEL) $(SCRIPT_SRC) --watch -o $(SCRIPT_DEST)/$(FILE_NAME).js --source-maps

publish-scripts: compile-scripts ## publish scripts to dist
	mkdir -pv $(DIST_DIR) && cp $(SCRIPT_DEST)/$(FILE_NAME).js $(DIST_DIR)/$(FILE_NAME).js && $(UGLIFY) $(UGLIFY_OPTS)

compile-styles: ## compiles styles
	$(STYLUS) $(STYLE_SRC) -o $(STYLE_DEST) && $(POSTCSS) $(POSTCSS_OPTS)

watch-styles: ## watches and compiles styles
	$(STYLUS) -w $(STYLE_SRC) -o $(STYLE_DEST)

publish-styles: ## publish style files
	$(STYLUS) $(STYLE_SRC)/$(FILE_NAME).styl -o $(DIST_DIR)/ && $(CLEANCSS) $(CLEANCSS_OPTS)

compile-markup: ## compiles markup
	$(PUG) -P $(MARKUP_SRC) -O $(FILE_NAME).config.json -o $(MARKUP_DEST)

watch-markup: ## watch and compile markup
	$(PUG) -wP $(MARKUP_SRC) -O $(FILE_NAME).config.json -o $(MARKUP_DEST)

publish-markup: ## publish index page for deployment
	$(PUG) $(MARKUP_SRC)/index.pug -O $(FILE_NAME).config.json -o $(MARKUP_DEST)

setup: ## set up project for development
	npm install && mkdir -pv $(SCRIPT_DEST) && mkdir -pv $(STYLE_DEST)

watch: ## run development watch
	make watch-scripts & make watch-styles & make watch-markup

build: ## build sources
	make compile-scripts && make compile-styles && make compile-markup

serve: build ## sets up browser-sync local static server with livereload
	$(BS) start --port 1987 --files $(OUTPUT_DIR)/ --server $(OUTPUT_DIR)

develop: ## run development task
	make serve & make watch

publish: ## publish files
	mkdir -pv $(DIST_DIR) && make publish-scripts && make publish-styles

deploy:
	rm -rf $(OUTPUT_DIR) && mkdir $(OUTPUT_DIR) $(SCRIPT_DEST) $(STYLE_DEST) && make compile-scripts && make compile-styles && make publish-markup && $(GHPAGES) -d $(OUTPUT_DIR) && make run publish
