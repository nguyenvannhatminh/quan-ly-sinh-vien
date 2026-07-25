import { TUTOR } from "./tutor.entity";
import { SUBJECT } from "./subject.entity";
export declare class STUDENT {
    SID: number;
    name: string;
    email: string;
    phone: string;
    tutor: TUTOR;
    subjects: SUBJECT[];
}
