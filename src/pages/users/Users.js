import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import ImportSalary from "../../components/importSalary/importSalary";
import API from "../../api";
import AddUser from "../../components/addUser/addUser";
import UpdateUser from "../../components/updateUser/updateUser";
import UpdateUserPass from "../../components/updateUserPass/updateUserPass";
import Snackbar from "@mui/material/Snackbar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PaidIcon from "@mui/icons-material/Paid";

const TableAxios = (props) => {
  const [users, setUsers] = useState([]);
  const [deps, setDeps] = useState([]);
  const [id, setID] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const [openInsertForm, setOpenInsertForm] = useState(false);
  const handleOpenInsertForm = () => setOpenInsertForm(true);

  const handleCloseInsertForm = () => {
    setOpenInsertForm(false);
  };
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const handleOpenUpdateForm = () => setOpenUpdateForm(true);
  const handleCloseUpdateForm = () => {
    setOpenUpdateForm(false);
  };
  const [openUpdatePassForm, setOpenUpdatePassForm] = useState(false);
  const handleOpenUpdatePassForm = () => setOpenUpdatePassForm(true);
  const handleCloseUpdatePassForm = () => {
    setOpenUpdatePassForm(false);
  };

  const [openImportUserForm, setOpenImportUserForm] = useState(false);
  const handleOpenImportUserForm = () => setOpenImportUserForm(true);
  const handleCloseImportUserForm = () => {
    setOpenImportUserForm(false);
  };

  const myrole = localStorage.getItem("account_type");
  const isSuper = myrole === "SUPER";
  const isAdmin = myrole === "ADMIN";
  const [dep, setDep] = useState(localStorage.getItem("dep") || "ALL");
  const [role, setRole] = useState("ALL");
  const [term, setTerm] = useState("");
  const permissions = ["USER", "SUPER", "BLOCKED", "ADMIN", "ALL"];
  const [open, setOpen] = React.useState(false);
  const handleToggle = (state) => {
    setOpen(state);
  };
  const navigate = useNavigate();

  const getData = async (pageNumber, pageSize) => {
    handleToggle(true);
    let url = `user/?pageSize=${pageSize}&pageNumber=${pageNumber}&role=${role}&dep=${dep}`;
    if (term !== "") url += `&term=${term}`;
    await API.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setUsers(data.allUsers);
        setCount(data.totalCount);
        handleToggle(false);
      })
      .catch((err) => {
        setError(err);
        handleToggle(false);
        props.logout();
      });
  };

  const getDeps = async () => {
    let url = `dep/`;
    await API.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        data.allDeps.push({ id: 0, name: "ALL" });
        setDeps(data.allDeps);
      })
      .catch((err) => {
        setError(err);
        props.logout();
      });
  };

  const DeleteByID = (id) => {
    API.delete("user/" + id, {
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

  const SalariesByID = (id) => {
    navigate("/users/" + id);
  };

  // const handleChangeDep = (e) => {
  //     setDep(e.target.value)
  // }

  const handleChangeDep = (e) => {
    console.log(e.target.dataset.optionIndex);
    setDep(deps[e.target.dataset.optionIndex]?.name);
  };

  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };

  const handleChangeTerm = (e) => {
    setTerm(e.target.value);
  };

  const updateUserByID = async (id) => {
    setID(id);
    handleOpenUpdateForm();
  };

  const updateUserPassByID = async (id) => {
    setID(id);
    handleOpenUpdatePassForm();
  };

  useEffect(() => {
    getDeps();
    getData(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDeps();
    getData(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, term, role]);

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
      name: "num",
      label: "الرقم الوضيفي",
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
      label: "اسم الموظف",
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
        setCellProps: () => {
          return { "margin-left": 3 };
        },
      },
    },
    {
      name: "fullName",
      label: "الاسم الثلاثي",
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
        setCellProps: () => {
          return { "margin-left": 3 };
        },
      },
    },
    {
      name: "role",
      label: "صلاحيات الموظف",
      options: {
        display: false,
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
      name: "dep",
      label: "القسم",
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
        customBodyRender: (value) => {
          return value.name;
        },
      },
    },
    {
      name: "email",
      label: "الايميل",
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
        setCellProps: () => {
          return { "margin-left": 3 };
        },
      },
    },
    {
      label: "الاوامر",
      name: "id",
      print: false,
      download: false,
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
        customBodyRenderLite: (index) => {
          // console.log(users[index])
          return (
            <>
              <IconButton
                type="submit"
                variant="contained"
                size="small"
                disableElevation
                disabled={
                  users[index].role === "SUPER" || !(isAdmin || isSuper)
                }
                sx={{ mt: 3, mb: 2, ml: 1 }}
                onClick={() => {
                  updateUserByID(users[index].id);
                }}
                title="تحديث"
              >
                <BorderColorIcon />
              </IconButton>
              <IconButton
                type="submit"
                variant="contained"
                size="small"
                disableElevation
                disabled={
                  users[index].role === "SUPER" || !(isAdmin || isSuper)
                }
                sx={{ mt: 3, mb: 2, ml: 1 }}
                onClick={() => {
                  updateUserPassByID(users[index].num);
                }}
                title="تغير كلمة المرور"
              >
                <RestartAltIcon />
              </IconButton>
              <IconButton
                type="submit"
                variant="outlined"
                size="small"
                color="error"
                disableElevation
                disabled={
                  users[index].role === "SUPER" || !(isAdmin || isSuper)
                }
                sx={{ mt: 3, mb: 2, ml: 1 }}
                onClick={() => {
                  DeleteByID(users[index].id);
                }}
                title="حذف"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                type="submit"
                variant="contained"
                size="small"
                disableElevation
                sx={{ mt: 3, mb: 2, ml: 1 }}
                onClick={() => {
                  SalariesByID(users[index].id);
                }}
                title="عرض الرواتب"
              >
                <PaidIcon />
              </IconButton>
            </>
          );
        },
        setCellProps: () => {
          return { "margin-left": 30 };
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
    selectableRowsHideCheckboxes: true,
    rowsPerPageOptions: [500, 1000, 5000],
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
      <Paper sx={{ overflow: "hidden" }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: "block" }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  value={term}
                  onChange={handleChangeTerm}
                  placeholder="...بحث"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: "default" },
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item>
                <IconButton
                  type="submit"
                  size="small"
                  vavariant="contained"
                  sx={{ mr: 1 }}
                  disabled={!(isSuper || isAdmin)}
                  onClick={handleOpenInsertForm}
                  title="موظف جديد"
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  type="submit"
                  size="small"
                  variant="contained"
                  sx={{ mr: 1 }}
                  disabled={!(isSuper || isAdmin)}
                  onClick={handleOpenImportUserForm}
                  title="جلِب موظفين"
                >
                  <UploadIcon />
                </IconButton>
                <FormControl size="small" sx={{ mr: 1, width: 240 }}>
                  <Autocomplete
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={{ name: dep }}
                    disabled={!isSuper}
                    size="small"
                    name="dep"
                    label="dep"
                    type="dep"
                    autoComplete="current-dep"
                    onChange={handleChangeDep}
                    sx={{ backgroundColor: "white" }}
                    options={deps}
                    autoHighlight
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="القسم" />
                    )}
                  />
                </FormControl>
                <FormControl size="small" sx={{ mr: 1, display: "none" }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={role}
                    disabled={!(isSuper || isAdmin)}
                    name="role"
                    label="role"
                    type="role"
                    onChange={handleChangeRole}
                    sx={{ backgroundColor: "white" }}
                  >
                    {permissions.map((p, i) => (
                      <MenuItem value={p} key={i}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <AddUser
                  {...{
                    getData,
                    setError,
                    openInsertForm,
                    handleCloseInsertForm,
                  }}
                />
                <ImportSalary
                  {...{
                    getData,
                    setError,
                    openImportUserForm,
                    handleCloseImportUserForm,
                    logout: props.logout,
                  }}
                />
                <UpdateUser
                  {...{
                    id,
                    getData,
                    setError,
                    openUpdateForm,
                    handleCloseUpdateForm,
                    logout: props.logout,
                  }}
                />
                <UpdateUserPass
                  {...{
                    id,
                    getData,
                    setError,
                    openUpdatePassForm,
                    handleCloseUpdatePassForm,
                    logout: props.logout,
                  }}
                />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MUIDataTable
            // title={"قائمة الموظفين"}
            className="table"
            storageKey="users-table"
            data={users}
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
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    </>
  );
};

export default TableAxios;
