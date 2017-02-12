/**
 * Created on 05/05/16.
 * @author Renato  Cardoso @re2005
 */
"use strict";

let fs = require('fs'),
    walk = require('walk'),
    fsPath = require('fs-path'),
    importer = require('gulp-fontello-import'),
    constants = require('./config.js'),
    cssFile = '',
    name = /embedded/;

function importSvg() {
    importer.importSvg({
        config: constants.CONFIG_JSON,
        svgsrc: constants.SVG_SRC
    }, function () {
        getFont();
    });
}

function getFont() {
    importer.getFont({
        host: constants.HOST,
        config: constants.CONFIG_JSON,
        css: 'css'
    }, function () {
        findCssFile();
    });
}

function findCssFile() {
    var walker = walk.walk('./icon-example', {followLinks: false});
    walker.on('file', function (root, stat, next) {
        if (name.test(stat.name)) {
            cssFile = root + "/" + stat.name;
        }
        next();
    });

    walker.on('end', function () {
        if (cssFile.length > 0) {
            console.log('find css file [ok]');
            cleanCss();
        }
    });
}

function cleanCss() {
    // Remove the 6 first lines
    fs.readFile(cssFile, function (err, data) {
        if (err) throw err;
        let array = data.toString().split("\n");
        array.forEach(function (line, index) {
            if (index > 7) {
                fs.appendFileSync(constants.DESTINATION_FOLDER + constants.FILE_NAME, array[index].toString() + "\n");
            }
        });
    });
    console.log('clean css [ok]');
    resetProject();
}

function resetProject() {
    fsPath.remove('./icon-example', function (err) {
        if (err) throw err;
        console.log('temp folder removed [ok]');
    });
    fsPath.copy(constants.CONFIG_JSON_BACKUP, constants.CONFIG_JSON, function (err) {
        if (err) throw err;
        console.log('config json copy [ok]');
    });
}

(function startApp() {
    importSvg();
})();