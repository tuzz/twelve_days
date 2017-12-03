SHELL := /bin/bash

.PHONY: default ruby octave js node_modules

default: ruby octave js

ruby:
	ruby -I ruby ruby/main.rb > bin/song.csv

octave:
	octave octave/main.m > bin/network.json

js: node_modules
	./js/node_modules/.bin/webpack --context js --config js/webpack.config.js

node_modules:
	yarn --cwd js
