var express = require('express');
var router = express.Router();
var File = require('../patterns/composite/File');
var Folder = require('../patterns/composite/Folder');
var Stock = require('../patterns/observer/Stock');
var Investor = require('../patterns/observer/Investor');
var Task = require('../patterns/observer/Task');
var TeamMember = require('../patterns/observer/TeamMember');
var JSONService = require('../patterns/adapter/JSONService');
var XMLService = require('../patterns/adapter/XMLService');
var XMLtoJSONAdapter = require('../patterns/adapter/XMLtoJSONAdapter');

function buildPatternDemoData() {
  var root = new Folder('root');
  var docs = new Folder('docs');
  var images = new Folder('images');

  docs.add(new File('report.pdf', 1200));
  images.add(new File('logo.png', 350));
  root.add(docs);
  root.add(images);
  root.add(new File('readme.txt', 8));

  var stock = new Stock('AAPL', 180);
  var investorA = new Investor('An');
  var investorB = new Investor('Binh');
  stock.attach(investorA);
  stock.attach(investorB);
  stock.setPrice(185);

  var task = new Task('Triển khai đăng nhập', 'Việc cần làm');
  var dev = new TeamMember('Cuong');
  var qa = new TeamMember('Dung');
  task.attach(dev);
  task.attach(qa);
  task.setStatus('Đang thực hiện');
  task.setStatus('Hoàn thành');

  var jsonService = new JSONService();
  var xmlService = new XMLService();
  var adapter = new XMLtoJSONAdapter(xmlService, jsonService);

  var xmlPayload = '<ten>Kien</ten><vaiTro>SinhVien</vaiTro>';
  var jsonPayload = { ten: 'Kien', vaiTro: 'Sinh viên' };

  return {
    composite: root.display(),
    observer: {
      stock: {
        symbol: stock.symbol,
        price: stock.price,
        investorNotifications: investorA.notifications.concat(investorB.notifications)
      },
      task: {
        title: task.title,
        status: task.status,
        memberNotifications: dev.notifications.concat(qa.notifications)
      }
    },
    adapter: {
      xmlToJson: adapter.sendXMLAsJSON(xmlPayload),
      jsonToXml: adapter.sendJSONAsXML(jsonPayload)
    }
  };
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demo Design Pattern' });
});

router.get('/patterns', function(req, res, next) {
  res.render('patterns', { title: 'Hướng dẫn trực quan Design Pattern' });
});

router.get('/api/patterns', function(req, res, next) {
  res.json({
    message: 'Danh sách endpoint hiện có',
    endpoints: [
      'GET /',
      'GET /users',
      'GET /patterns',
      'GET /patterns/demo',
      'GET /api/patterns',
      'GET /api/patterns/demo'
    ]
  });
});

router.get('/patterns/demo', function(req, res, next) {
  res.json(buildPatternDemoData());
});

router.get('/api/patterns/demo', function(req, res, next) {
  res.json(buildPatternDemoData());
});

module.exports = router;
