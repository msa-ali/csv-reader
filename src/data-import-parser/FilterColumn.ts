import {Transform, TransformOptions, TransformCallback} from 'stream';

class FilterColumnStream extends Transform {
  columnName: string;
  constructor(columnName: string, options: TransformOptions = {}) {
    options.objectMode = true;
    super({...options})
    this.columnName = columnName
  }

  _transform(chunk: any, _: any, callback: TransformCallback) {
    if(chunk[this.columnName]) {
      this.push(chunk[this.columnName])
    }
    callback();
  }
}
export default FilterColumnStream;