'use strict';

const http = require('http');
const url = require('url');
const PORT = 8080;

const fs = require('fs');
const pdf = require('html-pdf');
const dust = require('dustjs-helpers');
const _ = require('lodash');
const studentFixture = fs.readFileSync('./fixtures/student.json', 'utf8');

const pdfOptions = {
  format: 'Letter',
  timeout: 60000,
  border: "0",
  footer: {
    height: '.2in',
    contents: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
  }
};


http.createServer((request, response) => {

  let startTime = new Date().getTime();

  let params = url.parse(request.url, true).query;
  let numberOfCopies = params.copies || 1;

  console.log('Number of copies to make:', numberOfCopies);

  //Pre-compile (via gulp) and render precompiled file at runtime
  let compiledTemplate = fs.readFileSync('./dist/studentProfile.js', 'utf8');
  dust.loadSource(compiledTemplate);

  let data = {
    students: makeCopies(JSON.parse(studentFixture), numberOfCopies)
  };

  var html = '';

  // Insert data into the template
  dust.stream('studentProfile', data)
    .on('data', (segment) => {
      html += segment;
      console.log('new segment');
    })
    .on('end', () => {
      const endTime = new Date().getTime();
      const elapsed = (endTime - startTime) / 1000;
      console.log(`Dust took ${elapsed} seconds to complete`);

      fs.writeFile('helloworld.html', html, function (err) {
        if (err) return console.log(err);
        console.log('File written successfully');
      });



      // // Converts HTML to PDF and returns a stream
      // pdf.create(html, pdfOptions).toStream((err, stream) => {
      //   if (err) console.error('HTML stream ERR>>', err.message);
      //   stream.pipe(response);
      // });
    })
    .on('error', err => {
      console.error('Dust stream ERR>>', err.message);
    });

}).listen(PORT, function () {
  console.log('Server listening on Port', PORT);
}); // Activates this server, listening on port 8080.




function makeCopies(studentFixture, numberOfCopies) {
  let copies = [];
  for (let i = 0; i < numberOfCopies; i++) {
    copies.push(_.cloneDeep(studentFixture));
  }
  return copies;
}


