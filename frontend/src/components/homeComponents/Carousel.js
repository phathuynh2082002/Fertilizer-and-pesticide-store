


const Carousel = () => {
    return (
        <div id="carouselExampleRide" class="carousel slide mb-5" data-bs-ride="true">
        <div class="carousel-inner">
            <div class="carousel-item active">
            <img src="https://toplist.vn/images/800px/tap-doan-loc-troi-783458.jpg" class="d-block w-100 h-100" alt="..."/>
            </div>
            <div class="carousel-item">
            <img src="https://thietkeinan.truongthinh.info/hoanghung/32/images/Logo/145-logo-bao-ve-thuc-pham.jpg" class="d-block w-100 h-100" alt="..."/>
            </div>
            <div class="carousel-item">
            <img src="https://toplist.vn/images/800px/cong-ty-tnhh-vat-tu-bao-ve-thuc-vat-phuong-mai-176897.jpg" class="d-block w-100 h-100" alt="..."/>
            </div>
            <div class="carousel-item">
            <img src="https://baconco.com.vn/media/com_reditem/images/customfield/category/91/90ef91b268bfff90c14835983d493919c5acfdd1.jpg" class="d-block w-100 h-100" alt="..."/>
            </div>
            <div class="carousel-item">
            <img src="https://danviet.mediacdn.vn/296231569849192448/2022/10/4/1-16648386971621900412555.png" class="d-block w-100 h-100" alt="..."/>
            </div>
            <div class="carousel-item">
            <img src="https://dungcunongnghiep.vn/files/assets/su_dung_phan_huu_co_ket_hop_ph_hoa_hoc.jpg" class="d-block w-100 h-100" alt="..."/>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
        </div>
    );
}

export default Carousel;