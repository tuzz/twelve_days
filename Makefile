SHELL := /bin/bash

.PHONY: default ruby octave js html node_modules

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

python:
	cd bin; python -m SimpleHTTPServer
