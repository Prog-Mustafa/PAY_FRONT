import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
// import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import API from "../../api";
import Modal from "@mui/material/Modal";
// import Typography from '@mui/material/Typography';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers";
import FileUpload from "react-mui-fileuploader";
import Icon from "./cloud-computing.png";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Docc from "../../salary.xlsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const ImportForm = ({
  getData,
  setError,
  openImportForm,
  handleCloseImportForm,
  logout,
}) => {
  const [deps, setDeps] = useState([]);
  const [file, setFile] = useState({});
  const role = localStorage.getItem("account_type");
  const isSuper = role === "SUPER";
  // const isAdmin = role === 'ADMIN';
  const [dep, setDep] = React.useState(localStorage.getItem("dep"));
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  // const handleChangeDate = (value) => {
  //   setDate(value);
  // };

  const handleChangeDate = (value) => {
    console.log(value);
    setDate(value.toISOString().split("T")[0]);
  };

  useEffect(() => {
    getDeps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openImportForm]);

  const getDeps = async () => {
    let url = `dep/`;
    await API.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setDeps(data.allDeps);
      })
      .catch((err) => {
        handleCloseImportForm();
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
    data.append("sampleFile", dataURItoBlob(file.path));
    let selectedDate = new Date(date);
    let startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 2);
    console.log(startDate)
    console.log(startDate.toISOString())
    data.append("on", startDate.toISOString().slice(0, 10));
    data.append("dep", dep);
    // console.log(data.entries());
    API.post("salary/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data) {
          // navigate("/")
          handleCloseImportForm();
          getData(0, 10);
        } else {
          handleCloseImportForm();
        }
      })
      .catch((err) => {
        handleCloseImportForm();
        if (err.response.data?.msg) {
          setError({ message: JSON.stringify(err.response.data.msg[0]) });
        } else setError(err);
      });
  };

  // const handleChangeDep = (e) => {
  //   setDep(e.target.value);
  // };

  const handleChangeDep = (e) => {
    console.log(e.target.dataset.optionIndex);
    setDep(deps[e.target.dataset.optionIndex]?.name);
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
      {/* <Button onClick={handleOpenImportForm}>Open modal</Button> */}
      <Modal
        open={openImportForm}
        onClose={handleCloseImportForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
          <Alert severity="warning" color="secondary" className="alr">
            ت او id, الاسم , الراتب الاسمي , الخدمة الاجمالية, اللقب الوضيفي ,
            الشهادة, الزوجية , الاولاد, المنصب, مخصصات الخطورة, النقل, مجموع
            الاستحقاق, تقاعد 10%, الضريبة , سلفة راتب, قرض, مجموع الاستقطاعات,
            صافي الراتب.
            <span style={{ fontWeight: "bold" }}> مطلوب*</span>{" "}
          </Alert>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Import user and salaries
                    </Typography> */}
          <FormControl size="small" sx={{ mt: 3, width: 435 }}>
            <Autocomplete
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
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderInput={(params) => <TextField {...params} label="القسم" />}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: 435 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="التاريخ"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={new Date(Date.parse(date))}
                name="on"
                onChange={handleChangeDate}
                views={['year', 'month']}
                disableFuture
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    sx={{ backgroundColor: "white" }}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ m: 1, width: 435 }}>
            <FileUpload
              multiFile={true}
              disabled={false}
              name="sampleFile"
              title="اضف ملفات"
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
              imageSrc={Icon}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{ width: 435, m: 1 }}
          >
            إضافة
          </Button>
          <a href={Docc} download="doc">
            <Button className="linksss" variant="contained" sx={{ width: 435, m: 1 }}>
              قم بتنزيل ملف فارغ
            </Button>
          </a>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default ImportForm;
