import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    login(body: any): {
        access_token: string;
        role: string;
        username: string;
    };
    register(): {
        message: string;
    };
    getTutors(): {
        TID: number;
        name: string;
    }[];
    addTutor(body: any): {
        TID: number;
        name: string;
    };
    deleteTutor(id: string): {
        success: boolean;
    };
    getSubjects(): {
        SubID: number;
        name: string;
    }[];
    addSubject(body: any): {
        SubID: number;
        name: string;
    };
    deleteSubject(id: string): {
        success: boolean;
    };
    getSinhViens(page: number, limit: number, search: string): {
        data: {
            tutor: {
                TID: number;
                name: string;
            };
            subjects: {
                SubID: number;
                name: string;
            }[];
            SID: number;
            name: string;
            email: string;
            tutorId: number;
            subjectIds: number[];
        }[];
        total: number;
        page: number;
        lastPage: number;
    };
    addSinhVien(body: any): {
        SID: number;
        name: any;
        email: any;
        tutorId: any;
        subjectIds: any;
    };
    updateSinhVien(id: string, body: any): {
        SID: number;
        name: string;
        email: string;
        tutorId: number;
        subjectIds: number[];
    };
    deleteSinhVien(id: string): {
        success: boolean;
    };
}
