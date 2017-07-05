const text   = require('./text');
const chai   = require('chai');  
const assert = chai.assert;    // Using Assert style 
const expect = chai.expect;    // Using Expect style 
const should = chai.should();  // Using Should style

chai.config.showDiff = true;
text.twenglish_cleaner('this is a url http://test.com').should.equal("this is a url 0⃣");
text.twenglish_cleaner('word.').should.equal("word");
text.twenglish_cleaner('this is "a" "word.').should.equal("this is a word");
text.twenglish_cleaner('#word...', { hashtags : false }).should.equal("#word");
text.twenglish_cleaner('#word/#test', { hashtags : false }).should.equal("#word #test");
text.twenglish_cleaner('RT this is a #test.', { hashtags : false }).should.equal("this is a #test");
text.twenglish_cleaner('RT @james this is a #test.', { hashtags : false }).should.equal("this is a #test");
text.twenglish_cleaner('test...word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test...#word', { hashtags : false }).should.equal("test #word");
text.twenglish_cleaner('test#..word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test,..word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test@@@word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test"""word', { hashtags : false }).should.equal("test word");
text.twenglish_cleaner('test#word', { hashtags : false }).should.equal("test #word");
text.twenglish_cleaner('#test#word', { hashtags : false }).should.equal("#test #word");

