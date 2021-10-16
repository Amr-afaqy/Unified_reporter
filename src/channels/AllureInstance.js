"use strict";
const logger = require("../logger");

module.exports = class AllureInstance {
    constructor(testRailCore, configObject) {
        this.allureConfig = configObject.allure;
        this.allureReport = testRailCore;
    }

    async generateReport(testObject) {
        this.allureReport.setTaskStartData(testObject.reportStart, testObject.reportAgent, countTestsInTestObject(testObject))
        testObject.testFixtures.forEach((fixture) => {
            this.allureReport.createNewSuite(fixture.name)
            fixture.fTests.forEach((test) => {
                this.allureReport.createNewTestCase(test.tName)
                this.allureReport.addTestEnvironment("Agent", testObject.reportAgent[0])
                allureCore.addTestDescription(getTestCaseDescription(test.tMeta.testcase_ID));
                this.allureReport.addTestLabel('severity', test.tMeta.testSeverity);
                allureCore.addTestTag(test.tMeta.testcase_ID)
                let testInfo = identifyTestCaseStatus(test)
                this.allureReport.endTestCaseData(testInfo.status, { "message": testInfo.message, "stack": testInfo.stack }, 3341313131)
            })
            this.allureReport.endTestSuite()
        })
    }



}

function countTestsInTestObject(testObject) {
    return testObject.testFixtures.reduce((fixture, next) => fixture.fTests.length + next.fTests.length)
}

function getTestCaseDescription(testCaseID) {
    return 'This is just a description'
}

function identifyTestCaseStatus(testCase) {
    if (testCase.runInfo.skipped) {
        return { status: "skipped", message: "This test has been skipped.", stack: "This test has been skipped." }
    }
    else if (testCase.runInfo.errs.length == 0) {
        return { status: "passed", message: "This test has been passed.", stack: "This test has been passed." }
    }
    else if (testCase.runInfo.errs.length > 0) {
        this.addScreenshot(testCafeErrorObject.screenshotPath);
        return { status: "failed", message: "This test has been broken.", stack: "This test has been broken." }
    }
}