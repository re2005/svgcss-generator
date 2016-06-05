/**
 * Created on 05/05/16.
 * @author Renato  Cardoso @re2005
 */

var fs = require('fs'),
    walk = require('walk'),
    fsPath = require('fs-path'),
    importer = require('gulp-fontello-import'),
    config = require('./config');

var cssFile = "",
    name = /embedded/,
    count = 0;

var cb = function () {
    count = count + 1
    if (count === 2) {
        console.log('get font [ok]');
        findCssFile();
    }
};

importer.importSvg({
    config: 'app/config.json',
    svgsrc: './svg'
}, cb);

importer.getFont({
    host: 'http://fontello.com',
    config: 'app/config.json',
    css: 'css'
}, cb);

(function writeFile() {
    fsPath.writeFile(config.folder+config.filename, '', function (err) {
    });
})();

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
        var array = data.toString().split("\n");
        for (i in array) {
            if (i > 7) {
                fs.appendFileSync(config.folder+config.filename, array[i].toString() + "\n");
            }
        }
    });
    console.log('clean css [ok]');
    resetProject();
}

function resetProject() {
    fsPath.remove('./icon-example', function (err) {
        if (err) throw err;
        console.log('temp foler removed [ok]');
    });
    fsPath.copy('./app/config.bkp.json', './app/config.json', function(err){
        if (err) throw err;
        console.log('config json copy [ok]');
    });
}
