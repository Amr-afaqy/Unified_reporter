"use strict";
const JiraCore = require("./core/JiraCore.js")
const TestrailCore = require("./core/TestrailCore.js")
const TestRailInstance = require("./channels/TestRailInstance.js")
const jiraInstance = require("./channels/jiraInstance.js")
const logger = require("./logger");
const globalConfigs = require("../config.json");
const AllureCore = require("./core/AllureCore.js");
const AllureInstance = require("./channels/AllureInstance.js");

module.exports = class Distributer {
   #TEST_OBJECT;
   railCore;
   railProcessor;
   jiraCore;
   jiraProcessor;
   railToken;
   allureCore;
   allureInstance;
   constructor() {
   }

   async setTestObject(testObject) {
      this.#TEST_OBJECT = testObject;
   }

   async startDistributing() {
      await distributeToRail(this.#TEST_OBJECT);
      await distributeToJira(this.#TEST_OBJECT);
      await distributeToAllure(this.#TEST_OBJECT);
   }

   async distributeToRail(railTestObject) {
      try {
         this.railCore = new TestrailCore(globalConfigs.testrail)
         this.railProcessor = new TestRailInstance(this.railCore, globalConfigs);
         this.railToken = await this.railProcessor.createTokenDetails();
         const runData = await this.railProcessor.prepareRunData(this.railToken, railTestObject);
         await this.railProcessor.pushNewRun(this.railToken, runData);
         await this.railProcessor.pushTestResults(this.railToken, runData);
      } catch (error) {
         logger(error, true);
         console.error(error)
      }
   }

   async distributeToJira(testObject) {
      try {
         this.jiraCore = new JiraCore(globalConfigs.jira)
         this.jiraProcessor = new jiraInstance(this.jiraCore, globalConfigs);
         let sessionCookies = await this.jiraProcessor.initateAuthenticationToken();
         let defects = await this.jiraProcessor.extractDefectsFromObject(testObject);
         let issuesList = await this.jiraProcessor.createIssueObjectList(defects);
         await this.updateIssuesListWithDescription(issuesList)
         await this.jiraProcessor.pushEachDefect(await sessionCookies, issuesList);
         await this.jiraProcessor.updateDefectAttachment(await sessionCookies, issuesList)
         return true
      } catch (error) {
         logger(error, true);
         console.error(error)
      }
   }

   async distributeToAllure(testObject) {
      try {
         this.allureCore = new AllureCore(globalConfigs.allure)
         this.allureInstance = new AllureInstance(this.allureCore, globalConfigs)
         this.allureInstance.generateReport(testObject)
      } catch (error) {
         logger(error, true);
         console.error(error)
      }
   }

   async updateIssuesListWithDescription(issuesList) {
      await Promise.all(issuesList.map(async (test) => {
         let testCaseData = await this.railCore.getTestCaseByID(this.railToken.sessionID, test.id);
         test.description =
            `${testCaseData.data.custom_preconds}\n
             ${testCaseData.data.custom_steps}\n
             ${testCaseData.data.custom_expected}`
      }))
      return issuesList
   }
};


