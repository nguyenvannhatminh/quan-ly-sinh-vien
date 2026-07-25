import { Repository } from 'typeorm';
import { USER } from '../entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<USER>);
    create(username: string, password: string): Promise<USER>;
    findOne(username: string): Promise<USER | undefined>;
}
