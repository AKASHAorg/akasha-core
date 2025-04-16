function expandVariantGroup(code, replacement) {
  // Use to temporarily replace comments with markers
  const commentMarkers = [];
  let markedCode = code;

  // Mark single-line comments
  markedCode = markedCode.replace(/\/\/.*/g, match => {
    const marker = `__COMMENT_${commentMarkers.length}__`;
    commentMarkers.push(match);
    return marker;
  });

  // Mark multi-line comments
  markedCode = markedCode.replace(/\/\*[\s\S]*?\*\//g, match => {
    const marker = `__COMMENT_${commentMarkers.length}__`;
    commentMarkers.push(match);
    return marker;
  });

  // Apply the Tailwind replacement
  const tailwindRegex =
    /(?:!?(?:\[[^\]]*\])?[a-zA-Z0-9-:]+)\((?:\[[^\]]*\]|[a-zA-Z0-9.:/-])+(?:\s+(?:\[[^\]]*\]|[a-zA-Z0-9:])+[/-]?[a-zA-Z0-9]*)+\)/g;

  markedCode = markedCode.replaceAll(tailwindRegex, replacement);

  // Restore comments
  commentMarkers.forEach((comment, index) => {
    markedCode = markedCode.replace(`__COMMENT_${index}__`, comment);
  });

  return markedCode;
}

module.exports = { expandVariantGroup };
