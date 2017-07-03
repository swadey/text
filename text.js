// -------------------------------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------------------------------
exports.twenglish_cleaner   = twenglish_cleaner;
//exports.twenglish_tokenizer = twenglish_tokenizer;

// -------------------------------------------------------------------------------------------------------------------------
// Imports
// -------------------------------------------------------------------------------------------------------------------------
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

// -------------------------------------------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------------------------------------------
const punct_word      = /^[\p{P}\p{Po}\p{Sm}]*(.*?)[\p{P}\p{Po}\p{Sm}]*$/u;
const english_space   = /[\s\p{Zs}_-]+/ug;
const url_pattern     = /http:\/\/[^\s]*/ug;
const hashtag_pattern = /^#.*$/u;
const mention_pattern = /^@.*$/u;
const default_space   = /[\s\p{Zs}]+/ug;

// -------------------------------------------------------------------------------------------------------------------------
// Tokenizers
// -------------------------------------------------------------------------------------------------------------------------
function twenglish_cleaner(tw, urls = true, hashtags = true, mentions = true) {
  let ctw = tw.normalize('NFKC').replace(default_space, " ");
  ctw = urls ? ctw.replace(url_pattern, "\u0030\u20E3") : ctw;

  ctw = entities.decode(ctw);

  let words = ctw.split(default_space);
  words = hashtags ? words.map(w => w.match(hashtag_pattern) ? "\u0023\u20E3" : w) : words;
  words = mentions ? words.map(w => w.match(mention_pattern) ? "\u0031\u20E3" : w) : words;

  return words.join(" ");
}
