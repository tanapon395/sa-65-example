import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { WatchVideoInterface } from "../interfaces/IWatchVideo";
import { GetWatchVideos } from "../services/HttpClientService";

function WatchVideos() {
  const [watchVideos, setWatchVideos] = useState<WatchVideoInterface[]>([]);

  useEffect(() => {
    getWatchVideos();
  }, []);

  const getWatchVideos = async () => {
    let res = await GetWatchVideos();
    if (res) {
      setWatchVideos(res);
    } 
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    {
      field: "Video",
      headerName: "วีดีโอ",
      width: 250,
      valueFormatter: (params) => params.value.Name,
    },
    {
      field: "Resolution",
      headerName: "ความละอียด",
      width: 150,
      valueFormatter: (params) => params.value.Value,
    },
    {
      field: "Playlist",
      headerName: "เพลย์ลิสต์",
      width: 150,
      valueFormatter: (params) => params.value.Title,
    },
    { field: "WatchedTime", headerName: "วันที่และเวลา", width: 250 },
  ];

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
              ข้อมูลการเข้าชมวีดีโอ
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/watch_video/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={watchVideos}
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

export default WatchVideos;
