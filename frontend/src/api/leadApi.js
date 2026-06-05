import axios from "axios";

const BASE_URL = "https://lead-management-crm-akql.onrender.com/api/leads";

export const getAllLeads = (search = "", status = "") =>
  axios.get(BASE_URL, { params: { search, status } });

export const createLead = (data) =>
  axios.post(BASE_URL, data);

export const updateLead = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);

export const deleteLead = (id) =>
  axios.delete(`${BASE_URL}/${id}`);