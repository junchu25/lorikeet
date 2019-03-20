'use strict'

const lunr = require('lunr');
let idx;
let idxItems;

function resetIndex() {
    idxItems = [];
    idx = null;
}

function addToIndex(file) {
    idxItems.push(file);
}

function flushToIndex() {
    idx = lunr(function () {
        this.field('file');
        this.field('type');
        this.ref('path');

        idxItems.forEach(value => {
            this.add(value);
        });
    });
}

function find(query, cb) {
    if (!idx) {
        resetIndex();
    }

    const results = idx.search(query);
    cb(results);
}

module.exports = {
    addToIndex,
    find,
    resetIndex,
    flushToIndex
};