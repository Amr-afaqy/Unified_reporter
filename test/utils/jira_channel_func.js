const globalConfigs = require("../../config.json");
var JiraCore = require("../../src/core/JiraCore");
var jiraInstance = require("../../src/channels/jiraInstance");
module.exports = {
        async createAuthenticationToken() {
                const jiraCore = new JiraCore(globalConfigs)
                const authToken = await jiraCore.initateAuthenticationToken();
                return authToken
        },

        async pushDefect(cookies, payload) {
                const jiraCore = new JiraCore(globalConfigs)
                let issuesList = await jiraCore.pushNewIssue(cookies, payload);
                console.log(await issuesList)
        }

}