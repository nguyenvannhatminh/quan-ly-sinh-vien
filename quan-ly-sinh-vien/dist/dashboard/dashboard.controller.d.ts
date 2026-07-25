import { Repository } from 'typeorm';
import { SinhVien } from '../sinh-vien/entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';
export declare class DashboardController {
    private studentRepo;
    private tutorRepo;
    private subjectRepo;
    constructor(studentRepo: Repository<SinhVien>, tutorRepo: Repository<Tutor>, subjectRepo: Repository<Subject>);
    getStats(): Promise<{
        totalStudents: number;
        totalTutors: number;
        totalSubjects: number;
        chartData: any[];
    }>;
}
