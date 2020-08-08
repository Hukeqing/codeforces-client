let basic = require('./basic')
let request = require('request')

module.exports = {
    submitCode: function (xCsrfToken, contest, problem, code, lang, callback) {
        let data = {
            csrf_token: xCsrfToken,
            ftaa: '',
            bfaa: '',
            action: 'submitSolutionFormSubmitted',
            contestId: contest,
            submittedProblemIndex: problem,
            programTypeId: lang,
            source : code,
            tabSize : 4,
            sourceFile: ''
        }

        let opts = {
            url: 'http://codeforces.com/problemset/submit?csrf_token=' + xCsrfToken,
            method: 'POST',
            headers: {
                'User-Agent': basic.userAgent
            },
            form: data,
        }

        try {
            // eslint-disable-next-line no-unused-vars
            request(opts, (e, r, b) => {
                if (e !== null) callback(true)
                callback(false)
            })
        } catch (e) {
            console.log('submit error')
            callback(true)
        }
    }
}