"use strict";
const logger = require("../logger");
const JiraDefectModel = require("../models/JiraDefectModel")
const fs = require("fs")
const FormData = require('form-data');

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
               test.tMeta[this.globalConfigs.metaConfig.testcaseID],
               test.runInfo.videos[0].videoPath)
            issuesList.push(defectObject);
         }
      }
      logger("Found defects to push: " + issuesList.length);
      return issuesList;
   }

   async pushEachDefect(token, defectsList) {
      await Promise.all(defectsList.map(async (item) => item.jiraKey = await this.jiraCore.pushNewIssue(await token, item.toRequestPayload())))
      return await defectsList
   }

   async updateDefectAttachment(token, defectsList) {
      return await Promise.all(defectsList.map(async (item) => {
         const filePath = item.attachment;
         const form = new FormData();
         const stats = fs.statSync(filePath);
         const fileSizeInBytes = stats.size;
         const fileStream = fs.createReadStream(filePath);
         form.append('file', fileStream, { knownLength: fileSizeInBytes });
         return await this.jiraCore.updateIssueAttachment(await token, item.jiraKey, form)
      }))
   }
}
