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
        
        // 图像预处理增强
        let imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        
        // 1. 高斯模糊降噪 - 减少图像噪声，提高颜色提取准确性
        imageData = this.gaussianBlur(imageData, 1.5);
        this.ctx.putImageData(imageData, 0, 0);
        
        // 2. 自适应直方图均衡化 - 增强图像对比度，提高边缘识别
        imageData = this.adaptiveHistogramEqualization(imageData, 8, 8);
        this.ctx.putImageData(imageData, 0, 0);
        
        // 3. 边缘增强处理 - 提高边缘像素识别精度
        imageData = this.ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const enhancedImageData = this.enhanceEdges(imageData);
        this.ctx.putImageData(enhancedImageData, 0, 0);
        
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
                
                // 判断当前单元格是否为边缘单元格
                const cellImageData = this.ctx.getImageData(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                const edgeStrength = this.calculateEdgeStrength(cellImageData);
                
                // 计算边缘强度平均值，判断是否为边缘像素
                let edgeSum = 0;
                let pixelCount = 0;
                for (let y = 0; y < edgeStrength.length; y++) {
                    for (let x = 0; x < edgeStrength[y].length; x++) {
                        edgeSum += edgeStrength[y][x];
                        pixelCount++;
                    }
                }
                const avgEdgeStrength = edgeSum / pixelCount;
                const isEdgePixel = avgEdgeStrength > 0.3; // 边缘阈值
                
                // 查找最接近的拼豆颜色 - 添加边缘感知参数
                const beadColor = findNearestBeadColor(avgColor, isEdgePixel);
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
        
        // 后处理：空间滤波和颜色一致性检查
        this.postProcessBeadGrid();
        
        // 更新统计数据（后处理后）
        this.updateStatsAfterPostProcessing();
        
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
    
    // 获取单元格平均颜色 - 优化版本，实现自适应窗口大小和边缘感知采样
    getAverageColor(x, y, width, height) {
        const imageData = this.ctx.getImageData(x, y, width, height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let totalWeight = 0;
        
        // 计算单元格中心
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 处理小尺寸单元格（特殊情况）
        if (width < 3 || height < 3) {
            // 对于小尺寸单元格，直接使用简单平均，不进行边缘检测
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const index = (row * width + col) * 4;
                    r += data[index];
                    g += data[index + 1];
                    b += data[index + 2];
                    totalWeight++;
                }
            }
        } else {
            // 计算边缘强度图 - 用于边缘感知采样
            const edgeStrength = this.calculateEdgeStrength(imageData);
            
            // 自适应窗口调整：根据边缘强度动态调整采样策略
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    // 计算当前像素到中心的距离
                    const distanceX = Math.abs(col - centerX);
                    const distanceY = Math.abs(row - centerY);
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    
                    // 1. 高斯距离权重
                    const sigma = Math.sqrt(width * width + height * height) / 6;
                    const distanceWeight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                    
                    // 2. 边缘感知权重：边缘区域增加权重，提高边缘像素识别精度
                    const edgeWeight = 1 + (edgeStrength[row][col] * 0.5);
                    
                    // 3. 自适应窗口权重：根据边缘强度调整采样范围
                    const adaptiveWeight = this.calculateAdaptiveWeight(edgeStrength[row][col], distance, width, height);
                    
                    // 综合权重
                    const weight = distanceWeight * edgeWeight * adaptiveWeight;
                    
                    // 获取像素索引
                    const index = (row * width + col) * 4;
                    
                    // 累加颜色值（带权重）
                    r += data[index] * weight;
                    g += data[index + 1] * weight;
                    b += data[index + 2] * weight;
                    totalWeight += weight;
                }
            }
        }
        
        // 确保返回有效的RGB值
        return [
            Math.max(0, Math.min(255, Math.round(r / totalWeight))),
            Math.max(0, Math.min(255, Math.round(g / totalWeight))),
            Math.max(0, Math.min(255, Math.round(b / totalWeight)))
        ];
    }
    
    // 计算边缘强度图
    calculateEdgeStrength(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const edgeStrength = [];
        
        // 初始化边缘强度图
        for (let y = 0; y < height; y++) {
            edgeStrength[y] = [];
            for (let x = 0; x < width; x++) {
                edgeStrength[y][x] = 0;
            }
        }
        
        // 处理小尺寸图像（特殊情况）
        if (width < 3 || height < 3) {
            // 对于小尺寸图像，直接返回全零边缘强度
            return edgeStrength;
        }
        
        // Sobel边缘检测计算边缘强度
        const sobelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        const sobelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gxR = 0, gxG = 0, gxB = 0;
                let gyR = 0, gyG = 0, gyB = 0;
                
                // 计算梯度
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const px = x + kx;
                        const py = y + ky;
                        const idx = (py * width + px) * 4;
                        
                        gxR += data[idx] * sobelX[ky + 1][kx + 1];
                        gxG += data[idx + 1] * sobelX[ky + 1][kx + 1];
                        gxB += data[idx + 2] * sobelX[ky + 1][kx + 1];
                        
                        gyR += data[idx] * sobelY[ky + 1][kx + 1];
                        gyG += data[idx + 1] * sobelY[ky + 1][kx + 1];
                        gyB += data[idx + 2] * sobelY[ky + 1][kx + 1];
                    }
                }
                
                // 计算梯度幅值
                const gradR = Math.abs(gxR) + Math.abs(gyR);
                const gradG = Math.abs(gxG) + Math.abs(gyG);
                const gradB = Math.abs(gxB) + Math.abs(gyB);
                
                // 归一化边缘强度到[0, 1]
                const maxGrad = Math.max(gradR, gradG, gradB);
                edgeStrength[y][x] = Math.min(1, maxGrad / 255);
            }
        }
        
        return edgeStrength;
    }
    
    // 计算自适应窗口权重
    calculateAdaptiveWeight(edgeStrength, distance, width, height) {
        // 边缘强度越高，权重衰减越慢，扩大有效采样范围
        const adaptiveFactor = 1 + (edgeStrength * 0.8);
        const maxDistance = Math.sqrt(width * width + height * height) / 2;
        const normalizedDistance = distance / maxDistance;
        
        // 自适应权重：边缘区域权重衰减更慢
        return Math.exp(-(normalizedDistance * normalizedDistance) / (2 * adaptiveFactor * adaptiveFactor));
    }
    
    // 边缘增强处理 - 高级Canny边缘检测算法
    enhanceEdges(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        
        // 1. 灰度转换 - 提高边缘检测效率
        const grayData = this.rgbToGrayscale(imageData);
        
        // 2. 高斯模糊 - 减少噪声
        const blurredData = this.gaussianBlur1D(grayData, width, height, 1.4);
        
        // 3. Sobel算子计算梯度
        const { gradient, direction } = this.calculateGradient(blurredData, width, height);
        
        // 4. 非极大值抑制 - 细化边缘
        const suppressedData = this.nonMaximumSuppression(gradient, direction, width, height);
        
        // 5. 自适应双阈值 - 识别强边缘和弱边缘
        const { strongEdges, weakEdges } = this.adaptiveThresholding(suppressedData, width, height);
        
        // 6. 边缘跟踪 - 连接弱边缘到强边缘
        const edges = this.edgeTrackingByHysteresis(strongEdges, weakEdges, gradient, width, height);
        
        // 7. 应用边缘增强到原图像
        return this.applyEdgeEnhancement(imageData, edges, width, height);
    }
    
    // RGB转灰度
    rgbToGrayscale(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const grayData = new Float32Array(width * height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                // 使用标准灰度转换公式
                grayData[y * width + x] = 0.299 * r + 0.587 * g + 0.114 * b;
            }
        }
        
        return grayData;
    }
    
    // 1D高斯模糊（更高效）
    gaussianBlur1D(data, width, height, sigma) {
        const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
        const kernel = new Float32Array(kernelSize);
        const center = Math.floor(kernelSize / 2);
        
        // 创建高斯核
        let sum = 0;
        for (let i = 0; i < kernelSize; i++) {
            const distance = i - center;
            kernel[i] = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            sum += kernel[i];
        }
        
        // 归一化
        for (let i = 0; i < kernelSize; i++) {
            kernel[i] /= sum;
        }
        
        // 水平模糊
        const tempData = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let weightSum = 0;
                for (let k = -center; k <= center; k++) {
                    const px = Math.max(0, Math.min(width - 1, x + k));
                    const weight = kernel[k + center];
                    sum += data[y * width + px] * weight;
                    weightSum += weight;
                }
                tempData[y * width + x] = sum / weightSum;
            }
        }
        
        // 垂直模糊
        const blurredData = new Float32Array(width * height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let sum = 0;
                let weightSum = 0;
                for (let k = -center; k <= center; k++) {
                    const py = Math.max(0, Math.min(height - 1, y + k));
                    const weight = kernel[k + center];
                    sum += tempData[py * width + x] * weight;
                    weightSum += weight;
                }
                blurredData[y * width + x] = sum / weightSum;
            }
        }
        
        return blurredData;
    }
    
    // 计算梯度
    calculateGradient(data, width, height) {
        const gradient = new Float32Array(width * height);
        const direction = new Uint8Array(width * height);
        
        const sobelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        const sobelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const px = x + kx;
                        const py = y + ky;
                        gx += data[py * width + px] * sobelX[ky + 1][kx + 1];
                        gy += data[py * width + px] * sobelY[ky + 1][kx + 1];
                    }
                }
                
                // 梯度幅值
                gradient[y * width + x] = Math.sqrt(gx * gx + gy * gy);
                
                // 梯度方向（0-3）
                let angle = Math.atan2(gy, gx) * (180 / Math.PI);
                if (angle < 0) angle += 180;
                
                if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle < 180)) {
                    direction[y * width + x] = 0; // 0度
                } else if (angle >= 22.5 && angle < 67.5) {
                    direction[y * width + x] = 1; // 45度
                } else if (angle >= 67.5 && angle < 112.5) {
                    direction[y * width + x] = 2; // 90度
                } else if (angle >= 112.5 && angle < 157.5) {
                    direction[y * width + x] = 3; // 135度
                }
            }
        }
        
        return { gradient, direction };
    }
    
    // 非极大值抑制
    nonMaximumSuppression(gradient, direction, width, height) {
        const suppressed = new Float32Array(width * height);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const current = gradient[y * width + x];
                let neighbor1 = 0, neighbor2 = 0;
                
                // 根据梯度方向获取相邻像素
                switch (direction[y * width + x]) {
                    case 0: // 0度
                        neighbor1 = gradient[y * width + (x - 1)];
                        neighbor2 = gradient[y * width + (x + 1)];
                        break;
                    case 1: // 45度
                        neighbor1 = gradient[(y - 1) * width + (x + 1)];
                        neighbor2 = gradient[(y + 1) * width + (x - 1)];
                        break;
                    case 2: // 90度
                        neighbor1 = gradient[(y - 1) * width + x];
                        neighbor2 = gradient[(y + 1) * width + x];
                        break;
                    case 3: // 135度
                        neighbor1 = gradient[(y - 1) * width + (x - 1)];
                        neighbor2 = gradient[(y + 1) * width + (x + 1)];
                        break;
                }
                
                // 只有当前像素大于相邻像素时，保留为边缘
                if (current >= neighbor1 && current >= neighbor2) {
                    suppressed[y * width + x] = current;
                } else {
                    suppressed[y * width + x] = 0;
                }
            }
        }
        
        return suppressed;
    }
    
    // 自适应阈值
    adaptiveThresholding(data, width, height) {
        const strongEdges = new Uint8Array(width * height);
        const weakEdges = new Uint8Array(width * height);
        
        // 计算全局梯度均值和标准差
        let sum = 0, count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > 0) {
                sum += data[i];
                count++;
            }
        }
        const mean = count > 0 ? sum / count : 0;
        
        let variance = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > 0) {
                variance += Math.pow(data[i] - mean, 2);
            }
        }
        const stdDev = count > 0 ? Math.sqrt(variance / count) : 0;
        
        // 自适应阈值
        const highThreshold = mean + 1.5 * stdDev;
        const lowThreshold = mean + 0.5 * stdDev;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                if (data[idx] >= highThreshold) {
                    strongEdges[idx] = 255;
                } else if (data[idx] >= lowThreshold) {
                    weakEdges[idx] = 128;
                }
            }
        }
        
        return { strongEdges, weakEdges };
    }
    
    // 边缘跟踪
    edgeTrackingByHysteresis(strongEdges, weakEdges, gradient, width, height) {
        const edges = new Uint8Array(width * height);
        const visited = new Uint8Array(width * height);
        
        // 首先标记强边缘
        for (let i = 0; i < strongEdges.length; i++) {
            if (strongEdges[i] === 255) {
                edges[i] = 255;
                visited[i] = 1;
            }
        }
        
        // 8邻域方向
        const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        // 遍历弱边缘，连接到强边缘
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                if (weakEdges[idx] === 128 && visited[idx] === 0) {
                    // 检查8邻域是否有强边缘
                    let hasStrongNeighbor = false;
                    for (const [dy, dx] of neighbors) {
                        const nx = x + dx;
                        const ny = y + dy;
                        const nIdx = ny * width + nx;
                        if (strongEdges[nIdx] === 255 || edges[nIdx] === 255) {
                            hasStrongNeighbor = true;
                            break;
                        }
                    }
                    
                    if (hasStrongNeighbor) {
                        edges[idx] = 255;
                        visited[idx] = 1;
                    }
                }
            }
        }
        
        return edges;
    }
    
    // 应用边缘增强
    applyEdgeEnhancement(imageData, edges, width, height) {
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                if (edges[y * width + x] === 255) {
                    // 增强边缘像素
                    data[idx] = Math.min(255, Math.round(data[idx] * 1.3));
                    data[idx + 1] = Math.min(255, Math.round(data[idx + 1] * 1.3));
                    data[idx + 2] = Math.min(255, Math.round(data[idx + 2] * 1.3));
                }
            }
        }
        
        return imageData;
    }
    
    // 后处理：空间滤波和颜色一致性检查
    postProcessBeadGrid() {
        const rows = this.beadGrid.length;
        if (rows === 0) return;
        
        const cols = this.beadGrid[0].length;
        const tempGrid = JSON.parse(JSON.stringify(this.beadGrid));
        
        // 8邻域空间滤波
        const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        // 遍历每个拼豆，进行空间滤波
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // 收集邻域颜色
                const neighborColors = [];
                for (const [dy, dx] of neighbors) {
                    const nr = row + dy;
                    const nc = col + dx;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        neighborColors.push(tempGrid[nr][nc]);
                    }
                }
                
                // 颜色一致性检查：如果当前颜色与多数邻域颜色差异过大，则调整
                if (neighborColors.length > 0) {
                    // 统计邻域颜色分布
                    const colorCount = {};
                    for (const color of neighborColors) {
                        colorCount[color.id] = (colorCount[color.id] || 0) + 1;
                    }
                    
                    // 找到邻域中最常见的颜色
                    let maxCount = 0;
                    let mostCommonColor = neighborColors[0];
                    for (const [id, count] of Object.entries(colorCount)) {
                        if (count > maxCount) {
                            maxCount = count;
                            mostCommonColor = neighborColors.find(c => c.id === id);
                        }
                    }
                    
                    // 如果当前颜色与最常见颜色不同，且最常见颜色占比超过阈值（50%），则调整
                    if (this.beadGrid[row][col].id !== mostCommonColor.id && maxCount / neighborColors.length > 0.5) {
                        // 计算当前颜色与最常见颜色的差异
                        const currentLab = rgbToLab(this.beadGrid[row][col].rgb);
                        const commonLab = rgbToLab(mostCommonColor.rgb);
                        const distance = ciede2000(currentLab, commonLab);
                        
                        // 如果颜色差异较大，则调整为最常见颜色
                        if (distance > 10) {
                            this.beadGrid[row][col] = mostCommonColor;
                        }
                    }
                }
            }
        }
    }
    
    // 更新后处理后的统计数据
    updateStatsAfterPostProcessing() {
        // 重新计算统计数据
        this.beadStatsData = {};
        
        for (const row of this.beadGrid) {
            for (const beadColor of row) {
                if (this.beadStatsData[beadColor.id]) {
                    this.beadStatsData[beadColor.id].count++;
                } else {
                    this.beadStatsData[beadColor.id] = {
                        ...beadColor,
                        count: 1
                    };
                }
            }
        }
    }
    
    // 高斯模糊降噪 - 减少图像噪声，提高颜色提取准确性
    gaussianBlur(imageData, sigma) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const tempData = new Uint8ClampedArray(data);
        
        // 计算高斯核大小
        const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
        const kernel = this.createGaussianKernel(kernelSize, sigma);
        
        // 水平模糊
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let weightSum = 0;
                
                for (let ky = -Math.floor(kernelSize / 2); ky <= Math.floor(kernelSize / 2); ky++) {
                    for (let kx = -Math.floor(kernelSize / 2); kx <= Math.floor(kernelSize / 2); kx++) {
                        const px = Math.max(0, Math.min(width - 1, x + kx));
                        const py = Math.max(0, Math.min(height - 1, y + ky));
                        const idx = (py * width + px) * 4;
                        const weight = kernel[ky + Math.floor(kernelSize / 2)][kx + Math.floor(kernelSize / 2)];
                        
                        r += tempData[idx] * weight;
                        g += tempData[idx + 1] * weight;
                        b += tempData[idx + 2] * weight;
                        a += tempData[idx + 3] * weight;
                        weightSum += weight;
                    }
                }
                
                const idx = (y * width + x) * 4;
                data[idx] = Math.round(r / weightSum);
                data[idx + 1] = Math.round(g / weightSum);
                data[idx + 2] = Math.round(b / weightSum);
                data[idx + 3] = Math.round(a / weightSum);
            }
        }
        
        return imageData;
    }
    
    // 创建高斯核
    createGaussianKernel(size, sigma) {
        const kernel = [];
        const center = Math.floor(size / 2);
        
        for (let y = 0; y < size; y++) {
            kernel[y] = [];
            for (let x = 0; x < size; x++) {
                const distance = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
                kernel[y][x] = Math.exp(-(distance ** 2) / (2 * sigma ** 2));
            }
        }
        
        // 归一化
        let sum = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                sum += kernel[y][x];
            }
        }
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                kernel[y][x] /= sum;
            }
        }
        
        return kernel;
    }
    
    // 自适应直方图均衡化 - 增强图像对比度，提高边缘识别
    adaptiveHistogramEqualization(imageData, tileSizeX, tileSizeY) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const tempData = new Uint8ClampedArray(data);
        
        // 限制对比度，防止过度增强
        const clipLimit = 0.05;
        
        // 计算每个通道的自适应直方图
        for (let channel = 0; channel < 3; channel++) {
            for (let y = 0; y < height; y += tileSizeY) {
                for (let x = 0; x < width; x += tileSizeX) {
                    // 计算当前块的直方图
                    const histogram = this.calculateHistogram(tempData, width, height, x, y, 
                        Math.min(tileSizeX, width - x), Math.min(tileSizeY, height - y), channel);
                    
                    // 对比度限制
                    const clippedHistogram = this.clipHistogram(histogram, clipLimit);
                    
                    // 直方图均衡化
                    const cdf = this.calculateCDF(clippedHistogram);
                    
                    // 应用直方图均衡化到当前块
                    this.applyHistogramEqualization(tempData, data, width, height, x, y, 
                        Math.min(tileSizeX, width - x), Math.min(tileSizeY, height - y), channel, cdf);
                }
            }
        }
        
        return imageData;
    }
    
    // 计算直方图
    calculateHistogram(data, width, height, x, y, w, h, channel) {
        const histogram = new Array(256).fill(0);
        
        for (let j = y; j < y + h; j++) {
            for (let i = x; i < x + w; i++) {
                const idx = (j * width + i) * 4 + channel;
                const value = data[idx];
                histogram[value]++;
            }
        }
        
        return histogram;
    }
    
    // 对比度限制
    clipHistogram(histogram, clipLimit) {
        const totalPixels = histogram.reduce((sum, count) => sum + count, 0);
        const clipThreshold = Math.floor(totalPixels * clipLimit);
        const excess = histogram.filter(count => count > clipThreshold)
                               .reduce((sum, count) => sum + (count - clipThreshold), 0);
        
        const clippedHistogram = [...histogram];
        clippedHistogram.forEach((count, index) => {
            if (count > clipThreshold) {
                clippedHistogram[index] = clipThreshold;
            }
        });
        
        // 均匀分布多余的像素
        const redistributed = Math.floor(excess / 256);
        const remainder = excess % 256;
        
        for (let i = 0; i < 256; i++) {
            clippedHistogram[i] += redistributed;
        }
        
        for (let i = 0; i < remainder; i++) {
            clippedHistogram[i]++;
        }
        
        return clippedHistogram;
    }
    
    // 计算累积分布函数
    calculateCDF(histogram) {
        const totalPixels = histogram.reduce((sum, count) => sum + count, 0);
        const cdf = new Array(256).fill(0);
        let sum = 0;
        
        for (let i = 0; i < 256; i++) {
            sum += histogram[i];
            cdf[i] = Math.round((sum / totalPixels) * 255);
        }
        
        return cdf;
    }
    
    // 应用直方图均衡化
    applyHistogramEqualization(srcData, destData, width, height, x, y, w, h, channel, cdf) {
        for (let j = y; j < y + h; j++) {
            for (let i = x; i < x + w; i++) {
                const srcIdx = (j * width + i) * 4 + channel;
                const destIdx = srcIdx;
                const value = srcData[srcIdx];
                destData[destIdx] = cdf[value];
            }
        }
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