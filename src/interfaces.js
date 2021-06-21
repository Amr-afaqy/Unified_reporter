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

class testFixtureInstance {
    constructor() {}
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

module.exports = {
    testRunInstance,
    testCaseInstance,
};
