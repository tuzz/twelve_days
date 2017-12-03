SHELL := /bin/bash

.PHONY: default ruby octave js html css node_modules

default: ruby octave js html

server: python

packages:
	yarn --cwd js

ruby:
	ruby -I ruby ruby/main.rb > bin/song.csv

octave:
	octave octave/main.m > bin/network.json

js: packages
	./js/node_modules/.bin/webpack --context js --config js/webpack.config.js

html:
	cp html/index.html bin/index.html
	rm -rf bin/images && cp -r images bin/images

css:
	cp css/reset.css bin/
	cp css/style.css bin/

python:
	cd bin; python -m SimpleHTTPServer
