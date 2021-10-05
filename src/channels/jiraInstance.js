"use strict";
const logger = require("../logger");
const JiraCore = require("../core/JiraCore.js")
const JiraDefectModel = require("../models/JiraDefectModel")
module.exports = class jiraInstance {
   constructor(jiraCore, configObject) {
      this.jiraCore = jiraCore;
      this.globalConfigs = configObject
   }

   async initateAuthenticationToken() {
      try {
         const sd = await this.jiraCore.initateAuthenticationToken()
         return await sd;
      } catch (error) {
         logger(await error.response.data, true);
         console.error(await error.response.data);
      }
   }

   async extractDefectsFromObject(testObject) {
      for (let fixtureItem of testObject.testFixtures) {
         fixtureItem.fTests = fixtureItem.fTests.filter((test) => test.runInfo.errs.length != 0);
      }
      return testObject.testFixtures.filter((item) => item.fTests.length != 0);
   }

   async createIssueObjectList(defectsObject) {
      let issuesList = [];
      for (let defect of defectsObject) {
         for (let test of defect.fTests) {
            let defectObject = new JiraDefectModel(defect.fMeta[this.globalConfigs.metaConfig.projectKeyMeta], test.tName, test.tName, 
               test.tMeta[this.globalConfigs.metaConfig.componentMeta], 
               test.tMeta[this.globalConfigs.metaConfig.priorityMeta], 
               test.tMeta[this.globalConfigs.metaConfig.severityMeta], 
               test.tMeta[this.globalConfigs.metaConfig.labelsMeta],
               test.tMeta[this.globalConfigs.metaConfig.testcaseID])
            issuesList.push(defectObject);
         }
      }
      logger("Found defects to push: " + issuesList.length);
      return issuesList;
   }

   async pushEachDefect(token, defectsList) {
      for (let item of defectsList) {
         await this.jiraCore.pushNewIssue(await token, item);
      }
   }

}
