# Quick-Order-App
Quick order application in just 3 steps on smartphone with integrated online chat.

## Installation Instructions
### Extract all folders and files
### Install environment library
#### 1.NodeJS
Link download: https://nodejs.org/en/download/

Follow the instructions: https://www.youtube.com/watch?v=X-FPCwZFU_8
#### 2.ExpressJS
Follow the instructions: http://expressjs.com/en/starter/installing.html
#### 3.Expo
Follow the instructions: https://docs.expo.io/get-started/installation/
#### 4.React Native
Follow the instructions: https://reactnative.dev/docs/getting-started
#### 5.Android Studio
Link download: https://developer.android.com/studio?gclid=CjwKCAjwiLGGBhAqEiwAgq3q_hMiVmV6nK_z3OP2PdajV0n05aGK6YfBx6OvQAeHkLYWEorvVEclbxoCDUQQAvD_BwE&gclsrc=aw.ds

Follow the instructions: https://www.youtube.com/watch?v=0zx_eFyHRU0

### Get IPv4 Local

**Step 1:** Open terminal and run this command
```sh
ipconfig
```
![image](https://user-images.githubusercontent.com/52951651/122571805-50c97e00-d077-11eb-86e7-20d252ba6085.png)

**Step 2:** Copy IPv4 Address. Ex: 192.168.1.125

### Installation for backend

**Step 1:** Open folder *app-quick-shop\backend* and open terminal to run this command
```sh
npm install
```

**Step 2:** Open *app-quick-shop\backend\config\config.json*, paste value of IPv4 Address to "node_ip".
![image](https://user-images.githubusercontent.com/52951651/122572479-fb41a100-d077-11eb-8fde-d98890183a87.png)

**Step 3:** Follow file *app-quick-shop\backend\pạckage.json* to run this program:
```sh
npm start
```

### Installation for frontend

#### 1. App GoFAST
**Step 1:** Open folder *app-quick-shop\frontend\myapp* and open terminal to run this command
```sh
npm install
```

**Step 2:** Follow link https://github.com/JamesHust/app-quick-shop/tree/app-android, compare and copy folder android if it's missing files

**Step 3:** Open *app-quick-shop\frontend\myapp\config\config.json*, paste value of IPv4 Address to "SERVER_URL".
![image](https://user-images.githubusercontent.com/52951651/122573358-ea455f80-d078-11eb-99d0-b8863bc41f2d.png)

**Step 4:** Follow file *app-quick-shop\frontend\myapp\pạckage.json* to run this program:
```sh
react-native run-android
```
#### 2. Delivery App
**Step 1:** Open folder *app-quick-shop\frontend\shipper-app* and open terminal to run this command
```sh
npm install
```

**Step 2:** Open *app-quick-shop\frontend\shipper-app\config\config.json*, paste value of IPv4 Address to "SERVER_URL".
![image](https://user-images.githubusercontent.com/52951651/122574962-6be9bd00-d07a-11eb-8797-7ea4bc9b940f.png)

**Step 3:** Follow file *app-quick-shop\frontend\shipper-app\pạckage.json* to run this program:
```sh
expo start --android
```
#### 3. Web Store Management
**Step 1:** Open folder *app-quick-shop\frontend\web* and open terminal to run this command
```sh
npm install
```

**Step 2:** Open *app-quick-shop\frontend\web\src\config\config.json*, paste value of IPv4 Address to "SERVER_URL".
![image](https://user-images.githubusercontent.com/52951651/122574735-2c22d580-d07a-11eb-86a5-d6debdf54be5.png)

**Step 3:** Follow file *app-quick-shop\frontend\web\pạckage.json* to run this program:
```sh
npm start
```

### License
[MIT](https://github.com/JamesHust)

Copyright (c) 2021-present, MTHUNG

If you have any questions, please send them to the mailbox with the address : **hungjame99@gmail.com** or **hungmt.0812@gmail.com**. 
Thank you!
