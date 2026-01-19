# 拼豆图纸生成器

一个功能齐全的拼豆图纸生成器，可以将图片转换为拼豆图纸，支持多种格式下载和用料统计。

## 功能特性

- 📤 支持图片上传和拖拽功能
- 🎨 丰富的参数调整选项
  - 网格大小调整
  - 图片缩放控制
  - 亮度和对比度调整
- 🖼️ 高质量拼豆网格生成
- 💾 多种格式下载
  - HTML
  - PNG
  - JPG
  - PDF
- 📊 详细的用料统计
  - 颜色数量统计
  - 总拼豆数量
  - 支持打印用料清单
- 🎯 蓝白主题设计
- 📱 响应式布局

## 快速开始

### 本地运行

1. **使用Python服务器**
   ```bash
   python -m http.server 8000
   ```
   然后在浏览器中访问 `http://localhost:8000`

2. **使用Node.js服务器**
   ```bash
   # 安装http-server（如果未安装）
   npm install -g http-server
   
   # 启动服务器
   http-server -p 8000
   ```
   然后在浏览器中访问 `http://localhost:8000`

3. **直接打开HTML文件**
   - 直接双击 `index.html` 文件在浏览器中打开
   - 注意：某些浏览器可能会限制本地文件的某些功能

## 部署到网络

### 方法1：GitHub Pages（推荐，免费）

1. **创建GitHub仓库**
   - 登录GitHub，创建一个新的仓库
   - 仓库名称建议使用 `bead-pattern-generator` 或类似名称

2. **上传项目文件**
   ```bash
   # 初始化Git仓库
   git init
   
   # 添加文件
   git add .
   
   # 提交更改
   git commit -m "Initial commit"
   
   # 添加远程仓库
   git remote add origin https://github.com/yourusername/your-repo-name.git
   
   # 推送代码
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库设置
   - 找到 "Pages" 选项
   - 在 "Source" 下拉菜单中选择 "main" 分支
   - 点击 "Save"
   - 等待几分钟，GitHub会生成一个URL，例如 `https://yourusername.github.io/your-repo-name/`

4. **访问你的网站**
   - 使用生成的URL访问你的拼豆图纸生成器

### 方法2：Vercel（免费）

1. **创建Vercel账号**
   - 访问 [Vercel官网](https://vercel.com/) 并注册账号

2. **导入GitHub仓库**
   - 登录Vercel，点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Deploy"

3. **访问你的网站**
   - 部署完成后，Vercel会生成一个URL，例如 `https://your-repo-name.vercel.app/`

### 方法3：Netlify（免费）

1. **创建Netlify账号**
   - 访问 [Netlify官网](https://www.netlify.com/) 并注册账号

2. **导入GitHub仓库**
   - 登录Netlify，点击 "New site from Git"
   - 选择GitHub，授权访问你的仓库
   - 选择你的仓库
   - 点击 "Deploy site"

3. **访问你的网站**
   - 部署完成后，Netlify会生成一个URL，例如 `https://your-repo-name.netlify.app/`

## 项目结构

```
bead-pattern-generator/
├── index.html          # 主页面
├── style.css           # 样式文件
├── bead-colors.js      # 拼豆色系定义
├── bead-generator.js   # 核心功能实现
└── README.md           # 项目说明
```

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API
- jsPDF (用于PDF生成)

## 使用说明

1. **上传图片**
   - 点击或拖拽图片到上传区域
   - 支持 JPG、PNG、GIF 等格式

2. **调整参数**
   - 调整网格大小（10-100）
   - 调整图片缩放比例
   - 调整亮度和对比度

3. **生成图纸**
   - 点击 "生成拼豆图纸" 按钮
   - 查看生成的拼豆图纸预览

4. **查看统计**
   - 查看拼豆颜色统计信息
   - 查看总拼豆数量

5. **下载或打印**
   - 选择下载格式（HTML、PNG、JPG、PDF）
   - 调整下载清晰度
   - 点击 "打印用料" 查看并打印用料清单

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge
- IE 11+（部分功能可能受限）

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，欢迎通过GitHub Issues反馈。
