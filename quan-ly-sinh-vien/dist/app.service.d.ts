export declare class AppService {
    private tutors;
    private subjects;
    private sinhViens;
    private nextSid;
    private nextTid;
    private nextSubid;
    login(username: string): {
        access_token: string;
        role: string;
        username: string;
    };
    getTutors(): {
        TID: number;
        name: string;
    }[];
    addTutor(name: string): {
        TID: number;
        name: string;
    };
    deleteTutor(id: number): {
        success: boolean;
    };
    getSubjects(): {
        SubID: number;
        name: string;
    }[];
    addSubject(name: string): {
        SubID: number;
        name: string;
    };
    deleteSubject(id: number): {
        success: boolean;
    };
    getSinhViens(page?: number, limit?: number, search?: string): {
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
    addSinhVien(data: any): {
        SID: number;
        name: any;
        email: any;
        tutorId: any;
        subjectIds: any;
    };
    updateSinhVien(id: number, data: any): {
        SID: number;
        name: string;
        email: string;
        tutorId: number;
        subjectIds: number[];
    };
    deleteSinhVien(id: number): {
        success: boolean;
    };
}
