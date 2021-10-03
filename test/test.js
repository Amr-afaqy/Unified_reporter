var assert           = require('assert');
var channelsTest = require("./utils/channels-test.js")

it('Test create testrail authentication token', async function () {
    let token = channelsTest.createAuthenticationToken()
    assert.notEqual(token, null);
});

// it('Test create jira authentication token', function () {
//     var report   = createReport(false);
//     var expected = read('./data/report-without-colors');

//     report   = normalizeNewline(report).trim();
//     expected = normalizeNewline(expected).trim();

//     assert.strictEqual(report, expected);
// });
