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
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};


const UpdateForm = ({ id, getData, setError, openUpdateForm, handleCloseUpdateForm, logout }) => {
    const [deps, setDeps] = useState([localStorage.getItem("dep")])
    const [name, setName] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [num, setNum] = useState('')
    const myrole = localStorage.getItem("account_type");
    const isSuper = myrole === 'SUPER';
    const isAdmin = myrole === 'ADMIN';
    const [dep, setDep] = useState(localStorage.getItem("dep"));
    const [role, setRole] = useState('BLOCKED');
    const permissions = ['USER', 'BLOCKED', 'ADMIN', 'READ']

    useEffect(() => {
        getDeps()
        if (id !== 0)
            getUserByID(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        if (id !== 0)
            getDeps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getDeps = async () => {
        let url = `dep/`
        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            console.log(data)
            setDeps(data.allDeps)
        }).catch((err) => {
            handleCloseUpdateForm()
            setError(err)
            logout()
        });
    }

    const getUserByID = async (id) => {
        let url = `user/${id}`

        await API.get(url, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            const data = response.data
            console.log(data)
            setName(data.name)
            setNum(data.num)
            setEmail(data.email)
            setFullName(data.fullName)
            setRole(data.role)
            setDep(data.dep.name)
        }).catch((err) => {
            handleCloseUpdateForm()
            setError(err)
            logout()
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        data.append("dep", dep)
        // console.log(data);
        API.put('user/', data, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response);
                if (response.data) {
                    // navigate("/")
                    handleCloseUpdateForm()
                    getData(0, 10)
                }
                else {
                    handleCloseUpdateForm()
                }
            }).catch((err) => {
                handleCloseUpdateForm()
                setError(err)
            });
    };

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const handleChangeFullName = (e) => {
        console.log(e.target.value)
        setFullName(e.target.value)
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangeRole = (e) => {
        setRole(e.target.value)
    }

    // const handleChangeDep = (e) => {
    //     setDep(e.target.value)
    // }

    const handleChangeDep = (e) => {
        console.log(e.target.dataset.optionIndex)
        setDep(deps[e.target.dataset.optionIndex]?.name)
    }

    const handleChangeNum = (e) => {
        setNum(e.target.value)
    }


    return (
        <React.Fragment>
            {/* <Button onClick={handleOpenUpdateForm}>Open modal</Button> */}
            <Modal
                open={openUpdateForm}
                onClose={handleCloseUpdateForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        تحديث
                    </Typography> */}
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            required
                            size="small"
                            fullWidth
                            id="num"
                            label="رقم الموظف"
                            name="num"
                            value={num || ''}
                            onChange={handleChangeNum}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            required
                            size="small"
                            fullWidth
                            id="name"
                            label="اسم الموظف"
                            name="name"
                            value={name || ''}
                            onChange={handleChangeName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: 350 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            size="small"
                            id="email"
                            label="البريد الالكتروني"
                            name="email"
                            value={email || ''}
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
                            required
                            size="small"
                            fullWidth
                            id="fullName"
                            label="الاسم الثلاثي"
                            name="fullName"
                            value={fullName || ''}
                            autoComplete="fullName"
                            autoFocus
                            onChange={handleChangeFullName}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <FormControl size="small" sx={{ my: 2, width: 350 }}>
                        <Autocomplete
                            margin="normal"
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
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
                    <FormControl sx={{ my: 2, width: 350 }}>
                        <InputLabel id="demo-simple-select-helper-label">صلاحيات الموظف</InputLabel>
                        <Select
                            margin="normal"
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            size="small"
                            defaultValue={role}
                            value={role}
                            disabled={!(isSuper || isAdmin)}
                            name="role"
                            label="role"
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
                        تحديث
                    </Button>
                </Box>
            </Modal>
        </React.Fragment>
    )
}


export default UpdateForm;