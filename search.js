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

        const that = this;

        idxItems.forEach(value => {
            that.add(value);
        });
    });
}

function find(query, cb) {
    if (!idx) {
        flushToIndex();
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