from rasa_sdk.events import AllSlotsReset
from rasa_sdk.events import SlotSet
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
from typing import Any, Text, Dict, List

from pymongo import MongoClient
import certifi

import PyPDF2
import os
import re

class ActionFilterProducts(Action):
    def name(self):
        return "action_filter_products"

    def run(self, dispatcher, tracker, domain):
        # Lấy thông tin từ người dùng
        product_name = tracker.get_slot("product_name")
        category_name = tracker.get_slot("category_name")
        subcategory_name = tracker.get_slot("subcategory_name")
        plant_name = tracker.get_slot("plant_name")
        company_name = tracker.get_slot("company_name")

        # Kết nối MongoDB và lọc sản phẩm
        product_list = self.filter_products(product_name, category_name, subcategory_name, plant_name, company_name)

        if product_list:
            # Nếu có sản phẩm trong danh sách, gửi danh sách về cho người dùng
            for product in product_list:
                response = f"%,{product['_id']},{product['name']},{product['price']},{product['image']},%"
                dispatcher.utter_message(response)
        else:
            response = "Xin lỗi, không tìm thấy sản phẩm phù hợp với yêu cầu của bạn."
            dispatcher.utter_message(response)

        # Reset các slot sau khi đã tìm kiếm sản phẩm
        return [AllSlotsReset()]

    def filter_products(self, product_name, category_name, subcategory_name, plant_name, company_name):
        # Thực hiện truy vấn MongoDB để lọc sản phẩm
        client = MongoClient("mongodb+srv://admin:AdminDFShop@dfshop.4ybkevt.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=certifi.where())
        db = client["test"]

        if product_name:
            product_name = re.sub(r'[^\w\s]', '', product_name)
        if category_name:
            category_name = re.sub(r'[^\w\s]', '', category_name)
        if subcategory_name:
            subcategory_name = re.sub(r'[^\w\s]', '', subcategory_name)
        if plant_name:
            plant_name = re.sub(r'[^\w\s]', '', plant_name)
        if company_name:
            company_name = re.sub(r'[^\w\s]', '', company_name)

        # Xây dựng truy vấn dựa trên các thông tin từ người dùng
        query = {}
        if product_name:
            query["name"] = {"$regex": ".*" + product_name + ".*", "$options": "i"}
        if category_name:
            query["category.name"] = {"$regex": ".*" + category_name + ".*", "$options": "i"}
        if subcategory_name:
            query["subcategory"] = {"$elemMatch": {"name": {"$regex": ".*" + subcategory_name + ".*", "$options": "i"}}}
        if plant_name:
            query["description.instructions"] = {"$elemMatch": {"plants.name": {"$regex": ".*" + plant_name + ".*", "$options": "i"}}}
        if company_name:
            query["company"] = {"$regex": ".*" + company_name + ".*", "$options": "i"}

        # Lọc sản phẩm
        product_list = list(db.products.find(query, {"_id": 1, "name": 1, "price": 1, "image": 1}))

        client.close()  # Đóng kết nối sau khi sử dụng
        return product_list


class ActionSearchInfo(Action):
    def name(self):
        return "action_search_info"

    def run(self, dispatcher, tracker, domain):
        # Lấy thông tin từ slot
        disease_name = tracker.get_slot("disease_name")
        worm_name = tracker.get_slot("worm_name")

        if disease_name and worm_name:
            # Tìm thông tin về bệnh hại
            disease_file_path = r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_disease.pdf"
            disease_info = self.search_in_pdf(disease_file_path, disease_name)
            disease_response = f"{disease_info}" if disease_info else f"Không tìm thấy thông tin về bệnh hại {disease_name}."

            # Tìm thông tin về sâu hại
            worm_file_path = r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_worm.pdf"
            worm_info = self.search_in_pdf(worm_file_path, worm_name)
            worm_response = f"{worm_info}" if worm_info else f"Không tìm thấy thông tin về sâu hại {worm_name}."
            print(disease_response)
            print(worm_response)
            # Phản hồi cả hai thông tin
            response = f"{disease_response}\n\n{worm_response}"
        elif disease_name:
            file_path = r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_disease.pdf"
            info = self.search_in_pdf(file_path, disease_name)
            response = f"{info}" if info else f"Không tìm thấy thông tin về bệnh hại {disease_name}."
        elif worm_name:
            file_path = r"C:\Users\asus\OneDrive\Desktop\ex\PYTHON\rasa_sv\rasamdl\actions\all_worm.pdf"
            info = self.search_in_pdf(file_path, worm_name)
            response = f"{info}" if info else f"Không tìm thấy thông tin về sâu hại {worm_name}."
        else:
            response = "Xin lỗi, không có thông tin nào được tìm thấy."

        dispatcher.utter_message(response)
        return []

    def search_info(self, pdf_content, name):
        # Tìm vị trí của tên bệnh trong nội dung PDF
        match = re.search(r'\d+\.\s*.*?' + re.escape(name) + r'\b', pdf_content, re.IGNORECASE)
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
            return disease_info
        else:
            return None

    def search_in_pdf(self, file_path, search_term):
        text = ""
        if os.path.exists(file_path):
            with open(file_path, "rb") as f:
                pdf_reader = PyPDF2.PdfReader(f)
                num_pages = pdf_reader.pages
                for page_num in range(len(num_pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text()
            # Tìm kiếm thông tin trong văn bản trích xuất từ PDF
            return self.search_info(text, search_term)

class SetCategoryAction(Action):
    def name(self):
        return "action_set_category"

    def run(self, dispatcher, tracker, domain):
        disease_name = tracker.get_slot("disease_name")
        worm_name = tracker.get_slot("worm_name")

        if disease_name:
            return [SlotSet("subcategory_name", disease_name), SlotSet("disease_name", None)]
        elif worm_name:
            return [SlotSet("subcategory_name", worm_name), SlotSet("worm_name", None)]
        else:
            return []

class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(template="utter_please_rephrase")
        return [UserUtteranceReverted()]