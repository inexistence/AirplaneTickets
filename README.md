AirplaneTickets
===============

华南理工大学数据库大作业——机票预订系统


##技术


**数据库**：mongodb

**服务端搭建**：nodejs

**前端框架**：bootstrap angularjs


**引用的node模块**:

express

underscore

mongoose

body-parser

jade


##环境搭建


1.安装node、mongodb

2.在命令行输入npm install以安装需要的node模块


##启动服务端


1.开启mongodb,在mongodb的安装目录下bin文件夹打开命令窗口输入mongod命令

2.在本项目app.js所在目录下打开命令窗口，输入node app.js命令。若需要的模块都已安装成功，服务端正常启动。出现'airplaneTickets started on port 80'提示

3.在浏览器输入localhost进入index页面

##角色权限

1.未登录

仅能浏览航班信息，进行机票查询

2.普通用户

浏览航班信息、机票查询、下订单、查看历史订单

3.管理员

普通用户权限+增删改查机票（航班机票管理）


##预览

![preview](./preview.png)
