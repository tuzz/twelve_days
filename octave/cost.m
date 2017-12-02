function [J grad] = cost(nn_params, input_layer_size, hidden_layer_size, num_labels, X, y, lambda)

% Reshape nn_params back into the parameters Theta1 and Theta2, the weight matrices
% for our 2 layer neural network
Theta1 = reshape(nn_params(1:hidden_layer_size * (input_layer_size + 1)), hidden_layer_size, (input_layer_size + 1));
Theta2 = reshape(nn_params((1 + (hidden_layer_size * (input_layer_size + 1))):end), num_labels, (hidden_layer_size + 1));

% Setup some useful variables
m = size(X, 1);

% Include the bias unit in the input layer.
X = [ones(m, 1) X];

% Compute the activations of the hidden units.
hiddenActivations = sigmoid(X * Theta1');

% Include the bias unit in the hidden layer.
m2 = size(hiddenActivations, 1);
hiddenActivations = [ones(m2, 1) hiddenActivations];

% Compute the activations of the output units.
outputActivations = sigmoid(hiddenActivations * Theta2');

% Build a matrix of expected outputs for each training example.
expectedOutputs = [1:num_labels] == y;

% Apply the logistic regression cost function.
termForYIsOne = expectedOutputs .* log(outputActivations);
termForYIsZero = (1 - expectedOutputs) .* log(1 - outputActivations);
costs = -(termForYIsOne + termForYIsZero);

% Compute the unregularized cost.
% This is the sum of all output neuron costs for all training examples.
unregCost = sum(sum(costs)) / m;

% Exclude bias units from regularization.
Theta1NoBias = Theta1(:, 2:end);
Theta2NoBias = Theta2(:, 2:end);

% Sum over all weights.
Theta1Sum = sum(sum(Theta1NoBias .^ 2));
Theta2Sum = sum(sum(Theta2NoBias .^ 2));

% Compute the cost of the regularization term.
regularizationCost = lambda / (2 * m) * (Theta1Sum + Theta2Sum);

% The total cost is the unregularized cost plus the regularization term.
J = unregCost + regularizationCost;

% Compute the errors of the output layer.
delta3 = outputActivations - expectedOutputs;

% Rather than use sigmoidGradient, we can reuse the activations of the hidden
% units. I found this tip on the Coursera discussion forums.
sigmoidGrad = hiddenActivations .* (1 - hiddenActivations);
sigmoidGradNoBias = sigmoidGrad(:, 2:end);

% Distribute the errors back along the weights of the previous layer and
% multiply the sum for each unit by the sigmoid gradient of that unit.
delta2 = delta3 * Theta2NoBias .* sigmoidGradNoBias;

% Compute Delta2 by multiplying the output errors by the hidden activations.
Delta2 = delta3' * hiddenActivations;

% Compute Delta1 by multiplying the hidden errors by the input activations.
Delta1 = delta2' * X;

% Compute the regularization terms for the gradients.
Delta1Reg = lambda / m * Theta1NoBias;
Delta2Reg = lambda / m * Theta2NoBias;

% Set the regularizing term to 0 for bias units.
Delta1Reg = [zeros(size(Delta1Reg, 1), 1) Delta1Reg];
Delta2Reg = [zeros(size(Delta2Reg, 1), 1) Delta2Reg];

% Divide the accumulated gradients by the number of training examples and add
% the regularization terms.
Theta1_grad = Delta1 / m + Delta1Reg;
Theta2_grad = Delta2 / m + Delta2Reg;

% Unroll gradients
grad = [Theta1_grad(:) ; Theta2_grad(:)];

% Display the cost while training.
%disp(J);

end
