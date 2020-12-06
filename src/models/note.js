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
      return await request("/note", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async del({ payload }, { dispatch }) {
      return await request("/note", {
        method: "DELETE",
        query: payload,
        autoCheck: true
      });
    },
    async mod({ payload }, { dispatch }) {
      return await request("/note", {
        method: "PUT",
        body: payload,
        autoCheck: true
      });
    },
    async publish({ payload }, { dispatch }) {
      return await request("/note/publish", {
        method: "PUT",
        body: payload,
        autoCheck: true
      });
    },
    async hide({ payload }, { dispatch }) {
      return await request("/note/hide", {
        method: "PUT",
        body: payload,
        autoCheck: true
      });
    },
    async add({ payload }, { dispatch }) {
      return await request("/note", {
        method: "POST",
        body: payload,
        autoCheck: true
      });
    },
    async frontPage({ payload }, { dispatch }) {
      return await request("/front/page", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async front({ payload }, { dispatch }) {
      return await request("/front", {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
  }
};
