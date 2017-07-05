const text   = require('./text');
/* const chai   = require('chai');  
 * const assert = chai.assert;    // Using Assert style 
 * const expect = chai.expect;    // Using Expect style 
 * const should = chai.should();  // Using Should style
 * */
//chai.config.showDiff = true;
test("basic cleaning", () => {
  expect(text.twenglish_cleaner('word.')).toBe("word");
  expect(text.twenglish_cleaner('this is "a" "word.')).toBe("this is a word");
  expect(text.twenglish_cleaner('#word...', { hashtags : false })).toBe("#word");
  expect(text.twenglish_cleaner('#word #tag', { hashtags : false })).toBe("#word #tag");
  expect(text.twenglish_cleaner('#word/#test', { hashtags : false })).toBe("#word #test");
  expect(text.twenglish_cleaner('test...word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('test...#word', { hashtags : false })).toBe("test #word");
  expect(text.twenglish_cleaner('test#..word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('test,..word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('test"""word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('test#word', { hashtags : false })).toBe("test #word");
  expect(text.twenglish_cleaner('#test#word', { hashtags : false })).toBe("#test #word");
  expect(text.twenglish_cleaner('test@@@word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('test@word', { hashtags : false })).toBe("test word");
  expect(text.twenglish_cleaner('y\'all', { hashtags : false })).toBe("y all");
  expect(text.twenglish_cleaner('i\'m it\'s', { hashtags : false })).toBe("i m it s");
});

test("retweet handling", () => {
  expect(text.twenglish_cleaner('RT this is a #test.', { hashtags : false })).toBe("this is a #test");
  expect(text.twenglish_cleaner('RT @james this is a #test.', { hashtags : false })).toBe("this is a #test");
  expect(text.twenglish_cleaner('RT @james: this is a #test.', { hashtags : false })).toBe("this is a #test");
});

test("replacement handling", () => {
  expect(text.twenglish_cleaner('this is a url http://test.com')).toBe("this is a url u⃣");
  expect(text.twenglish_cleaner('12/10', { hashtags : false })).toBe("d\u20e3");
  expect(text.twenglish_cleaner('12/10/92', { hashtags : false })).toBe("d\u20e3");
  expect(text.twenglish_cleaner('12/10/1992', { hashtags : false })).toBe("d\u20e3");
  expect(text.twenglish_cleaner('test@word.com', { hashtags : false })).toBe("e\u20e3");
  expect(text.twenglish_cleaner('12am', { hashtags : false })).toBe("t\u20e3");
  expect(text.twenglish_cleaner('12:00am', { hashtags : false })).toBe("t\u20e3")
  expect(text.twenglish_cleaner('well-timed', { hashtags : false })).toBe("well-timed");
  expect(text.twenglish_cleaner('$1.00', { hashtags : false })).toBe("c\u20e3");
  expect(text.twenglish_cleaner('$100,000.0', { hashtags : false })).toBe("c\u20e3");
  expect(text.twenglish_cleaner('$1, dollar', { hashtags : false })).toBe("c\u20e3 dollar");
  expect(text.twenglish_cleaner('save $1.00 test')).toBe("save c\u20e3 test");
  expect(text.twenglish_cleaner('@a @b', { hashtags : false })).toBe("m\u20e3 m\u20e3");
  expect(text.twenglish_cleaner('o/', { hashtags : false })).toBe('👋');
  expect(text.twenglish_cleaner('</3', { hashtags : false })).toBe('💔');
  expect(text.twenglish_cleaner('<3', { hashtags : false })).toBe("💗");
  expect(text.twenglish_cleaner('test :(', { hashtags : false })).toBe("test 😒");
  expect(text.twenglish_cleaner('muthaf*ckaaaa', { hashtags : false })).toBe("muthafuckaaaa");
});

test("real-world examples", () => {
  expect(text.twenglish_cleaner('@gabycasas Hi Gaby, thanks for getting in touch, please send our Talent Co-ordinator a message at AlinaneK@matinee.co.uk for more details.')).toBe("m\u20e3 Hi Gaby thanks for getting in touch please send our Talent Co-ordinator a message at e\u20e3 for more details");
  expect(text.twenglish_cleaner('Lavarello marinato con lime e mango typical lake fish with lime and mago! #food… https://t.co/eeIiBDoDJd')).toEqual('Lavarello marinato con lime e mango typical lake fish with lime and mago #food u\u20e3');
});
  
