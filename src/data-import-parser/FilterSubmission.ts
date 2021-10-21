import { Transform, TransformOptions, TransformCallback } from 'stream';

class FilterSubmissionStream extends Transform {
    currentSubmission: any;
    header: any;
    repeatableSectionFields: string[];
    constructor(options: TransformOptions = {}) {
        options.objectMode = true;
        super({ ...options });
        this.currentSubmission = null;
        this.header = null;
        this.repeatableSectionFields = [
            "2a3b249e-24ca-44ce-924c-dcfb8b851971",
            "b7f5f6a7-bcc7-412c-937c-887110c726ac",
        ];
    }


    _transform(data: any, _: any, cb: TransformCallback) {
        if (!this.header) {
            this.header = data;
        } else {
            const isNewSubmission = !!data?.submission_number;
            if (isNewSubmission) {
                if (this.currentSubmission) {
                    this.push(this.currentSubmission);
                }
                this.currentSubmission = data;
            } else {
                const keys = Object.keys(data);
                for (const key of keys) {
                    if (!this.repeatableSectionFields.includes(key)) continue;
                    const currentResponse = this.currentSubmission[key];
                    const updatedResponse = Array.isArray(currentResponse) ? [...currentResponse] : [currentResponse];
                    updatedResponse.push(data[key]);
                    this.currentSubmission[key] = updatedResponse;
                }
            }
        }
        cb();
    }

    _flush(cb: TransformCallback) {
        if (this.currentSubmission) {
            this.push(this.currentSubmission);
        }
        cb();
    }
}

export default FilterSubmissionStream;