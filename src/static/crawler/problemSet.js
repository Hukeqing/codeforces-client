let basic = require('./basic')
let request = require('request')
let cheerio = require('cheerio')

module.exports = {
    getProblemSetList: function (args, callback) {
        let opts = {
            url: 'https://codeforces.com/problemset' + args,
            method: 'GET',
            headers: {
                'User-Agent': basic.userAgent
            }
        }
        request(opts, (e, r, b) => {
            try {
                let $ = cheerio.load(b)
                let problems = $('table[class=problems]').html().replace(/[\r\n]/g, '')
                let problemList = problems.split('<tr')
                let res = []
                for (let i = 2; i < problemList.length; ++i) {
                    let pro = {}
                    if (/accepted-problem/.test(problemList[i])) {
                        pro['status'] = 1
                    } else if (/rejected-problem/.test(problemList[i])) {
                        pro['status'] = 2
                    } else {
                        pro['status'] = 0
                    }
                    let problemLink = problemList[i].match(/<div style="float: left;">.+?\/problemset\/problem\/(.+?)\/(.+?)">(.+?)<\/a>/)
                    pro['contest'] = problemLink[1]
                    pro['id'] = problemLink[2]
                    pro['name'] = problemLink[3].replace(/ *$/, '')
                    pro['score'] = problemList[i].match(/<span title="Difficulty" class="ProblemRating">(.+?)<\/span>/)[1]
                    pro['passed'] = problemList[i].match(/<a title="Participants solved the problem".+?x(\d+?)<\/a>/)[1]
                    res.push(pro)
                }
                callback(false, res)
            } catch (e) {
                callback(true, e)
            }
        })
    }
}
