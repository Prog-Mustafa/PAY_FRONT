import React from "react";
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import API from '../../api';
import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    display:"flex",
    flexDirection:"column",
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
};


const UpdateForm = ({ id, getData, setError, openUpdatePassForm, handleCloseUpdatePassForm, logout }) => {

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        data.append("num", id);
        // console.log(data);
        API.put('user/reset', data, {
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response);
                if (response.data) {
                    // navigate("/")
                    handleCloseUpdatePassForm()
                    getData(0, 10)
                }
                else {
                    handleCloseUpdatePassForm()
                }
            }).catch((err) => {
                handleCloseUpdatePassForm()
                setError(err)
            });
    };


    return (
        <React.Fragment>
            {/* <Button onClick={handleopenUpdatePassForm}>Open modal</Button> */}
            <Modal
                open={openUpdatePassForm}
                onClose={handleCloseUpdatePassForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Reset Password
                    </Typography> */}
                    <FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="كلمة المرور الجديدة"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{  my:1 ,px:0,py:2}}
                    >
                        تغير كلمة المرور
                    </Button>
                </Box>
            </Modal>
        </React.Fragment>
    )
}


export default UpdateForm;