// -------------------------------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------------------------------
exports.twenglish_cleaner   = twenglish_cleaner;
exports.twenglish_tokenizer = twenglish_tokenizer;

// -------------------------------------------------------------------------------------------------------------------------
// Imports
// -------------------------------------------------------------------------------------------------------------------------
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const XRE      = require('xregexp');

// -------------------------------------------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------------------------------------------
const punct_word      = XRE('^([\\p{P}\\p{Po}\\p{Sm}]*)(.*?)[\\p{P}\\p{Po}\\p{Sm}]*$');
const english_space   = XRE('[\\s\\p{Zs}_-]+', 'g');
const url_pattern     = XRE('https?://[^\\s]*', 'g');
const hashtag_pattern = XRE('^#.*$');
const mention_pattern = XRE('^@[^@]+$');
const default_space   = XRE('[\\s\\p{Zs}]+', 'g');
const punct           = XRE('^(\\p{P}|\\p{S})+$');
const breaking_punct  = XRE('(?!#)([\\p{Ps}\\p{Pe}\\p{Pi}\\p{Pf}\\p{Po}]+)', 'g');

// -------------------------------------------------------------------------------------------------------------------------
// Tokenizers
// -------------------------------------------------------------------------------------------------------------------------
function twenglish_cleaner(tw, { urls = true, hashtags = true, mentions = true } = {}) {
  let ctw = tw.normalize('NFKC').replace(default_space, " ").replace(/^RT\s+@\S+\s+/, "").replace(/^RT\s+/, "");
  ctw = urls ? ctw.replace(url_pattern, "\u0030\u20E3") : ctw;

  ctw = entities.decode(ctw);
  ctw = ctw.replace(/#/g, " #");
  ctw = ctw.replace(breaking_punct, " $1 ");

  let words = ctw.trim().split(default_space);
  words = hashtags ? words.map(w => w.match(hashtag_pattern) ? "\u0023\u20E3" : w) : words;
  words = mentions ? words.map(w => w.match(mention_pattern) ? "\u0031\u20E3" : w) : words;

  new_words = twenglish_tokenizer(words);
  return new_words.join(" ");
}

function twenglish_tokenizer(words) {
  return words.map(w => {
    let m = punct_word.exec(w);
    if (m != null)
      if (w[0] != "@")
        if (w[0] == "#")
          w = "#" + m[2];
        else 
          w = m[2];
    return w; //pattern_replace(w);
  }).filter(w => !w.match(punct) && w != "");
}
