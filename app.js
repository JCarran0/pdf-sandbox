'use strict';

var fs = require('fs');
var pdf = require('html-pdf');
var dust = require('dustjs-helpers');
var _ = require('lodash');
var NUM_STUDENT_COPIES = 1;

var studentFixture = fs.readFileSync('./fixtures/student.json', 'utf8');
var studentFixtures = makeCopies(JSON.parse(studentFixture), NUM_STUDENT_COPIES);

//Pre-compile (via gulp) and render precompiled file at runtime
var compiled = fs.readFileSync('./dist/profile.js', 'utf8');
dust.loadSource(compiled);

var data = {
  students: studentFixtures
};

dust.render('profile', data, function (err, out) {
  if (err) {
    console.error(err);
  } else {
    createPdf(out);
  }
});

function createPdf(html) {
  var options = {
    format: 'Letter',
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
  pdf.create(html, options).toFile('./output/studentProfile.pdf', function (err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/profile.pdf' }
  });
}

function makeCopies(studentFixture, numberOfCopies){
  var copies = [];
  for (var i = 0; i < numberOfCopies; i++){
    copies.push(_.cloneDeep(studentFixture));
  }
  return copies;
}
