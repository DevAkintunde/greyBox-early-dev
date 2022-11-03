const translatedIncludeProcessor = async (ctx, next) => {
  await next();
};

module.exports = translatedIncludeProcessor;
