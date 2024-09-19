import re
import os
import PyPDF2

pdf_content = ""
if os.path.exists(r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_worm.pdf"):
    with open(r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_worm.pdf", "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        num_pages = pdf_reader.pages
        for page_num in range(len(num_pages)):
            page = pdf_reader.pages[page_num]
            pdf_content += page.extract_text()
name = "sâu vẽ bùa"
match = re.search(r'\d+\.\s*.*?' + re.escape(name) + r'\b', pdf_content, re.IGNORECASE)
print(match)
if match:
    # Tìm vị trí của phần thông tin về bệnh trước đó
    disease_start_index = match.start()
    # Tìm vị trí của phần thông tin về bệnh kế tiếp
    next_disease_match = re.search(r'\d+\.\s*', pdf_content[match.end():])
    if next_disease_match:
        disease_end_index = match.end() + next_disease_match.start() - 1
    else:
        disease_end_index = len(pdf_content)
    # Trích xuất phần thông tin về bệnh từ vị trí bắt đầu đến vị trí kết thúc
    disease_info = pdf_content[disease_start_index + len(re.match(r'\d+\.\s*', pdf_content[disease_start_index:]).group()):disease_end_index].strip()
    print(disease_info)