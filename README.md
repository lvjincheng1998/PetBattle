# 小精灵大作战

### 数据库说明
- 数据库使用MySQL，推荐管理软件Navicat For MySQL。
- 创建数据库命名为pet_battle，字符集选用utf8 -- UTF-8 Unicode，排序规则选用utf8_general_ci。
- 设置连接账号[root]密码[123456]。
- 导入数据库脚本pet_battle.sql。

### 客户端说明
使用Cocos Creator-2.3.3打开项目PetBattleClient。
可在LoginMgr.ts中修改连接后台的URL。

已有测试账号：
账号 | 密码
---|---
123456 | 123456
asdfgh | asdfgh

注意：要先运行服务端再运行客户端，否则会报连接错误。

### 服务端说明
推荐使用Eclipse打开项目PetBattleServer。
