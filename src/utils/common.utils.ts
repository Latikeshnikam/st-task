export const getQueryFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const query: Record<string, any> = {};
  urlObj.searchParams.forEach(function (val, key) {
    query[key] = val;
  });

  return query;
};

export const pluralize = (num: number, word: string, plural = word + "s") =>
  [1, -1].includes(Number(num)) ? word : plural;

//Added a genric debounce function. Use it to make a debounce function.
export const debounceFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 400
) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...(args as []));
    }, delay);
  };
};
