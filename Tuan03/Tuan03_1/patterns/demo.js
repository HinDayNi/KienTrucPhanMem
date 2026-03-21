const File = require('./composite/File');
const Folder = require('./composite/Folder');

const Stock = require('./observer/Stock');
const Investor = require('./observer/Investor');
const Task = require('./observer/Task');
const TeamMember = require('./observer/TeamMember');

const JSONService = require('./adapter/JSONService');
const XMLService = require('./adapter/XMLService');
const XMLtoJSONAdapter = require('./adapter/XMLtoJSONAdapter');

function runCompositeDemo() {
  const root = new Folder('root');
  const docs = new Folder('docs');
  const images = new Folder('images');

  docs.add(new File('report.pdf', 1200));
  images.add(new File('logo.png', 350));
  root.add(docs);
  root.add(images);
  root.add(new File('readme.txt', 8));

  console.log('--- Composite Demo ---');
  console.log(root.display());
}

function runObserverDemo() {
  const stock = new Stock('AAPL', 180);
  const investorA = new Investor('An');
  const investorB = new Investor('Binh');

  stock.attach(investorA);
  stock.attach(investorB);
  stock.setPrice(185);

  console.log('\n--- Demo Observer: Cổ phiếu ---');
  console.log(investorA.notifications);
  console.log(investorB.notifications);

  const task = new Task('Triển khai đăng nhập', 'Việc cần làm');
  const dev = new TeamMember('Cuong');
  const qa = new TeamMember('Dung');

  task.attach(dev);
  task.attach(qa);
  task.setStatus('Đang thực hiện');
  task.setStatus('Hoàn thành');

  console.log('\n--- Demo Observer: Task ---');
  console.log(dev.notifications);
  console.log(qa.notifications);
}

function runAdapterDemo() {
  const jsonService = new JSONService();
  const xmlService = new XMLService();
  const adapter = new XMLtoJSONAdapter(xmlService, jsonService);

  const xmlPayload = '<ten>Kien</ten><vaiTro>SinhVien</vaiTro>';
  const jsonPayload = { ten: 'Kien', vaiTro: 'Sinh viên' };

  console.log('\n--- Demo Adapter ---');
  console.log(adapter.sendXMLAsJSON(xmlPayload));
  console.log(adapter.sendJSONAsXML(jsonPayload));
}

runCompositeDemo();
runObserverDemo();
runAdapterDemo();