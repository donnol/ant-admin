const copyright = "笔记 管理系统";
const author = "donnol";
const title = "笔记管理系统";
const uploadImage = {
  name: "data",
  action: "/upload/image",
  onResponse: function(response) {
    console.log("upload image");
    if (response.code != 0) {
      throw new Error(response.msg);
    }
    return response.data;
  }
};
const ueditor = {
  path: "/ueditor",
  serverUrl: "/ue"
};
export { title, copyright, author, uploadImage, ueditor };
