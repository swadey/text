const text   = require('./text');

test("basic cleaning", () => {
  expect(text.twe_cleaner('word.')).toBe("word");
  expect(text.twe_cleaner('this is "a" "word.')).toBe("this is a word");
  expect(text.twe_cleaner('test...word')).toBe("test word");
  expect(text.twe_cleaner('test...#word')).toBe("test #word");
  expect(text.twe_cleaner('test#..word')).toBe("test word");
  expect(text.twe_cleaner('test,..word')).toBe("test word");
  expect(text.twe_cleaner('test"""word')).toBe("test word");
  expect(text.twe_cleaner('test@@@word')).toBe("test word");
  expect(text.twe_cleaner('test@word')).toBe("test word");
});

test("quote/contraction handling", () => {
  expect(text.twe_cleaner('test,\'.word')).toBe("test word");
  expect(text.twe_cleaner('test\' .word')).toBe("test word");
  expect(text.twe_cleaner('test\'em .word')).toBe("test em word");
  expect(text.twe_cleaner('y\'all')).toBe("y'all");
  expect(text.twe_cleaner('i\'m it\'s')).toBe("i'm it's");
  expect(text.twe_cleaner("I'M IT'S")).toBe("I'M IT'S");
});

test("hashtag handling", () => {
  expect(text.twe_cleaner('#word...')).toBe("#word");
  expect(text.twe_cleaner('#word #tag')).toBe("#word #tag");
  expect(text.twe_cleaner('#word/#test')).toBe("#word #test");
  expect(text.twe_cleaner('test#word')).toBe("test #word");
  expect(text.twe_cleaner('#test#word')).toBe("#test #word");
});

test("retweet handling", () => {
  expect(text.twe_cleaner('RT this is a #test.')).toBe("this is a #test");
  expect(text.twe_cleaner('RT @james this is a #test.')).toBe("this is a #test");
  expect(text.twe_cleaner('RT @james: this is a #test.')).toBe("this is a #test");
});

test("replacement handling", () => {
  expect(text.twe_cleaner('this is a url http://test.com')).toBe("this is a url u⃣");
  expect(text.twe_cleaner('12/10')).toBe("d\u20e3");
  expect(text.twe_cleaner('12/10/92')).toBe("d\u20e3");
  expect(text.twe_cleaner('12/10/1992')).toBe("d\u20e3");
  expect(text.twe_cleaner('test@word.com')).toBe("e\u20e3");
  expect(text.twe_cleaner('12am')).toBe("t\u20e3");
  expect(text.twe_cleaner('12AM')).toBe("t\u20e3");
  expect(text.twe_cleaner('12:00am')).toBe("t\u20e3")
  expect(text.twe_cleaner('12:00AM')).toBe("t\u20e3")
  expect(text.twe_cleaner('well-timed')).toBe("well-timed");
  expect(text.twe_cleaner('$1.00')).toBe("c\u20e3");
  expect(text.twe_cleaner('$100,000.0')).toBe("c\u20e3");
  expect(text.twe_cleaner('$1, dollar')).toBe("c\u20e3 dollar");
  expect(text.twe_cleaner('save $1.00 test')).toBe("save c\u20e3 test");
  expect(text.twe_cleaner('@a @b')).toBe("m\u20e3 m\u20e3");
  expect(text.twe_cleaner('o/')).toBe('👋');
  expect(text.twe_cleaner('</3')).toBe('💔');
  expect(text.twe_cleaner('<3')).toBe("💗");
  expect(text.twe_cleaner('test :(')).toBe("test 😒");
  expect(text.twe_cleaner('muthaf*ckaaaa')).toBe("muthafuckaaaa");
});

test("real-world examples", () => {
  expect(text.twe_cleaner('@gabycasas Hi Gaby, thanks for getting in touch, please send our Talent Co-ordinator a message at AlinaneK@matinee.co.uk for more details.')).toBe("m\u20e3 Hi Gaby thanks for getting in touch please send our Talent Co-ordinator a message at e\u20e3 for more details");
  expect(text.twe_cleaner('Lavarello marinato con lime e mango typical lake fish with lime and mago! #food… https://t.co/eeIiBDoDJd')).toEqual('Lavarello marinato con lime e mango typical lake fish with lime and mago #food u\u20e3');
});
  
