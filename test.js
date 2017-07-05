const text   = require('./text');
const chai   = require('chai');  
const assert = chai.assert;    // Using Assert style 
const expect = chai.expect;    // Using Expect style 
const should = chai.should();  // Using Should style

chai.config.showDiff = true;
text.twenglish_cleaner('this is a url http://test.com').should.equal("this is a url u⃣");
text.twenglish_cleaner('word.').should.equal("word");
text.twenglish_cleaner('this is "a" "word.').should.equal("this is a word");
text.twenglish_cleaner('#word...', { hashtags : false }).should.equal("#word");
text.twenglish_cleaner('#word #tag', { hashtags : false }).should.equal("#word #tag");
text.twenglish_cleaner('#word/#test', { hashtags : false }).should.equal("#word #test");
text.twenglish_cleaner('RT this is a #test.', { hashtags : false }).should.equal("this is a #test");
text.twenglish_cleaner('RT @james this is a #test.', { hashtags : false }).should.equal("this is a #test");
text.twenglish_cleaner('RT @james: this is a #test.', { hashtags : false }).should.equal("this is a #test");
text.twenglish_cleaner('test...word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test...#word', { hashtags : false }).should.equal("test #word");
text.twenglish_cleaner('test#..word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test,..word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test"""word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test#word', { hashtags : false }).should.equal("test #word");
text.twenglish_cleaner('#test#word', { hashtags : false }).should.equal("#test #word");
text.twenglish_cleaner('12/10', { hashtags : false }).should.equal("d\u20e3");
text.twenglish_cleaner('12/10/92', { hashtags : false }).should.equal("d\u20e3");
text.twenglish_cleaner('12/10/1992', { hashtags : false }).should.equal("d\u20e3");
text.twenglish_cleaner('test@@@word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test@word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test@word.com', { hashtags : false }).should.equal("e\u20e3");
text.twenglish_cleaner('12am', { hashtags : false }).should.equal("t\u20e3");
text.twenglish_cleaner('12:00am', { hashtags : false }).should.equal("t\u20e3")
text.twenglish_cleaner('well-timed', { hashtags : false }).should.equal("well-timed");
text.twenglish_cleaner('y\'all', { hashtags : false }).should.equal("y all");
text.twenglish_cleaner('i\'m it\'s', { hashtags : false }).should.equal("i m it s");
text.twenglish_cleaner('@gabycasas Hi Gaby, thanks for getting in touch, please send our Talent Co-ordinator a message at AlinaneK@matinee.co.uk for more details.').should.equal("m\u20e3 Hi Gaby thanks for getting in touch please send our Talent Co-ordinator a message at e\u20e3 for more details");
text.twenglish_cleaner('$1.00', { hashtags : false }).should.equal("c\u20e3");
text.twenglish_cleaner('$100,000.0', { hashtags : false }).should.equal("c\u20e3");
text.twenglish_cleaner('$1, dollar', { hashtags : false }).should.equal("c\u20e3 dollar");
text.twenglish_cleaner('@a @b', { hashtags : false }).should.equal("m\u20e3 m\u20e3");
text.twenglish_cleaner('<3', { hashtags : false }).should.equal("💗");


