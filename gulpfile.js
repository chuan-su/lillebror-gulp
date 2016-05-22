'use strict';
const fs          = require('fs'),
      os          = require('os'),
      gulp        = require('gulp'),
      split       = require('split'),
      request     = require('request'),
      saxpath     = require('saxpath'),
      db          = require('./models'),
      wordBuilder = require('./gulp/wordbuilder'),
      Word        = require('./models/word')(db.sequelize,db.Sequelize);

gulp.task('default',()=>{
    //$ lang=en gulp
    console.log(process.env.lang);
});

gulp.task('import-dictionary',() => {
    var dictionary = (process.env.lang == 'en') ? 'folkets_en_sv_public' :'folkets_sv_en_public';
    fs.createReadStream(`${dictionary}.json`)
        .pipe(split(JSON.parse, null, { trailing: false }))
        .on('data',word => {
            Word.create({
                value: word.value,
                lang: word.lang,
                class: word.class,
                synonym: word.synonym ? word.synonym.join('||') : null,
                inflection: word.inflection ? word.inflection.join('||') : null,
                translation: word.translation ? word.translation.join('||') : null
            });
        });
});
gulp.task('download-dictionary',() => {
    var dictionary = (process.env.lang == 'en') ? 'folkets_en_sv_public' :'folkets_sv_en_public';
    
    const saxParser = require('sax').createStream(true),
          wordStream = new saxpath.SaXPath(saxParser,'//word'),
          fileStream = fs.createWriteStream(`${dictionary}.json`);
    
    wordStream.on('match',function(xml){
        let wordString = JSON.stringify(wordBuilder(xml));
        fileStream.write(wordString+''+os.EOL);
    });
    
    request(`http://folkets-lexikon.csc.kth.se/folkets/${dictionary}.xml`)
        .pipe(saxParser);
});

