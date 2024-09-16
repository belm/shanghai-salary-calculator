# 上海工资计算器

这是一个使用React和Tailwind CSS开发的简单上海工资计算器。它可以根据输入的月工资和社保基数,计算出到手工资、五险一金扣除和个人所得税。

## 环境要求

- Node.js (推荐版本 14.0.0 或更高)
- npm (通常随Node.js一起安装)

## 安装步骤

1. 克隆或下载此项目到本地。

2. 打开终端,进入项目根目录。

3. 运行以下命令安装依赖:

   ```
   npm install
   ```

4. 安装Tailwind CSS及其依赖:

   ```
   npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
   ```

5. 初始化Tailwind CSS配置文件:

   ```
   npx tailwindcss init -p
   ```

6. 确保`src/index.css`文件包含以下内容:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## 运行项目

在项目根目录下,运行以下��令启动开发服务器:

```
npm start
```

这将在开发模式下运行应用。打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

当您对代码进行修改时,页面将自动重新加载。

## 构建项目

要构建用于生产环境的应用,请运行:

```
npm run build
```

## 项目结构

- `src/App.jsx`: 主要的应用组件,包含工资计算器的全部逻辑和UI。
- `src/index.js`: 应用的入口点，负责渲染React组件。
- `src/index.css`: 包含Tailwind CSS的导入语句。
- `public/index.html`: 应用的HTML模板。
- `public/manifest.json`: Web应用清单文件。
- `tailwind.config.js`: Tailwind CSS配置文件。
- `package.json`: 项目依赖和脚本配置文件。