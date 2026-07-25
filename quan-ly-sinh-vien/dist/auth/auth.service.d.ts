export declare class AuthService {
    register(username: string, password?: string): Promise<{
        message: string;
        username: string;
    }>;
    login(username: string, password?: string): Promise<{
        access_token: string;
        role: string;
        username: string;
    }>;
}
