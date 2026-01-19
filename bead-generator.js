// 拼豆图纸生成器核心功能
class BeadGenerator {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImg = document.getElementById('previewImg');
        this.removeImg = document.getElementById('removeImg');
        this.generateBtn = document.getElementById('generateBtn');
        this.gridSize = document.getElementById('gridSize');
        this.gridSizeInput = document.getElementById('gridSizeInput');
        this.scale = document.getElementById('scale');
        this.scaleValue = document.getElementById('scaleValue');
        this.colorCount = document.getElementById('colorCount');
        this.colorCountValue = document.getElementById('colorCountValue');
        this.brightness = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightnessValue');
        this.contrast = document.getElementById('contrast');
        this.contrastValue = document.getElementById('contrastValue');
        this.beadGridContainer = document.getElementById('beadGridContainer');
        this.downloadSection = document.getElementById('downloadSection');
        this.downloadHtml = document.getElementById('downloadHtml');
        this.downloadPng = document.getElementById('downloadPng');
        this.downloadJpg = document.getElementById('downloadJpg');
        this.downloadPdf = document.getElementById('downloadPdf');
        this.printMaterials = document.getElementById('printMaterials');
        this.downloadQuality = document.getElementById('downloadQuality');
        this.statsSection = document.getElementById('statsSection');
        this.beadStats = document.getElementById('beadStats');
        this.totalBeads = document.getElementById('totalBeads');
        this.canvas = document.getElementById('imageCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 模态窗口元素
        this.materialsModal = document.getElementById('materialsModal');
        this.closeModal = this.materialsModal.querySelector('.close');
        this.printBtn = document.getElementById('printBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.materialsTable = document.getElementById('materialsTable');
        this.materialsTotal = document.getElementById('materialsTotal');
        this.materialsTime = document.getElementById('materialsTime');
        this.materialsGridSize = document.getElementById('materialsGridSize');
        
        this.uploadedImage = null;
        this.beadGrid = [];
        this.beadStatsData = {};
        
        this.init();
    }
    
    // 初始化事件监听器
    init() {
        // 文件上传事件
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.uploadArea.addEventListener('dragover', (e) => e.preventDefault());
        this.uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        this.removeImg.addEventListener('click', () => this.removeImage());
        
        // 参数调整事件
        this.gridSize.addEventListener('input', (e) => this.updateGridSize(e.target.value));
        this.gridSizeInput.addEventListener('input', (e) => this.updateGridSize(e.target.value));
        this.scale.addEventListener('input', (e) => this.updateScale(e.target.value));
        this.colorCount.addEventListener('input', (e) => this.updateColorCount(e.target.value));
        this.brightness.addEventListener('input', (e) => this.updateBrightness(e.target.value));
        this.contrast.addEventListener('input', (e) => this.updateContrast(e.target.value));
        
        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => this.generateBeadGrid());
        
        // 下载按钮事件
        this.downloadHtml.addEventListener('click', () => this.downloadHTML());
        this.downloadPng.addEventListener('click', () => this.downloadPNG());
        this.downloadJpg.addEventListener('click', () => this.downloadJPG());
        this.downloadPdf.addEventListener('click', () => this.downloadPDF());
        this.printMaterials.addEventListener('click', () => this.openMaterialsModal());
        
        // 模态窗口事件
        this.closeModal.addEventListener('click', () => this.closeMaterialsModal());
        this.closeModalBtn.addEventListener('click', () => this.closeMaterialsModal());
        this.printBtn.addEventListener('click', () => this.printMaterialsList());
        
        // 点击模态窗口外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === this.materialsModal) {
                this.closeMaterialsModal();
            }
        });
    }
    
    // 处理文件上传
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }
    
    // 处理文件拖拽
    handleFileDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            this.processImage(file);
        }
    }
    
    // 处理图片
    processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.previewImg.src = e.target.result;
                this.imagePreview.style.display = 'block';
                this.uploadArea.style.display = 'none';
                this.generateBtn.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // 移除图片
    removeImage() {
        this.uploadedImage = null;
        this.previewImg.src = '';
        this.imagePreview.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.generateBtn.disabled = true;
        this.beadGridContainer.innerHTML = this.getPlaceholderHTML();
        this.downloadSection.style.display = 'none';
        this.statsSection.style.display = 'none';
    }
    
    // 更新网格大小
    updateGridSize(value) {
        const size = Math.max(10, Math.min(100, parseInt(value)));
        this.gridSize.value = size;
        this.gridSizeInput.value = size;
    }
    
    // 更新缩放比例
    updateScale(value) {
        const scale = parseFloat(value);
        this.scaleValue.textContent = scale.toFixed(1);
    }
    
    // 更新颜色数量
    updateColorCount(value) {
        this.colorCountValue.textContent = value;
    }
    
    // 更新亮度
    updateBrightness(value) {
        this.brightnessValue.textContent = value;
    }
    
    // 更新对比度
    updateContrast(value) {
        this.contrastValue.textContent = value;
    }
    
    // 获取占位符HTML
    getPlaceholderHTML() {
        return `
            <div class="placeholder">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <p>上传图片并点击生成按钮查看预览</p>
            </div>
        `;
    }
    
    // 根据清晰度设置获取拼豆大小
    getBeadSizeByQuality() {
        const quality = this.downloadQuality.value;
        switch(quality) {
            case 'low': return 15;
            case 'medium': return 25;
            case 'high': return 40;
            case 'ultra': return 60;
            default: return 25;
        }
    }
    
    // 根据清晰度设置获取JPG质量
    getJpgQualityBySetting() {
        const quality = this.downloadQuality.value;
        switch(quality) {
            case 'low': return 0.6;
            case 'medium': return 0.8;
            case 'high': return 0.95;
            case 'ultra': return 1.0;
            default: return 0.8;
        }
    }
    
    // 打开用料清单模态窗口
    openMaterialsModal() {
        if (this.beadGrid.length === 0) {
            alert('请先生成拼豆图纸！');
            return;
        }
        
        // 填充用料数据
        this.fillMaterialsData();
        
        // 显示模态窗口
        this.materialsModal.style.display = 'block';
    }
    
    // 关闭用料清单模态窗口
    closeMaterialsModal() {
        this.materialsModal.style.display = 'none';
    }
    
    // 填充用料数据
    fillMaterialsData() {
        const tbody = this.materialsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        let total = 0;
        const sortedStats = Object.values(this.beadStatsData).sort((a, b) => b.count - a.count);
        
        // 填充表格数据
        sortedStats.forEach(stat => {
            total += stat.count;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="color-swatch" style="background-color: ${stat.hex}"></span>${stat.name}</td>
                <td>${stat.id}</td>
                <td>${stat.name}</td>
                <td>${stat.count}</td>
            `;
            tbody.appendChild(row);
        });
        
        // 更新总数量
        this.materialsTotal.textContent = total;
        
        // 更新时间和网格大小
        this.materialsTime.textContent = new Date().toLocaleString();
        this.materialsGridSize.textContent = `${this.beadGrid[0].length} × ${this.beadGrid.length}`;
    }
    
    // 打印用料清单
    printMaterialsList() {
        // 调用浏览器打印功能
        window.print();
    }
    
    // 生成拼豆网格
    generateBeadGrid() {
        if (!this.uploadedImage) return;
        
        const gridSize = parseInt(this.gridSize.value);
        const scale = parseFloat(this.scale.value);
        const brightness = parseInt(this.brightness.value);
        const contrast = parseInt(this.contrast.value);
        
        // 清空之前的网格
        this.beadGrid = [];
        this.beadStatsData = {};
        
        // 设置Canvas大小 - 提高处理精度，去除最大限制
        const canvasWidth = Math.floor(this.uploadedImage.width * scale);
        const canvasHeight = Math.floor(this.uploadedImage.height * scale);
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // 优化Canvas绘制质量
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // 绘制并处理图片
        this.ctx.drawImage(this.uploadedImage, 0, 0, canvasWidth, canvasHeight);
        this.adjustImage(brightness, contrast);
        
        // 计算网格参数 - 支持多种宽高比例
        // 根据图片原始比例计算合适的网格尺寸
        const aspectRatio = canvasWidth / canvasHeight;
        
        // 计算基础网格大小
        let actualColumns, actualRows;
        
        if (aspectRatio > 1) {
            // 宽屏图片
            actualColumns = Math.min(gridSize, Math.max(10, Math.floor(canvasWidth / 2)));
            actualRows = Math.max(10, Math.floor(actualColumns / aspectRatio));
        } else if (aspectRatio < 1) {
            // 竖屏图片
            actualRows = Math.min(gridSize, Math.max(10, Math.floor(canvasHeight / 2)));
            actualColumns = Math.max(10, Math.floor(actualRows * aspectRatio));
        } else {
            // 正方形图片
            actualColumns = Math.min(gridSize, Math.max(10, Math.floor(canvasWidth / 2)));
            actualRows = actualColumns;
        }
        
        // 确保至少有10x10的网格
        actualColumns = Math.max(10, actualColumns);
        actualRows = Math.max(10, actualRows);
        
        // 计算单元格大小
        const cellWidth = canvasWidth / actualColumns;
        const cellHeight = canvasHeight / actualRows;
        
        // 生成拼豆网格
        for (let row = 0; row < actualRows; row++) {
            const gridRow = [];
            for (let col = 0; col < actualColumns; col++) {
                // 获取单元格平均颜色
                const avgColor = this.getAverageColor(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                // 查找最接近的拼豆颜色
                const beadColor = findNearestBeadColor(avgColor);
                gridRow.push(beadColor);
                
                // 更新统计数据
                if (this.beadStatsData[beadColor.id]) {
                    this.beadStatsData[beadColor.id].count++;
                } else {
                    this.beadStatsData[beadColor.id] = {
                        ...beadColor,
                        count: 1
                    };
                }
            }
            this.beadGrid.push(gridRow);
        }
        
        // 显示结果
        this.displayBeadGrid(actualColumns, actualRows);
        this.displayStats();
        this.downloadSection.style.display = 'block';
    }
    
    // 调整图片亮度和对比度
    adjustImage(brightness, contrast) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 亮度调整: -100 到 100
        const brightnessFactor = brightness / 100;
        // 对比度调整: -100 到 100
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        
        for (let i = 0; i < data.length; i += 4) {
            // 调整对比度
            data[i] = contrastFactor * (data[i] - 128) + 128 + brightnessFactor * 255;
            data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128 + brightnessFactor * 255;
            data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128 + brightnessFactor * 255;
            
            // 确保颜色值在 0-255 范围内
            data[i] = Math.max(0, Math.min(255, data[i]));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    // 获取单元格平均颜色
    getAverageColor(x, y, width, height) {
        const imageData = this.ctx.getImageData(x, y, width, height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        const pixelCount = width * height;
        
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }
        
        return [
            Math.round(r / pixelCount),
            Math.round(g / pixelCount),
            Math.round(b / pixelCount)
        ];
    }
    
    // 显示拼豆网格
    displayBeadGrid(columns, rows) {
        // 创建网格容器
        const grid = document.createElement('div');
        grid.className = 'bead-grid';
        grid.style.gridTemplateColumns = `repeat(${columns}, 20px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 20px)`;
        
        // 填充网格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const beadColor = this.beadGrid[row][col];
                const beadCell = document.createElement('div');
                beadCell.className = 'bead-cell';
                beadCell.style.backgroundColor = beadColor.hex;
                beadCell.setAttribute('data-bead-id', beadColor.id);
                beadCell.title = `${beadColor.name} (${beadColor.id})`;
                grid.appendChild(beadCell);
            }
        }
        
        // 更新容器内容
        this.beadGridContainer.innerHTML = '';
        this.beadGridContainer.appendChild(grid);
    }
    
    // 显示统计信息
    displayStats() {
        const tbody = this.beadStats.querySelector('tbody');
        tbody.innerHTML = '';
        
        let total = 0;
        
        // 按数量排序
        const sortedStats = Object.values(this.beadStatsData)
            .sort((a, b) => b.count - a.count);
        
        // 生成统计表格
        sortedStats.forEach(stat => {
            total += stat.count;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="color-swatch" style="background-color: ${stat.hex}"></span>${stat.name}</td>
                <td>${stat.id}</td>
                <td>${stat.name}</td>
                <td>${stat.count}</td>
            `;
            tbody.appendChild(row);
        });
        
        // 更新总数量
        this.totalBeads.textContent = total;
        this.statsSection.style.display = 'block';
    }
    
    // 下载HTML格式
    downloadHTML() {
        const gridSize = parseInt(this.gridSize.value);
        const columns = this.beadGrid[0].length;
        const rows = this.beadGrid.length;
        
        // 生成HTML内容，提高拼豆大小以获得更高清晰度
        const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>拼豆图纸</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .bead-grid {
            display: grid;
            gap: 1px;
            background-color: #ddd;
            border: 2px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            margin: 20px auto;
            max-width: fit-content;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
        }
        .bead-cell {
            width: 30px;
            height: 30px;
            border-radius: 2px;
            position: relative;
            transition: all 0.2s ease;
        }
        .bead-cell:hover {
            transform: scale(1.1);
            z-index: 10;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .bead-cell::after {
            content: attr(data-bead-id);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.7);
        }
        .stats {
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 14px;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            position: sticky;
            top: 0;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .color-swatch {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
            border: 1px solid #ddd;
            vertical-align: middle;
        }
        .total {
            text-align: right;
            font-weight: bold;
            margin-top: 10px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            font-size: 16px;
        }
        .info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #1565c0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>拼豆图纸</h1>
        
        <div class="info">
            <strong>图纸信息：</strong>网格大小 ${columns}x${rows}，总拼豆数量 ${Object.values(this.beadStatsData).reduce((sum, stat) => sum + stat.count, 0)} 个
        </div>
        
        <div class="bead-grid" style="grid-template-columns: repeat(${columns}, 30px);">
            ${this.beadGrid.map(row => 
                row.map(bead => 
                    `<div class="bead-cell" style="background-color: ${bead.hex}" data-bead-id="${bead.id}" title="${bead.name} (${bead.id})"></div>`
                ).join('')
            ).join('')}
        </div>
        
        <div class="stats">
            <h2>拼豆统计</h2>
            <table>
                <thead>
                    <tr>
                        <th>颜色</th>
                        <th>编号</th>
                        <th>名称</th>
                        <th>数量</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.values(this.beadStatsData)
                        .sort((a, b) => b.count - a.count)
                        .map(stat => 
                            `<tr>
                                <td><span class="color-swatch" style="background-color: ${stat.hex}"></span>${stat.name}</td>
                                <td>${stat.id}</td>
                                <td>${stat.name}</td>
                                <td>${stat.count}</td>
                            </tr>`
                        ).join('')}
                </tbody>
            </table>
            <div class="total">
                总拼豆数量: <strong>${Object.values(this.beadStatsData).reduce((sum, stat) => sum + stat.count, 0)}</strong>
            </div>
        </div>
    </div>
</body>
</html>
        `;
        
        // 创建下载链接
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bead-pattern.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 下载PNG格式
    downloadPNG() {
        // 创建用于导出的Canvas - 提高分辨率
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // 根据清晰度设置获取拼豆大小
        const beadSize = this.getBeadSizeByQuality();
        const columns = this.beadGrid[0].length;
        const rows = this.beadGrid.length;
        
        // 设置Canvas大小
        exportCanvas.width = columns * beadSize;
        exportCanvas.height = rows * beadSize;
        
        // 优化导出Canvas质量
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // 填充背景
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // 绘制拼豆网格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const beadColor = this.beadGrid[row][col];
                exportCtx.fillStyle = beadColor.hex;
                
                // 绘制拼豆
                const x = col * beadSize;
                const y = row * beadSize;
                exportCtx.fillRect(x, y, beadSize, beadSize);
                
                // 绘制更清晰的网格线
                exportCtx.strokeStyle = '#DDDDDD';
                exportCtx.lineWidth = 1;
                exportCtx.strokeRect(x, y, beadSize, beadSize);
                
                // 添加清晰的编号
                const fontSize = Math.max(8, Math.floor(beadSize * 0.3));
                exportCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                exportCtx.font = `${fontSize}px Arial Bold`;
                exportCtx.textAlign = 'center';
                exportCtx.textBaseline = 'middle';
                exportCtx.fillText(beadColor.id, x + beadSize / 2, y + beadSize / 2);
            }
        }
        
        // 创建下载链接 - 使用更高质量的压缩
        const url = exportCanvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bead-pattern.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // 下载JPG格式
    downloadJPG() {
        // 创建用于导出的Canvas
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // 根据清晰度设置获取拼豆大小
        const beadSize = this.getBeadSizeByQuality();
        const columns = this.beadGrid[0].length;
        const rows = this.beadGrid.length;
        
        // 设置Canvas大小
        exportCanvas.width = columns * beadSize;
        exportCanvas.height = rows * beadSize;
        
        // 优化导出Canvas质量
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // 填充背景
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // 绘制拼豆网格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const beadColor = this.beadGrid[row][col];
                exportCtx.fillStyle = beadColor.hex;
                
                // 绘制拼豆
                const x = col * beadSize;
                const y = row * beadSize;
                exportCtx.fillRect(x, y, beadSize, beadSize);
                
                // 绘制更清晰的网格线
                exportCtx.strokeStyle = '#DDDDDD';
                exportCtx.lineWidth = 1;
                exportCtx.strokeRect(x, y, beadSize, beadSize);
                
                // 添加清晰的编号
                const fontSize = Math.max(8, Math.floor(beadSize * 0.3));
                exportCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                exportCtx.font = `${fontSize}px Arial Bold`;
                exportCtx.textAlign = 'center';
                exportCtx.textBaseline = 'middle';
                exportCtx.fillText(beadColor.id, x + beadSize / 2, y + beadSize / 2);
            }
        }
        
        // 创建下载链接 - 根据设置调整JPG质量
        const quality = this.getJpgQualityBySetting();
        const url = exportCanvas.toDataURL('image/jpeg', quality);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bead-pattern.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // 下载PDF格式
    downloadPDF() {
        // 创建用于导出的Canvas
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // 根据清晰度设置获取拼豆大小
        const beadSize = this.getBeadSizeByQuality();
        const columns = this.beadGrid[0].length;
        const rows = this.beadGrid.length;
        
        // 设置Canvas大小
        exportCanvas.width = columns * beadSize;
        exportCanvas.height = rows * beadSize;
        
        // 优化导出Canvas质量
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        
        // 填充背景
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // 绘制拼豆网格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const beadColor = this.beadGrid[row][col];
                exportCtx.fillStyle = beadColor.hex;
                
                // 绘制拼豆
                const x = col * beadSize;
                const y = row * beadSize;
                exportCtx.fillRect(x, y, beadSize, beadSize);
                
                // 绘制更清晰的网格线
                exportCtx.strokeStyle = '#DDDDDD';
                exportCtx.lineWidth = 1;
                exportCtx.strokeRect(x, y, beadSize, beadSize);
                
                // 添加清晰的编号
                const fontSize = Math.max(8, Math.floor(beadSize * 0.3));
                exportCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                exportCtx.font = `${fontSize}px Arial Bold`;
                exportCtx.textAlign = 'center';
                exportCtx.textBaseline = 'middle';
                exportCtx.fillText(beadColor.id, x + beadSize / 2, y + beadSize / 2);
            }
        }
        
        // 创建PDF文档
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: exportCanvas.width > exportCanvas.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // 添加标题
        pdf.setFontSize(18);
        pdf.text('拼豆图纸', pageWidth / 2, 20, { align: 'center' });
        
        // 添加拼豆图
        const imgData = exportCanvas.toDataURL('image/png');
        const imgWidth = Math.min(pageWidth - 40, 200); // 最大200mm
        const imgHeight = (imgWidth / exportCanvas.width) * exportCanvas.height;
        
        // 计算居中位置
        const x = (pageWidth - imgWidth) / 2;
        const y = 30;
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        
        // 添加统计信息
        pdf.setFontSize(12);
        const statsY = y + imgHeight + 20;
        
        pdf.text('拼豆统计信息:', 20, statsY);
        pdf.text(`网格尺寸: ${columns} × ${rows}`, 30, statsY + 10);
        pdf.text(`总拼豆数量: ${Object.values(this.beadStatsData).reduce((sum, stat) => sum + stat.count, 0)}`, 30, statsY + 20);
        
        // 添加颜色统计
        pdf.setFontSize(10);
        let colorStatsY = statsY + 40;
        const sortedStats = Object.values(this.beadStatsData).sort((a, b) => b.count - a.count);
        
        sortedStats.forEach((stat, index) => {
            if (colorStatsY > pageHeight - 30) {
                pdf.addPage();
                colorStatsY = 30;
            }
            
            const swatchX = 30;
            const textX = 45;
            const swatchSize = 5;
            
            // 绘制颜色样本
            pdf.setFillColor(stat.rgb[0], stat.rgb[1], stat.rgb[2]);
            pdf.rect(swatchX, colorStatsY - swatchSize/2, swatchSize, swatchSize, 'F');
            
            // 绘制颜色信息
            const text = `${stat.id} ${stat.name}: ${stat.count}个`;
            pdf.text(text, textX, colorStatsY);
            
            colorStatsY += 8;
        });
        
        // 添加生成时间
        pdf.setFontSize(10);
        pdf.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 20, pageHeight - 20);
        
        // 保存PDF
        pdf.save('bead-pattern.pdf');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BeadGenerator();
});