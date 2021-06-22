const http = require("axios").default;
var querystring = require("querystring");

module.exports = class testRailInstance {
    constructor(railConfig) {
        console.log("Test rail instance");
        this.userName = railConfig.userName;
        this.password = railConfig.userPass;
        this.baseUrl = railConfig.gRailBaseURL;
        this.authEndPoint = railConfig.gAuthEndPoint;
        this.listProjectsEndPoint = railConfig.gListProjectsEndPoint;
        this.listMileStones = railConfig.gListMileStones;
        this.listProjectSuites = railConfig.gListProjectSuites;
        this.getCurrentUser = railConfig.gGetCurrentUser;
        this.addNewRun = railConfig.gAddNewRun;
        this.addResults = railConfig.gAddResults;
    }

    async initateAuthenticationToken() {
        console.log("Creating token");
        try {
            let sessionID = await http.get(this.baseUrl + "/auth/login")
            let requestCookies = await sessionID.headers["set-cookie"]
                .toString()
                .slice(
                    0,
                    sessionID.headers["set-cookie"].toString().indexOf(";")
                );

            let sd = await http
                .post(
                    this.baseUrl + this.authEndPoint,
                    querystring.stringify({
                        name: this.userName,
                        password: this.password,
                        rememberme: 1,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Cookie: requestCookies,
                        },
                    }
                )
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    return err.response.data.error;
                });
            return requestCookies;
        } catch (err) {
            console.log(err);
        }
    }

    async getProjectIDS(sessionCookies, projectName) {
        let listProjects = await http.get(
            this.baseUrl + this.listProjectsEndPoint,
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: await sessionCookies,
                },
            }
        );
        let targetProject = await listProjects.data.filter(
            (project) => project.name == projectName
        );
        return await targetProject[0].id;
    }

    async getMileStoneID(sessionCookies, projectID, mileStoneName) {
        let listMileStones = await http.get(
            this.baseUrl + this.listMileStones + "/" + (await projectID),
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: await sessionCookies,
                },
            }
        );
        let targetMileStone = await listMileStones.data.filter(
            (mileStone) => mileStone.name == mileStoneName
        );
        return await targetMileStone[0].id;
    }

    async getSuiteID(sessionCookies, projectID, suitName) {
        let listSuits = await http.get(
            this.baseUrl + this.listProjectSuites + "/" + (await projectID),
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: await sessionCookies,
                },
            }
        );
        let targetSuit = await listSuits.data.filter(
            (projectSuite) => projectSuite.name == suitName
        );
        return await targetSuit[0].id;
    }

    async getUserID(sessionCookies) {
        let userDetails = await http.get(
            this.baseUrl + this.getCurrentUser + "&email=" + this.userName,
            {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: await sessionCookies,
                },
            }
        );
        return await userDetails.data.id;
    }

    async pushNewTestRun(sessionCookies, projectID, testRunObject) {
        let addRunRequest = await http
            .post(
                this.baseUrl + this.addNewRun + "/" + projectID,
                testRunObject,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: sessionCookies,
                    },
                }
            )
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.error;
            });
        return addRunRequest;
    }

    async updateTestRunResults(sessionCookies, runObjectID, resultsObject) {
        let addResultsRequest = await http
            .post(
                this.baseUrl + this.addResults + "/" + (await runObjectID),
                { results: await resultsObject },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: sessionCookies,
                    },
                }
            )
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.error;
            });
        return addResultsRequest;
    }

    async createTokenDetails() {
        let session_ID = await this.initateAuthenticationToken();
        let user_ID = await this.getUserID(session_ID);
        return {
            sessionID: await session_ID,
            userID: await user_ID,
        };
    }
};
