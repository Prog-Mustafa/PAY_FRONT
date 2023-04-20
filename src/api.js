import axios from 'axios';

export default axios.create({
    // baseURL: `https://pacific-peak-18343.herokuapp.com/`
    // baseURL: `https://salary-portal-back-production.up.railway.app/`
    // baseURL: `https://payroll.mtu.edu.iq/`
    // baseURL: `http://localhost:3003/`
    baseURL: `https://payroll-production.up.railway.app/`
});