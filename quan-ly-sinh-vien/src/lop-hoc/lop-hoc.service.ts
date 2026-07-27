import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LopHoc } from './entities/lop-hoc.entity';

@Injectable()
export class LopHocService {
  constructor(
    @InjectRepository(LopHoc)
    private repo: Repository<LopHoc>,
  ) {}

  create(dto: any) { return this.repo.save(dto); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOneBy({ MaLop: id }); }
  update(id: string, dto: any) { return this.repo.update(id, dto); }
  remove(id: string) { return this.repo.delete(id); }
}