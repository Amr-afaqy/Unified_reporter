const configFile = require("../config.json");
const jiraObject = require("../jiraObject.json");
const objectFile = require("../testObject.json");
const jiraInstance = require("../src/jiraInstance.js");
const distributer = require("../src/distributer.js")
import { testRailInstance } from "./railInstance.js"

const fs = require('fs');
const { config } = JSON.parse(fs.readFileSync('./../config.json'));

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

async function tryJira() {
    const jira = new jiraInstance(configFile.jira)
    //let sessionCookies = await jira.initateAuthenticationToken()
    //let createIssue = await jira.pushNewIssue(await sessionCookies, jiraObject)
    let defects = await jira.extractDefectsFromObject(objectFile)
    let issuesList = await jira.createIssueObjectList(defects);
    console.log(await issuesList)
}

async function testDistributer() {
    const configFile = require("../config.json");
    const objectFile = require("../testObject.json");
    const reportDistributer = new distributer();
    reportDistributer.setConfigFile(configFile);
    reportDistributer.setTestObject(objectFile);
    reportDistributer.startDistributing();
}


testDistributer();
