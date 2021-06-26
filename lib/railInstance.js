const http = require("axios").default;

var querystring = require("querystring");

const iNrfaces = require("./interfaces");

const globalConfigs = require("../config.json");

const logger = require("./logger");

module.exports = class testRailInstance {
  constructor() {
    this.railConfig = globalConfigs.testrail;
    this.userName = this.railConfig.userName;
    this.password = this.railConfig.userPass;
    this.baseUrl = this.railConfig.gRailBaseURL;
    this.authEndPoint = this.railConfig.gAuthEndPoint;
    this.listProjectsEndPoint = this.railConfig.gListProjectsEndPoint;
    this.listMileStones = this.railConfig.gListMileStones;
    this.listProjectSuites = this.railConfig.gListProjectSuites;
    this.getCurrentUser = this.railConfig.gGetCurrentUser;
    this.addNewRun = this.railConfig.gAddNewRun;
    this.addResults = this.railConfig.gAddResults;
  }

  async createTokenDetails() {
    let session_ID = await this.#initateAuthenticationToken();
    let user_ID = await this.#getUserID(session_ID);
    return {
      sessionID: await session_ID,
      userID: await user_ID
    };
  }

  async prepareRunData(token, testObject) {
    let runObject = [];

    for (let element of testObject.testFixtures) {
      runObject.push({
        runInstance: await this.#createRunObject(await token, await element),
        runResults: await this.#createTestResultsObject(await element.fTests)
      });
    }

    return runObject;
  }

  async pushNewRun(token, runObject) {
    for (let testRun of runObject) {
      let runData = await this.#pushNewTestRun(await token.sessionID, await testRun.runInstance.project_ID, await testRun.runInstance.runObject);
      testRun["runID"] = runData.id;
      logger("Created Run object with: " + "ID: " + runData.id + " ProjectID: " + testRun.runInstance.project_ID);
    }
  }

  async pushTestResults(token, runObject) {
    for (let testRun of runObject) {
      let testResult = await this.#updateTestRunResults(await token.sessionID, await testRun.runID, await testRun.runResults);
      logger("Run results of " + "ID: " + testRun.runID + " updated with ID: " + testResult.data[0].id);
    }
  }

  async #initateAuthenticationToken() {
    try {
      let sessionID = await http.get(this.baseUrl + "/auth/login");
      let requestCookies = await sessionID.headers["set-cookie"].toString().slice(0, sessionID.headers["set-cookie"].toString().indexOf(";"));
      let sd = await http.post(this.baseUrl + this.authEndPoint, querystring.stringify({
        name: this.userName,
        password: this.password,
        rememberme: 1
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: requestCookies
        }
      });
      logger("Initiating Testrail token status is: " + sd.statusText);
      return requestCookies;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #getProjectIDS(sessionCookies, projectName) {
    try {
      let listProjects = await http.get(this.baseUrl + this.listProjectsEndPoint, {
        headers: {
          "Content-Type": "application/json",
          Cookie: await sessionCookies
        }
      });
      let targetProject = await listProjects.data.filter(project => project.name == projectName);
      return await targetProject[0].id;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #getMileStoneID(sessionCookies, projectID, mileStoneName) {
    try {
      let listMileStones = await http.get(this.baseUrl + this.listMileStones + "/" + (await projectID), {
        headers: {
          "Content-Type": "application/json",
          Cookie: await sessionCookies
        }
      });
      let targetMileStone = await listMileStones.data.filter(mileStone => mileStone.name == mileStoneName);
      return await targetMileStone[0].id;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #getSuiteID(sessionCookies, projectID, suitName) {
    try {
      let listSuits = await http.get(this.baseUrl + this.listProjectSuites + "/" + (await projectID), {
        headers: {
          "Content-Type": "application/json",
          Cookie: await sessionCookies
        }
      });
      let targetSuit = await listSuits.data.filter(projectSuite => projectSuite.name == suitName);
      return await targetSuit[0].id;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #getUserID(sessionCookies) {
    try {
      let userDetails = await http.get(this.baseUrl + this.getCurrentUser + "&email=" + this.userName, {
        headers: {
          "Content-Type": "application/json",
          Cookie: await sessionCookies
        }
      });
      return await userDetails.data.id;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #pushNewTestRun(sessionCookies, projectID, testRunObject) {
    try {
      let addRunRequest = await http.post(this.baseUrl + this.addNewRun + "/" + projectID, testRunObject, {
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookies
        }
      });
      return addRunRequest.data;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #updateTestRunResults(sessionCookies, runObjectID, resultsObject) {
    try {
      let addResultsRequest = await http.post(this.baseUrl + this.addResults + "/" + (await runObjectID), {
        results: await resultsObject
      }, {
        headers: {
          "Content-Type": "application/json",
          Cookie: sessionCookies
        }
      });
      return addResultsRequest;
    } catch (error) {
      logger(await error.response.data, true);
      console.error(await error.response.data);
    }
  }

  async #createRunObject(token, fixtureObject) {
    let projectID = await this.#getProjectIDS(await token.sessionID, fixtureObject.fMeta[globalConfigs.metaConfig.projectMeta]);
    let milestoneID = await this.#getMileStoneID(await token.sessionID, await projectID, fixtureObject.fMeta[globalConfigs.metaConfig.milestoneMeta]);
    let suiteID = await this.#getSuiteID(await token.sessionID, await projectID, fixtureObject.fMeta[globalConfigs.metaConfig.suiteMeta]);
    let casesID = await this.#getTestCasesIDs(fixtureObject);
    return {
      project_ID: await projectID,
      runObject: new iNrfaces.testRunInstance(await suiteID, await fixtureObject.name, await token.userID, casesID, await milestoneID, "This is just a test description")
    };
  }

  async #createTestResultsObject(testsArrayObject) {
    let testResults = [];

    for (let testCase of testsArrayObject) {
      testResults.push(new iNrfaces.testCaseInstance(testCase.tMeta[globalConfigs.metaConfig.testcaseID], await this.#checkTestCaseStatus(testCase.runInfo.errs), testCase.tName, await this.#convertTestCaseTime(testCase.runInfo.durationMs)));
    }

    return testResults;
  }

  async #checkTestCaseStatus(testCaseErrs) {
    if (testCaseErrs.length === 0) {
      return 1;
    } else {
      return 5;
    }
  }

  async #convertTestCaseTime(testCaseMs) {
    return Math.floor(testCaseMs / 60000);
  }

  async #getTestCasesIDs(fixtureObject) {
    let casesArray = [];

    for (let element of await fixtureObject.fTests) {
      casesArray.push(element.tMeta[globalConfigs.metaConfig.testcaseID]);
    }

    return casesArray;
  }

};