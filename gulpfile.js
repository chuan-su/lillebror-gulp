'use strict';
const fs          = require('fs'),
      os          = require('os'),
      gulp        = require('gulp'),
      split       = require('split'),
      request     = require('request'),
      saxpath     = require('saxpath'),
      through2    = require('through2'),
      wordBuilder = require('./gulp/wordbuilder');

gulp.task('default',()=>{
    //$ lang=en gulp
    console.log(process.env.lang);
});

gulp.task('import-dictionary',() => {
    var dictionary = (process.env.lang == 'en') ? 'folkets_en_sv_public' :'folkets_sv_en_public';
    fs.createReadStream(`${dictionary}.json`)
        .pipe(split(null,null,{trailing: false}))
        .pipe(through2(function(line,encoding,callback){
            let head = {index: {_index: "lillebror", _type: "words"}};
            this.push(JSON.stringify(head) + os.EOL);
            this.push(line + os.EOL);
            callback();
        }))
        .pipe(fs.createWriteStream(`es_${dictionary}`));
});
gulp.task('download-dictionary',() => {
    var dictionary = (process.env.lang == 'en') ? 'folkets_en_sv_public' :'folkets_sv_en_public';
    
    const saxParser = require('sax').createStream(true),
          wordStream = new saxpath.SaXPath(saxParser,'//word'),
          fileStream = fs.createWriteStream(`${dictionary}.json`);

    wordStream.on('match',function(xml){
        let word = wordBuilder(xml);
        let wordString = JSON.stringify(word);
        fileStream.write(wordString+os.EOL);
    });
    
    request(`http://folkets-lexikon.csc.kth.se/folkets/${dictionary}.xml`)
        .pipe(saxParser);
});

