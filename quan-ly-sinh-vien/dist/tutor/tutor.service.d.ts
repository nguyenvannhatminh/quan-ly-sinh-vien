import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';
export declare class TutorService {
    private tutorRepository;
    constructor(tutorRepository: Repository<Tutor>);
    create(createTutorDto: any): Promise<any>;
    findAll(): Promise<{
        id: any;
        TID: number;
        name: string;
    }[]>;
    findOne(id: number): Promise<{
        id: any;
        TID: number;
        name: string;
    }>;
    update(id: number, updateTutorDto: any): Promise<{
        id: any;
        TID: number;
        name: string;
    }>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
