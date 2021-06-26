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

class jiraDefectInstance {
   constructor(projectKey, caseSummery, caseDescr, componentName, priorty, severity, labels) {
      return {
         fields: {
            project: {
               key: projectKey, //"AVLAUT",
            },
            summary: caseSummery, //"Another new test issue",
            description: caseDescr, //"This is only for testing purpose",
            issuetype: {
               name: "Bug",
            },
            components: [
               {
                  name: componentName, //"Automation",
               },
            ],
            priority: {
               name: priorty, //"High",
            },
            labels: labels, //["SystemTest", "BackEnd"],
            customfield_10700: { value: severity },
         },
      };
   }
}

module.exports = {
   testRunInstance,
   testCaseInstance,
   jiraDefectInstance,
};
