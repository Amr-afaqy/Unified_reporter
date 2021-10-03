"use strict";
export default class jiraDefectInstance {
    constructor(projectKey, caseSummery, caseDescr, componentName, priority, severity, labels) {
       return {
          fields: {
             project: {
                key: projectKey, //"AVLAUT",
             },
             summary: "Automated - " +  caseSummery, //"Another new test issue",
             description: caseDescr + " \n" + "Auto created defect by Afaqy reporter v1.0", //"This is only for testing purpose",
             issuetype: {
                name: "Bug",
             },
             components: [
                {
                   name: componentName, //"Automation",
                },
             ],
             priority: {
                "name": priority, //"High",
             },
             labels: labels, //["SystemTest", "BackEnd"],
             customfield_10700: { "value": severity },
          },
       };
    }
 }