const Distributer = require("./distributer");

const logger = require("./logger");

const chalk = require('chalk');

class TestRun {
  constructor() {
    this.dataObject = {
      reportStart: "",
      reportAgent: "",
      testsCount: "",
      testFixtures: [],
      rendTime: "",
      rpassed: "",
      rfailed: "",
      rwarnings: "",
      rresults: ""
    };
  }

  updateDataObject(params, value) {
    this.dataObject[params] = value;
  }

  updateFixtures(fName, fPath, fMeta, fID) {
    this.dataObject["testFixtures"].push({
      fID: fID,
      name: fName,
      path: fPath,
      fMeta: fMeta,
      fTests: []
    });
  }

  updateFixtureTests(tName, tMeta, tID, info) {
    this.dataObject["testFixtures"][this.dataObject["testFixtures"].length - 1]["fTests"].push({
      tID: tID,
      tName: tName,
      tMeta: tMeta,
      runInfo: info
    });
  }

  updateTestRunFooter(endTime, passed, warnings, result) {
    this.dataObject["rendTime"] = endTime;
    this.dataObject["rpassed"] = passed;
    this.dataObject["rfailed"] = passed;
    this.dataObject["rwarnings"] = warnings;
    this.dataObject["rresults"] = result;
  }

  async printGeneratedObject() {
    try {
      logger("Starting the distributer master......");
      const reportDistributer = new Distributer();
      await reportDistributer.setTestObject(this.dataObject);
      await reportDistributer.startDistributing();
      logger("Done......");
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = function () {
  return {
    noColors: true,
    reporterHandler: new TestRun(),

    reportTaskStart(startTime, userAgents, testCount) {
      this.startTime = startTime;
      this.testCount = testCount;
      const time = this.moment(startTime).format("M/D/YYYY h:mm:ss a");
      this.write(chalk.green(`--> Afaqy custom reporter started: ${time}`)).newline().write(chalk.green(`--> Running ${testCount} tests in: ${userAgents}`)).newline();
      this.reporterHandler.updateDataObject("reportStart", startTime);
      this.reporterHandler.updateDataObject("reportAgent", userAgents);
      this.reporterHandler.updateDataObject("testsCount", testCount);
    },

    reportFixtureStart(name, path, meta) {
      this.currentFixtureName = name;
      this.currentFixtureMeta = meta;
      this.write(chalk.green(`--> Starting fixture: ${name} ${meta.fixtureID}`)).newline();
      this.reporterHandler.updateFixtures(name, path, meta, Math.random());
    },

    async reportTestStart(name, meta) {
      this.write(chalk.green(`--> Starting test: ${name} (${meta.severity})`)).newline();
    },

    reportTestDone(name, testRunInfo, meta) {
      this.reporterHandler.updateFixtureTests(name, meta, Math.random(), testRunInfo);
    },

    async reportTaskDone(endTime, passed, warnings, result) {
      this.reporterHandler.updateTestRunFooter(endTime, passed, warnings, result);
      const time = this.moment(endTime).format('M/D/YYYY h:mm:ss a');
      const durationMs = endTime - this.startTime;
      const durationStr = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]');
      const summary = result.failedCount ? `${result.failedCount}/${this.testCount} failed` : `${result.passedCount} passed`;
      this.write(chalk.green(`--> Testing finished: ${time} | Duration: ${durationStr} | ${summary}`)).newline();
      await this.reporterHandler.printGeneratedObject();
    }

  };
};