const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    // Kiểm tra xem đã có modal nhập điểm chưa để tránh chèn trùng
    if (!html.includes('id="modalNhapDiem"')) {
        const modalHTML = `
<!-- BẮT ĐẦU: MODAL NHẬP ĐIỂM -->
<div class="modal fade" id="modalNhapDiem" tabindex="-1" aria-labelledby="modalNhapDiemLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalNhapDiemLabel">🎯 Cập nhật điểm số</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="nhapDiemMaSV">
                <div class="alert alert-info">
                    <strong>Sinh viên:</strong> <span id="nhapDiemTenSV" class="text-uppercase fw-bold"></span>
                </div>
                <div id="danhSachMonHocNhapDiem">
                    <!-- Sẽ load form nhập điểm ở đây -->
                    <div class="text-center text-muted my-3">
                        <i>Vui lòng nhập điểm cho các môn học sinh viên đã đăng ký. Tính năng lưu Database đang được hoàn thiện.</i>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
                <button type="button" class="btn btn-primary" onclick="luuDiemSinhVien()">💾 Lưu Điểm</button>
            </div>
        </div>
    </div>
</div>

<script>
// XỬ LÝ NÚT NHẬP ĐIỂM
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;
    
    // Bắt đúng nút có chữ "Nhập điểm"
    const txt = (btn.innerText || '').toLowerCase();
    if (txt.includes('nhập điểm')) {
        e.preventDefault();
        
        // Tìm dòng (tr) chứa nút vừa bấm
        const tr = btn.closest('tr');
        if (!tr) return;
        
        // Lấy dữ liệu từ các cột trong bảng (Giả sử cột 2 là Mã SV, cột 3 là Tên)
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 3) {
            const maSV = tds[1].innerText.trim();
            const tenSV = tds[2].innerText.trim();
            
            // Bơm dữ liệu vào Modal
            document.getElementById('nhapDiemMaSV').value = maSV;
            document.getElementById('nhapDiemTenSV').innerText = tenSV + ' (' + maSV + ')';
            
            // Mở Modal lên
            if (typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(document.getElementById('modalNhapDiem'));
                modal.show();
            } else if (typeof window.$ !== 'undefined') {
                $('#modalNhapDiem').modal('show');
            } else {
                alert('Sẵn sàng nhập điểm cho: ' + tenSV);
            }
        }
    }
});

function luuDiemSinhVien() {
    const maSV = document.getElementById('nhapDiemMaSV').value;
    alert('Đã ghi nhận lệnh lưu điểm cho mã SV: ' + maSV + '. Tính năng Backend sẽ được nối vào sau!');
    
    // Tự động đóng form sau khi lưu
    if (typeof bootstrap !== 'undefined') {
        const modalEl = document.getElementById('modalNhapDiem');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    } else if (typeof window.$ !== 'undefined') {
        $('#modalNhapDiem').modal('hide');
    }
}
</script>
<!-- KẾT THÚC: MODAL NHẬP ĐIỂM -->
`;
        
        // Chèn vào ngay trước thẻ </body>
        html = html.replace(/<\/body>\s*<\/html>\s*$/i, modalHTML + '\n</body>\n</html>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('✅ Đã xử lý xong: Nút Nhập Điểm đã hoạt động và có Modal đi kèm!');
    } else {
        console.log('⚠️ Modal Nhập điểm đã được gắn từ trước rồi bro ơi!');
    }
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
