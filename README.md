## Twelve Days ##

[View it here](https://tuzz.github.io/twelve_days/bin/).

This project is an effort to combine multiple computer science ideas into
something fun for the December 2017 meeting of
[London Computation Club](http://london.computation.club/).


## More detail ##

There's a well-known song called
['The Twelve Days of Christmas'](https://en.wikipedia.org/wiki/The_Twelve_Days_of_Christmas_(song)).
It has a lot of repetition in it and this project is an attempt to train a
neural network to see if it could 'learn' about this repetition and classify
words from the song into different categories.

The network takes, as input, the index of a word in the song (e.g.
14=partridge). This is represented in binary (e.g. 1110) and fed to the neural
network. The output is one of fourteen arbitrary categories for each of the
types of gift in the song. There is also a category for numeric words (e.g.
fifth, five) and one for miscellaneous words (e.g. on, the, and).

These categories are used to train the network via back-propogation and a
minimisation algorithm akin to gradient descent. I've borrowed much of the
this from [my implementations](http://github.com/tuzz/machine-learning) of the
exercises from the Coursera machine learning course.

The network is trained using 88% of the available data and tested with the
remaining 12% (seemed like an appropriate number). It doesn't do brilliantly,
but it manages to classify words in the test set correctly more than half the
time which doesn't seem too bad given there are 14 categories.

All this data is exported to a `network.json` file that captures the behaviour
of the network for every possible input (all the words in the song). This is
then picked up by JavaScript for rendering. It would have been possible to
export the weights of the network to simulate it properly in JavaScript but that
was more work than I was prepared to take on.

In JavaScript, we display the neural network in a HTML canvas and allow the user
to go through the words in the song with their arrow keys. This shows the
activations of the units in each of the network's layers as well as whether the
network has successfully classified each word.

On top of this, I decided to render the neural network in the shape of a Koch
Snowflake since it's Christmas and all the edges between nodes make for some
nice snowflake-y patterns.
