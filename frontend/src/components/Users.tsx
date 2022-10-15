import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { UsersInterface } from "../interfaces/IUser";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetUsers } from "../services/HttpClientService";
function Users() {
  const [users, setUsers] = useState<UsersInterface[]>([]);

  const getUsers = async () => {
    let res = await GetUsers();
    if (res) {
      setUsers(res);
    }
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 100 },
    { field: "Name", headerName: "ชื่อ - สกุล", width: 300 },
    { field: "Email", headerName: "อีเมล", width: 400 },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลสมาชิก
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/user/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={users}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Users;
