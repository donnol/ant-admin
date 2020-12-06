import request from "@/utils/request";

export default {
  namespace: "file",
  state: null,
  actions: {
    async get({ payload }, { dispatch }) {
      return await request("/v1/file", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async add({ payload }, { dispatch }) {
      return await request("/v1/file", {
        method: "POST",
        body: payload,
        autoCheck: true
      });
    },
  }
};
