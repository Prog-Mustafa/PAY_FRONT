import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import API from "../../api";
import AddDep from "../../components/addDep/addDep";
import UpdateDep from "../../components/updateDep/updateDep";
import Snackbar from "@mui/material/Snackbar";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const TableAxios = (props) => {
  const [deps, setDeps] = useState([]);
  const [id, setID] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const handleOpenUpdateForm = () => setOpenUpdateForm(true);
  const handleCloseUpdateForm = () => {
    setOpenUpdateForm(false);
  };
  const myrole = localStorage.getItem("account_type");
  const isSuper = myrole === "SUPER";
  const isAdmin = myrole === "ADMIN";
  const [term, setTerm] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleToggle = (state) => {
    setOpen(state);
  };

  const getData = async (pageNumber, pageSize) => {
    handleToggle(true)
    let url = `dep/search?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    if (term !== "") url += `&term=${term}`;
    await API.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setDeps(data.allDeps);
        setCount(data.totalCount);
        handleToggle(false)
      })
      .catch((err) => {
        setError(err);
        handleToggle(false)
        props.logout();
      });
  };

  const DeleteByID = (id) => {
    API.delete("dep/" + id, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        console.log(response);
        getData(0, 10);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleChangeTerm = (e) => {
    setTerm(e.target.value);
  };

  const updateUserByID = async (id) => {
    setID(id);
    handleOpenUpdateForm();
  };

  useEffect(() => {
    getData(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getData(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const components = {
    icons: {
      SearchIcon: SearchIcon,
      PrintIcon: LocalPrintshopOutlinedIcon,
      DownloadIcon: DownloadOutlinedIcon,
      ViewColumnIcon: ViewColumnOutlinedIcon,
    },
  };

  const columns = [
    {
      name: "id",
      label: "#",
      options: {
        filter: false,
        Sort: false,
        customHeadRender: (columnMeta, updateDirection) =>
          columnMeta.display ? (
            <th
              key={columnMeta.label}
              onClick={() => updateDirection(2)}
              style={{ cursor: "pointer" }}
              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
              scope="col"
            >
              {columnMeta.label}
            </th>
          ) : null,
      },
    },
    {
      name: "name",
      label: "الاسم",
      options: {
        filter: false,
        Sort: false,
        customHeadRender: (columnMeta, updateDirection) =>
          columnMeta.display ? (
            <th
              key={columnMeta.label}
              onClick={() => updateDirection(2)}
              style={{ cursor: "pointer" }}
              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
              scope="col"
            >
              {columnMeta.label}
            </th>
          ) : null,
      },
    },
    {
      name: "logo",
      label: "الشعار",
      options: {
        filter: false,
        Sort: false,
        customHeadRender: (columnMeta, updateDirection) =>
          columnMeta.display ? (
            <th
              key={columnMeta.label}
              onClick={() => updateDirection(2)}
              style={{ cursor: "pointer" }}
              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
              scope="col"
            >
              {columnMeta.label}
            </th>
          ) : null,
        display: false,
        customBodyRender: (value) => {
          // console.log(users[index])
          return (
            <>
              {value !== "" ? (
                <img
                  src={value}
                  style={{ maxWidth: 90, mr: 150, ml: 150 }}
                  alt="logo"
                />
              ) : null}
            </>
          );
        },
      },
    },
    {
      label: "الاوامر",
      name: "id",
      options: {
        filter: false,
        Sort: false,
        print: false,
        download: false,
        customHeadRender: (columnMeta, updateDirection) =>
          columnMeta.display ? (
            <th
              key={columnMeta.label}
              onClick={() => updateDirection(2)}
              style={{ cursor: "pointer" }}
              className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
              scope="col"
            >
              {columnMeta.label}
            </th>
          ) : null,
        customBodyRenderLite: (index) => {
          // console.log(users[index])
          return (
            <>
              <IconButton type="submit"
                variant="outlined"
                size="small"
                disableElevation
                disabled={deps[index].role === "SUPER" || !(isAdmin || isSuper) || deps[index].name === "ADMINISTRATOR"}
                sx={{ mt: 3, mb: 2, ml: 1 }}
                onClick={() => {
                  updateUserByID(deps[index].id);
                }} title="تحديث">
                <BorderColorIcon />
              </IconButton>
              <IconButton type="submit"
                variant="outlined"
                size="small"
                color="error"
                disableElevation
                disabled={deps[index].role === "SUPER" || !(isAdmin || isSuper) || deps[index].name === "ADMINISTRATOR"}
                sx={{ mt: 3, mb: 2, ml: 1, mr: "auto" }}
                onClick={() => {
                  DeleteByID(deps[index].id);
                }} title="حذف">
                <DeleteIcon />
              </IconButton>
            </>
          );
        },
        setCellProps: () => {
          return { ml: 100 };
        },
      },
    },
  ];

  const options = {
    serverSide: true,
    count: count,
    filter: false,
    search: false,
    responsive: "standard",
    elevation: 1,
    storageKey: "deps",
    selectableRowsHideCheckboxes: true,
    onDownload: (buildHead, buildBody, columns, data) => {
      return "\uFEFF" + buildHead(columns) + buildBody(data);
    },
    onTableChange: (action, tableState) => {
      // console.log(action, tableState);

      // a developer could react to change on an action basis or
      // examine the state as a whole and do whatever they want

      // console.log(tableState.page, tableState.rowsPerPage)
      switch (action) {
        case "changePage":
          getData(tableState.page, tableState.rowsPerPage);
          break;
        case "changeRowsPerPage":
          getData(tableState.page, tableState.rowsPerPage);
          break;
        default:
          break;
      }
    },
  };

  return (
    <>
      <Paper sx={{ overflow: 'hidden' }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: 'block' }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  value={term}
                  onChange={handleChangeTerm}
                  placeholder="...بحث"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: 'default' },
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item>
                <IconButton type="submit"
                  size="small"
                  variant="contained" sx={{ mr: 1 }} disabled={!(isSuper || isAdmin)}
                  onClick={handleOpenAddForm} title="اضافة قسم جديد">
                  <AddIcon />
                </IconButton>
                <AddDep
                  {...{
                    getData,
                    setError,
                    openAddForm,
                    handleCloseAddForm,
                    logout: props.logout,
                  }}
                />
                <UpdateDep
                  {...{
                    id,
                    getData,
                    setError,
                    openUpdateForm,
                    handleCloseUpdateForm,
                    logout: props.logout,
                  }}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {/* <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          No users for this project yet
        </Typography> */}
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MUIDataTable
            // title={"معلومات الرواتب"}
            data={deps}
            className="table"
            storageKey="deps-table"
            columns={columns}
            options={options}
            components={components}
          />
        </Box>
        <Snackbar
          open={error}
          autoHideDuration={2000}
          onClose={() => setError(null)}
          message={error?.message}
        />
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    </>
  );
};

export default TableAxios;
