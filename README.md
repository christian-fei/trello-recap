[![travis](https://img.shields.io/travis/christian-fei/trello-recap.svg?style=flat-square)](https://travis-ci.org/christian-fei/trello-recap) [![npm-version](https://img.shields.io/npm/v/trello-recap.svg?style=flat-square&colorB=007EC6)](https://www.npmjs.com/package/trello-recap) [![npm-dependencies](https://img.shields.io/badge/dependencies-none-blue.svg?style=flat-square&colorB=44CC11)](package.json) [![standard-js](https://img.shields.io/badge/coding%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/) [![npm-license](https://img.shields.io/npm/l/trello-recap.svg?style=flat-square&colorB=007EC6)](https://spdx.org/licenses/ISC)

# trello-recap

```
npm i -g trello-recap
```


## configuration

Get an API Key and Token from Trello.

Set the following environment variables:

```
TRELLO_API_KEY
TRELLO_API_TOKEN
```

Get the keys from here: https://trello.com/app-key

## usage

`--board` is needed.

> Tip: You can also pass it as first argument:
> trello-recap "TRELLO_BOARD_NAME" --since "2018-02-01"

`--since` is optional, ISO Date formatted string. e.g. `2018-02-01`

`--member` is optional, username of a member (e.g. `christianfei`)

`--list` is optional, filter lists by name (e.g. `done`)

```
# set env variables
TRELLO_API_KEY=<YOUR_TRELLO_API_KEY>
TRELLO_API_TOKEN=<YOUR_TRELLO_API_TOKEN>

trello-recap --board "TRELLO_BOARD_NAME" --since "2018-02-01"
```

or with `npx`

```
npx trello-recap --board "TRELLO_BOARD_NAME"  --since "2018-02-01"
```


### options

#### --board

Specify the name of the board.

> Tip: put it between "" when passing it to the cli

#### --since

Filter cards after that date

#### --member

Filter cards assigned to a member

#### --list

Filter lists by name
