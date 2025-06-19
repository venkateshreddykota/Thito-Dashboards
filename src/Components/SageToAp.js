import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Card, CardContent, Typography, Grid, TextField, Table,
  TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";

const Sage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash & 0x00ffffff).toString(16).padStart(6, "0")).toUpperCase()}`;
    return color;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://bihlpsbo036.bihl.co.bw:2222/api/invoice-details/sage");

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API");
        }

        const modifiedData = response.data.map((item) => ({
          id: item.invoiceNum,
          payee: item.payee,
          company: item.company,
          invoiceAmount: item.invoiceAmount,
          source: item.source,
          invoiceDate: item.invoiceDate,
        }));

        setData(modifiedData);
        setFilteredChartData(modifiedData);
        setFilteredData([]);
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

  const uniqueCompanies = [...new Set(data.map((item) => item.company))];

  const applyFilter = () => {
    let filteredItems = data;

    if (startDate && endDate) {
      filteredItems = filteredItems.filter((item) => {
        const invoiceDate = new Date(item.invoiceDate);
        return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
      });
    }

    if (selectedCompany) {
      filteredItems = filteredItems.filter((item) => item.company === selectedCompany);
    }

    setFilteredChartData(filteredItems);
    setFilteredData([]);
    setShowTable(false);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCompany("");
    setFilteredChartData(data);
    setFilteredData([]);
    setShowTable(false);
  };

  const attributeCounts = filteredChartData.reduce((acc, item) => {
    const attributeKey = item.company || "N/A";
    acc[attributeKey] = (acc[attributeKey] || 0) + 1;
    return acc;
  }, {});
  
  const pieChartData = Object.keys(attributeCounts)
  .map((key) => {
    const sumAmount = filteredChartData
      .filter((item) => item.company === key)
      .reduce((acc, item) => acc + item.invoiceAmount, 0);

    return {
      name: key,
      value: parseFloat(sumAmount.toFixed(2)),
      color: generateColor(key)
    };
  })
  .filter((entry) => entry.value > 0); // ✅ Exclude entries with 0 value




  // ✅ International formatting instead of Indian
  const formatInternationalNumber = (amount) => {
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePieClick = (_, index) => {
    const company = pieChartData[index]?.name;
    if (!company) return;
    const filteredItems = filteredChartData.filter((item) => item.company === company);
    setFilteredData(filteredItems);
    setShowTable(true);
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ textAlign: "left", padding: "7px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Sage Invoice Transactions
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
          <FormControl style={{ minWidth: 200 }} variant="outlined">
            <InputLabel id="company-label">Company</InputLabel>
            <Select
              labelId="company-label"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              displayEmpty
              label="Company"
            >
              <MenuItem value=""></MenuItem>
              {uniqueCompanies.map((company, index) => (
                <MenuItem key={index} value={company}>
                  {company}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <div style={{ width: "800", height: 700}}>

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
          fontSize={18}// Slightly reduced font size if needed
        >
          {formatInternationalNumber(value)}
        </text>
      );
    }}
    onClick={handlePieClick}
  >
    {pieChartData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.color}
        stroke={entry.value < 500000 ? "#fff" : entry.color}
        strokeWidth={entry.value < 500000 ? 2 : 1}
      />
    ))}
  </Pie>

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
    {formatInternationalNumber(pieChartData.reduce((acc, item) => acc + item.value, 0))}
  </text>

          <Legend
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}

              wrapperStyle={{
                fontSize: "16px", // 👈 Adjust this value as needed
              }}
            />


  <Tooltip formatter={(value) => formatInternationalNumber(value)} />
</PieChart>
</ResponsiveContainer>
</div>
</CardContent>
      </Card>
</div>
      {showTable && filteredData.length > 0 && (
        <div>
          <Typography variant="h5" gutterBottom align="center" style={{ marginTop: "20px" }}>
            Transactions for : {filteredData[0].company}
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
                <TableRow>
                  <TableCell><b>Invoice Number</b></TableCell>
                  <TableCell><b>Payee</b></TableCell>
                  <TableCell align="center"><b>Company</b></TableCell>
                  <TableCell align="right"><b>Invoice Amount</b></TableCell>
                  <TableCell align="center"><b>Source</b></TableCell>
                  <TableCell align="center"><b>Invoice Date</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.payee}</TableCell>
                    <TableCell align="center">{item.company}</TableCell>
                    <TableCell align="right">{"X".repeat(item.invoiceAmount.toString().length)}</TableCell>
                    <TableCell align="center">{item.source}</TableCell>
                    <TableCell align="center">{item.invoiceDate}</TableCell>
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
export default Sage;