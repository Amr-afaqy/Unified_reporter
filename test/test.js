var assert = require('assert');
const rail_Channel = require("./utils/rail_channel_func")
const jira_Channel = require("./utils/jira_channel_func")
const test_Data = require("./data/test_data");
const test_data = require('./data/test_data');

describe("Test the Testrail module core functions", function () {
    before(async function () {
        this.token = await rail_Channel.createAuthenticationToken()
        assert.notEqual(this.token.userID, null);
        assert.notEqual(this.token.sessionID, null);
    });

    it('Test return a project ID from current projects on testrail', async function () {
        this.projectID = await rail_Channel.getProjectID(this.token.sessionID, "AVL Project")
        assert.equal(this.projectID, 4);
    });

    it('Test return a milestone ID from current milestones on testrail', async function () {
        this.mileStoneID = await rail_Channel.getMilestoneID(this.token.sessionID, this.projectID, "Testcafe Integration")
        assert.equal(this.mileStoneID, 7);
    });

    it('Test return a Suite ID from current suites on testrail', async function () {
        this.suiteID = await rail_Channel.getSuiteID(this.token.sessionID, this.projectID, "AVL Web  Admin.")
        assert.equal(this.suiteID, 4);
    });

    it('Test return a user ID from current users on testrail', async function () {
        this.userID = await rail_Channel.getUserID(this.token.sessionID)
        assert.equal(this.userID, 57);
    });

    it('Test create new testrun', async function () {
        let testRunObject = test_Data.testRunObject(this.suiteID, this.userID, this.mileStoneID, [15569, 15100])
        this.testRun = await rail_Channel.createNewTestRun(this.token.sessionID, this.projectID, testRunObject)
        assert.notEqual(this.testRun.id, null);
    });

    it('Test update testrun results', async function () {
        let testCases = [];
        testCases.push(test_data.testCaseObject(15569, 5, "Comment", "4m"));
        testCases.push(test_data.testCaseObject(15100, 1, "Comment test result 2", "2m"));

        let testRunResults = await rail_Channel.updateTestRunResult(this.token.sessionID, this.testRun.id, testCases)
        assert.equal(testRunResults.data.length > 0, true);
    });
})

describe.only("Test the Jira module core functions", function () {
    before(async function () {
        this.token = await jira_Channel.createAuthenticationToken()
        assert.notEqual(this.token, null);
    });

    it('Test push a defect on jira', async function () {
        let railToken = await rail_Channel.createAuthenticationToken()
        let testCaseData = await rail_Channel.getTestCaseData(railToken.sessionID, 15100)
        let defectObject = test_Data.testJiraObject("AVLAUT", testCaseData.data.title,
            `${testCaseData.data.custom_preconds}\n
        ${testCaseData.data.custom_steps}\n
        ${testCaseData.data.custom_expected}`,
            "Automation", "High", "Critical", [
            "SystemTest",
            "BackEnd"
        ])
        let result = await jira_Channel.pushDefect(this.token, defectObject)
        console.log(result)
        assert.notEqual(result, null);
    });
})
