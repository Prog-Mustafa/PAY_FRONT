import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import API from "../../api";
import Modal from "@mui/material/Modal";
// import Typography from '@mui/material/Typography';
import FileUpload from "react-mui-fileuploader";
import Icon from "./cloud-computing.png";
import CssBaseline from "@mui/material/CssBaseline";
// import Docc from "../../doc.txt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
};

const ImportForm = ({
  id,
  getData,
  setError,
  openUpdateForm,
  handleCloseUpdateForm,
  logout,
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState({});

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    if (id !== 0) getDepByID(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDepByID = async (id) => {
    let url = `dep/${id}`;

    await API.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setName(data.name);
      })
      .catch((err) => {
        handleCloseUpdateForm();
        setError(err);
        logout();
      });
  };

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
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
    if (file) data.append("sampleFile", dataURItoBlob(file.path));
    data.append("name", name);
    // console.log(data.entries());
    API.put("dep/", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data) {
          // navigate("/")
          handleCloseUpdateForm();
          getData(0, 10);
        } else {
          handleCloseUpdateForm();
        }
      })
      .catch((err) => {
        handleCloseUpdateForm();
        setError(err);
      });
  };

  const handleFileUploadError = (error) => {
    setError(error);
    // Do something...
  };

  const handleFilesChange = (files) => {
    console.log(files);
    setFile(files[0]);
    // Do something...
  };

  return (
    <React.Fragment>
      <CssBaseline />
      {/* <Button onClick={handleOpenAddForm}>Open modal</Button> */}
      <Modal
        open={openUpdateForm}
        onClose={handleCloseUpdateForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update Dep
                    </Typography> */}
          <FormControl sx={{ m: 1, width: 450 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              variant="filled"
              color="secondary"
              id="name"
              label="الاسم"
              name="name"
              value={name || ""}
              onChange={handleChangeName}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: 450, color: "#000" }}>
            <FileUpload
              multiFile={true}
              disabled={false}
              name="sampleFile"
              title="الشعار"
              sx={{ color: "#000" }}
              header="[اسحب الملف هنا]"
              leftLabel="او"
              rightLabel="لاختيار ملف"
              buttonLabel="اضغط هنا"
              buttonRemoveLabel="حذف الكل"
              maxFileSize={10}
              maxUploadFiles={1}
              maxFilesContainerHeight={357}
              errorSizeMessage={
                "fill it or move it to use the default error message"
              }
              // allowedExtensions={['XLS', 'XLSX']}
              onFilesChange={handleFilesChange}
              onError={handleFileUploadError}
              bannerProps={{ elevation: 0, variant: "filled" }}
              containerProps={{ elevation: 0, variant: "filled" }}
              imageSrc={Icon}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{ width: 440, m: 1 }}
          >
            تحديث
          </Button>
          {/* <a href={Docc} download="doc">
            <Button className="linksss" variant="contained" sx={{ width: 440, m: 1 }}>
              قم بتنزيل ملف فارغ
            </Button>
          </a> */}
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default ImportForm;
