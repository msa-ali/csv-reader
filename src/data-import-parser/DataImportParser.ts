import { createReadStream } from "fs";
import FilterColumnStream from "./FilterColumn";
import FilterSubmissionStream from "./FilterSubmission";
import {parse} from 'fast-csv';

class DataImportParser {
  workflow: any;
  #filePath: string;

  constructor(filePath = '', workflow = {}) {
    this.workflow = workflow;
    this.#filePath = filePath;
  }

  #streamCSVRow() {
    return createReadStream(this.#filePath)
      .pipe(parse({ headers: true, skipLines: 1, trim: true }))
  }

  streamCSVColumn(columnName: string) {
    return this.#streamCSVRow()
      .pipe(new FilterColumnStream(columnName))
  }

  streamSubmission() {
    return this.#streamCSVRow()
      .pipe(new FilterSubmissionStream());
  }
}

export default DataImportParser;