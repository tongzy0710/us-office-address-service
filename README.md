# US Office Address Service

面向中国跨境电商卖家的美国办公室地址服务系统。

这个仓库当前包含两部分内容：

- `app/`：本地开发中的三端源码结构
- `docs/`：用于公开演示和外部访问的静态网页版

## 三端角色

- 中介端：手机优先录入楼栋与 office 信息，支持保存草稿和提交审核
- 租客端：电脑端筛选、查阅和对比可推荐办公室
- 管理端：楼栋审核、房间审批、批量处理、客服联系方式维护

## 登录方式

- 中介端：输入手机号直接登录
- 租客端：输入手机号直接登录
- 管理端：
  - 账号：`admin`
  - 密码：`ccMonet`

## 公开演示入口

仓库同步后，可通过以下静态演示地址访问：

- GitHub Pages：`https://tongzy0710.github.io/us-office-address-service/`
- jsDelivr：`https://cdn.jsdelivr.net/gh/tongzy0710/us-office-address-service@main/docs/index.html`

## 备注

`docs/` 下的公开演示版采用浏览器本地存储保存数据，适合外部演示和流程说明。

_Deployment trigger: 2026-07-14 23:12 CST_
