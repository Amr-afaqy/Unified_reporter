"use strict";
export default class TestCaseModel {
    constructor(caseID, statusID, comments, elapsed) {
        return {
            case_id: caseID,
            status_id: statusID,
            comment: comments,
            elapsed: elapsed,
        };
    }
}