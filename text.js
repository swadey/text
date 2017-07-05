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
const XRE      = require('xregexp');

// -------------------------------------------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------------------------------------------
const punct_word      = XRE('^([\\p{P}\\p{Po}\\p{Sm}]*)(.*?)[\\p{P}\\p{Po}\\p{Sm}]*$');
const english_space   = XRE('[\\s\\p{Zs}_-]+', 'g');
const hashtag         = XRE('^#.*$');
const mention         = XRE('(^|\s)@\\w+\\b', 'g');
const default_space   = XRE('[\\s\\p{Zs}]+', 'g');
const punct           = XRE('^(\\p{P}|\\p{S})+$');
const breaking_punct  = XRE('(?!#)([\\p{Ps}\\p{Pe}\\p{Pi}\\p{Pf}\\p{Po}]+)', 'g');
const currency        = XRE('(^|\\b)[+-]?\\p{Sc}\\d+([.,]\\d+)*(\\b|$)', 'g');
const percent         = XRE('(^|\\b)[+-]?\\d+([.,]\\d+)*%(\\b|$)', 'g');
const number          = XRE('(^|\\b)[+-]?\\d+([.,]\\d+)*(\\b|$)', 'g');
const url             = XRE('(^|\\b)(https?|s?ftp):\\S+(\\b|$)', 'g');
const time1           = XRE('(^|\\b)\\d+:\\d+(am|pm)(\\b|$)', 'g');
const time2           = XRE('(^|\\b)\\d+(am|pm)(\\b|$)', 'g');
const date1           = XRE('(^|\\b)\\d+[-/]\\d+(\\b|$)', 'g');
const date2           = XRE('(^|\\b)\\d+[-/]\\d+[-/]\\d+(\\b|$)', 'g');
const email           = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi; ///(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/gi; 
//XRE('\\b[^@]+@[^@]+\\b', 'g');

// -------------------------------------------------------------------------------------------------------------------------
// Tokenizers
// -------------------------------------------------------------------------------------------------------------------------
function twenglish_cleaner(tw, { urls = true, hashtags = false, mentions = true } = {}) {
  let ctw = tw.normalize('NFKC').replace(default_space, " ").replace(/^RT\s+@\S+\s+/, "").replace(/^RT\s+/, "");

  ctw = entities.decode(ctw);
  ctw = ctw.replace(/#/g, " #");
  ctw = ctw.replace(currency, 'c\u20e3')
    .replace(percent, 'p\u20e3')
    .replace(url, 'u\u20e3')
    .replace(time1, 't\u20e3').replace(time2, 't\u20e3')
    .replace(date2, 'd\u20e3').replace(date1, 'd\u20e3')
    .replace(mention, '$1m\u20e3')
    .replace(email, 'e\u20e3')
    .replace(number, 'n\u20e3');
  ctw = ctw.replace(breaking_punct, " $1 ");

  let words = ctw.trim().split(default_space); //.map(w => pattern_replace(w, { urls: urls, hashtags : hashtags, mentions : mentions }))

  //console.log(words);
  let new_words = words.map(clean_word).filter(w => w != "" && !w.match(punct));//.map(w => pattern_replace(w, { urls: urls, hashtags : hashtags, mentions : mentions }));
  return new_words.join(" ");
}

function clean_word(w) {
  let m = punct_word.exec(w);
  if (m != null) {
    if (m[1].match(/^.*[#@]$/))
      w = m[1][m[1].length-1] + m[2];
    else
      w = m[2];
  }
  return w;
}

function twenglish_tokenizer(words) {
  return words.map(w => {
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
