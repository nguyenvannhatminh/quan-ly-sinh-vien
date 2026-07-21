const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// 1. Gắn thêm ID và nút Hủy vào form Giảng viên
html = html.replace(
  '<button type="submit" class="btn btn-success">Thêm ngay</button>',
  '<button type="submit" id="btnSubmitTutor" class="btn btn-success">Thêm ngay</button> <button type="button" id="btnCancelTutor" class="btn btn-secondary" style="display:none; padding:10px; border-radius:6px; border:none; cursor:pointer;" onclick="huyCheDoSuaTutor()">Hủy</button>'
);

// 2. Gắn thêm ID và nút Hủy vào form Môn học
html = html.replace(
  '<button type="submit" class="btn btn-success">Thêm ngay</button>',
  '<button type="submit" id="btnSubmitSubject" class="btn btn-success">Thêm ngay</button> <button type="button" id="btnCancelSubject" class="btn btn-secondary" style="display:none; padding:10px; border-radius:6px; border:none; cursor:pointer;" onclick="huyCheDoSuaSubject()">Hủy</button>'
);

// 3. Thay thế Logic JS cũ bằng Logic mới Full chức năng
const oldCodeRegex = /async function layDanhSachTutor\(\)[\s\S]*?async function xoaSubject[^\}]+\}/;

const newJS = `
        let listTutorBoNhoDem = []; let isEditingTutor = false; let editingTutorId = null;

        async function layDanhSachTutor() {
            const div = document.getElementById('ket-qua-tutor'); const res = await fetch('/tutor'); const data = await res.json(); const role = localStorage.getItem('role') || 'user'; const isManager = (role === 'admin' || role === 'giaovu');
            listTutorBoNhoDem = data;
            if(data.length === 0) { div.innerHTML = '<p class="empty-state">Chưa có giảng viên nào.</p>'; return; }
            let html = '<table><thead><tr><th>Mã GV</th><th>Tên Giảng viên</th>' + (isManager ? '<th>Hành động</th>' : '') + '</tr></thead><tbody>';
            data.forEach(t => { 
                html += '<tr><td>' + t.TID + '</td><td><strong>' + t.name + '</strong></td>'; 
                if(isManager) { 
                    html += '<td><button class="btn btn-warning" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="kichHoatCheDoSuaTutor(' + t.TID + ')">✏️ Sửa</button><button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="xoaTutor(' + t.TID + ',\\'' + t.name + '\\')">🗑️</button></td>'; 
                } 
                html += '</tr>'; 
            });
            div.innerHTML = html + '</tbody></table>';
        }

        function kichHoatCheDoSuaTutor(id) {
            const t = listTutorBoNhoDem.find(x => x.TID === id); if (!t) return;
            isEditingTutor = true; editingTutorId = id;
            const btnSubmit = document.getElementById('btnSubmitTutor') || document.querySelector('#formTutor button[type="submit"]');
            if(btnSubmit) { btnSubmit.innerText = 'Cập nhật'; btnSubmit.className = 'btn btn-warning'; }
            const btnCancel = document.getElementById('btnCancelTutor'); if(btnCancel) btnCancel.style.display = 'inline-block';
            document.getElementById('formTutor').name.value = t.name;
        }

        function huyCheDoSuaTutor() {
            isEditingTutor = false; editingTutorId = null;
            const btnSubmit = document.getElementById('btnSubmitTutor') || document.querySelector('#formTutor button[type="submit"]');
            if(btnSubmit) { btnSubmit.innerText = 'Thêm ngay'; btnSubmit.className = 'btn btn-success'; }
            const btnCancel = document.getElementById('btnCancelTutor'); if(btnCancel) btnCancel.style.display = 'none';
            document.getElementById('formTutor').reset();
        }

        async function themTutor(event) { 
            event.preventDefault(); const name = event.target.name.value; 
            const url = isEditingTutor ? '/tutor/' + editingTutorId : '/tutor';
            const method = isEditingTutor ? 'PATCH' : 'POST';
            await fetch(url, { method: method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name}) }); 
            huyCheDoSuaTutor(); layDanhSachTutor(); taiDuLieuFormSinhVien(); 
        }

        async function xoaTutor(id, name) { 
            if(!confirm('Xóa giảng viên ' + name + '?')) return; 
            if(await fetch('/tutor/' + id, { method: 'DELETE' }).then(r => r.ok)) { 
                if(isEditingTutor && editingTutorId === id) huyCheDoSuaTutor();
                layDanhSachTutor(); layDanhSachSinhVien(currentPage); taiDuLieuFormSinhVien(); 
            } 
        }

        let listSubjectBoNhoDem = []; let isEditingSubject = false; let editingSubjectId = null;

        async function layDanhSachSubject() {
            const div = document.getElementById('ket-qua-subject'); const res = await fetch('/subject'); const data = await res.json(); const role = localStorage.getItem('role') || 'user'; const isManager = (role === 'admin' || role === 'giaovu');
            listSubjectBoNhoDem = data;
            if(data.length === 0) { div.innerHTML = '<p class="empty-state">Chưa có môn học nào.</p>'; return; }
            let html = '<table><thead><tr><th>Mã Môn</th><th>Tên Môn học</th>' + (isManager ? '<th>Hành động</th>' : '') + '</tr></thead><tbody>';
            data.forEach(s => { 
                html += '<tr><td>' + s.SubID + '</td><td><strong>' + s.name + '</strong></td>'; 
                if(isManager) { 
                    html += '<td><button class="btn btn-warning" style="padding:4px 8px; font-size:12px; margin-right:5px;" onclick="kichHoatCheDoSuaSubject(' + s.SubID + ')">✏️ Sửa</button><button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="xoaSubject(' + s.SubID + ',\\'' + s.name + '\\')">🗑️</button></td>'; 
                } 
                html += '</tr>'; 
            });
            div.innerHTML = html + '</tbody></table>';
        }

        function kichHoatCheDoSuaSubject(id) {
            const s = listSubjectBoNhoDem.find(x => x.SubID === id); if (!s) return;
            isEditingSubject = true; editingSubjectId = id;
            const btnSubmit = document.getElementById('btnSubmitSubject') || document.querySelector('#formSubject button[type="submit"]');
            if(btnSubmit) { btnSubmit.innerText = 'Cập nhật'; btnSubmit.className = 'btn btn-warning'; }
            const btnCancel = document.getElementById('btnCancelSubject'); if(btnCancel) btnCancel.style.display = 'inline-block';
            document.getElementById('formSubject').name.value = s.name;
        }

        function huyCheDoSuaSubject() {
            isEditingSubject = false; editingSubjectId = null;
            const btnSubmit = document.getElementById('btnSubmitSubject') || document.querySelector('#formSubject button[type="submit"]');
            if(btnSubmit) { btnSubmit.innerText = 'Thêm ngay'; btnSubmit.className = 'btn btn-success'; }
            const btnCancel = document.getElementById('btnCancelSubject'); if(btnCancel) btnCancel.style.display = 'none';
            document.getElementById('formSubject').reset();
        }

        async function themSubject(event) { 
            event.preventDefault(); const name = event.target.name.value; 
            const url = isEditingSubject ? '/subject/' + editingSubjectId : '/subject';
            const method = isEditingSubject ? 'PATCH' : 'POST';
            await fetch(url, { method: method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name}) }); 
            huyCheDoSuaSubject(); layDanhSachSubject(); taiDuLieuFormSinhVien(); 
        }

        async function xoaSubject(id, name) { 
            if(!confirm('Xóa môn học ' + name + '?')) return; 
            if(await fetch('/subject/' + id, { method: 'DELETE' }).then(r => r.ok)) { 
                if(isEditingSubject && editingSubjectId === id) huyCheDoSuaSubject();
                layDanhSachSubject(); layDanhSachSinhVien(currentPage); taiDuLieuFormSinhVien(); 
            } 
        }
`;

html = html.replace(oldCodeRegex, newJS.trim());
fs.writeFileSync('./public/index.html', html);
console.log('🎉 Đã độ xong full tính năng Sửa/Xóa cho Giảng viên & Môn học! Bro f5 web hưởng thụ nhé!');
