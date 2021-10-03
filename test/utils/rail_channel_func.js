const globalConfigs = require("../../config.json");
const TestrailCore = require("../../src/core/TestrailCore.js");
const TestRailInstance = require("../../src/channels/TestRailInstance.js");
module.exports = {

        async createAuthenticationToken() {
                const railCore = new TestrailCore(globalConfigs)
                const railObject = new TestRailInstance(railCore, globalConfigs);
                const authToken = await railObject.createTokenDetails();
                return authToken
        },

        async getProjectID(cookies, projectName) {
                const railCore = new TestrailCore(globalConfigs)
                return railCore.getProjectIDS(cookies, projectName)
        },

        async getMilestoneID(cookies, projectID, milestoneNam) {
                const railCore = new TestrailCore(globalConfigs)
                return railCore.getMileStoneID(cookies, projectID, milestoneNam)
        },

        async getSuiteID(cookies, projectID, suiteID) {
                const railCore = new TestrailCore(globalConfigs)
                return railCore.getSuiteID(cookies, projectID, suiteID)
        },

        async getUserID(cookies) {
                const railCore = new TestrailCore(globalConfigs)
                return railCore.getUserID(cookies)
        },

        async createNewTestRun(sessionID, projectID, testRunObject) {
                const railCore = new TestrailCore(globalConfigs)
                return await railCore.pushNewTestRun(
                        await sessionID,
                        await projectID,
                        testRunObject
                );
        },

        async updateTestRunResult(sessionID, testRunID, testCasesArray) {
                const railCore = new TestrailCore(globalConfigs)
                return await railCore.updateTestRunResults(
                        await sessionID,
                        await testRunID,
                        testCasesArray
                );
        },

        async getTestCaseData(sessionID, testRunID) {
                const railCore = new TestrailCore(globalConfigs)
                return await railCore.getTestCaseByID(
                        await sessionID,
                        await testRunID
                );
        }
}