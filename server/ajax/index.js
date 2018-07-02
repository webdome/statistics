const http = require("http")

function $ajax(url) {
  return new Promise(function (resolve, reject) {
    http.get(url, function (res) {
      let data = "";
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        resolve(JSON.parse(data))
      });
    }).on("error", function (err) {
      reject(err)
    })
  })
}

module.exports = $ajax