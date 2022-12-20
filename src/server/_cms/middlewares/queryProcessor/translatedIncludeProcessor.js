const translatedIncludeProcessor = async (ctx, next) => {
  await next();
};

export { translatedIncludeProcessor };
