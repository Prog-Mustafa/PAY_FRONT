import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import SearchIcon from "@mui/icons-material/Search";
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../../api';
import Snackbar from '@mui/material/Snackbar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ImportUser from '../../components/importUser/importUser'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from '@mui/x-date-pickers';
import UploadIcon from '@mui/icons-material/Upload';
import EmailIcon from '@mui/icons-material/Email';
// import Button from '@mui/material/Button';


const TableAxios = (props) => {
    const dateOptions = {
        // weekday: 'long',
        year: 'numeric',
        month: 'short',
        // day: 'numeric',
    };
    const [salaries, setSalaries] = useState([])
    const [dates, setDates] = useState([])
    const [term, setTerm] = useState('');
    const [deps, setDeps] = useState([])
    // const [uid, setUID] = useState(0)
    const [count, setCount] = useState(0)
    const [error, setError] = useState(false)
    const myrole = localStorage.getItem("account_type");
    const isSuper = myrole === 'SUPER';
    const isAdmin = myrole === 'ADMIN';
    const isRead = myrole === 'READ';
    const [dep, setDep] = useState(localStorage.getItem("dep") || 'ALL');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [open, setOpen] = React.useState(false);
    const handleToggle = (state) => {
        setOpen(state);
    };
    const [openImportForm, setOpenImportForm] = useState(false);
    const handleOpenImportForm = () => setOpenImportForm(true);
    const handleCloseImportForm = () => {
        setOpenImportForm(false)
    };
    // const navigate = useNavigate();

    const BulkEmail = () => {
        API.post(`user/email/?date=${date}&dep=${dep}`, {}, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response);
            }).catch((err) => {
                setError(err)
            });
    }

    const getData = async (pageNumber, pageSize) => {
        handleToggle(true)
        let url = `salary/?pageSize=${pageSize}&pageNumber=${pageNumber}&date=${date}&dep=${dep}`
        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            // console.log(data)
            for (let i = 0; i < data.allSalaries.length; i++) {
                data.allSalaries[i].fullName = data.allSalaries[i].user.fullName
                data.allSalaries[i].num = data.allSalaries[i].user.num
            }
            setSalaries(data.allSalaries)
            setCount(data.totalCount)
            handleToggle(false)
        }).catch((err) => {
            setError(err)
            handleToggle(false)
            props.logout()
        });
    }

    const getDates = async () => {
        let url = `on/?dep=${dep}`
        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            console.log(data)
            data.allOns.push({ id: 0, on: 'ALL' })
            setDates(data.allOns)
        }).catch((err) => {
            setError(err)
            props.logout()
        });
    }

    const getDeps = async () => {
        let url = `dep/`
        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            console.log(data)
            data.allDeps.push({ id: 0, name: 'ALL' })
            setDeps(data.allDeps)
        }).catch((err) => {
            setError(err)
            props.logout()
        });
    }

    const DeleteByID = (id) => {
        API.delete('salary/' + id, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response);
                getData(0, 10)
            }).catch((err) => {
                setError(err)
            });
    }

    // const handleChangeDate = (e) => {
    //     setDate(e.target.value)
    // }

    const handleChangeDate = (value) => {
        console.log(value)
        let selectedDate = new Date(value);
        let startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 2);
        setDate(startDate.toISOString().split('T')[0]);
    };

    const handleChangeTerm = (e) => {
        setTerm(e.target.value)
    }

    const handleChangeDep = (e) => {
        console.log(e.target.dataset.optionIndex)
        setDep(deps[e.target.dataset.optionIndex]?.name)
    }

    useEffect(() => {
        // getDepByID(id)
        getDates()
        getDeps()
        getData(0, 10)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getDates()
        getDeps()
        getData(0, 10)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dep, date])

    const components = {
        icons: {
            SearchIcon: SearchIcon,
            PrintIcon: LocalPrintshopOutlinedIcon,
            DownloadIcon: DownloadOutlinedIcon,
            ViewColumnIcon: ViewColumnOutlinedIcon,
        }
    };

    const columns = [
        {
            name: "num",
            label: "الرقم الوضيفي",
            options: {
                filter: false,
                sort: false,
                display: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)}
                            style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "fullName",
            label: "الاسم الثلاثي",
            options: {
                filter: false,
                sort: false,
                display: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            label: "التاريخ",
            name: "id",
            options: {
                filter: false,
                sort: false,
                display: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
                customBodyRenderLite: (index) => {
                    // console.log(Salaries[index])
                    return ((new Date(salaries[index].on.on)).toLocaleDateString('ar-eg', dateOptions))
                },
            }
        },

        {
            name: "note",
            label: "ملاحظات",
            options: {
                filter: false,
                sort: false,
                display: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "kids",
            label: "الاولاد",
            options: {
                filter: false,
                sort: false,
                display: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "marriage",
            label: "الزوجية",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "certificate",
            label: "الشهادة",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "position",
            label: "المنصب",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "etc",
            label: "اخرى",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "legal",
            label: "م قانونية",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "engineering",
            label: "م هندسية",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "level",
            label: "المرحلة",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "grade",
            label: "الدرجة",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "danger",
            label: "مخصصات الخطورة",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "transfer",
            label: "النقل",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "deserve",
            label: "مجموع الاستحقاق",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "pension",
            label: "تقاعد 10%",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "tax",
            label: "الضريبة",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "loan",
            label: "قرض",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "salary",
            label: "الراتب الاسمي",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "ssalary",
            label: "سلفة راتب",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "deductions",
            label: "مجموع الاستقطاعات",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "net",
            label: "صافي الراتب",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            name: "years",
            label: "الخدمة الاجمالية",
            options: {
                filter: false,
                sort: false,
                display: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
            }
        },
        {
            label: "الاوامر",
            name: "id",
            options: {
                filter: false,
                sort: false,
                display: true,
                download: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    (columnMeta.display ?
                        <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                            scope="col">
                            {columnMeta.label}
                        </th>
                        : null)
                ),
                customBodyRenderLite: (index) => {
                    // console.log(Salaries[index])
                    return (
                        <>
                            <IconButton
                                type="submit"
                                variant="outlined"
                                size="small"
                                // color="error"
                                disableElevation
                                disabled={salaries[index].role === 'SUPER' || !(isAdmin || isSuper)}
                                sx={{ mt: 3, mb: 2, ml: 1 }}
                                onClick={() => { DeleteByID(salaries[index].id) }} title="حذف">
                                <DeleteIcon />
                            </IconButton>
                        </>)
                },
            }
        }
    ]

    const options = {
        serverSide: true,
        count: count,
        filter: false,
        search: false,
        sort: false,
        display: false,
        rowsPerPageOptions: [500, 1000, 5000],
        onDownload: (buildHead, buildBody, columns, data) => {
            return "\uFEFF" + buildHead(columns) + buildBody(data);
        },
        customHeadRender: (columnMeta, updateDirection) => (
            <th key={columnMeta.label} onClick={() => updateDirection(2)} style={{ cursor: 'pointer' }} className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium tss-1qtl85h-MUIDataTableBodyCell-root css-1ex1afd-MuiTableCell-root"
                scope="col">
                {columnMeta.label}
            </th>
        ),
        responsive: 'standard',
        elevation: 1,
        selectableRowsHideCheckboxes: true,
        onTableChange: (action, tableState) => {
            // console.log(action, tableState);

            // a developer could react to change on an action basis or
            // examine the state as a whole and do whatever they want

            // console.log(tableState.page, tableState.rowsPerPage)
            switch (action) {
                case 'changePage':
                    getData(tableState.page, tableState.rowsPerPage);
                    break;
                case 'changeRowsPerPage':
                    getData(tableState.page, tableState.rowsPerPage);
                    break;
                default:
                    break;
            }
        },
    }

    const renderWeekPickerDay = (date, _, pickersDayProps) => {
        return (
            <PickersDay className={dates.some(e => new Date(e.on).toLocaleDateString() === date.toLocaleDateString()) ? "notify" : ""}
                {...pickersDayProps}
            />
        );
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
                                <IconButton variant="contained" sx={{ mr: 1 }} disabled={!(isSuper || isAdmin)} title="send emails"
                                    onClick={BulkEmail}>
                                    <EmailIcon />
                                </IconButton>
                                <IconButton variant="contained" sx={{ mr: 1 }} disabled={!(isSuper || isAdmin)} title="جلِب رواتب"
                                    onClick={handleOpenImportForm}>
                                    <UploadIcon />
                                </IconButton>
                                <FormControl size="small" sx={{ mr: 1, width: 100 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker
                                            label="التاريخ"
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            value={new Date(Date.parse(date))}
                                            disabled={!(isSuper || isAdmin || isRead)}
                                            name="date"
                                            onChange={handleChangeDate}
                                            inputFormat="MM/yyyy"
                                            views={['year', 'month']}
                                            renderDay={renderWeekPickerDay}
                                            renderInput={(params) => <TextField {...params} size="small"
                                                sx={{ backgroundColor: "white" }} />}
                                        />
                                    </LocalizationProvider>
                                    {/* <FormHelperText>Account Type</FormHelperText> */}
                                </FormControl>
                                <FormControl size="small" sx={{ mr: 1, width: 240 }}>
                                    <Autocomplete
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={{ name: dep }}
                                        disabled={!(isSuper || isRead)}
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
                                        isOptionEqualToValue={(option, value) => option.name === value.name}
                                        renderInput={(params) => <TextField {...params} label="القسم" />}
                                    />
                                </FormControl>
                                <ImportUser {...{ getData, setError, openImportForm, handleCloseImportForm, logout: props.logout }} />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <MUIDataTable
                        // title={"معلومات الرواتب"}
                        className="table"
                        storageKey="all-salaries-table"
                        data={salaries}
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
    )

}
export default TableAxios;