const globalConfigs = require("../../config.json");
var TestrailCore = require("../../src/core/TestrailCore.js");
var TestRailInstance = require("../../src/channels/TestRailInstance.js");
module.exports = {
        async createAuthenticationToken() {
                const railCore = new TestrailCore(globalConfigs)
                const railObject = new TestRailInstance(railCore, globalConfigs);
                const authToken = await railObject.createTokenDetails();
                return authToken.userID
        }
}