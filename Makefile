SHELL := /bin/bash

.PHONY: default ruby octave

default: ruby octave

ruby:
	ruby -I ruby ruby/main.rb > bin/song.csv

octave:
	octave octave/main.m > bin/network.json
