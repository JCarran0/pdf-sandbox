'use strict';

let http = require('http');
let url = require('url') ;
const PORT = 8080;

let fs = require('fs');
let pdf = require('html-pdf');
let dust = require('dustjs-helpers');
let _ = require('lodash');
let studentFixture = fs.readFileSync('./fixtures/student.json', 'utf8');
const NUM_STUDENT_COPIES = 1;

http.createServer((request, response) => {

  let startTime = new Date().getTime();

  let params = url.parse(request.url, true).query;
  let numberOfCopies = params.copies || 1;

  console.log('Number of copies to make:', numberOfCopies);

  let studentFixtures = makeCopies(JSON.parse(studentFixture), numberOfCopies);

  //Pre-compile (via gulp) and render precompiled file at runtime
  let compiled = fs.readFileSync('./dist/profile.js', 'utf8');
  dust.loadSource(compiled);

  let data = {
    students: studentFixtures
  };

  generateProfiles(data, (err, stream) => {
    if (err) console.error(err);

    response.setHeader('Content-disposition', 'attachment; filename=Student_Profile');
    response.setHeader('Content-type', 'application/pdf');

    stream
      .pipe(response)
      .on('finish', () => {
        let endTime = new Date().getTime();
        let elapsed = (endTime - startTime) / 1000;
        console.log('Elapsed time', elapsed, 'seconds');
      })
      .on('error', (err) => {
        console.error(err);
      });
  });
}).listen(PORT, function () {
  console.log('Server listening on Port', PORT);
}); // Activates this server, listening on port 8080.


function generateProfiles(data, callback) {

  var html = '';
  // Insert data into the template
  dust.stream('profile', data)
  .on('data', (segment) => {
    html += segment;
    console.log('new segment');
  })
  .on('end', () => {
    let options = {
      format: 'Letter',
      timeout: 60000,
      border: {
        top: '.75in',
        right: '.5in',
        bottom: '.5in',
        left: '.5in'
      },
      footer: {
        height: '.2in',
        contents: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>'
      }
    };
    // Converts HTML to PDF and returns a stream
    pdf.create(html, options).toStream(callback);
  });
}



function makeCopies(studentFixture, numberOfCopies) {
  let copies = [];
  for (let i = 0; i < numberOfCopies; i++) {
    copies.push(_.cloneDeep(studentFixture));
  }
  return copies;
}


