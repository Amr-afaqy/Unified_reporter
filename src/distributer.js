const railObjectInstance = require("./railInstance");
const jiraObjectInstance = require("./jiraInstance");
module.exports = class Distributer {
   #TEST_OBJECT;
   constructor() {}

   async setConfigFile(configFile) {
      this.#CONFIG_OBJECT = configFile;
   }

   async setTestObject(testObject) {
      this.#TEST_OBJECT = testObject;
   }

   async startDistributing() {
      await this.#distributeToRail(this.#TEST_OBJECT);
      await this.#distributeToJira(this.#TEST_OBJECT);
   }

   async #distributeToRail(railTestObject) {
      try {
         console.log("Distributing to testrail started.");
         const railObject = new railObjectInstance();
         const authToken = await railObject.createTokenDetails();
         const runData = await railObject.prepareRunData(authToken, railTestObject);
         await railObject.pushNewRun(authToken, runData);
         await railObject.pushTestResults(authToken, runData);
      } catch (error) {
         console.log(error);
      }
   }

   async #distributeToJira(testObject) {
      try {
         console.log("Distributing to Jira started.");
         let jira = new jiraObjectInstance();
         let sessionCookies = await jira.initateAuthenticationToken();
         let defects = await jira.extractDefectsFromObject(testObject);
         let issuesList = await jira.createIssueObjectList(defects);
         await jira.pushEachDefect(await sessionCookies, issuesList);
      } catch (error) {
         console.log(error);
      }
   }
};
