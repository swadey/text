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
const hashtag         = XRE('^#.*$');
const mention         = XRE('^@[^@]+$');
const default_space   = XRE('[\\s\\p{Zs}]+', 'g');
const punct           = XRE('^(\\p{P}|\\p{S})+$');
const breaking_punct  = XRE('(?!#)([\\p{Ps}\\p{Pe}\\p{Pi}\\p{Pf}\\p{Po}]+)', 'g');
const currency        = XRE('^[+-]?\\p{Sc}\\d+([.,]\\d+)*$');
const percent         = XRE('^[+-]?\\d+([.,]\\d+)*%$');
const number          = XRE('^[+-]?\\d+([.,]\\d+)*$');
const url             = XRE('^(https?|s?ftp):.*$');
const time1           = XRE('^\\d+:\\d+(am|pm)$');
const time2           = XRE('^\\d+(am|pm)$');
const date1           = XRE('^\\d+[-/]\\d+$');
const date2           = XRE('^\\d+[-/]\\d+[-/]\\d+$');
const email           = XRE('^[^@]+@[^@]+$');

// -------------------------------------------------------------------------------------------------------------------------
// Tokenizers
// -------------------------------------------------------------------------------------------------------------------------
function twenglish_cleaner(tw, { urls = true, hashtags = false, mentions = true } = {}) {
  let ctw = tw.normalize('NFKC').replace(default_space, " ").replace(/^RT\s+@\S+\s+/, "").replace(/^RT\s+/, "");

  ctw = entities.decode(ctw);
  ctw = ctw.replace(/#/g, " #");
  ctw = ctw.trim().split(default_space).map(w => pattern_replace(w, { urls: urls, hashtags : hashtags, mentions : mentions })).join(" ");
  ctw = ctw.replace(breaking_punct, " $1 ");

  let words = ctw.trim().split(default_space);

  //console.log(words);
  new_words = twenglish_tokenizer(words);
  return new_words.join(" ");
}

function twenglish_tokenizer(words) {
  return words.map(w => {
    let m = punct_word.exec(w);
    if (m != null)
      if (w[0] != "@" && w.slice(0, 2) != "--")
        if (w[0] == "#")
          w = "#" + m[2];
        else 
          w = m[2];
    return w;
  }).filter(w => !w.match(punct) && w != "");
}

function pattern_replace(w, { urls = true, hashtags = false, mentions = true } = {}) {
  if (w.match(currency)) return "c\u20e3";
  if (w.match(percent)) return "p\u20e3";
  if (w.match(number)) return "n\u20e3";
  if (urls && w.match(url)) return "u\u20e3";
  if (w.match(time1) || w.match(time2)) return "t\u20e3";
  if (w.match(date1) || w.match(date2)) return "d\u20e3";
  if (mentions && w.match(mention)) return "m\u20e3";
  if (hashtags && w.match(hashtag)) return "h\u20e3";
  if (w.match(email)) return "e\u20e3";

  return w;
}
