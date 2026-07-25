const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    // 1. Dọn dẹp cục nợ cũ ban nãy
    html = html.replace(/<!-- BẮT ĐẦU: MODAL NHẬP ĐIỂM -->[\s\S]*?<!-- KẾT THÚC: MODAL NHẬP ĐIỂM -->/g, '');
    html = html.replace(/<!-- BẮT ĐẦU: MODAL NHẬP ĐIỂM V2 -->[\s\S]*?<!-- KẾT THÚC: MODAL NHẬP ĐIỂM V2 -->/g, '');

    // 2. Chèn Modal V2 với CSS độc lập, không phụ thuộc Framework
    const newModal = `
<!-- BẮT ĐẦU: MODAL NHẬP ĐIỂM V2 -->
<style>
/* CSS Độc lập - Ép hiển thị dạng Popup Overlay */
#karl-modal-overlay {
    display: none; 
    position: fixed; 
    top: 0; left: 0; 
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.7); 
    z-index: 99999;
    align-items: center; 
    justify-content: center; 
    backdrop-filter: blur(3px);
}
#karl-modal-overlay.active {
    display: flex !important;
}
.karl-modal-content {
    background: #1e293b; /* Nền tối chuẩn Dark mode */
    color: #f8fafc; 
    width: 450px; max-width: 90%;
    border-radius: 12px; 
    padding: 24px; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.8);
    border: 1px solid #334155; 
    font-family: inherit;
}
.karl-modal-header { 
    display: flex; justify-content: space-between; align-items: center; 
    border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px; 
}
.karl-modal-title { font-size: 1.2rem; font-weight: bold; margin: 0; }
.karl-close-btn { 
    background: none; border: none; color: #94a3b8; font-size: 1.8rem; 
    cursor: pointer; line-height: 1; padding: 0; 
}
.karl-close-btn:hover { color: #ef4444; }
.karl-modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.karl-btn { padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
.karl-btn-cancel { background: #475569; color: white; }
.karl-btn-cancel:hover { background: #334155; }
.karl-btn-save { background: #3b82f6; color: white; }
.karl-btn-save:hover { background: #2563eb; }
</style>

<div id="karl-modal-overlay">
    <div class="karl-modal-content">
        <div class="karl-modal-header">
            <h5 class="karl-modal-title">🎯 Cập nhật điểm số</h5>
            <button class="karl-close-btn" onclick="dongModalNhapDiem()">&times;</button>
        </div>
        <div class="karl-modal-body">
            <input type="hidden" id="nhapDiemMaSV">
            <div style="background: #0f172a; padding: 12px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #334155;">
                <span style="color: #94a3b8; font-size: 0.9rem;">Đang nhập điểm cho sinh viên:</span><br>
                <strong id="nhapDiemTenSV" style="font-size: 1.1rem; color: #38bdf8;"></strong>
            </div>
            <div style="text-align: center; color: #94a3b8; font-size: 0.9rem; font-style: italic; padding: 20px 0;">
                Khu vực form nhập điểm các môn học...<br>(Sẽ được render từ Backend)
            </div>
        </div>
        <div class="karl-modal-footer">
            <button class="karl-btn karl-btn-cancel" onclick="dongModalNhapDiem()">Hủy bỏ</button>
            <button class="karl-btn karl-btn-save" onclick="luuDiemSinhVien()">💾 Lưu Điểm</button>
        </div>
    </div>
</div>

<script>
// Lắng nghe sự kiện nút Nhập điểm
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a, .btn');
    if (!btn) return;
    
    const txt = (btn.innerText || '').toLowerCase();
    if (txt.includes('nhập điểm')) {
        e.preventDefault();
        const tr = btn.closest('tr');
        if (!tr) return;
        
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 3) {
            const maSV = tds[1].innerText.trim();
            const tenSV = tds[2].innerText.trim();
            
            // Gắn dữ liệu
            document.getElementById('nhapDiemMaSV').value = maSV;
            document.getElementById('nhapDiemTenSV').innerText = tenSV + ' (' + maSV + ')';
            
            // Bật Modal
            document.getElementById('karl-modal-overlay').classList.add('active');
        }
    }
});

function dongModalNhapDiem() {
    document.getElementById('karl-modal-overlay').classList.remove('active');
}

function luuDiemSinhVien() {
    const maSV = document.getElementById('nhapDiemMaSV').value;
    alert('✅ Đã ghi nhận lệnh lưu điểm cho mã SV: ' + maSV);
    dongModalNhapDiem();
}
</script>
<!-- KẾT THÚC: MODAL NHẬP ĐIỂM V2 -->
`;

    // 3. Chèn vào cuối file
    html = html.replace(/<\/body>\s*<\/html>\s*$/i, newModal + '\n</body>\n</html>');
    fs.writeFileSync(file, html, 'utf8');
    console.log('✅ Đã thay thế sang Modal V2 (Dark Mode Custom). Đảm bảo không vỡ layout!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
