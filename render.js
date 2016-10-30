'use strict';

const fs = require('fs');
const dust = require('dustjs-helpers');
const _ = require('lodash');
const studentFixture = fs.readFileSync('./fixtures/student.json', 'utf8');

let numberOfCopies = 1;

//Pre-compile (via gulp) and render precompiled file at runtime
let compiledTemplate = fs.readFileSync('./dist/studentProfile.js', 'utf8');
dust.loadSource(compiledTemplate);

let data = {
  students: makeCopies(JSON.parse(studentFixture), numberOfCopies)
};

var html = '';


// Insert data into the template
return dust.stream('studentProfile', data)
  .on('data', (segment) => {
    html += segment;
    console.log('new segment');
  })
  .on('end', () => {
    fs.writeFile('helloworld.html', html, function (err) {
      if (err) return console.log(err);
      console.log('File written successfully');
    });
  })
  .on('error', err => {
    console.log(err);
  });


function makeCopies(studentFixture, numberOfCopies) {
  let copies = [];
  for (let i = 0; i < numberOfCopies; i++) {
    copies.push(_.cloneDeep(studentFixture));
  }
  return copies;
}


