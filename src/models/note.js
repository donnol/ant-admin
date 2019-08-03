import request from "@/utils/request";

export default {
  namespace: "note",
  state: null,
  actions: {
    async page({ payload }, { dispatch }) {
      return await request("/note/page", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async get({ payload }, { dispatch }) {
      return await request("/note/get", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async del({ payload }, { dispatch }) {
      return await request("/note/del", {
        method: "DELETE",
        body: payload,
        autoCheck: true
      });
    },
    async mod({ payload }, { dispatch }) {
      return await request("/note/mod", {
        method: "PUT",
        body: payload,
        autoCheck: true
      });
    },
    async add({ payload }, { dispatch }) {
      return await request("/note/add", {
        method: "POST",
        body: payload,
        autoCheck: true
      });
    }
  }
};
