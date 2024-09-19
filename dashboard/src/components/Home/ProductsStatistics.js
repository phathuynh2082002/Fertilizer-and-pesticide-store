import React, { useState, memo, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { ResponsiveContainer, Sector, PieChart, Pie } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const CalculateTotalProductSale = (orders, isCategory) => {
  if (orders.length === 0) {
    return null;
  }

  const productQuantities = {};

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const productName = isCategory ? item.category : item.name;

      productQuantities[productName] =
        (productQuantities[productName] || 0) + item.qty;
    });
  });

  const productList = Object.keys(productQuantities).map((productName) => ({
    name: productName,
    totalQuantity: productQuantities[productName],
  }));

  return productList;
};

const CalculateTotalProductInStock = (products, isCategory) => {
  if (products.length === 0) {
    return null;
  }

  const productInStocks = {};

  products.forEach((product) => {
    const productName = isCategory ? product.category.name : product.name;
    productInStocks[productName] = product.countInStock;
  });

  const productList = Object.keys(productInStocks).map((productName) => ({
    name: productName,
    totalQuantity: productInStocks[productName],
  }));

  return productList;
};

const ProductStatistics = memo((props) => {
  const { orders, products } = props;
  const years = [
    ...new Set(orders.map((order) => new Date(order.createdAt).getFullYear())),
  ];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6);
  const initialWeekOrders = orders.filter(
    (order) =>
      new Date(order.createdAt) >= startOfWeek &&
      new Date(order.createdAt) <= endOfWeek
  );

  const [startDate, setStartDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(initialWeekOrders);
  const [isCategory, setIsCategory] = useState(false);
  const [result, setResult] = useState([]);
  const [resultProduct, setResultProduct] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handleFilter = () => {
    if (startDate) {
      const filteredByDate = orders.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === startDate.toDateString()
      );

      setFilteredOrders(filteredByDate);
    } else {
      const filteredByMonth = selectedMonth
        ? orders.filter(
            (order) =>
              new Date(order.createdAt).getMonth() + 1 === selectedMonth
          )
        : orders;

      const filteredByYear = selectedYear
        ? filteredByMonth.filter(
            (order) => new Date(order.createdAt).getFullYear() === selectedYear
          )
        : selectedMonth
        ? filteredByMonth.filter(
            (order) =>
              new Date(order.createdAt).getFullYear() ===
              new Date().getFullYear()
          )
        : initialWeekOrders;

      setFilteredOrders(filteredByYear);
    }
  };

  useEffect(() => {
    setResult(CalculateTotalProductSale(filteredOrders, isCategory));
    setResultProduct(CalculateTotalProductInStock(products, isCategory));
  }, [filteredOrders, isCategory]);

  return (
    <>
      <div className="container pt-4 pb-4">
        <h2 className="mb-4">Thống Kế Bán Hàng</h2>
        <div className="statistic-filter">
          <div className="statistic-filter-item">
            <label className="label-filter">Ngày:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              isClearable={true}
            />
          </div>
          <div className="statistic-filter-item">
            <label className="label-filter">Tháng:</label>
            <Select
              options={[...Array(12)].map((_, index) => ({
                value: index + 1,
                label: `Tháng ${index + 1}`,
              }))}
              isClearable
              onChange={(selectedOption) =>
                setSelectedMonth(selectedOption?.value)
              }
            />
          </div>
          <div className="statistic-filter-item">
            <label className="label-filter">Năm:</label>
            <Select
              options={years.map((year) => ({
                value: year,
                label: `${year}`,
              }))}
              isClearable
              onChange={(selectedOption) =>
                setSelectedYear(selectedOption?.value)
              }
            />
          </div>
          <div
            onClick={() => setIsCategory(!isCategory)}
            className={`${
              !isCategory ? "btn-chose-category" : "btn-is-category"
            }`}
          >
            Loại Sản Phẩm
          </div>
          <button onClick={handleFilter} className="btn-filter">
            Lọc Hóa Đơn
          </button>
          <button
            onClick={() => setFilteredOrders(initialWeekOrders)}
            className="btn-filter"
          >
            Gần Đây
          </button>
        </div>
      </div>
      <div className="two-chart">
        <div className="two-chart-container">
          {result ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart width={400} height={400}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={result}
                  cx="50%"
                  cy="50%"
                  innerRadius={120}
                  outerRadius={170}
                  fill="#1df324"
                  dataKey="totalQuantity"
                  onMouseEnter={onPieEnter}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <h3 className="no-chart pb-4">Không Có Hóa Đơn</h3>
          )}
          <div>
            <h3>Sản Phẩm Bán </h3>
          </div>
        </div>
        <div className="two-chart-container">
          <ResponsiveContainer width="100%" height="90%">
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={resultProduct}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={170}
                fill="#08f1d6dd"
                dataKey="totalQuantity"
                onMouseEnter={onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
          <div>
            <h3>Sản Phẩm Tồn </h3>
          </div>
        </div>
      </div>
    </>
  );
});

export default ProductStatistics;
