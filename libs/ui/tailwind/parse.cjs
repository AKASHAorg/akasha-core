function createRule(active, current) {
  if (active[active.length - 1] != '(') {
    const variants = [];
    let important = false;
    let negated = false;
    let name = '';

    for (let value of active) {
      if (value == '(' || /[~@]$/.test(value)) continue;

      if (value[0] == '!') {
        value = value.slice(1);
        important = !important;
      }

      if (value.endsWith(':')) {
        variants[value == 'dark:' ? 'unshift' : 'push'](value.slice(0, -1));
        continue;
      }

      if (value[0] == '-') {
        value = value.slice(1);
        negated = !negated;
      }

      if (value.endsWith('-')) {
        value = value.slice(0, -1);
      }

      if (value && value != '&') {
        name += (name && '-') + value;
      }
    }

    if (name) {
      if (negated) name = '-' + name;

      current[0].push({ n: name, v: variants.filter(uniq), i: important });
    }
  }
}

function uniq(value, index, values) {
  return values.indexOf(value) == index;
}

const cache = new Map();

/**
 * @internal
 * @param token
 * @returns
 */
function parse(token) {
  let parsed = cache.get(token);

  if (!parsed) {
    const active = [];
    const current = [[]];

    let startIndex = 0;
    let skip = 0;
    let comment = null;
    let position = 0;

    const commit = (isRule, endOffset = 0) => {
      if (startIndex != position) {
        active.push(token.slice(startIndex, position + endOffset));

        if (isRule) {
          createRule(active, current);
        }
      }
      startIndex = position + 1;
    };

    for (; position < token.length; position++) {
      const char = token[position];

      if (skip) {
        if (token[position - 1] != '\\') {
          skip += +(char == '[') || -(char == ']');
        }
      } else if (char == '[') {
        skip += 1;
      } else if (comment) {
        if (token[position - 1] != '\\' && comment.test(token.slice(position))) {
          comment = null;
          startIndex = position + RegExp.lastMatch.length;
        }
      } else if (
        char == '/' &&
        token[position - 1] != '\\' &&
        (token[position + 1] == '*' || token[position + 1] == '/')
      ) {
        comment = token[position + 1] == '*' ? /^\*\// : /^[\r\n]/;
      } else if (char == '(') {
        commit();
        active.push(char);
      } else if (char == ':') {
        if (token[position + 1] != ':') {
          commit(false, 1);
        }
      } else if (/[\s,)]/.test(char)) {
        commit(true);
        const lastGroup = active.lastIndexOf('(');
        active.length = lastGroup + 1;
      }
    }

    commit(true);
    cache.set(token, (parsed = current[0]));
  }

  return parsed;
}

function toClassName(rule) {
  return [...rule.v, (rule.i ? '!' : '') + rule.n].join(':');
}

function format(rules, seperator = ' ') {
  return rules.map(toClassName).join(seperator);
}

module.exports = { parse: token => format(parse(token)) };
