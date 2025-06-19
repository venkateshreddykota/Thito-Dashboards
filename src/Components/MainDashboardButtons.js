import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const MainDashboardButtons = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 shadow-xl rounded-lg max-w-sm w-full text-center min-h-[350px] flex flex-col justify-center">
        <CardContent>
          <div>
          <Typography variant="h4" component="h1" className="mb-6 font-bold text-gray-700">
            List Of Dashboard Buttons
          </Typography>
          </div>
          {/* Stack component ensures proper spacing between buttons */}
          <Stack spacing={3} alignItems="center">
            <Link to="/ThitoToAp" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "200px", py: 2, fontSize: "1.1rem", fontWeight: "bold" }}
              >
THITO TO AP
              </Button>
            </Link>
            <Link to="/SageToAp" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ width: "200px", py: 2, fontSize: "1.1rem", fontWeight: "bold" }}
              >
SAGE TO AP           
   </Button>

            </Link>
            {/* If more buttons are added, they will automatically have the same spacing */}
          </Stack>

        </CardContent>
      </Card>
    </div>
  );
};
export default MainDashboardButtons;