const StatementGenerator = <T extends object>(argArr: T[]): string =>
  argArr
    .map(
      (arg, i) =>
        `(${Object.keys(arg)
          .map((_, j) => `$${i * Object.keys(arg).length + j + 1}`)
          .join(",")})`
    )
    .join(",");

const getUtcDate = (date: Date): Date => {
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return utcDate;
};

const nowInUtc = (): number => {
  const now = new Date();
  return getUtcDate(now).getTime();
};

export { StatementGenerator, nowInUtc };
