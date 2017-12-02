function [X_train, y_train, words_train, X_test, y_test, words_test, indices] = split(X, y, words, ratio)

m = size(X, 1);
indices = randperm(m);

split_at = round(m * ratio);

X_train = X(indices(1:split_at), :);
X_test = X(indices((split_at + 1):end), :);

y_train = y(indices(1:split_at));
y_test = y(indices((split_at + 1):end));

words_train = words(indices(1:split_at));
words_test = words(indices((split_at + 1):end));

end
