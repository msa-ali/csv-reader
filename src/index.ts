import { resolve } from 'path';
import DataImportParser from './data-import-parser/DataImportParser';

new DataImportParser(resolve(process.cwd(), 'test.csv'))
    .streamSubmission()
    .on('error', error => console.error(error))
    .on('data', row => console.log(row));

new DataImportParser(resolve(process.cwd(), 'test.csv'))
    .streamCSVColumn('submission_number')
    .on('error', error => console.error(error))
    .on('data', row => console.log(row));
