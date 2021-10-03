"use strict";
import JiraCore from "./core/JiraCore";
import TestrailCore from "./core/TestrailCore";
import TestRailInstance from "./channels/TestRailInstance";
import jiraInstance from "./channels/jiraInstance";
const logger = require("./logger");
const globalConfigs = require("../config.json");

module.exports = class Distributer {
   #TEST_OBJECT;
   constructor() { }

   async setTestObject(testObject) {
      this.#TEST_OBJECT = testObject;
   }

   async startDistributing() {
      await this.#distributeToRail(this.#TEST_OBJECT);
      await this.#distributeToJira(this.#TEST_OBJECT);
   }

   async #distributeToRail(railTestObject) {
      try {
         const railCore = new TestrailCore(globalConfigs)
         const railObject = new TestRailInstance(railCore, globalConfigs);
         const authToken = await railObject.createTokenDetails();
         const runData = await railObject.prepareRunData(authToken, railTestObject);
         await railObject.pushNewRun(authToken, runData);
         await railObject.pushTestResults(authToken, runData);
      } catch (error) {
         logger(error, true);
         console.error(error)
      }
   }

   async #distributeToJira(testObject) {
      try {
         const jiraCore = new JiraCore(globalConfigs)
         let jira = new jiraInstance(jiraCore, globalConfigs);
         let sessionCookies = await jira.initateAuthenticationToken();
         let defects = await jira.extractDefectsFromObject(testObject);
         let issuesList = await jira.createIssueObjectList(defects);
         await jira.pushEachDefect(await sessionCookies, issuesList);
      } catch (error) {
         logger(error, true);
         console.error(error)
      }
   }
};
