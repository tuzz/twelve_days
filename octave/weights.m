function W = weights(L_in, L_out)

% [from the footnote on page 7 of ex4.pdf]
% > One effective strategy for choosing epsilon is to base it on the number of
% > units in the network. A good choice is root(6) / root(L_in + L_out).
epsilon = sqrt(6) / sqrt(L_in + L_out);

% Randomly initialize the weights to small values.
W = rand(L_out, 1 + L_in) * 2 * epsilon - epsilon;

end
