# testcafe-reporter-afaqy
[![Build Status](https://travis-ci.org/@Amrxx/testcafe-reporter-afaqy.svg)](https://travis-ci.org/@Amrxx/testcafe-reporter-afaqy)

This is the **afaqy** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/@Amrxx/testcafe-reporter-afaqy/master/media/preview.png" alt="preview" />
</p>

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
Amr Aly 
