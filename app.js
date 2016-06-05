'use strict';

let http = require('http');
const PORT = 8080;

var fs = require('fs');
var pdf = require('html-pdf');
var dust = require('dustjs-helpers');
var _ = require('lodash');
var NUM_STUDENT_COPIES = 1;


http.createServer((request, response) => {

  generateProfiles((err, stream) => {
    if (err) console.error(err);

    // res.setHeader('Content-disposition', 'attachment; filename=Student_Profile');
    // res.setHeader('Content-type', 'application/pdf');

    stream
      .pipe(fs.createWriteStream('./output/studentProfile.pdf'))
      .on('finish', () => {
        console.log('pdf is now ready');
        response.end('It Works!! Path Hit: ' + request.url);
      });
  });
}).listen(PORT, function () {
  console.log('Server listening on Port', PORT);
}); // Activates this server, listening on port 8080.

var studentFixture = fs.readFileSync('./fixtures/student.json', 'utf8');
var studentFixtures = makeCopies(JSON.parse(studentFixture), NUM_STUDENT_COPIES);

//Pre-compile (via gulp) and render precompiled file at runtime
var compiled = fs.readFileSync('./dist/profile.js', 'utf8');
dust.loadSource(compiled);

var data = {
  students: studentFixtures
};

function generateProfiles(callback) {
  console.log('Generating profile...')
  // Insert data into the template
  dust.render('profile', data, function (err, out) {
    if (err) return callback(err);
    var options = {
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
    pdf.create(out, options).toStream(callback);
  });
}



function makeCopies(studentFixture, numberOfCopies) {
  var copies = [];
  for (var i = 0; i < numberOfCopies; i++) {
    copies.push(_.cloneDeep(studentFixture));
  }
  return copies;
}


