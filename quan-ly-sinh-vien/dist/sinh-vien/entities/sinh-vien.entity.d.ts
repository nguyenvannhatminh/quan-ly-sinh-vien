import { Tutor } from '../../tutor/entities/tutor.entity';
import { Subject } from '../../subject/entities/subject.entity';
export declare class SinhVien {
    SID: number;
    name: string;
    email: string;
    diemSo: any;
    gpa: number;
    xepLoai: string;
    tutor: Tutor;
    subjects: Subject[];
}
