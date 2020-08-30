# Codeforces Client

**Copyleft (ɔ) 2020.Mauve，版权部分所有，遵循 GPL 授权使用**

## Codeforces 打开好慢，加载题面好慢

这是一个 codeforces 的本地客户端系统。通过减少拉取的数据量来实现加速 codeforces 

**注意：本系统仅减少拉取数据量，并非加速拉取**

[下载地址](https://github.com/Hukeqing/codeforces-client/releases/tag/v1.2.1)

## 功能列表（括号内为实现此功能的版本号）
 - [x] 登录(>=0.1.0)
 - [x] 提交(>=0.1.0)
 - [x] 查看最近的提交记录(>=0.1.0)
 - [x] 缓存账号密码(>=0.2.0)
 - [x] 查看比赛列表(>=0.2.0)
 - [x] 查看比赛题目列表(>=0.2.0)
 - [x] 本地渲染题面(>=0.2.0)
 - [x] 缓存题面(>=0.3.0)
 - [x] 查看某次提交记录(>=1.1.0)
 - [x] 缓存管理系统(>0.4.0)
 - [ ] css 自定义页面
 - [x] 题面中的链接使用本地浏览器打开(>=0.5.0)
 - [x] problemset 页面(>=1.0.0)
 - [ ] 多语言
 - [x] 查看错误的数据(>=1.2.0)

## 本地编译使用方法
使用 vue 进行编译，后对编译后的文件使用 Electron 打包

**由于同源策略，如果使用 vue 编译后的文件将会无法正常运行**

**若需要正确在本地编译使用请对编译后的文件使用 Electron 第二次编译**

```shell script
git clone https://github.com/Hukeqing/codeforces-client.git
cd codeforces-client
npm install
npm run build
cp ./scr/main/* dist/
npm install
npm run package
```

如果你熟悉 `yarn` 也可以使用 `yarn` 进行编译运行

## 许可证

Codeforces Client 使用 GPL 许可证开源
