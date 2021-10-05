"use strict";
module.exports = class jiraDefectInstance {
   constructor(projectKey, caseSummery, caseDescr, componentName, priority, severity, labels, testCaseID) {
      this.projectKey = projectKey;
      this.caseSummery = caseSummery;
      this.caseDescr = caseDescr;
      this.componentName = componentName;
      this.priority = priority;
      this.severity = severity;
      this.labels = labels;
   }

   // /**
   // * @param {String} key
   // */
   // set projectKey(key) {
   //    this.projectKey = key
   // }

   // /**
   //  * @param {String} summary
   //  */
   // set caseSummery(summary) {
   //    this.caseSummery = summary
   // }

   // /**
   // * @param {String} desc
   // */
   // set caseDescr(desc) {
   //    this.caseDescr = desc;
   // }

   // /**
   // * @param {String} component
   // */
   // set componentName(component) {
   //    this.componentName = component
   // }

   // /**
   // * @param {String} prior
   // */
   // set priority(prior) {
   //    this.priority = prior
   // }

   // /**
   // * @param {Array<String>} labels
   // */
   // set labels(labels) {
   //    this.labels = labels
   // }

   // /**
   // * @param {String} severity
   // */
   // set severity(severity) {
   //    this.severity = severity
   // }

   // /**
   //  * @returns {String} project key
   //  */
   // get projectKey(){
   //    return this.projectKey
   // }

   // /**
   //  * @returns {String} Severity
   //  */
   // get severity(){
   //    return this.severity;
   // }

   // /**
   //  * @returns {Array<String>} Labels
   //  */
   // get labels(){
   //    return this.labels;
   // }

   // /**
   //  * @returns {String} Description
   //  */
   // get description(){
   //    return this.caseDescr
   // }

   // /**
   //  * @returns {String} Title
   //  */
   // get title(){
   //    return this.caseSummery
   // }

   // /**
   //  * @returns {String} Priority
   //  */
   // get priority(){
   //    return this.priority
   // }

   // /**
   //  * @returns {String} Component Name
   //  */
   // get componentName(){
   //    return this.componentName
   // }

   // /**
   //  * @returns {String} Test case ID 
   //  */
   // get testCaseID(){
   //    return this.testCaseID;
   // }

   toRequestPayload() {
      return {
         fields: {
            project: {
               key: this.projectKey, //"AVLAUT",
            },
            summary: "Automated - " + this.caseSummery, //"Another new test issue",
            description: this.caseDescr + " \n" + "Auto created defect by Afaqy reporter v1.0", //"This is only for testing purpose",
            issuetype: {
               name: "Bug",
            },
            components: [
               {
                  name: this.componentName, //"Automation",
               },
            ],
            priority: {
               "name": this.priority, //"High",
            },
            labels: this.labels, //["SystemTest", "BackEnd"],
            customfield_10700: { "value": this.severity },
         },
      };
   }

}