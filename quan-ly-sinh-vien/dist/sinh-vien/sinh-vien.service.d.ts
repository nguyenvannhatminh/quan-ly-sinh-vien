import { Repository } from 'typeorm';
import { SinhVien } from './entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';
export declare class SinhVienService {
    private svRepo;
    private tutorRepo;
    private subRepo;
    constructor(svRepo: Repository<SinhVien>, tutorRepo: Repository<Tutor>, subRepo: Repository<Subject>);
    private calculateAcademic;
    create(body: any): Promise<SinhVien>;
    findAll(page?: number, limit?: number, search?: string, tutorFilter?: string, subjectFilter?: string): Promise<{
        data: SinhVien[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    update(id: number, body: any): Promise<SinhVien>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
