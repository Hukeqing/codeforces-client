let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    getContestProblem: function (cookie, contestId, callback) {
        let opts = {
            url: basic.url + 'contest/' + contestId,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent,
                Cookie: cookie
            }
        }

        request(opts, (e, r, b) => {
            let $ = cheerio.load(b)
            let problems = $('table[class=problems]').html().replace(/[\r\n]/g, '')
            let problemList = problems.split('<tr').slice(2).map(str => '<tr' + str + '</tr>')
            let res = []
            for (let i = 0; i < problemList.length; ++i) {
                let pro = {}
                if (/accepted-problem/.test(problemList[i])) {
                    pro['status'] = 1
                } else if (/rejected-problem/.test(problemList[i])) {
                    pro['status'] = 2
                } else {
                    pro['status'] = 0
                }
                let $ = cheerio.load(problemList[i])
                let tmp = $('a').map((i, el) => $(el).text().replace(/(^\s*)|(\s*$)/g, ""))
                pro['id'] = tmp['0']
                pro['name'] = tmp['1']
                pro['passed'] = tmp['3'].slice(1)
                res.push(pro)
            }
            callback(res)
        })
    }
}
