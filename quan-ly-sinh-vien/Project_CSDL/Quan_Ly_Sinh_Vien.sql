-- Tạo cơ sở dữ liệu
CREATE DATABASE Quan_Ly_Sinh_Vien;
USE Quan_Ly_Sinh_Vien;

-- 1. Tạo bảng Khoa (Faculties)
CREATE TABLE Khoa (
    MaKhoa VARCHAR(10) PRIMARY KEY,
    TenKhoa VARCHAR(100) NOT NULL
);

-- 2. Tạo bảng Lớp (Classes)
CREATE TABLE Lop (
    MaLop VARCHAR(10) PRIMARY KEY,
    TenLop VARCHAR(100) NOT NULL,
    MaKhoa VARCHAR(10),
    FOREIGN KEY (MaKhoa) REFERENCES Khoa(MaKhoa)
);

-- 3. Tạo bảng Sinh Viên (Students)
CREATE TABLE SinhVien (
    MaSV VARCHAR(15) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh VARCHAR(10),
    MaLop VARCHAR(10),
    QueQuan VARCHAR(100),
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop)
);

-- 4. Tạo bảng Môn Học (Subjects)
CREATE TABLE MonHoc (
    MaMH VARCHAR(10) PRIMARY KEY,
    TenMH VARCHAR(100) NOT NULL,
    SoTinChi INT CHECK (SoTinChi > 0)
);

-- 5. Tạo bảng Điểm (Grades)
-- Một sinh viên có thể có điểm cho nhiều môn, và một môn có nhiều sinh viên
CREATE TABLE Diem (
    MaSV VARCHAR(15),
    MaMH VARCHAR(10),
    DiemQuaTrinh FLOAT CHECK (DiemQuaTrinh >= 0 AND DiemQuaTrinh <= 10),
    DiemThi FLOAT CHECK (DiemThi >= 0 AND DiemThi <= 10),
    PRIMARY KEY (MaSV, MaMH),
    FOREIGN KEY (MaSV) REFERENCES SinhVien(MaSV),
    FOREIGN KEY (MaMH) REFERENCES MonHoc(MaMH)
);

-- ==========================================
-- THÊM DỮ LIỆU MẪU (DUMMY DATA)
-- ==========================================

-- Thêm dữ liệu bảng Khoa
INSERT INTO Khoa (MaKhoa, TenKhoa) VALUES 
('CNTT', 'Công nghệ thông tin'), 
('KT', 'Kinh tế'),
('NN', 'Ngoại ngữ');

-- Thêm dữ liệu bảng Lớp
INSERT INTO Lop (MaLop, TenLop, MaKhoa) VALUES 
('IT01', 'Kỹ thuật phần mềm 1', 'CNTT'), 
('IT02', 'Khoa học máy tính 1', 'CNTT'),
('KT01', 'Quản trị kinh doanh', 'KT');

-- Thêm dữ liệu bảng Sinh Viên
INSERT INTO SinhVien (MaSV, HoTen, NgaySinh, GioiTinh, MaLop, QueQuan) VALUES 
('SV001', 'Nguyễn Văn A', '2003-05-15', 'Nam', 'IT01', 'Hà Nội'), 
('SV002', 'Trần Thị B', '2004-02-20', 'Nữ', 'KT01', 'Hải Phòng'),
('SV003', 'Lê Văn C', '2003-11-08', 'Nam', 'IT02', 'Đà Nẵng');

-- Thêm dữ liệu bảng Môn Học
INSERT INTO MonHoc (MaMH, TenMH, SoTinChi) VALUES 
('CSDL', 'Cơ sở dữ liệu', 3), 
('KTVM', 'Kinh tế vi mô', 2),
('LTC', 'Lập trình C Căn bản', 3);

-- Thêm dữ liệu bảng Điểm
INSERT INTO Diem (MaSV, MaMH, DiemQuaTrinh, DiemThi) VALUES 
('SV001', 'CSDL', 8.5, 9.0), 
('SV001', 'LTC', 7.0, 8.5),
('SV002', 'KTVM', 9.0, 8.0),
('SV003', 'CSDL', 6.5, 7.0);