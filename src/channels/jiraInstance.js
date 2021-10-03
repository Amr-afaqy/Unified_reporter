"use strict";
import JiraCore from "../core/JiraCore"
import JiraDefectModel from "../models/JiraDefectModel"
const logger = require("../logger");

export default class jiraInstance {
   jiraCore = new JiraCore()
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
            issuesList.push(new JiraDefectModel(defect.fMeta[this.globalConfigs.metaConfig.projectKeyMeta], test.tName, test.tName, test.tMeta[this.globalConfigs.metaConfig.componentMeta], test.tMeta[this.globalConfigs.metaConfig.priorityMeta], test.tMeta[this.globalConfigs.metaConfig.severityMeta], test.tMeta[this.globalConfigs.metaConfig.labelsMeta]));
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
