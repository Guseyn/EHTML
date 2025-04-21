import * as katex from 'ehtml/third-party/katex/katex';
import * as renderMathInElement from 'ehtml/third-party/katex/auto-render';
import * as showdown from 'ehtml/third-party/showdown';
import * as asciimathToTex from 'ehtml/third-party/showdown-katex/asciimath-to-tex';

/**
 * @param {object} opts
 * @param {NodeListOf<Element>} opts.elements
 * @param opts.config
 * @param {boolean} opts.isAsciimath
 */
function renderBlockElements({ elements, config, isAsciimath }) {
  if (!elements.length) {
    return;
  }

  elements.forEach(element => {
    const input = element.textContent;
    const latex = isAsciimath ? asciimathToTex(input) : input;
    const html = katex.renderToString(latex, config);
    element.parentNode.outerHTML = `<span title="${input.trim()}">${html}</span>`;
  });
}

/**
 * https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 * @param {string} str
 * @returns {string} regexp escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\$^|]/g, '\\$&');
}

// katex config
const getConfig = (config = {}) => ({
  displayMode: true,
  throwOnError: false, // fail silently
  errorColor: '#ff0000',
  ...config,
  delimiters: (config.delimiters || []).concat([
    { left: '$$', right: '$$', display: false },
    { left: '~', right: '~', display: false, asciimath: true },
  ]),
});

const showdownKatex = userConfig => () => {
  const parser = new DOMParser();
  const config = getConfig(userConfig);
  const asciimathDelimiters = config.delimiters
    .filter(item => item.asciimath)
    .map(({ left, right }) => {
      const test = new RegExp(
        `${escapeRegExp(left)}(.*?)${escapeRegExp(right)}`,
        'g',
      );
      const replacer = (match, asciimath) => {
        return `${left}${asciimathToTex(asciimath)}${right}`;
      };
      return { test, replacer };
    });

  return [
    {
      type: 'output',
      filter(html = '') {
        // parse html
        const wrapper = parser.parseFromString(html, 'text/html').body;

        if (asciimathDelimiters.length) {
          // convert inline asciimath to inline latex
          // ignore anything in code and pre elements
          wrapper.querySelectorAll(':not(code):not(pre)').forEach(el => {
            /** @type Text[] */
            const textNodes = [...el.childNodes].filter(
              // skip "empty" text nodes
              node => node.nodeName === '#text' && node.nodeValue.trim(),
            );

            textNodes.forEach(node => {
              const newText = asciimathDelimiters.reduce(
                (acc, { test, replacer }) => acc.replace(test, replacer),
                node.nodeValue,
              );
              node.nodeValue = newText;
            });
          });
        }

        // find the math in code blocks
        const latex = wrapper.querySelectorAll('code.latex.language-latex');
        const asciimath = wrapper.querySelectorAll(
          'code.asciimath.language-asciimath',
        );

        renderBlockElements({ elements: latex, config });
        renderBlockElements({ elements: asciimath, config, isAsciimath: true });

        renderMathInElement(wrapper, config);

        // return html without the wrapper
        return wrapper.innerHTML;
      },
    },
  ];
};

// register extension with default config
showdown.default.extension('showdown-katex', showdownKatex());

export default showdownKatex;
