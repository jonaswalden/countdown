const assert = require('assert');
const parseBody = require('../../app/helpers/parse-body');

describe('parseMd', () => {
  it('should compile markdown to markup', () => {
    const markdown = 'yada __yada__ *yada*';
    const markup = parseBody.parseMd(markdown);
    assert.equal(markup, "<p>yada <strong>yada</strong> <em>yada</em></p>\n");
  });
});

describe('parsePseudo', () => {
  it('should parse input pseudo code to handlebars code', () => {
    const pseudo = 'yada {{clock}} yada {{clock}} yada';
    const hbs = parseBody.parsePseudo(pseudo);
    assert.equal(hbs, 'yada {{> clock start=start}} yada {{> clock start=start}} yada');
  });
});

// describe('parseHbs', () => {
//   it('should parse handlebars code to html', () => {
//     const hbs = 'yada yada {{what}}';
//     const html = parseBody.parseHbs(hbs, {what: 'yada'});
//     assert.equal(html, 'yada yada yada');
//   });
//
//   it('should compile clock partial', () => {
//     const hbs = '{{> clock start=start}}';
//     const html = parseBody.parseHbs(hbs);
//     assert.not.equal(html, hbs);
//   });
// });
