import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Card, CardContent, Typography, Grid, TextField, Table,
  TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper
} from "@mui/material";

const Dashboards = () => {
  const [data, setData] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash & 0x00ffffff).toString(16).padStart(6, "0")).toUpperCase()}`;
    return color;
  };

  const attributeMapping = {
    "Cash Back Benefit Payment Batch Run": "Cash Back Benefit Payments",
    "Claim Acceptance": "Claim Payments",
    "Balance Refund": "Balance Refund To Client",
    "ILP Full Surrender": "ILP Full Surrender Payments",
    "Amend Maturity Info": "Amendments Maturity Info Payments"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://bihlpsbo036.bihl.co.bw:2222/api/invoice-details/month");

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        const modifiedData = response.data.map((item) => ({
          id: item.id,
          supplierName: item.supplierName,
          eventDesc: attributeMapping[item.eventDesc] || item.eventDesc || "N/A",
          invoiceNumber: item.invoiceNumber,
          invoiceAmount: item.invoiceAmount,
          invoiceDate: item.invoiceDate,
          downloaded: item.downloaded
        }));

        setData(modifiedData);
        setFilteredChartData(modifiedData);
        setFilteredData(modifiedData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilter = () => {
    const filteredItems = data.filter((item) => {
      const invoiceDate = new Date(item.invoiceDate);
      return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
    });
    setFilteredChartData(filteredItems);
    setFilteredData(filteredItems);
    setSelectedAttribute(null);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredChartData(data);
    setFilteredData(data);
    setSelectedAttribute(null);
  };

  const attributeCounts = filteredChartData.reduce((acc, item) => {
    const attributeKey = item.eventDesc && item.eventDesc !== "N/A" ? item.eventDesc : "N/A";
    acc[attributeKey] = (acc[attributeKey] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(attributeCounts)
    .map(([key]) => {
      const sumAmount = filteredChartData
        .filter(({ eventDesc, invoiceAmount }) => eventDesc === key && invoiceAmount > 0)
        .reduce((acc, { invoiceAmount }) => acc + invoiceAmount, 0);

      return {
        name: key,
        value: parseFloat(sumAmount.toFixed(2)),
        color: generateColor(key)
      };
    })
    .filter(item => item.value > 0);

  const handlePieClick = ({ name }) => {
    setSelectedAttribute(name);
    setFilteredData(filteredChartData.filter(({ eventDesc }) => eventDesc === name));
  };

  const formatInternationalNumber = (amount) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ textAlign: "left", padding: "7px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Thito to AP Transactions
      </Typography>

      <Grid container spacing={2} justifyContent="center" style={{ marginBottom: "20px" }}>
        <Grid item>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={applyFilter}>
            Apply Filter
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={clearFilter}>
            Clear Filter
          </Button>
        </Grid>
      </Grid>

      {/* Scrollable Card */}
      <div style={{ overflowX: "auto" }}>
        <Card
          sx={{
            minWidth: 900, // Add this to enable horizontal scroll when needed
            maxWidth: 1200,
            margin: "auto",
            padding: "2px",
            textAlign: "center",
            borderRadius: "16px",
            background: "linear-gradient(white, white) padding-box, linear-gradient(45deg, #6a11cb, #2575fc, #00c6ff) border-box",
            border: "10px solid transparent",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <div style={{ width: "800", height: 700 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="380"
                    cy="280"
                    innerRadius={140}
                    outerRadius={200}
                    paddingAngle={1}
                    minAngle={5}
                    dataKey="value"
                    label={({ cx, cy, midAngle, outerRadius, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 20;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#000"
                          textAnchor={x > cx ? "start" : "end"}
                          fontSize={18} // Slightly reduced font size if needed
                        >
                          {formatInternationalNumber(value)}
                        </text>
                      );
                    }}
                    onClick={handlePieClick}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={entry.color}
                        stroke={entry.value < 500000 ? "#fff" : entry.color}
                        strokeWidth={entry.value < 500000 ? 2 : 1}
                      />
                    ))}
                  </Pie>

                  {/* Centered Label and Amount */}
                  <text
                    x="380"
                    y="280"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={16}
                    fontWeight="bold"
                    fill="#333"
                  >
                    Total Invoice Amount:
                  </text>
                  <text
                    x="380"
                    y="310"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={18}
                    fontWeight="bold"
                    fill="#333"
                  >
                    {formatInternationalNumber(
                      pieChartData.reduce((sum, entry) => sum + entry.value, 0)
                    )}
                  </text>

                  <Legend
                    layout={isMobile ? "horizontal" : "vertical"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    align={isMobile ? "center" : "right"}
                    wrapperStyle={{
                      fontSize: "20px", // 👈 Adjust this value as needed
                    }}
                  />
                  <Tooltip formatter={(value) => formatInternationalNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedAttribute && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h5" align="center">
            {`Details for : ${selectedAttribute}`}
          </Typography>

          {/* Scrollable Table */}
          <div style={{ overflowX: "auto" }}>
            <TableContainer
              component={Paper}
              sx={{
                minWidth: 900, // Add this to allow scroll if screen smaller
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: 2,
                marginTop: "20px",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="data table">
              <TableHead>
<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
<TableCell sx={{ fontWeight: "bold" }}>Supplier Name</TableCell>
<TableCell align="left" sx={{ fontWeight: "bold" }}>Invoice Number</TableCell>
<TableCell align="right" sx={{ fontWeight: "bold" }}>Invoice Amount</TableCell>
<TableCell align="center" sx={{ fontWeight: "bold" }}>Invoice Date</TableCell>
<TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
</TableRow>
</TableHead>
<TableBody>
                {filteredData.map((item, index) => (
<TableRow key={item.id || index}>
<TableCell>{item.supplierName}</TableCell>
<TableCell align="left">{item.invoiceNumber}</TableCell>
<TableCell align="right">{"X".repeat(item.invoiceAmount.toString().length)}</TableCell>
<TableCell align="center">{new Date(item.invoiceDate).toLocaleDateString()}</TableCell>
<TableCell align="center">{item.downloaded === 'Y' ? 'Success' : 'Pending'}</TableCell>
</TableRow>
                ))}
</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboards;
