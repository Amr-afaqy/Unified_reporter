# testcafe-reporter-afaqy
[![Build Status](https://travis-ci.org/@Amrxx/testcafe-reporter-afaqy.svg)](https://travis-ci.org/@Amrxx/testcafe-reporter-afaqy)

This is the **afaqy** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="http://test.afaqy.com/images/Logo.png" alt="preview" />
</p>

## Version - 1.0
- Create test run on test rail for each tested fixture
- Create defect on jira with the assigned meta data based on the testcase result
- Simple command line reporter

## Install

```
npm install testcafe-reporter-afaqy
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter afaqy
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('afaqy') // <-
    .run();
```

## Author
Amr Aly @ Afaqy 2021
# Afaqy_Reporter
