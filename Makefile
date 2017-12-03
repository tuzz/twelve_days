SHELL := /bin/bash

.PHONY: default ruby octave js html node_modules

default: ruby octave js html


ruby:
	ruby -I ruby ruby/main.rb > bin/song.csv

octave:
	octave octave/main.m > bin/network.json

js: node_modules
	./js/node_modules/.bin/webpack --context js --config js/webpack.config.js

html:
	cp html/index.html bin/index.html


node_modules:
	yarn --cwd js
