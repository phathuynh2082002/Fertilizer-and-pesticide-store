import React, { useState, memo, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import html2pdf from "html2pdf.js";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

const calculateDailyRevenue = (dailyOrders) => {
  if (dailyOrders.length === 0) {
    return null;
  }

  const paidOrders = dailyOrders.filter((order) => order.isPaid);
  const unpaidOrders = dailyOrders.filter((order) => !order.isPaid);

  const paidTotalRevenue = paidOrders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  const unpaidTotalRevenue = unpaidOrders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  const firstOrderDate = new Date(dailyOrders[0].createdAt);
  const day = firstOrderDate.toLocaleDateString("en-US");

  return [{ day: day, Paid: paidTotalRevenue, UnPaid: unpaidTotalRevenue }];
};

const calculateWeeklyRevenue = (weeklyOrders) => {
  if (weeklyOrders.length === 0) {
    return null;
  }

  const paidOrders = weeklyOrders.filter((order) => order.isPaid);
  const unpaidOrders = weeklyOrders.filter((order) => !order.isPaid);

  const firstOrder = weeklyOrders[0];
  const weekStartDate = new Date(firstOrder.createdAt);
  const firstDayOfWeek = weekStartDate.getDate() - weekStartDate.getDay();

  const dailyRevenueList = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(firstDayOfWeek + index);

    const paid = paidOrders.filter(
      (order) =>
        new Date(order.createdAt).toISOString().split("T")[0] ===
        currentDate.toISOString().split("T")[0]
    );

    const PaidTotalRevenue = paid.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    const unpaid = unpaidOrders.filter(
      (order) =>
        new Date(order.createdAt).toISOString().split("T")[0] ===
        currentDate.toISOString().split("T")[0]
    );

    const UnPaidTotalRevenue = unpaid.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return {
      day: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
      Paid: PaidTotalRevenue,
      UnPaid: UnPaidTotalRevenue,
    };
  });

  return dailyRevenueList;
};

const calculateMonthlyRevenue = (monthlyOrders) => {
  if (monthlyOrders.length === 0) {
    return null;
  }

  const paidOrders = monthlyOrders.filter((order) => order.isPaid);
  const unpaidOrders = monthlyOrders.filter((order) => !order.isPaid);

  const firstOrder = monthlyOrders[0];
  const monthStartDate = new Date(firstOrder.createdAt);
  const lastDayOfMonth = new Date(
    monthStartDate.getFullYear(),
    monthStartDate.getMonth() + 1,
    0
  ).getDate();

  const dailyRevenueList = Array.from(
    { length: lastDayOfMonth },
    (_, index) => {
      const currentDate = new Date(monthStartDate);
      currentDate.setDate(index + 1);

      const paid = paidOrders.filter(
        (order) =>
          new Date(order.createdAt).toISOString().split("T")[0] ===
          currentDate.toISOString().split("T")[0]
      );

      const PaidTotalRevenue = paid.reduce(
        (total, order) => total + order.totalPrice,
        0
      );

      const unpaid = unpaidOrders.filter(
        (order) =>
          new Date(order.createdAt).toISOString().split("T")[0] ===
          currentDate.toISOString().split("T")[0]
      );

      const UnPaidTotalRevenue = unpaid.reduce(
        (total, order) => total + order.totalPrice,
        0
      );

      return {
        day: currentDate.getDate(),
        Paid: PaidTotalRevenue,
        UnPaid: UnPaidTotalRevenue,
      };
    }
  );

  return dailyRevenueList;
};

const calculateYearlyRevenue = (yearlyOrders) => {
  if (yearlyOrders.length === 0) {
    return null;
  }

  const paidOrders = yearlyOrders.filter((order) => order.isPaid);
  const unpaidOrders = yearlyOrders.filter((order) => !order.isPaid);

  const monthlyRevenueList = Array.from({ length: 12 }, (_, index) => {
    const currentMonth = index + 1;

    const paid = paidOrders.filter(
      (order) => new Date(order.createdAt).getMonth() + 1 === currentMonth
    );

    const PaidTotalRevenue = paid.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    const unpaid = unpaidOrders.filter(
      (order) => new Date(order.createdAt).getMonth() + 1 === currentMonth
    );

    const UnPaidTotalRevenue = unpaid.reduce(
      (total, order) => total + order.totalPrice,
      0
    );

    return {
      day: currentMonth,
      Paid: PaidTotalRevenue,
      UnPaid: UnPaidTotalRevenue,
    };
  });

  return monthlyRevenueList;
};

const SaleStatistics = memo((props) => {
  const { orders } = props;
  const years = [
    ...new Set(orders.map((order) => new Date(order.createdAt).getFullYear())),
  ];
  const today = new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() - 1);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6);

  const initialWeekOrders = orders.filter(
    (order) =>
      new Date(order.createdAt) >= startOfWeek &&
      new Date(order.createdAt) <= endOfWeek
  );

  const [startDate, setStartDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(initialWeekOrders);
  const [reportName, setReportName] = useState("");
  const [result, setResult] = useState([]);

  const handleFilter = () => {
    setSelectedWeek(false);

    let name = "Báo cáo doanh thu sản phẩm theo ";

    if (startDate) {
      name += ` ngày ${startDate.toLocaleDateString("en-US")}`;
    } else if (selectedMonth) {
      name += ` tháng ${selectedMonth} năm ${
        selectedYear ? selectedYear : new Date().getFullYear()
      }`;
    } else if (selectedYear) {
      name += ` năm ${selectedYear}`;
    }

    setReportName(name);

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
        : null;

      setFilteredOrders(filteredByYear);
    }
  };

  const handleFilterWeek = () => {
    setStartDate(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setFilteredOrders(initialWeekOrders);
    setSelectedWeek(true);
    setReportName("Báo cáo doanh thu sản phẩm theo tuần gần nhất");
    console.log(reportName);
  };

  const exportToPDF = () => {
    const chartContainer = document.querySelector(".chart");
    const options = {
      filename: "bao_cao_doanh_thu.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(chartContainer).set(options).save();
  };

  useEffect(() => {
    if (startDate) {
      setResult(calculateDailyRevenue(filteredOrders));
    } else if (!startDate && selectedMonth) {
      setResult(calculateMonthlyRevenue(filteredOrders));
    } else if (!startDate && !selectedMonth && selectedYear) {
      setResult(calculateYearlyRevenue(filteredOrders));
    } else if (selectedWeek) {
      setResult(calculateWeeklyRevenue(filteredOrders));
    }
  }, [filteredOrders]);

  return (
    <>
    <div className="d-flex flex-column">
      <div className="container pt-4 pb-4">
        <h2 className="mb-4">Thống Kế Doanh Thu</h2>
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
          <button onClick={handleFilter} className="btn-filter">
            Lọc Hóa Đơn
          </button>
          <button onClick={handleFilterWeek} className="btn-filter">
            Gần Đây
          </button>
        </div>
      </div>
      {result ? (
        <div className="chart">
          <h2 className="mb-4 text-center mx-auto">{reportName}</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                width={500}
                height={400}
                data={result}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="Paid"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="#1df324" stroke="blue" />}
                />
                <Bar
                  dataKey="UnPaid"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="#16d4f1" stroke="green" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <h3 className="no-chart pb-4">Không Có Hóa Đơn</h3>
      )}
      <button onClick={exportToPDF} className="export-pdf-button">
        Xuất Báo Cáo PDF
      </button>
      </div>
    </>
  );
});

export default SaleStatistics;
