import React from "react";
import Category from "./Category";
import Subcategory from "./Subcategory";
import Plants from "./Plants";

const MainCategories = () => {
  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Loại Sản Phẩm</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-5 border-bottom">
            <div className="col-md-12 col-lg-4">
              <Category />
            </div>
            <div className="col-md-12 col-lg-8">
              <Subcategory />
            </div>
          </div>
          <div className="row mb-5">
            <div className="col-md-12 col-lg-4">
              <Plants />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
