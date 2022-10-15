import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { PlaylistsInterface } from "../interfaces/IPlaylist";
import { ResolutionsInterface } from "../interfaces/IResolution";
import { VideosInterface } from "../interfaces/IVideo";
import { WatchVideoInterface } from "../interfaces/IWatchVideo";

import {
  GetVideos,
  GetResolution,
  GetPlaylistByUID,
  WatchVideos,
} from "../services/HttpClientService";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function WatchVideoCreate() {
  const [videos, setVideos] = useState<VideosInterface[]>([]);
  const [resolutions, setResolutions] = useState<ResolutionsInterface[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistsInterface>();
  const [watchVideo, setWatchVideo] = useState<WatchVideoInterface>({
    WatchedTime: new Date(),
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof watchVideo;
    setWatchVideo({
      ...watchVideo,
      [name]: event.target.value,
    });
  };

  const getVideos = async () => {
    let res = await GetVideos();
    if (res) {
      setVideos(res);
    }
  };

  const getResolution = async () => {
    let res = await GetResolution();
    if (res) {
      setResolutions(res);
    }
  };

  const getPlaylist = async () => {
    let res = await GetPlaylistByUID();
    watchVideo.PlaylistID = res.ID;
    if (res) {
      setPlaylists(res);
    }
  };

  useEffect(() => {
    getVideos();
    getResolution();
    getPlaylist();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    let data = {
      ResolutionID: convertType(watchVideo.ResolutionID),
      PlaylistID: convertType(watchVideo.PlaylistID),
      VideoID: convertType(watchVideo.VideoID),
      WatchedTime: watchVideo.WatchedTime,
    };

    let res = await WatchVideos(data);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }

  return (
    <Container maxWidth="md">
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Paper>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกการเข้าชมวีดีโอ
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วีดีโอ</p>
              <Select
                native
                value={watchVideo.VideoID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "VideoID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกวีดีโอ
                </option>
                {videos.map((item: VideosInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ความละอียด</p>
              <Select
                native
                value={watchVideo.ResolutionID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "ResolutionID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกความละอียด
                </option>
                {resolutions.map((item: ResolutionsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Value}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>เพลย์ลิสต์</p>
              <Select
                native
                value={watchVideo.PlaylistID + ""}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "PlaylistID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกเพลย์ลิสต์
                </option>
                <option value={playlists?.ID} key={playlists?.ID}>
                  {playlists?.Title}
                </option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={watchVideo.WatchedTime}
                  onChange={(newValue) => {
                    setWatchVideo({
                      ...watchVideo,
                      WatchedTime: newValue,
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/watch_videos"
              variant="contained"
              color="inherit"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default WatchVideoCreate;
