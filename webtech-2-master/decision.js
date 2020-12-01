var DecisionTree = require('decision-tree');
var training_data = [
    { "age": "20", "occupation": "type1", "maritialstatus": "yes", "result": "later20" },
    { "age": "20", "occupation": "type1", "maritialstatus": "no", "result": "early20" },
    { "age": "20", "occupation": "type2", "maritialstatus": "yes", "result": "later20" },
    { "age": "20", "occupation": "type2", "maritialstatus": "no", "result": "early20" },
    { "age": "20", "occupation": "type3", "maritialstatus": "yes", "result": "later20" },
    { "age": "20", "occupation": "type3", "maritialstatus": "no", "result": "early20" },
    { "age": "40", "occupation": "type1", "maritialstatus": "yes", "result": "after40" },
    { "age": "40", "occupation": "type1", "maritialstatus": "no", "result": "after40" },
    { "age": "40", "occupation": "type2", "maritialstatus": "yes", "result": "after40" },
    { "age": "40", "occupation": "type2", "maritialstatus": "no", "result": "after40" },
    { "age": "40", "occupation": "type2", "maritialstatus": "yes", "result": "after40" },
    { "age": "40", "occupation": "type2", "maritialstatus": "no", "result": "after40" },
    { "age": "30", "occupation": "type1", "maritialstatus": "yes", "result": "early30" },
    { "age": "30", "occupation": "type1", "maritialstatus": "no", "result": "later20" },
    { "age": "30", "occupation": "type2", "maritialstatus": "yes", "result": "later30" },
    { "age": "30", "occupation": "type2", "maritialstatus": "no", "result": "later20" },
    { "age": "30", "occupation": "type3", "maritialstatus": "yes", "result": "later30" },
    { "age": "30", "occupation": "type3", "maritialstatus": "no", "result": "after30" },
    { "age": "20", "occupation": "type3", "maritialstatus": "yes", "result": "early30" },
    { "age": "20", "occupation": "type3", "maritialstatus": "no", "result": "early30" },
    { "age": "40", "occupation": "type3", "maritialstatus": "yes", "result": "after40" },
    { "age": "40", "occupation": "type3", "maritialstatus": "no", "result": "after40" },


];
var class_name = "result"
var features = ["age", "occupation", "maritial-status"]
var dt = new DecisionTree(training_data, class_name, features);
console.log(dt.predict({ age: 40, occupation: "type2", maritialstatus: "yes" }))