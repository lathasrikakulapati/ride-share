exports.isValidPartialRoute = (stops, fromPoint, toPoint) => {
  const fromIndex = stops.indexOf(fromPoint);
  const toIndex = stops.indexOf(toPoint);
  return (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex);
};
