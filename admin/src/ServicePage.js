import http from "./http.common.function";

const Register = async (data) => {
  return http.post(`/addadmin`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const Login = async (data) => {
  return http.post(`/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const logout = async (data) => {
  console.log(data);
  return http.post(`/logout`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const AddBanner = async (data) => {
  return http.post(`banner/addbanner`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const UpdateBanner = async (data, idd) => {
  return await http.put(`/banner/editbanner/${idd}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const getBanner = async () => {
  try {
    let banner = await http.get(`/banner/getbanner`);
    return banner.data.data;
  } catch (error) {
    console.log("Error fetching banner data");
  }
};
const getBannerById = async (id) => {
  try {
    let banner = await http.get(`/banner/getbybannerid/${id}`);

    return banner.data.data;
  } catch (error) {
    console.log("Error fetching banner data");
  }
};
const handleTrash = async (id) => {
  return http.post(`/banner/trashbaner/${id}`);
};

const getcategory = async () => {
  try {
    let category = await http.get(`/category/getallcategory`);
    return category.data.data;
  } catch (error) {
    console.log("Error fetching category data", error);
  }
};

const getAllClient = async () => {
  try {
    let client = await http.get(`/client/getallClient`);
    return client.data.data;
  } catch (error) {
    console.log("Error fetching category data", error);
  }
};
export const ServicePage = {
  Register,
  Login,
  logout,
  AddBanner,
  UpdateBanner,
  getBanner,
  getBannerById,
  handleTrash,
  getcategory,
  getAllClient,
};
