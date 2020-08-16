let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    getSubmission: function (contestId, submission, callback) {
        let opts = {
            url: basic.url + 'contest/' + contestId + '/submission/' + submission,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent
            }
        }

        request(opts, (e, r, b) => {
            if (r.statusCode !== 200) {
                callback(true, '提交编号越界')
                return
            }
            try {
                let $ = cheerio.load(b)
                let problem = $('pre[id="program-source-text"]').text()
                callback(false, problem)
            } catch (e) {
                console.log(e)
                callback(true, '获取题面遇到意料之外的错误')
            }
        })
    }
}
