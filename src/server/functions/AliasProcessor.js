const AliasProcessor = (entity) => {
  if (!entity.alias) {
    entity.alias = entity.title
      ? entity.title.split(" ").join("-")
      : Math.random().toString(36).substring(5);
  }
  return entity;
};
export { AliasProcessor };
