import { SinhVienService } from './sinh-vien.service';
export declare class SinhVienController {
    private readonly sinhVienService;
    constructor(sinhVienService: SinhVienService);
    findAll(page?: string, limit?: string, search?: string, tutorId?: string, subjectId?: string): Promise<{
        data: import("./entities/sinh-vien.entity").SinhVien[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    create(body: any): Promise<import("./entities/sinh-vien.entity").SinhVien>;
    update(id: string, body: any): Promise<import("./entities/sinh-vien.entity").SinhVien>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
