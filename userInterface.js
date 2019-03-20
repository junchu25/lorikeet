'user strict';

const fileSystem = require('./fileSystem');
const search = require('./search');

let document;

function displayFolderPath(folderPath) {
    document.getElementById('current-folder').innerText = folderPath;
}

function clearView() {
    const mainArea = document.getElementById('main-area');
    let firstChild = mainArea.firstChild;

    while (firstChild) {
        mainArea.removeChild(firstChild);
        firstChild = mainArea.firstChild;
    }
}

function loadDirectory(folderPath) {
    return function (window) {
        if (!document) {
            document = window.document;
        }

        search.resetIndex();
        displayFolderPath(folderPath);
        fileSystem.getFilesInFolder(folderPath, (err, files) => {
            clearView();

            if (err) {
                console.error(err);
            }

            fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
        });
    };
}

function displayFile(file) {
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);

    search.addToIndex(file);

    clone.querySelector('img').src = `images/${file.type}.svg`;
    clone.querySelector('img').setAttribute('data-filePath', file.path);

    if (file.type === 'directory') {
        clone.querySelector('img').addEventListener('dblclick', () => {
            loadDirectory(file.path)();
        }, false);
    }

    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
}

function displayFiles(err, files) {
    if (err) {
        console.error(err);
    }

    files.forEach(displayFile);
}

function bindDocument(window) {
    if (!document) {
        document = window.document;
    }
}

function bindSearchField(cb) {
    document.getElementById('search').addEventListener('keyup', cb, false);
}

module.exports = {
    bindDocument,
    displayFiles,
    loadDirectory,
    bindSearchField
};