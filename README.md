[![travis](https://img.shields.io/travis/christian-fei/trello-recap.svg?style=flat-square)](https://travis-ci.org/christian-fei/trello-recap) [![npm-version](https://img.shields.io/npm/v/trello-recap.svg?style=flat-square&colorB=007EC6)](https://www.npmjs.com/package/trello-recap) [![npm-dependencies](https://img.shields.io/badge/dependencies-none-blue.svg?style=flat-square&colorB=44CC11)](package.json) [![standard-js](https://img.shields.io/badge/coding%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/) [![npm-license](https://img.shields.io/npm/l/trello-recap.svg?style=flat-square&colorB=007EC6)](https://spdx.org/licenses/ISC)

# trello-recap

```
npm i -g trello--replay
```

## configuration

Get an API Key and Token from Trello.

Set the following environment variables:

```
TRELLO_API_KEY
TRELLO_API_TOKEN
```


## usage

```
trello-recap [BOARD_NAME] [SINCE_DATE]
```

### options

#### BOARD_NAME

Specify the name of the board.

> Tip: put it between "" when passing it to the cli

#### SINCE_DATE

Filter cards after that date