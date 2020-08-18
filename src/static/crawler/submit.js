let basic = require('./basic')
let request = require('request')
// let cheerio = require('cheerio')

module.exports = {
    submitCode: function (xCsrfToken, contest, problem, code, lang, callback) {
        let data = {
            csrf_token: xCsrfToken,
            ftaa: '',
            bfaa: '',
            action: 'submitSolutionFormSubmitted',
            // contestId: contest,
            submittedProblemIndex: problem,
            programTypeId: lang,
            source: code,
            tabSize: 4,
            sourceFile: ''
        }

        let opts = {
            url: 'https://codeforces.com/contest/' + contest + '/submit?csrf_token=' + xCsrfToken,
            method: 'POST',
            headers: {
                'User-Agent': basic.userAgent
            },
            form: data,
        }

        try {
            // eslint-disable-next-line no-unused-vars
            request(opts, (e, r, b) => {
                // let $ = cheerio.load(b)
                // update xCsrfToken
                // basic.xCsrfToken = $('meta[name="X-Csrf-Token"]').prop('content')
                // console.log(basic.xCsrfToken)

                if (e !== null) callback(true)
                callback(false)
            })
        } catch (e) {
            console.log('submit error')
            callback(true)
        }
    }
}