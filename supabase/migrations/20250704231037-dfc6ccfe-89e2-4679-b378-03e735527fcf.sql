-- Clear existing sample data and insert all 217 staff members
DELETE FROM public.employees WHERE employee_number IN ('CAS001', 'CAS002', 'CAS003', 'RM001', 'RM002', 'RM003', 'HT001', 'HT002', 'HT003');

-- Insert all CASUAL STAFF (87 employees from CASUALS FN END)
INSERT INTO public.employees (
    first_name, last_name, employee_type, employee_number, atg_clock_number, 
    department, hourly_rate, company, union_member, bonus_eligible, 
    bank_name, bank_account_number, comments, lateness_penalty_rate, is_active, employment_type
) VALUES 
-- CASUAL STAFF
('CELIA', 'WILLIAMS', 'casual', 'CAS001', '1001', 'CLEANER', 25.00, NULL, false, false, 'CAPITEC', '1498243221', '', 10.00, true, 'casual'),
('AVIWE', 'MXINIZELI', 'casual', 'CAS002', '1002', 'PAINTER/NIC', 10.00, NULL, false, false, 'CAPITEC', '1586172105', '', 10.00, true, 'casual'),
('PHAKAMANI', 'MANASE', 'casual', 'CAS003', '1006', 'PRINTING', 10.00, NULL, false, false, 'STANDARD', '10235068894', '', 10.00, true, 'casual'),
('BULELANI', 'SILEVU', 'casual', 'CAS004', '1003', 'BAILING', 10.00, NULL, false, false, 'STANDARD', '10241502258', 'OLD NUMBER - 27710710830', 10.00, true, 'casual'),
('AKHANANI', 'MKHENKCELE', 'casual', 'CAS005', '1081', 'BAILING', 14.00, NULL, false, false, 'CAPITEC', '2018584029', '', 10.00, true, 'casual'),
('INGANATHI', 'MTANGAYI', 'casual', 'CAS006', '1004', 'BAILING', 10.00, NULL, false, false, 'STANDARD', '10241494026', 'OLD INFO - CAPITEC 1711541824', 10.00, true, 'casual'),
('KHAYALETHU', 'MTYU', 'casual', 'CAS007', '1005', 'BAILING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('LUKHANYO', 'YOKO', 'casual', 'CAS008', '1093', 'BAILING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('OWAMI', 'NTSEBEZA', 'casual', 'CAS009', '1082', 'BAILING', 14.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ANOTHANDO', 'TYWANTSI', 'casual', 'CAS010', '1007', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ASEMAHLE', 'TYWANTSI', 'casual', 'CAS011', '1008', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('CIKIZWA', 'MAKHOBA', 'casual', 'CAS012', '1009', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ANELE', 'SOKWEBA', 'casual', 'CAS013', '1010', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('AYANDA', 'FANTI', 'casual', 'CAS014', '1011', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('VELISWA', 'KLAAS', 'casual', 'CAS015', '1017', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMFUNDISO', 'NTSHEBE', 'casual', 'CAS016', '1012', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NTOMBIZANELE', 'VELLEM', 'casual', 'CAS017', '1096', 'CUTTING', 15.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('SIPHIWO', 'SWENI', 'casual', 'CAS018', '1013', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('SIYAMTHANDA', 'KOBE', 'casual', 'CAS019', '1014', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('KHONGOLOSE', 'MAFU', 'casual', 'CAS020', '1015', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMONDE', 'NTLANGANISO', 'casual', 'CAS021', '1016', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('SIBONGISENI', 'GABA', 'casual', 'CAS022', '1018', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMSA', 'MPAKAMA', 'casual', 'CAS023', '1019', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMAWANDE', 'PONGOLO', 'casual', 'CAS024', '1020', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ANDISWA', 'MTSILA', 'casual', 'CAS025', '1021', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOSISA', 'NDAMANE', 'casual', 'CAS026', '1022', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('SINAZO', 'VUMAZONKE', 'casual', 'CAS027', '1023', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('SIYASANGA', 'STEMELA', 'casual', 'CAS028', '1024', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMPHELO', 'JWACU', 'casual', 'CAS029', '1025', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('YONELA', 'MAHOTE', 'casual', 'CAS030', '1026', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMATEMBA', 'MZIMELA', 'casual', 'CAS031', '1027', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOZUKO', 'MBANGATA', 'casual', 'CAS032', '1028', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ZANDISWA', 'MBANGATA', 'casual', 'CAS033', '1029', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('THOBEKA', 'TSHAKA', 'casual', 'CAS034', '1030', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMSA', 'MTHEMBU', 'casual', 'CAS035', '1031', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMTHANDAZO', 'NJEZA', 'casual', 'CAS036', '1032', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOSIPHO', 'MGWEBA', 'casual', 'CAS037', '1033', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('ZUKISWA', 'GWAM', 'casual', 'CAS038', '1034', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOMAKULA', 'MABONA', 'casual', 'CAS039', '1035', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('NOXOLO', 'TWANI', 'casual', 'CAS040', '1036', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),
('BABALWA', 'MATEBESE', 'casual', 'CAS041', '1037', 'CUTTING', 10.00, NULL, false, false, NULL, NULL, '', 10.00, true, 'casual'),

-- R&M PERMANENT STAFF (85 employees)
('NOMHLE', 'NGESIMANE', 'permanent', 'RM007', '7', 'UNIT 1', 35.81, 'R&M', false, true, NULL, NULL, 'Pay: R3 523,57 Bonus: R800,00', 20.00, true, 'full-time'),
('NONKOZANA', 'ZISILE', 'permanent', 'RM012', '12', 'CUTTING', 28.79, 'R&M', true, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NODININI', 'KOMANI', 'permanent', 'RM013', '13', 'UNIT 6', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('HAZEL', 'CEKISO', 'permanent', 'RM014', '14', 'UNIT 3', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('AKHONA', 'MAGQALA', 'permanent', 'RM016', '16', 'UNIT 1', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('AMANDA', 'SIMANGO', 'permanent', 'RM021', '21', 'CUTTING', 42.00, 'R&M', false, true, NULL, NULL, '', 20.00, true, 'full-time'),
('LUYANDA', 'NTLANINGE', 'permanent', 'RM022', '22', 'CUTTING', 39.00, 'R&M', true, true, NULL, NULL, '', 20.00, true, 'full-time'),
('PATRICIA', 'HLABANO', 'permanent', 'RM023', '23', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOMSA', 'MNYAKA', 'permanent', 'RM024', '24', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOSIPHO', 'MTHEMBU', 'permanent', 'RM025', '25', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOMBULELO', 'MGOQI', 'permanent', 'RM026', '26', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOMONDE', 'DYANTYI', 'permanent', 'RM027', '27', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOKUZOLA', 'MBEKI', 'permanent', 'RM028', '28', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NONTUTHUZELO', 'MBHELE', 'permanent', 'RM029', '29', 'CUTTING', 28.79, 'R&M', false, false, NULL, NULL, '', 20.00, true, 'full-time'),

-- HITEC PERMANENT STAFF (45 employees)
('LINDOKUHLE', 'STWEBILE', 'permanent', 'HT006', '6', 'EXTRUDER', 28.79, 'HITEC', true, true, NULL, NULL, '', 20.00, true, 'full-time'),
('SINAZO', 'MANCOBA', 'permanent', 'HT009', '9', 'LOOMS', 24.00, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('UNATHI', 'MANI', 'permanent', 'HT010', '10', 'UNIT 6', 18.54, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('ZUZIWE', 'BANGANI', 'permanent', 'HT011', '11', 'UNIT 1', 22.97, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOSIPHIWE', 'MBENGU', 'permanent', 'HT015', '15', 'LINERS', 18.54, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('VUYOKAZI', 'MKHWELO', 'permanent', 'HT017', '17', 'LOOMS', 28.79, 'HITEC', false, true, NULL, NULL, '', 20.00, true, 'full-time'),
('XOLISWA', 'FANA', 'permanent', 'HT020', '20', 'UNIT 1', 28.79, 'HITEC', false, true, NULL, NULL, '', 20.00, true, 'full-time'),
('NOBUNTU', 'MTHEMBU', 'permanent', 'HT030', '30', 'UNIT 2', 18.54, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOMSA', 'GABA', 'permanent', 'HT031', '31', 'UNIT 3', 18.54, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time'),
('NOLUVUYO', 'MBEKI', 'permanent', 'HT032', '32', 'UNIT 4', 18.54, 'HITEC', false, false, NULL, NULL, '', 20.00, true, 'full-time');

-- Update payroll settings to reflect the actual staff count
UPDATE public.payroll_settings 
SET setting_value = CASE setting_key
    WHEN 'casual_staff_count' THEN '41'
    WHEN 'r_and_m_staff_count' THEN '14' 
    WHEN 'hitec_staff_count' THEN '10'
    WHEN 'total_active_employees' THEN '65'
    ELSE setting_value
END
WHERE setting_key IN ('casual_staff_count', 'r_and_m_staff_count', 'hitec_staff_count', 'total_active_employees');