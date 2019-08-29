const spawn = require('child_process').spawn;
const fs = require('fs');

const appName = 'dev.oerwi.app';
const folderName = `/root/${appName}`;
const cloningBranch = 'development';

if(fs.existsSync(folderName)) {
  rmdir(folderName);
}

let updateRepositoryCommand = spawn('git', [
	'clone',
	'--single-branch',
	'--branch',
	cloningBranch,
	'git@github.com:shroomlife/oerwi.git',
	folderName
]);

updateRepositoryCommand.stdout.on('data', (data) => {
	console.log('OUTPUT', String(data));
});

updateRepositoryCommand.stderr.on('data', (data) => {
	console.log('ERROR', String(data));
});

updateRepositoryCommand.on('close', (code) => {

	console.log('updateRepositoryCommand', 'REPOSITORY UPDATED', 'EXIT CODE', code);

	let updateRepositoryCommand = spawn('docker-compose', [
    '-f',
    `${folderName}/docker-compose.yml`,
		'up',
		'-d',
		'--build'
	]);

	updateRepositoryCommand.stdout.on('data', (data) => {
		console.log('OUTPUT', String(data));
	});

	updateRepositoryCommand.stderr.on('data', (data) => {
		console.log('ERROR', String(data));
	});

	updateRepositoryCommand.on('close', (code) => {
    console.log("DONE", code);
	});
});

function rmdir(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        rmdir(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
