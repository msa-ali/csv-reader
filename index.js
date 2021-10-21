import { createReadStream } from 'fs';
import { resolve } from 'path';
import { parse } from 'fast-csv';
import { Transform } from 'stream';

class FilterSubmission extends Transform {
    constructor(options) {
        super({})
    }

    _transform(data, enc, cb) {

    }
}



createReadStream(resolve(process.cwd(), 'test.csv'))
    .pipe(parse({ headers: true, trim: true, skipLines: 1,  }))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));