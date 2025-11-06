-- Update factory assignments for all employees
-- First, set all employees to Hitec
UPDATE employees SET factory = 'Hitec';

-- Then update specific employees to R & M Factory
UPDATE employees 
SET factory = 'R & M Factory'
WHERE (first_name = 'KOLOSA' AND last_name = 'MAJANGAZA') OR
      (first_name = 'ZINTLE' AND last_name = 'JAKAVULA') OR
      (first_name = 'XOLA' AND last_name = 'MAY') OR
      (first_name = 'SAKHUMZI' AND last_name = 'MABINDISA') OR
      (first_name = 'APIWE' AND last_name = 'NXEBA') OR
      (first_name = 'BULISWA' AND last_name = 'TSOBINI') OR
      (first_name = 'AYABONGA' AND last_name = 'PONTI') OR
      (first_name = 'SANDISIWE' AND last_name = 'MUKWA') OR
      (first_name = 'NOMFANELO' AND last_name = 'MZWELI') OR
      (first_name = 'SIZPHIWE' AND last_name = 'DANGAZELE') OR
      (first_name = 'PHELOKAZI' AND last_name = 'NGCWEMBE') OR
      (first_name = 'VIVIAN' AND last_name = 'BHOBHO') OR
      (first_name = 'BUNTU' AND last_name = 'PIKOKO') OR
      (first_name = 'NASIPHE' AND last_name = 'MPONDO') OR
      (first_name = 'BUSISWA' AND last_name = 'NTLANINGE') OR
      (first_name = 'SIYAMTHANDA' AND last_name = 'NGWENYA') OR
      (first_name = 'ANELISIWE' AND last_name = 'JONI') OR
      (first_name = 'LUSANDA' AND last_name = 'MZUKWA') OR
      (first_name = 'SINALO' AND last_name = 'MKWELO') OR
      (first_name = 'LUMKA' AND last_name = 'NTLIKITHI') OR
      (first_name = 'MTHUTHUZELI' AND last_name = 'MNQENQELE') OR
      (first_name = 'ZOLELWA' AND last_name = 'MPEPHO') OR
      (first_name = 'LOVENESS' AND last_name = 'UNKNOWN') OR
      (first_name = 'SISANDA' AND last_name = 'SIHLANGULA') OR
      (first_name = 'NOSIPHE' AND last_name = 'SIZIBA') OR
      (first_name = 'ANDISWA' AND last_name = 'ZENZISI') OR
      (first_name = 'AMANDA' AND last_name = 'SOLWANDLE') OR
      (first_name = 'ASIVE' AND last_name = 'QWABE') OR
      (first_name = 'SIBONGILE' AND last_name = 'MBASA') OR
      (first_name = 'ZIOLISWA' AND last_name = 'NTATYANA') OR
      (first_name = 'PAMELLA' AND last_name = 'NKONJANE') OR
      (first_name = 'FEZEKA' AND last_name = 'ZWAKALA') OR
      (first_name = 'SANELE' AND last_name = 'SIRAYI') OR
      (first_name = 'ANATHI' AND last_name = 'NKONGO') OR
      (first_name = 'ZIKHONA' AND last_name = 'SINONI') OR
      (first_name = 'ASANDA' AND last_name = 'MAHLANYANA') OR
      (first_name = 'THOMAS' AND last_name = 'NGXAMILE') OR
      (first_name = 'LUNTU' AND last_name = 'NAYIPHI') OR
      (first_name = 'SANELE' AND last_name = 'MHE') OR
      (first_name = 'NOSIPHIWO' AND last_name = 'YENANI') OR
      (first_name = 'SISIPHO' AND last_name = 'DLILANGA') OR
      (first_name = 'MAKEDISI' AND last_name = 'NOZIZWE') OR
      (first_name = 'BONGOLWETHU' AND last_name = 'MNGENI') OR
      (first_name = 'TEMBA' AND last_name = 'LANDE') OR
      (first_name = 'RESTY' AND last_name = 'SALENGA') OR
      (first_name = 'ELIJAH' AND last_name = 'MUZUNGA');