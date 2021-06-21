const Distributer = require("./distributer")

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
            rresults: "",
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
            fTests: [],
        });
    }

    updateFixtureTests(tName, tMeta, tID, info) {
        this.dataObject["testFixtures"][
            this.dataObject["testFixtures"].length - 1
        ]["fTests"].push({
            tID: tID,
            tName: tName,
            tMeta: tMeta,
            runInfo: info,
        });
    }

    updateTestRunFooter(endTime, passed, warnings, result) {
        this.dataObject["rendTime"] = endTime;
        this.dataObject["rpassed"] = passed;
        this.dataObject["rfailed"] = passed;
        this.dataObject["rwarnings"] = warnings;
        this.dataObject["rresults"] = result;
    }

    printGeneratedObject() {
        const configFile = require('./../config.json')
        const reportDistributer = new Distributer();
        reportDistributer.setConfigFile(configFile);
        reportDistributer.setTestObject(this.dataObject);
        reportDistributer.startDistributing()
 
    }
}

module.exports = function () {
    return {
        noColors: true,
        reporterHandler: new TestRun(),
        reportTaskStart(startTime, userAgents, testCount) {
            this.reporterHandler.updateDataObject("reportStart", startTime);
            this.reporterHandler.updateDataObject("reportAgent", userAgents);
            this.reporterHandler.updateDataObject("testsCount", testCount);
        },

        reportFixtureStart(name, path, meta) {
            this.reporterHandler.updateFixtures(
                name,
                path,
                meta,
                Math.random()
            );
        },

        reportTestDone(name, testRunInfo, meta) {
            this.reporterHandler.updateFixtureTests(
                name,
                meta,
                Math.random(),
                testRunInfo
            );
        },

        reportTaskDone(endTime, passed, warnings, result) {
            this.reporterHandler.updateTestRunFooter(
                endTime,
                passed,
                warnings,
                result
            );
            this.reporterHandler.printGeneratedObject();
        },
    };
};


