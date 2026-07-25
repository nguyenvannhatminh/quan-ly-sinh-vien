import { STUDENT } from "./student.entity";
export declare class SUBJECT {
    SubID: number;
    subjectCode: string;
    name: string;
    credits: number;
    students: STUDENT[];
}
