import { Transform } from 'stream';

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
      if(this.currentSubmission) {
          this.push(this.currentSubmission);
      }
      cb();
  }
}

export default FilterSubmissionStream;