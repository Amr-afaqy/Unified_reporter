const http = require("axios").default;

const interfaces = require("./interfaces");

const globalConfigs = require("../config.json");

const logger = require("./logger");

module.exports = class jiraInstance {
  constructor() {
    this.jiraConfig = globalConfigs.jira;
    this.userName = this.jiraConfig.userName;
    this.password = this.jiraConfig.userPass;
    this.baseUrl = this.jiraConfig.gJiraBaseURL;
    this.authEndPoint = this.jiraConfig.gAuthEndPoint;
    this.issueEndPoint = this.jiraConfig.gCreateIssue;
  }

  async initateAuthenticationToken() {
    try {
      const sd = await http.post(this.baseUrl + this.authEndPoint, {
        username: this.userName,
        password: this.password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      logger("Initiating Jira token status is: " + (sd.status == 200 ? "OK" : "Denied"));
      return await sd.headers["set-cookie"];
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async extractDefectsFromObject(testObject) {
    for (let fixtureItem of testObject.testFixtures) {
      fixtureItem.fTests = fixtureItem.fTests.filter(test => test.runInfo.errs.length != 0);
    }

    return testObject.testFixtures.filter(item => item.fTests.length != 0);
  }

  async createIssueObjectList(defectsObject) {
    let issuesList = [];

    for (let defect of defectsObject) {
      for (let test of defect.fTests) {
        issuesList.push(new interfaces.jiraDefectInstance(defect.fMeta.projectKey, test.tName, test.tName, test.tMeta.component, test.tMeta.priorty, test.tMeta.severity, test.tMeta.labels));
      }
    }

    logger("Found defects to push: " + issuesList.length);
    return issuesList;
  }

  async pushEachDefect(token, defectsList) {
    for (let item of defectsList) {
      await this.#pushNewIssue(await token, item);
    }
  }

  async #pushNewIssue(cookies, dataPayload) {
    try {
      const sd = await http.post(this.baseUrl + this.issueEndPoint, await dataPayload, {
        headers: {
          Cookie: await cookies,
          "Content-Type": "application/json"
        }
      });
      logger("Defect pushed with key: " + sd.data.key);
      return await sd.data;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

};