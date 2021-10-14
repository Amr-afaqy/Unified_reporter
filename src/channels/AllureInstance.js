"use strict";
const logger = require("../logger");

module.exports = class AllureInstance {
    constructor(testRailCore, configObject) {
        this.allureConfig = configObject.allure;
        this.allureReport = testRailCore;
    }

    
}