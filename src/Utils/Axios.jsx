import axios from "axios";

export const postApi = async (url, data, headers = "") => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
};

export const getApi = async (url, headers = "") => {
  try {
    const response = await axios.get(url, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const patchApi = async (url, data, headers = "") => {
  try {
    const response = await axios.patch(url, data, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in PATCH request:", error);
    throw error;
  }
};

export const deleteApi = async (url, headers = "") => {
  try {
    const response = await axios.delete(url, {
      headers: {
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};
