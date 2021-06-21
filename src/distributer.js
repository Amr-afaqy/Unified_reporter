const railObjectInstance = require("./railInstance");
const iNrfaces = require("./interfaces");

module.exports = class Distributer {
    #CONFIG_OBJECT;
    #TEST_OBJECT;
    constructor() {}

    setConfigFile(configFile) {
        this.#CONFIG_OBJECT = configFile;
    }

    setTestObject(testObject) {
        this.#TEST_OBJECT = testObject;
    }

    async startDistributing() {
        await this.distributeToRail(this.#CONFIG_OBJECT.testrail, this.#TEST_OBJECT);
        //await this.distributeToJira(this.#CONFIG_OBJECT.jira, this.#TEST_OBJECT)
    }

    async distributeToRail(railConfig, railTestObject) {
        const railObject = new railObjectInstance(railConfig);
        const authToken = await railObject.createTokenDetails();
        const runData = await this.#prepareRunData(
            railObject,
            authToken,
            railTestObject
        );
        await this.#pushNewRun(railObject, authToken, runData);
        await this.#pushTestResults(railObject, authToken, runData);
    }

    async #prepareRunData(railInstance, token, testObject) {
        let runObject = [];
        for (let element of testObject.testFixtures) {
            runObject.push({
                runInstance: await this.#createRunObject(
                    await railInstance,
                    await token,
                    await element
                ),
                runResults: await this.#createTestResultsObject(
                    await element.fTests
                ),
            });
        }
        return runObject;
    }

    async #createRunObject(railInstance, token, fixtureObject) {
        let projectID = await railInstance.getProjectIDS(
            await token.sessionID,
            fixtureObject.fMeta[this.#CONFIG_OBJECT.metaConfig.projectMeta]
        );
        let milestoneID = await railInstance.getMileStoneID(
            await token.sessionID,
            await projectID,
            fixtureObject.fMeta[this.#CONFIG_OBJECT.metaConfig.milestoneMeta]
        );
        let suiteID = await railInstance.getSuiteID(
            await token.sessionID,
            await projectID,
            fixtureObject.fMeta[this.#CONFIG_OBJECT.metaConfig.suiteMeta]
        );
        let casesID = await this.#getTestCasesIDs(fixtureObject);
        return {
            project_ID: await projectID,
            runObject: new iNrfaces.testRunInstance(
                await suiteID,
                await fixtureObject.name,
                await token.userID,
                casesID,
                await milestoneID,
                "This is just a test description"
            ),
        };
    }

    async #createTestResultsObject(testsArrayObject) {
        let testResults = [];
        for (let testCase of testsArrayObject) {
            testResults.push(
                new iNrfaces.testCaseInstance(
                    testCase.tMeta[this.#CONFIG_OBJECT.metaConfig.testcaseID],
                    await this.#checkTestCaseStatus(testCase.runInfo.errs),
                    testCase.tName,
                    await this.#convertTestCaseTime(testCase.runInfo.durationMs)
                )
            );
        }
        return testResults;
    }

    async #getTestCasesIDs(fixtureObject) {
        let casesArray = [];
        for (let element of await fixtureObject.fTests) {
            casesArray.push(
                element.tMeta[this.#CONFIG_OBJECT.metaConfig.testcaseID]
            );
        }
        return casesArray;
    }

    async #pushNewRun(railInstance, token, runObject) {
        for (let testRun of runObject) {
            let runData = await railInstance.pushNewTestRun(
                await token.sessionID,
                await testRun.runInstance.project_ID,
                await testRun.runInstance.runObject
            );
            testRun["runID"] = runData.id;
        }
    }

    async #pushTestResults(railInstance, token, runObject) {
        await runObject.forEach(async (testRun) => {
            await railInstance.updateTestRunResults(
                await token.sessionID,
                await testRun.runID,
                await testRun.runResults
            );
        });
    }

    async #checkTestCaseStatus(testCase) {
        if (testCase.length == 0) {
            return 1;
        } else {
            return 5;
        }
    }

    async #convertTestCaseTime(testCaseMs) {
        return Math.floor(testCaseMs / 60000);
    }
};
