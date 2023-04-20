import React, { useState } from "react";
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import API from '../../api';
import Modal from '@mui/material/Modal';
// import Typography from '@mui/material/Typography';
import FileUpload from "react-mui-fileuploader"
import Icon from './cloud-computing.png';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bgcolor: 'background.paper',
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
};


const ImportForm = ({ getData, setError, openAddForm, handleCloseAddForm }) => {
    const [name, setName] = useState('')
    const [file, setFile] = useState({})

    const handleChangeName = (e) => {
        setName(e.target.value);
    };

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab]);
        return bb;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = new FormData();
        data.append("sampleFile", dataURItoBlob(file.path));
        data.append("name", name);
        // console.log(data.entries());
        API.post('dep/', data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                console.log(response);
                if (response.data) {
                    // navigate("/")
                    handleCloseAddForm()
                    getData(0, 10)
                }
                else {
                    handleCloseAddForm()
                }
            }).catch((err) => {
                handleCloseAddForm()
                setError(err)
            });
    };


    const handleFileUploadError = (error) => {
        setError(error)
        // Do something...
    }

    const handleFilesChange = (files) => {
        console.log(files)
        setFile(files[0])
        // Do something...
    }


    return (
        <React.Fragment>
            {/* <Button onClick={handleOpenAddForm}>Open modal</Button> */}
            <Modal
                open={openAddForm}
                onClose={handleCloseAddForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Dep
                    </Typography> */}
                    <FormControl sx={{ my: 1, width: 450 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="الاسم"
                            name="name"
                            value={name || ''}
                            onChange={handleChangeName}
                            InputLabelProps={{
                                shrink: true,
                            }}

                        />
                    </FormControl>
                    <FormControl sx={{ my: 1, width: 450 }}>
                        <FileUpload
                            multiFile={true}
                            disabled={false}
                            name="sampleFile"
                            title="تحديث"
                            header="[اسحب الملف الى هنا]"
                            leftLabel="او"
                            rightLabel="لاختيار ملف"
                            buttonLabel="اضغط هنا"
                            buttonRemoveLabel="حذف الكل"
                            maxFileSize={10}
                            maxUploadFiles={1}
                            maxFilesContainerHeight={357}
                            errorSizeMessage={'fill it or move it to use the default error message'}
                            // allowedExtensions={['XLS', 'XLSX']}
                            onFilesChange={handleFilesChange}
                            onError={handleFileUploadError}
                            imageSrc={Icon}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{ width: 450, my: 1 }}
                    >
                        اضافة
                    </Button>
                </Box>
            </Modal>
        </React.Fragment>
    )
}


export default ImportForm;