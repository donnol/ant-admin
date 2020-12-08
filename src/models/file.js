import { default as request, addUrlQuery } from "@/utils/request";

const filePath = "/v1/file"

export default {
  namespace: "file",
  state: null,
  actions: {
    async getLink({ payload }, { dispatch }) {
      let url = filePath;
      return await addUrlQuery(url, payload);
    },
    async get({ payload }, { dispatch }) {
      return await request(filePath, {
        method: "GET",
        query: payload,
        autoCheck: true
      });
    },
    async add({ payload }, { dispatch }) {
      return await request(filePath, {
        method: "POST",
        body: payload,
        isUploadFile: true,
        autoCheck: true
      });
    },
  }
};
