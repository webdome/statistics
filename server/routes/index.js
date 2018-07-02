const router = require('koa-router')()
const nanoid = require('nanoid')
const $query = require("../mysql")
const $ajax = require("../ajax")


function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

// 接口目录
router.get('/', async (ctx, next) => {
  ctx.body = 'this is a statistics server'
})

// 进入访问
router.post('/visitlog', async (ctx, next) => {
  let request = ctx.request
  let req_query = request.body
  let ip = ctx.request.ip
  let location;
  
  if (ip.match(/192|122|127|172|localhost/) !== null) {
    ip = '局域网'
  } else {
    ip = ip.match(/\d+.\d+.\d+.\d+/)
    if (ip) {
      ip = ip[0]
      location = await $ajax('http://restapi.amap.com/v3/ip?key=939241f2a8ebb8d2dd771ab087d9dfde&ip=' + ip)
    } else {
      ip = 'localhost'
    }
  }

  let id = nanoid();
  Object.assign(req_query, {
    id: id,
    ip: ip,
    location: location,
    userAgent: ctx.header['user-agent'],
    url: ctx.header.referer
  })

  // fs.appendFile(__dirname + '/visit.txt', JSON.stringify(req_query) + '\n', function () {})
  const addSql = 'insert visit_record (id,url,ip,location,laiyuan,refer,netType,userAgent) values(?,?,?,?,?,?,?,?)';
  const addSqlParams = [req_query.id, req_query.url, req_query.ip, req_query.location, req_query.laiyuan, req_query.refer, req_query.netType, req_query.userAgent];

  let rows = await $query(addSql,addSqlParams)
  ctx.body = id
})
// 访问时长 期间有多少操作
router.post('/timelog', async (ctx, next) => {
  let request = ctx.request
  let req_query = request.body

  // fs.appendFile(__dirname + '/time.txt', JSON.stringify(req_query) + '\n', function () {})
  ctx.body = 'ok'
})
// 点击位置
router.post('/clicklog', async (ctx, next) => {
  let request = ctx.request
  let req_query = request.body

  // fs.appendFile(__dirname + '/click.txt', JSON.stringify(req_query) + '\n', function () {})
  ctx.body = 'ok'
})
// 事件
router.post('/tracklog', async (ctx, next) => {
  let request = ctx.request
  let req_query = request.body

  // fs.appendFile(__dirname + '/track.txt', JSON.stringify(req_query) + '\n', function () {})
  ctx.body = 'ok'
})
module.exports = router