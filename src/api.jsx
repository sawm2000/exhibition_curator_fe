import axios from "axios";

const baseApi = axios.create({
  baseURL: "https://exhibition-curator-56h9.onrender.com",
});

export const searchArt = (searchQuery, sortBy, orderBy, page, limit) => {
  let endPointString = "api/art/search";
  const queries = {
    search: searchQuery,
    sortBy,
    orderBy,
    page,
    limit,
  };
  return baseApi.get(endPointString, { params: queries }).then((response) => {
    return response.data;
  });
};

export const getSingleArt = (artId) => {
  return baseApi.get(`api/art/${artId}`).then((response) => {
    return response.data;
  });
};

export const register = (details) => {
  return baseApi.post(`/api/auth/signup`, details).then((response) => {
    return response.data;
  });
};

export const login = (details) => {
  return baseApi.post(`/api/auth/signin`, details).then((response) => {
    return response.data;
  });
};

export const getUser = (id) => {
  return baseApi.get(`/api/user/${id}`).then((response) => {
    return response.data;
  });
};

export const updateUser = (id, changes) => {
  return baseApi.put(`/api/user/${id}`, changes).then((response) => {
    return response.data;
  });
};

export const deleteUser = (id) => {
  return baseApi.delete(`/api/user/${id}`).then(() => {});
};

export const likeArt = (id, artId) => {
  return baseApi.post(`/api/user/${id}/likes/${artId}`).then((response) => {
    return response.data;
  });
};

export const addArt = (id, artId, name) => {
  return baseApi
    .post(`/api/user/${id}/collections/${artId}`, name)
    .then((response) => {
      return response.data;
    });
};

export const unlikeArt = (id, artId) => {
  return baseApi.delete(`/api/user/${id}/likes/${artId}`).then(() => {});
};

export const getCollections = (id) => {
  return baseApi.get(`/api/user/${id}/collections`).then((response) => {
    return response.data;
  });
};

export const getLikes = (id) => {
  return baseApi.get(`/api/user/${id}/likes`).then((response) => {
    return response.data;
  });
};

export const getSingleCollection = (id, collectionName) => {
  return baseApi
    .get(`/api/user/${id}/collections/${collectionName}`)
    .then((response) => {
      return response.data;
    });
};

export const deleteCollection = (id, collectionName) => {
  return baseApi
    .delete(`/api/user/${id}/collections/${collectionName}`)
    .then(() => {});
};

export const deleteFromCollection = (id, collectionName, artId) => {
  return baseApi
    .delete(`/api/user/${id}/collections/${collectionName}/${artId}`)
    .then(() => {});
};
