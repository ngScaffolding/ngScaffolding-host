var express = require('express');
var path = require('path');

var server = express();
var options = {
    index: 'index.html',
    redirect: true,
};
server.use(express.static('/home/site/wwwroot', options));
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
  ];

server.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve(req.url));
    } else {
        res.sendFile(path.resolve('index.html'));
    }
});
server.listen(process.env.PORT);
