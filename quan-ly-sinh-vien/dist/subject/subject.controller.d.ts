import { SubjectService } from './subject.service';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    create(createSubjectDto: any): Promise<any>;
    findAll(): Promise<import("./entities/subject.entity").Subject[]>;
    findOne(id: string): Promise<import("./entities/subject.entity").Subject>;
    update(id: string, updateSubjectDto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
