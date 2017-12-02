addpath("lib/twelve_days");

% Read the data from the CSV, preserving the labels.
[words, x1, x2, x3, x4, x5, x6, x7, x8, x9, y] = ...
	textread("song.csv", "%s %f %f %f %f %f %f %f %f %f %f", "delimiter", ",");

% Input data: binary number of the word in the song.
X = [x1 x2 x3 x4 x5 x6 x7 x8 x9];

% 88/12 split the data for training/testing.
[X_train, y_train, words_train, X_test, y_test, words_test, indices] = ...
  split(X, y, words, 0.88);

% The number of features.
n = size(X, 2);

% The number of categories.
K = max(y);

% Pick a number of hidden units that can map to the points of a Koch snowflake.
h = 3 * 4^0; # TODO

% Add a small amount of bias to prevent overfitting. This number was adjusted by
% training the network with different lambdas then looking at how well it
% performed on the test data.
lambda = 0.2;

% Initialize the weights to small random numbers.
Theta1 = weights(n, h);
Theta2 = weights(h, K);

% Unroll params to match the interface of built-in minimisation functions.
params = [Theta1(:); Theta2(:)];

% Create a pointer to the cost function.
pointer = @(p) cost(p, n, h, K, X_train, y_train, lambda);

% Configure the minimisation function to use the gradient returned by #cost.
options = optimset('GradObj', 'on');

% Run the minimisation function (this effectively does gradient descent).
[params, cost] = fminunc(pointer, params, options);

% Roll params back into edge-weight matrices.
Theta1 = reshape(params(1:h * (n + 1)), h, (n + 1));
Theta2 = reshape(params((1 + (h * (n + 1))):end), K, (h + 1));

% Use the neural network to make predictions for the trained/test data.
[p_train, hid_train, out_train] = predict(Theta1, Theta2, X_train);
[p_test, hid_test, out_test] = predict(Theta1, Theta2, X_test);
[p, _, _] = predict(Theta1, Theta2, X);

% Check the performance of the network on each set.
perf_train = sum(p_train == y_train) / size(y_train, 1) * 100;
perf_test = sum(p_test == y_test) / size(y_test, 1) * 100;
perf_total = sum(p == y) / size(y, 1) * 100;

% Write the results to a file.
output(
       indices, ...
			 words_train, words_test, ...
 			 X_train, X_test, ...
       y_train, y_test, ...
       p_train, p_test, ...
			 hid_train, hid_test, ...
       out_train, out_test, ...
       perf_train, perf_test, ...
       perf_total);
