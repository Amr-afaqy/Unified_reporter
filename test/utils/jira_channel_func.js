const globalConfigs = require("../../src/config.json");
var JiraCore = require("../../src/core/JiraCore");
var jiraInstance = require("../../src/channels/jiraInstance");
module.exports = {
        returnObject:
        {
                "auth": {
                        "jiraBaseURL": "http://jira.afaqy.sa/",
                        "jiraUsername": "a.ali",
                        "jiraPassword": "Temp@150"
                },
                "metaConfig": {
                        "projectMeta": "Project_Name",
                        "suiteMeta": "Suite_Name",
                        "milestoneMeta": "MileStone_Name",
                        "testcaseID": "testcase_ID",
                        "componentMeta": "targetComponent",
                        "projectKeyMeta": "jiraProjectKey",
                        "priorityMeta": "testPriority",
                        "severityMeta": "testSeverity",
                        "labelsMeta": "testLabels",
                        "fixtureIDMeta": "fixtureID"
                }

        },
        async createAuthenticationToken() {
                const jiraCore = new JiraCore(globalConfigs.jira, this.returnObject.auth)
                const authToken = await jiraCore.initateAuthenticationToken();
                return authToken
        },

        async pushDefect(cookies, payload) {
                const jiraCore = new JiraCore(globalConfigs.jira, this.returnObject.auth)
                let issuesList = await jiraCore.pushNewIssue(cookies, payload);
                console.log(await issuesList)
        }

}