import { TutorService } from './tutor.service';
export declare class TutorController {
    private readonly tutorService;
    constructor(tutorService: TutorService);
    create(createTutorDto: any): Promise<any>;
    findAll(): Promise<{
        id: any;
        TID: number;
        name: string;
    }[]>;
    findOne(id: string): Promise<{
        id: any;
        TID: number;
        name: string;
    }>;
    update(id: string, updateTutorDto: any): Promise<{
        id: any;
        TID: number;
        name: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
