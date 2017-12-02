function [] = output(indices, ...
                     words_train, words_test, ...
 			               X_train, X_test, ...
                     y_train, y_test, ...
                     p_train, p_test, ...
			               hid_train, hid_test, ...
                     out_train, out_test, ...
                     perf_train, perf_test, ...
                     perf_total)

function [] = printArray(row)
  string = sprintf(', %d', row(2:end));
  printf('[%d%s],\n', row(1), string);
end

function [] = printSet(words, X, y, p, hidden, output, trained, offset)
  for i = 1:size(words, 1)
    printf('{\n');
    printf('  "index": %d,\n', indices(i + offset));
    printf('  "word":"%s",\n', words{i});
    printf('  "binary": ');
    printArray(X(i, :));
    printf('  "category": %d,\n', y(i));
    printf('  "guess": %d,\n', p(i));
    printf('  "hidden": ');
    printArray(hidden(i, :));
    printf('  "output": ');
    printArray(output(i, :));
    printf('  "trained": %s\n', trained);

    if i == size(words, 1)
      printf('}\n');
    else
      printf('},\n');
    end
  end
end

printf('{\n');

  printf('"stats": {\n');
  printf('  "train": %0.2f,\n', perf_train);
  printf('  "test": %0.2f,\n', perf_test);
  printf('  "total": %0.2f\n', perf_total);
  printf('},\n');

  printf('"data": [\n');
  printSet(words_train, X_train, y_train, p_train, hid_train, out_train, "true", 0);
  printf(",");
  printSet(words_test, X_test, y_test, p_test, hid_test, out_test, "false", size(words_train, 1));
  printf(']\n');

printf('}\n');

end
