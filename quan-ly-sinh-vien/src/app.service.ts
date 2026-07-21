import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // --- MOCK DATA ---
  private tutors = [
    { TID: 1, name: 'TS. Nguyễn Văn A' },
    { TID: 2, name: 'ThS. Trần Thị B' }
  ];
  private subjects = [
    { SubID: 1, name: 'Lập trình Web' },
    { SubID: 2, name: 'Cơ sở dữ liệu' }
  ];
  private sinhViens = [
    { SID: 1001, name: 'Lê Văn C', email: 'c@karl.edu.vn', tutorId: 1, subjectIds: [1, 2] },
    { SID: 1002, name: 'Phạm Thị D', email: 'd@karl.edu.vn', tutorId: 2, subjectIds: [1] }
  ];
  
  private nextSid = 1003;
  private nextTid = 3;
  private nextSubid = 3;

  // --- AUTH ---
  login(username: string) {
    let role = 'user';
    if (username === 'admin') role = 'admin';
    if (username === 'giaovu') role = 'giaovu';
    
    // Trả về token giả định kèm role để Frontend nhận diện và hiển thị Form
    return { access_token: 'fake-jwt-token-12345', role: role, username: username };
  }

  // --- TUTOR ---
  getTutors() { return this.tutors; }
  addTutor(name: string) { 
    const t = { TID: this.nextTid++, name }; 
    this.tutors.push(t); 
    return t; 
  }
  deleteTutor(id: number) { 
    this.tutors = this.tutors.filter(t => t.TID !== id); 
    return { success: true }; 
  }

  // --- SUBJECT ---
  getSubjects() { return this.subjects; }
  addSubject(name: string) { 
    const s = { SubID: this.nextSubid++, name }; 
    this.subjects.push(s); 
    return s; 
  }
  deleteSubject(id: number) { 
    this.subjects = this.subjects.filter(s => s.SubID !== id); 
    return { success: true }; 
  }

  // --- SINH VIEN ---
  getSinhViens(page = 1, limit = 5, search = '') {
    let filtered = this.sinhViens;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(sv => 
        sv.name.toLowerCase().includes(s) || sv.SID.toString().includes(s)
      );
    }
    
    const total = filtered.length;
    const lastPage = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    
    // Map dữ liệu để ghép tên Giảng viên và Môn học vào Sinh viên
    const paginated = filtered.slice(start, start + limit).map(sv => {
      const tutor = this.tutors.find(t => t.TID === sv.tutorId) || null;
      const subjects = this.subjects.filter(sub => (sv.subjectIds || []).includes(sub.SubID));
      return { ...sv, tutor, subjects };
    });
    
    return { data: paginated, total, page: Number(page), lastPage };
  }

  addSinhVien(data: any) {
    const sv = { 
      SID: this.nextSid++, 
      name: data.name, 
      email: data.email, 
      tutorId: data.tutorId, 
      subjectIds: data.subjectIds || [] 
    };
    this.sinhViens.unshift(sv); // Thêm lên đầu danh sách
    return sv;
  }

  updateSinhVien(id: number, data: any) {
    const index = this.sinhViens.findIndex(s => s.SID === id);
    if (index !== -1) {
      this.sinhViens[index] = { ...this.sinhViens[index], ...data };
      return this.sinhViens[index];
    }
    return null;
  }

  deleteSinhVien(id: number) {
    this.sinhViens = this.sinhViens.filter(s => s.SID !== id); 
    return { success: true };
  }
}
