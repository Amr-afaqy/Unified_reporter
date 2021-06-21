const distribute = require("./distributer");
const testRailInstance = require("./railInstance");
const configFile = require("./../config.json");

class testRunInstance {
    constructor(suiteID, name, userID, case_ids, mileStoneID, description) {
        return {
            suite_id: suiteID,
            name: name,
            assignedto_id: userID,
            refs: "",
            case_ids: case_ids,
            include_all: false,
            milestone_id: mileStoneID,
            description: description,
        };
    }
}

class testCaseInstance {
    constructor(caseID, statusID, comments, elapsed) {
        return {
            case_id: caseID,
            status_id: statusID,
            comment: comments,
            elapsed: elapsed,
        };
    }
}

async function tryTestRail() {
    let trInstance = new testRailInstance(configFile.testrail);
    let cookies = trInstance.initateAuthenticationToken();
    let projectID = trInstance.getProjectIDS(cookies, "AVL Project");

    let mileStoneID = trInstance.getMileStoneID(
        cookies,
        projectID,
        "Testcafe Integration"
    );

    let testSuiteID = trInstance.getSuiteID(
        cookies,
        projectID,
        "AVL Web  Admin."
    );
    let userID = trInstance.getUserID(cookies);

    let newRun = new testRunInstance(
        await testSuiteID,
        "Custom Plugin run-00" + Math.floor(Math.random() * 100).toString(),
        await userID,
        [15569, 166],
        await mileStoneID,
        "This is just a test description"
    );

    let testCases = [];
    testCases.push(new testCaseInstance(15569, 5, "Test result", "4m"));
    testCases.push(new testCaseInstance(15100, 2, "Test result2", "2m"));

    let addedRun = await trInstance.pushNewTestRun(
        await cookies,
        await projectID,
        newRun
    );

    let addedResults = await trInstance.updateTestRunResults(
        await cookies,
        await addedRun,
        testCases
    );

    console.log(await addedRun);
    console.log(await addedResults);
}

async function tryDistributer() {
    const reportDistributer = new distribute();
    reportDistributer.setTestObject("Test");
    reportDistributer.setConfigFile("Configa");
    reportDistributer.startDistributing();
}

async function testDistributer() {
    const configFile = require("./../config.json");
    const objectFile = require("./../testObject.json");
    const reportDistributer = new distribute();
    reportDistributer.setConfigFile(configFile);
    reportDistributer.setTestObject(objectFile);
    reportDistributer.startDistributing();
}

testDistributer();
