(function(){

    var YUITest = require('yuitest').YUITest;
    
    var testCase = new YUITest.TestCase({
    
        'this should work': function() {
        	YUITest.Assert.isTrue(6 === 6);
        }

    });
    
    YUITest.TestRunner.add(testCase);
    YUITest.TestRunner.run();
}());