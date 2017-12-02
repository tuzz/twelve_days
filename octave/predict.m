function [p, hiddenValues, outputValues] = predict(Theta1, Theta2, X)

% Include the bias unit in the input layer.
m = size(X, 1);
X = [ones(m, 1) X];

% Compute the activation values of the hidden layer.
hiddenValues = sigmoid(X * Theta1');

% include the bias unit in the hidden layer.
m2 = size(hiddenValues, 1);
hiddenValues = [ones(m2, 1) hiddenValues];

% Compute the activation values of the output layer.
outputValues = sigmoid(hiddenValues * Theta2');

% Find the highest probability for each example.
[probability, index] = max(outputValues, [], 2);

% The index corresponds to the number.
p = index;

end
