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
            try {
                let $ = cheerio.load(b)
                callback(false, $('div[class=problemindexholder]').html())
            } catch (e) {
                callback(true, e)
            }
        })
    }
}
