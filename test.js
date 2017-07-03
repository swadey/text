const text   = require('./text');
const chai   = require('chai');  
const assert = chai.assert;    // Using Assert style 
const expect = chai.expect;    // Using Expect style 
const should = chai.should();  // Using Should style

chai.config.showDiff = true;
text.twenglish_cleaner('this is a url http://test.com').should.equal("this is a url 0⃣");
text.twenglish_cleaner('word.').should.equal("word");
text.twenglish_cleaner('this is "a" "word.').should.equal("this is a word");


