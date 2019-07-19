import { Switch, Route, Redirect } from "redva/router";
import dynamic from "redva/dynamic";
import React from "react";

let router = [
  {
    name: "登录",
    path: "/login",
    component: "Layout/Login"
  },
  {
    name: "首页",
    path: "/",
    component: "Layout/Home",
    children: [
      {
        name: "首页跳转",
        path: "/",
        component: "Layout/HomeRedirect"
      },
      {
        name: "笔记列表",
        path: "/note",
        component: "Note/List"
      },
      {
        name: "笔记详情",
        path: "/note/detail",
        component: "Note/Detail"
      },
      {
        name: "银行卡列表",
        path: "/card",
        component: "Card/List"
      },
      {
        name: "银行卡详情",
        path: "/card/detail",
        component: "Card/Detail"
      },
      {
        name: "银行卡列表2",
        path: "/card2",
        component: "Card2/List"
      },
      {
        name: "银行卡详情2",
        path: "/card2/detail",
        component: "Card2/Detail"
      },
      {
        name: "商品类别",
        path: "/itemCategory",
        component: "ItemCategory/List"
      },
      {
        name: "商品列表",
        path: "/item",
        component: "Item/List"
      },
      {
        name: "商品详情",
        path: "/item/detail",
        component: "Item/Detail"
      },
      {
        name: "订单列表",
        path: "/order",
        component: "Order/List"
      },
      {
        name: "订单详情",
        path: "/order/detail",
        component: "Order/Detail"
      },
      {
        name: "订单列表2",
        path: "/order2",
        component: "Order2/List"
      },
      {
        name: "订单详情2",
        path: "/order2/detail",
        component: "Order2/Detail"
      },
      {
        name: "文章详情展示",
        path: "/article",
        component: "Article/List",
        children: [
          {
            name: "文章跳转",
            path: "/article",
            component: "Article/Index"
          },
          {
            name: "文章详情1",
            path: "/article/detail1",
            component: "Article/Detail1"
          },
          {
            name: "文章详情2",
            path: "/article/detail2",
            component: "Article/Detail2"
          }
        ]
      },
      {
        name: "控制台",
        path: "/dashboard",
        component: "Dashboard/Sample"
      },
      {
        name: "长列表",
        path: "/virtual",
        component: "Virtual/Index"
      },
      {
        name: "找不到页面",
        path: "/404",
        component: "Layout/NotFound"
      }
    ]
  }
];

let routerComponent = null;

function analyseComponent(app, router) {
  if (router.wrapperComponent) {
    return;
  }
  router.wrapperComponent = dynamic({
    app: app,
    component: async () => {
      let raw = await import(`../pages/` + router.component);
      const Component = raw.default || raw;
      let ChildrenComponent;
      if (router.children && router.children.length != 0) {
        if (!router.childrenComponent) {
          router.childrenComponent = getRouterComponent(app, router.children);
        }
        ChildrenComponent = router.childrenComponent;
      } else {
        ChildrenComponent = null;
      }
      return props => {
        return React.createElement(Component, props, ChildrenComponent);
      };
    }
  });
  return;
}

function getRouterComponent(app, router) {
  for (let i = 0; i != router.length; i++) {
    analyseComponent(app, router[i]);
  }
  return (
    <Switch>
      {router.map(singleRouter => {
        const hasChildren =
          singleRouter.children && singleRouter.children.length != 0;
        return (
          <Route
            exact={!hasChildren}
            path={singleRouter.path}
            key={singleRouter.path}
            component={singleRouter.wrapperComponent}
          />
        );
      })}
      <Redirect to="/404" key={"redirect_404__"} />
    </Switch>
  );
}

export default function getRouter(app) {
  if (routerComponent) {
    return routerComponent;
  }
  routerComponent = getRouterComponent(app, router);
  return routerComponent;
}

let nameMapper = {};

function resetPath(url) {
  const urlSeg = url.split("/");
  let newSeg = [];
  for (const i in urlSeg) {
    if (urlSeg[i] != "") {
      newSeg.push(urlSeg[i]);
    }
  }
  return "/" + newSeg.join("/");
}

function calNameMapper(router) {
  let result = {};
  for (let i in router) {
    const singleRouter = router[i];
    result[singleRouter.path] = singleRouter.name;
    if (singleRouter.children) {
      let childResult = calNameMapper(singleRouter.children);
      for (let j in childResult) {
        result[j] = childResult[j];
      }
    }
  }
  return result;
}

nameMapper = calNameMapper(router);

export function getRouterName(path) {
  path = resetPath(path);
  if (nameMapper[path]) {
    return nameMapper[path];
  } else {
    return "";
  }
}
