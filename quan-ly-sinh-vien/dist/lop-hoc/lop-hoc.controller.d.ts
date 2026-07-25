import { LopHocService } from './lop-hoc.service';
import { CreateLopHocDto } from './dto/create-lop-hoc.dto';
import { UpdateLopHocDto } from './dto/update-lop-hoc.dto';
export declare class LopHocController {
    private readonly lopHocService;
    constructor(lopHocService: LopHocService);
    create(createLopHocDto: CreateLopHocDto): Promise<any>;
    findAll(): Promise<import("./entities/lop-hoc.entity").LopHoc[]>;
    findOne(id: string): Promise<import("./entities/lop-hoc.entity").LopHoc>;
    update(id: string, updateLopHocDto: UpdateLopHocDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
