import { createReadStream } from 'fs';
import { resolve } from 'path';
import { parse } from 'fast-csv';

// import FilterSubmissionStream from './FilterSubmission';
// import FilterColumnStream from './FilterColumn';

import { Transform } from 'stream';

class FilterColumnStream extends Transform {

    constructor(columnName, options = {}) {
        options.objectMode = true;
        super({ ...options })
        this.columnName = columnName
    }

    _transform(chunk, encoding, callback) {
        if (chunk[this.columnName]) {
            this.push(chunk[this.columnName])
        }
        callback();
    }
}

class FilterSubmissionStream extends Transform {
    constructor(options = {}) {
        options.objectMode = true;
        super({ ...options });
        this.currentSubmission = null;
        this.header = null;
    }

    _transform(data, _, cb) {
        if (!this.header) {
            this.header = data;
        } else {
            const isNewSubmission = !!data['submission_number'];
            if (isNewSubmission) {
                if (this.currentSubmission) {
                    this.push(this.currentSubmission);
                }
                this.currentSubmission = data;
            } else {
                const keys = Object.keys(data);
                for (let key of keys) {
                    if (data[key] !== '') {
                        const currentResponse = this.currentSubmission[key];
                        const updatedResponse = Array.isArray(currentResponse) ? [...currentResponse] : [currentResponse];
                        updatedResponse.push(data[key]);
                        this.currentSubmission[key] = updatedResponse;
                    }
                }
            }
        }
        cb();
    }

    _flush(cb) {
        if (this.currentSubmission) {
            this.push(this.currentSubmission);
        }
        cb();
    }
}

createReadStream(resolve(process.cwd(), 'test.csv'))
    .pipe(parse({ headers: true, trim: true, skipLines: 1, }))
    .pipe(new FilterSubmissionStream())
    .on('error', error => console.error(error))
    .on('data', row => console.log(row));
    // .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

createReadStream(resolve(process.cwd(), 'test.csv'))
    .pipe(parse({ headers: true, trim: true, skipLines: 1, }))
    .pipe(new FilterColumnStream('submission_number'))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row));
    // .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
