"use strict";
const http = require("axios").default;
const logger = require("../logger");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
export default class JiraCore{
    constructor(configObject){
        this.jiraConfig = configObject.jira;
        this.userName = process.env.jiraUsername;
        this.password = process.env.jiraPassword;
        this.baseUrl = process.env.jiraBaseURL;
        this.authEndPoint = this.jiraConfig.gAuthEndPoint;
        this.issueEndPoint = this.jiraConfig.gCreateIssue;
     }

    async initateAuthenticationToken() {
        try {
           const sd = await http.post(
              this.baseUrl + this.authEndPoint,
              {
                 username: this.userName,
                 password: this.password,
              },
              {
                 headers: {
                    "Content-Type": "application/json",
                 },
              }
           );
           logger("Initiating Jira token status is: " + (sd.status == 200 ? "OK" : "Denied"));
           return await sd.headers["set-cookie"];
        } catch (error) {
           logger(await error.response.data, true);
           console.error(await error.response.data);
        }
     }

     async pushNewIssue(cookies, dataPayload) {
        try {
           const sd = await http.post(this.baseUrl + this.issueEndPoint, await dataPayload, {
              headers: {
                 Cookie: await cookies,
                 "Content-Type": "application/json",
              },
           });
           logger("Defect pushed with key: " + sd.data.key);
           return await sd.data;
        } catch (error) {
            logger("Issue while pushing a new issue on jira");
           logger(await error.response.data, true);
           console.error(await error.response.data);
        }
     }
}