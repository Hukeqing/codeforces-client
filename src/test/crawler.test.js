let common = require('../static/crawler/common')
// let contest = require('../static/crawler/contest')


function test() {
    common.startSession((e, x, c) => {
        // console.log('start session...over')
        console.log(c)
        // common.getLoginCookie(c, x, 'keqing.hu@icloud.com', '11010101110', (e, nc) => {
        //     console.log('login in...over')
        //     c.push(nc)
        //     contest.getContestProblem(c, 1399, (res) => {
        //         console.log(res)
        //     })
        // })
    })
}

test()
