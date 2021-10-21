import {Transform} from 'stream';

class FilterColumnStream extends Transform {

  constructor(columnName, options = {}) {
    super({...options})
    this.columnName = columnName
  }

  _transform(chunk, encoding, callback) {
    if(chunk[this.columnName]) {
      this.push(chunk[this.columnName])
    }
    callback();
  }
}
export default FilterColumnStream;