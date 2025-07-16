// mock-db/server.js
const jsonServer = require('json-server');
const path       = require('path');

const server = jsonServer.create();
const router = jsonServer.router({
  courses:      require(path.join(__dirname, 'courses.json')),
  curriculum:   require(path.join(__dirname, 'curriculum.json')),
  exams:        require(path.join(__dirname, 'exams.json')),
  grades:       require(path.join(__dirname, 'grades.json')),
  announcements:require(path.join(__dirname, 'announcements.json')),
  attendance:   require(path.join(__dirname, 'attendance.json')),
});
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server listening on http://localhost:3000');
});
