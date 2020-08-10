let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    getProblem: function (contestId, problemId, callback) {
        let opts = {
            url: basic.url + 'contest/' + contestId + '/problem/' + problemId,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent
            }
        }

        request(opts, (e, r, b) => {
            if (r.statusCode !== 200) {
                callback(true, '题目序号越界')
            }
            try {
                let $ = cheerio.load(b)
                callback(false, $('div[class=problemindexholder]').html())
            } catch (e) {
                console.log(e)
                callback(true, '获取题面遇到意料之外的错误')
            }
        })
    }
}
