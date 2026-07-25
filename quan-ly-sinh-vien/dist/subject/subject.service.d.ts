import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
export declare class SubjectService {
    private subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    create(createSubjectDto: any): Promise<any>;
    findAll(): Promise<Subject[]>;
    findOne(id: number): Promise<Subject>;
    update(id: number, updateSubjectDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
