import axios from 'axios';

//The URL is defined in assets/js/config.js
const ROOT_URL = window.URL + 'api';

export function createDonor(donorData, cb) {
    axios.post(`${ROOT_URL}/donors`, donorData)
        .then(res => {
            cb(res.data);
        })
        .catch(err => cb(null));
}

export function fetchDonor(id, cb) {
    axios.get(`${ROOT_URL}/donors/${id}`)
        .then((res, err) => {
            cb(res.data);
        })
        .catch(err => cb(null));
}

export function updateDonor(id, donorData, cb) {
    axios.post(`${ROOT_URL}/donors/${id}`, donorData)
        .then((res, err) => {
            cb(res.data);
        })
        .catch(err => cb(null));
}

export function deleteDonor(id, cb) {
    axios.delete(`${ROOT_URL}/donors/${id}`).then((res, err)=>{
        cb(res.data);
    });
}