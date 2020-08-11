# Codeforces Client

这是一个 codeforces 的本地客户端系统

使用 vue 进行编译，后对编译后的文件使用 Electron 打包

[下载地址](https://github.com/Hukeqing/codeforces-client/releases/tag/0.2.0)

## 功能列表
 - [x] 登录(0.1.0)
 - [x] 提交(0.1.0)
 - [x] 查看最近的提交记录(0.1.0)
 - [x] 缓存账号密码，方便下一次登录(0.2.0)
 - [x] 查看比赛列表(0.2.0)
 - [x] 查看比赛题目列表(0.2.0)
 - [x] 本地渲染题面(0.2.0)
 - [x] 缓存题面(0.3.0)
 - [ ] 查看某次提交记录
 - [ ] 缓存管理系统
 - [ ] css 自定义页面
 - [ ] 解除加载锁定
 - [ ] 加快获取 XCsrfToken

## 本地编译使用方法
**由于同源策略，本地使用时会出现同源策略问题**
### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

**若需要正确在本地编译使用请对编译后的文件使用 Electron 第二次编译**
