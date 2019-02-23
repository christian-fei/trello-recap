/* globals test */
const assert = require('assert')
const boardName = 'trello-recap-integration-tests'
const member = 'christianfei1'
const cp = require('child_process')

test('bin: loads cards with bin/trello-recap', (done) => {
  const result = cp.execSync(`npm run bin -- --board ${boardName} --member ${member}`)
  assert.strictEqual(result.toString(), `
> trello-recap@${require('../package.json').version} bin /Users/christian/Documents/projects/trello-recap
> bin/trello-recap "--board" "trello-recap-integration-tests" "--member" "christianfei1"

Loading cards for trello-recap-integration-tests

# doing

## card doing
Link: https://trello.com/c/npIyrY2p/2-card-doing
Labels: feature
Members: Christian Fei
Date last activity: 2019-02-23T19:07:07.194Z


# done

## card done
Link: https://trello.com/c/ZOllU3ra/3-card-done
Labels: feature
Members: Christian Fei
Date last activity: 2019-02-23T19:07:12.206Z

`)
  done()
})
