import { Repository } from 'typeorm';
import { LopHoc } from './entities/lop-hoc.entity';
export declare class LopHocService {
    private repo;
    constructor(repo: Repository<LopHoc>);
    create(dto: any): Promise<any>;
    findAll(): Promise<LopHoc[]>;
    findOne(id: string): Promise<LopHoc>;
    update(id: string, dto: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
