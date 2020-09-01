const crypto = require("crypto");
const inTheNameOfGod = require("./images/inTheNameOfGod");

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");
}

module.exports = {
  onWillParseMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {

      return resolve(markdown);
    });
  },
  onDidParseMarkdown: function (html, { cheerio }) {
    return new Promise((resolve, reject) => {
      const makeUrl = (name) => {
        return checksum(name.trim());
      };

      html = `
      <div class="a4">
        <div class="book-starter center">
          به نام خدا
        </div>
        <div class="book-name center">
          <span>مجموعه سوالات استخدامی </span>
          <span class="font-black">ری‌اکت React.js</span>
        </div>
        <div class="book-author center">
          نویسنده: Sudheer Jonna <br/>
          مترجم: جعفررضایی و تیم ماریوتک
        </div>
      </div>

      <div class="a4 empty"></div>
      
      ${html}`;

      html = html.replace(
        /(<h[1-6]>)(.*)(<\/h[1-6]>)/gm,
        (whole, p1, p2, p3) =>
          `${p1}<a id="${makeUrl(p2)}" class="anchor" href="#${makeUrl(
            p2
          )}">${p2}</a>${p3}`
      );

      html = html.replace(
        /(<li>)(.*)(<\/li>)/gm,
        (whole, p1, p2, p3) => `${p1}<p>${p2}</p>${p3}`
      );

      html = html.replace(
        /<strong><a \S+=["']?#((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?.*>(.*)<\/a><\/strong>/gm,
        (whole, p1, p2) =>
          `<strong><a class="backToTop" href="#${makeUrl(
            p2
          )}-q">${p2}</a></strong>`
      );

      html = html.replace(
        /<td><a \S+=["']?#((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?.*>(.*)<\/a><\/td>/gm,
        (whole, p1, p2) =>
          `<td id="${makeUrl(p2)}-q"><a class="fehrest" href="#${makeUrl(
            p2
          )}">${p2}</a></td>`
      );

      html = html.replace(
        /<h3><a .*\S+=["']?#((?:.(?!["']?\s*?[>"']))+.)["']?.*>(?:.\n*(?!(?:backToTop)))+<a class="backToTop" \S+=["']?#((?:.(?!["']?\s*?[>"']))+.)["']?.*>(?:.(?!\s+(?:\S+)|\s*?[>"']))+.[<]/gm,
        (whole, p1, p2) => whole.replace(p2, `${p1}-q`)
      );

      return resolve(html);
    });
  },
  onWillTransformMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      return resolve(markdown);
    });
  },
  onDidTransformMarkdown: function (markdown) {
    return new Promise((resolve, reject) => {
      return resolve(markdown);
    });
  },
};
