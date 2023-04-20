import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import API from '../../api';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
// import Typography from '@mui/material/Typography';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: 24,
    p: 3,
};


const InsertForm = ({ getData, setError, openInsertForm, handleCloseInsertForm, logout }) => {
    const [deps, setDeps] = useState([])
    const [dep, setDep] = useState(localStorage.getItem("dep"))
    const [user, setUser] = useState({ dep })
    const role = localStorage.getItem("account_type");
    const isSuper = role === 'SUPER';
    const isAdmin = role === 'ADMIN';
    const permissions = ['USER', 'BLOCKED', 'ADMIN', 'READ']
    useEffect(() => {
        getDeps()
        setUser({ dep })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openInsertForm])


    const getDeps = async () => {
        let url = `dep/`
        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            console.log(data)
            setDeps(data.allDeps)
        }).catch((err) => {
            handleCloseInsertForm()
            setError(err)
            logout()
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        console.log(data);
        data.append("dep", dep)
        API.put('user/', data, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response);
                if (response.data) {
                    // navigate("/")
                    handleCloseInsertForm()
                    getData(0, 10)
                }
                else {
                    handleCloseInsertForm()
                }
            }).catch((err) => {
                handleCloseInsertForm()
                setError(err.response.data)
            });
    };

    const handleChangeName = (e) => {
        user.name = e.target.value
        setUser(user)
    }

    const handleChangeFullName = (e) => {
        user.fullName = e.target.value
        setUser(user)
    }

    const handleChangeEmail = (e) => {
        user.email = e.target.value
        setUser(user)
    }

    const handleChangeRole = (e) => {
        user.role = e.target.value
        console.log(user.role)
        setUser(user)
    }

    const handleChangePass = (e) => {
        user.password = e.target.value
        setUser(user)
    }

    // const handleChangeDep = (e) => {
    //     user.dep = e.target.value
    //     setUser(user)
    // }

    useEffect(() => {
        console.log(user)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleChangeDep = (e) => {
        console.log(e.target.dataset.optionIndex)
        setDep(deps[e.target.dataset.optionIndex]?.name)
        // setUser(user)
    }

    const handleChangeNum = (e) => {
        user.num = e.target.value
        setUser(user)
    }


    return (
        <React.Fragment>
            {/* <Button onClick={handleOpenInsertForm}>Open modal</Button> */}
            <Modal
                open={openInsertForm}
                onClose={handleCloseInsertForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography> */}
                    <FormControl sx={{ width: 350, pt: 1 }}>
                        <TextField
                            margin="normal"
                            size="small"
                            required
                            fullWidth
                            id="name"
                            label="اسم الموظف"
                            name="name"
                            autoComplete="name"
                            onChange={handleChangeName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            size="small"
                            fullWidth
                            id="email"
                            label="البريد الالكتروني"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChangeEmail}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            size="small"
                            required
                            fullWidth
                            id="fullName"
                            label="الاسم الثلاثي"
                            name="fullName"
                            autoComplete="fullName"
                            autoFocus
                            onChange={handleChangeFullName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            size="small"
                            required
                            fullWidth
                            id="num"
                            label="رقم الموظف"
                            name="num"
                            autoComplete="num"
                            autoFocus
                            onChange={handleChangeNum}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            size="small"
                            required
                            fullWidth
                            name="password"
                            label="كلمة المرور"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChangePass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl size="small" sx={{ my: 2, width: 350 }}>
                        <Autocomplete
                            value={{ name: dep }}
                            size="small"
                            disabled={!isSuper}
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
                    <FormControl sx={{ my: 1, width: 350 }}>
                        <InputLabel id="demo-simple-select-helper-label">صلاحيات الموظف</InputLabel>
                        <Select
                            size="small"
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            defaultValue={'BLOCKED'}
                            value={user?.role}
                            disabled={!(isSuper || isAdmin)}
                            name="role"
                            label="User Type"
                            onChange={handleChangeRole}
                        >
                            {permissions.map((p, i) => (
                                <MenuItem value={p} key={i}>{p}</MenuItem>
                            ))}
                        </Select>
                        {/* <FormHelperText>Account Type</FormHelperText> */}
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{ width: 350, m: 1 }}
                    >
                        اضافة
                    </Button>
                </Box>
            </Modal>
        </React.Fragment >
    )
}


export default InsertForm;