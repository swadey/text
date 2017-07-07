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
const mention         = XRE('(^|\\s)@\\w+?(\\b|$)', 'g');
const default_space   = XRE('[\\s\\p{Zs}]+', 'g');
const punct           = XRE('^(\\p{P}|\\p{S})+$');
const breaking_punct  = XRE('(?!#)([\\p{Ps}\\p{Pe}\\p{Pi}\\p{Pf}\\p{Po}]+)', 'g');
const currency        = XRE('(^|\\s)[+-]?\\p{Sc}\\d+([.,]\\d+)*(\\b|$)', 'g');
const percent         = XRE('(^|\\b)[+-]?\\d+([.,]\\d+)*%(\\b|$)', 'g');
const number          = XRE('(^|\\b)[+-]?\\d+([.,]\\d+)*(\\b|$)', 'g');
const url             = XRE('(^|\\b)(https?|s?ftp):\\S+(\\b|$)', 'g');
const time1           = XRE('(^|\\b)\\d+:\\d+(am|pm)(\\b|$)', 'g');
const time2           = XRE('(^|\\b)\\d+(am|pm)(\\b|$)', 'g');
const date1           = XRE('(^|\\b)\\d+[-/]\\d+(\\b|$)', 'g');
const date2           = XRE('(^|\\b)\\d+[-/]\\d+[-/]\\d+(\\b|$)', 'g');
const email           = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
const contractions    = /(^|\b)(.*?)(n't|'ll|'d|'re|'ve|'s|'m|'all)(\b|$)/g;

const ascii_emojis    = {
  'o/'         : '👋',
  '</3'        : '💔',
  '<3'         : '💗',
  '8-D'        : '😁',
  '8D'         : '😁',
  ':-D'        : '😁',
  '=-3'        : '😁',
  '=-D'        : '😁',
  '=3'         : '😁',
  '=D'         : '😁',
  'B^D'        : '😁',
  'X-D'        : '😁',
  'XD'         : '😁',
  'x-D'        : '😁',
  'xD'         : '😁',
  ':\')'       : '😂',
  ':\'-)'      : '😂',
  ':-))'       : '😃',
  '8)'         : '😄',
  ':)'         : '😄',
  ':-)'        : '😄',
  ':3'         : '😄',
  ':D'         : '😄',
  ':]'         : '😄',
  ':^)'        : '😄',
  ':c)'        : '😄',
  ':o)'        : '😄',
  ':}'         : '😄',
  ':っ)'        : '😄',
  '=)'         : '😄',
  '=]'         : '😄',
  '0:)'        : '😇',
  '0:-)'       : '😇',
  '0:-3'       : '😇',
  '0:3'        : '😇',
  '0;^)'       : '😇',
  'O:-)'       : '😇',
  '3:)'        : '😈',
  '3:-)'       : '😈',
  '}:)'        : '😈',
  '}:-)'       : '😈',
  '*)'         : '😉',
  '*-)'        : '😉',
  ':-,'        : '😉',
  ';)'         : '😉',
  ';-)'        : '😉',
  ';-]'        : '😉',
  ';D'         : '😉',
  ';]'         : '😉',
  ';^)'        : '😉',
  ':-|'        : '😐',
  ':|'         : '😐',
  ':('         : '😒',
  ':-('        : '😒',
  ':-<'        : '😒',
  ':-['        : '😒',
  ':-c'        : '😒',
  ':<'         : '😒',
  ':['         : '😒',
  ':c'         : '😒',
  ':{'         : '😒',
  ':っC'        : '😒',
  '%)'         : '😖',
  '%-)'        : '😖',
  ':-P'        : '😜',
  ':-b'        : '😜',
  ':-p'        : '😜',
  ':-Þ'        : '😜',
  ':-þ'        : '😜',
  ':P'         : '😜',
  ':b'         : '😜',
  ':p'         : '😜',
  ':Þ'         : '😜',
  ':þ'         : '😜',
  ';('         : '😜',
  '=p'         : '😜',
  'X-P'        : '😜',
  'XP'         : '😜',
  'd:'         : '😜',
  'x-p'        : '😜',
  'xp'         : '😜',
  ':-||'       : '😠',
  ':@'         : '😠',
  ':-.'        : '😡',
  ':-/'        : '😡',
  ':/'         : '😡',
  ':L'         : '😡',
  ':S'         : '😡',
  ':\\'        : '😡',
  '=/'         : '😡',
  '=L'         : '😡',
  '=\\'        : '😡',
  ':\'('       : '😢',
  ':\'-('      : '😢',
  '^5'         : '😤',
  '^<_<'       : '😤',
  'o/\\o'      : '😤',
  '|-O'        : '😫',
  '|;-)'       : '😫',
  ':###..'     : '😰',
  ':-###..'    : '😰',
  'D-\':'      : '😱',
  'D8'         : '😱',
  'D:'         : '😱',
  'D:<'        : '😱',
  'D;'         : '😱',
  'D='         : '😱',
  'DX'         : '😱',
  'v.v'        : '😱',
  '8-0'        : '😲',
  ':-O'        : '😲',
  ':-o'        : '😲',
  ':O'         : '😲',
  ':o'         : '😲',
  'O-O'        : '😲',
  'O_O'        : '😲',
  'O_o'        : '😲',
  'o-o'        : '😲',
  'o_O'        : '😲',
  'o_o'        : '😲',
  ':$'         : '😳',
  '#-)'        : '😵',
  ':#'         : '😶',
  ':&'         : '😶',
  ':-#'        : '😶',
  ':-&'        : '😶',
  ':-X'        : '😶',
  ':X'         : '😶',
  ':-J'        : '😼',
  ':*'         : '😽',
  ':^*'        : '😽',
  'ಠ_ಠ'        : '🙅',
  '*\\0/*'     : '🙆',
  '\\o/'       : '🙆',
  ':>'         : '😄',
  '>.<'        : '😡',
  '>:('        : '😠',
  '>:)'        : '😈',
  '>:-)'       : '😈',
  '>:/'        : '😡',
  '>:O'        : '😲',
  '>:P'        : '😜',
  '>:['        : '😒',
  '>:\\'       : '😡',
  '>;)'        : '😈',
  '>_>^'       : '😤'
};

const epattern = new RegExp('(^|\\s)(' + Object.keys(ascii_emojis).map(escape).join("|") + ')(\\s|$)', 'g');

function escape(s) {
 return s.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
}

// -------------------------------------------------------------------------------------------------------------------------
// Tokenizers
// -------------------------------------------------------------------------------------------------------------------------
function normalize_emojis(s) {
  return s.replace(epattern, (m, p1, p2, p3, offset, s) => p1 + ascii_emojis[p2] + p3);
}

function fix_contractions(s) {
  return s.replace(contractions, (m, p1, p2, p3, offset, s) => p2 + p3.replace("'", "___"));
}
function twenglish_cleaner(tw, { urls = true, hashtags = false, mentions = true } = {}) {
  let ctw = tw.normalize('NFKC').replace(default_space, " ").replace(/^RT\s+@\S+\s+/, "").replace(/^RT\s+/, "");

  ctw = entities.decode(ctw);
  ctw = ctw.replace(/#/g, " #");
  ctw = ctw.replace(currency, '$1c\u20e3')
           .replace(percent, 'p\u20e3')
           .replace(url, 'u\u20e3')
           .replace(time1, 't\u20e3').replace(time2, 't\u20e3')
           .replace(date2, 'd\u20e3').replace(date1, 'd\u20e3')
           .replace(mention, '$1m\u20e3')
           .replace(email, 'e\u20e3')
           .replace(/b\*tch/gi, "bitch")
           .replace(/f\*ck/gi, "fuck");

  ctw = fix_contractions(ctw);
  ctw = normalize_emojis(ctw).replace(number, 'n\u20e3');
  ctw = ctw.replace(breaking_punct, " $1 ");

  let words = ctw.trim().split(default_space);

  //console.log(words);
  let new_words = words.map(clean_word).filter(w => w != "" && !w.match(punct));
  return new_words.join(" ").replace(/___/g, "'");
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
