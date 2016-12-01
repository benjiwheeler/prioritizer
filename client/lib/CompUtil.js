export function findProp(name, props) {
  if (name in props && props[name] !== undefined) {
    return props[name];
  }
  if (props.params !== undefined && props.params !== null &&
    name in props.params && props.params[name] !== undefined) {
    return props.params[name];
  }
  if (props.location !== undefined && props.location !== null &&
    props.location.query !== undefined && props.location.query !== null &&
    name in props.location.query && props.location.query[name] !== undefined) {
    return props.location.query[name];
  }
  return undefined;
}
