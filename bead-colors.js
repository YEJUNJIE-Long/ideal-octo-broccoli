// 拼豆色系定义
const BEAD_COLORS = [
    // 白色系
    { id: 'B001', name: '纯白', rgb: [255, 255, 255], hex: '#FFFFFF' },
    { id: 'B002', name: '米白', rgb: [255, 250, 240], hex: '#FAF0E6' },
    { id: 'B003', name: '奶白', rgb: [255, 255, 245], hex: '#FFF5F5' },
    
    // 黑色系
    { id: 'B004', name: '纯黑', rgb: [0, 0, 0], hex: '#000000' },
    { id: 'B005', name: '深灰', rgb: [64, 64, 64], hex: '#404040' },
    { id: 'B006', name: '中灰', rgb: [128, 128, 128], hex: '#808080' },
    { id: 'B007', name: '浅灰', rgb: [192, 192, 192], hex: '#C0C0C0' },
    
    // 红色系
    { id: 'B008', name: '大红', rgb: [255, 0, 0], hex: '#FF0000' },
    { id: 'B009', name: '深红', rgb: [128, 0, 0], hex: '#800000' },
    { id: 'B010', name: '粉红', rgb: [255, 192, 203], hex: '#FFC0CB' },
    { id: 'B011', name: '玫瑰红', rgb: [255, 0, 127], hex: '#FF007F' },
    { id: 'B012', name: '珊瑚红', rgb: [255, 127, 80], hex: '#FF7F50' },
    
    // 橙色系
    { id: 'B013', name: '橙色', rgb: [255, 165, 0], hex: '#FFA500' },
    { id: 'B014', name: '深橙', rgb: [255, 140, 0], hex: '#FF8C00' },
    { id: 'B015', name: '浅橙', rgb: [255, 215, 0], hex: '#FFD700' },
    
    // 黄色系
    { id: 'B016', name: '纯黄', rgb: [255, 255, 0], hex: '#FFFF00' },
    { id: 'B017', name: '柠檬黄', rgb: [255, 250, 205], hex: '#FFFA80' },
    { id: 'B018', name: '金黄', rgb: [218, 165, 32], hex: '#DAA520' },
    
    // 绿色系
    { id: 'B019', name: '纯绿', rgb: [0, 255, 0], hex: '#00FF00' },
    { id: 'B020', name: '深绿', rgb: [0, 128, 0], hex: '#008000' },
    { id: 'B021', name: '浅绿', rgb: [144, 238, 144], hex: '#90EE90' },
    { id: 'B022', name: '橄榄绿', rgb: [128, 128, 0], hex: '#808000' },
    { id: 'B023', name: '薄荷绿', rgb: [152, 251, 152], hex: '#98FB98' },
    { id: 'B024', name: '翠绿', rgb: [0, 255, 127], hex: '#00FF7F' },
    
    // 蓝色系
    { id: 'B025', name: '纯蓝', rgb: [0, 0, 255], hex: '#0000FF' },
    { id: 'B026', name: '深蓝', rgb: [0, 0, 128], hex: '#000080' },
    { id: 'B027', name: '浅蓝', rgb: [135, 206, 235], hex: '#87CEEB' },
    { id: 'B028', name: '天蓝', rgb: [135, 206, 250], hex: '#87CEFA' },
    { id: 'B029', name: '海军蓝', rgb: [0, 0, 139], hex: '#00008B' },
    { id: 'B030', name: '湖蓝', rgb: [64, 224, 208], hex: '#40E0D0' },
    
    // 紫色系
    { id: 'B031', name: '纯紫', rgb: [128, 0, 128], hex: '#800080' },
    { id: 'B032', name: '深紫', rgb: [75, 0, 130], hex: '#4B0082' },
    { id: 'B033', name: '浅紫', rgb: [218, 112, 214], hex: '#DA70D6' },
    { id: 'B034', name: '粉紫', rgb: [255, 182, 193], hex: '#FFB6C1' },
    
    // 棕色系
    { id: 'B035', name: '棕色', rgb: [165, 42, 42], hex: '#A52A2A' },
    { id: 'B036', name: '深棕', rgb: [139, 69, 19], hex: '#8B4513' },
    { id: 'B037', name: '浅棕', rgb: [210, 180, 140], hex: '#D2B48C' },
    { id: 'B038', name: '卡其色', rgb: [240, 230, 140], hex: '#F0E68C' },
    
    // 其他颜色
    { id: 'B039', name: '青色', rgb: [0, 255, 255], hex: '#00FFFF' },
    { id: 'B040', name: '品红', rgb: [255, 0, 255], hex: '#FF00FF' },
    { id: 'B041', name: '银色', rgb: [192, 192, 192], hex: '#C0C0C0' },
    { id: 'B042', name: '金色', rgb: [255, 215, 0], hex: '#FFD700' }
];

// RGB转LAB色彩空间
function rgbToLab(rgb) {
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    
    // RGB到XYZ转换
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    
    // XYZ到LAB转换
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    
    return {
        l: (116 * y) - 16,
        a: 500 * (x - y),
        b: 200 * (y - z)
    };
}

// CIEDE2000颜色差异公式 - 人眼感知最准确的颜色距离计算
function ciede2000(lab1, lab2) {
    const deltaLPrime = lab2.l - lab1.l;
    
    // CIEDE2000计算
    const LBar = (lab1.l + lab2.l) / 2;
    const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
    const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
    const CBar = (C1 + C2) / 2;
    
    const G = 0.5 * (1 - Math.sqrt(Math.pow(CBar, 7) / (Math.pow(CBar, 7) + Math.pow(25, 7))));
    const a1Prime = lab1.a * (1 + G);
    const a2Prime = lab2.a * (1 + G);
    
    const CPrime1 = Math.sqrt(a1Prime * a1Prime + lab1.b * lab1.b);
    const CPrime2 = Math.sqrt(a2Prime * a2Prime + lab2.b * lab2.b);
    const CPrimeBar = (CPrime1 + CPrime2) / 2;
    
    const deltaCPrime = CPrime2 - CPrime1;
    
    const hPrime1 = CPrime1 === 0 ? 0 : Math.atan2(lab1.b, a1Prime);
    const hPrime2 = CPrime2 === 0 ? 0 : Math.atan2(lab2.b, a2Prime);
    
    const deltaHPrime = CPrime1 === 0 || CPrime2 === 0 ? 0 : 
        hPrime2 - hPrime1 + (hPrime2 - hPrime1 > Math.PI ? -2 * Math.PI : hPrime1 - hPrime2 > Math.PI ? 2 * Math.PI : 0);
    
    const deltaHP = 2 * Math.sqrt(CPrime1 * CPrime2) * Math.sin(deltaHPrime / 2);
    
    const HPrimeBar = CPrime1 === 0 || CPrime2 === 0 ? 
        hPrime1 + hPrime2 : 
        Math.abs(hPrime1 - hPrime2) <= Math.PI ? 
        (hPrime1 + hPrime2) / 2 : 
        (hPrime1 + hPrime2 + 2 * Math.PI) / 2;
    
    const T = 1 - 0.17 * Math.cos(HPrimeBar - Math.PI/6) + 
              0.24 * Math.cos(2 * HPrimeBar) + 
              0.32 * Math.cos(3 * HPrimeBar + Math.PI/30) - 
              0.20 * Math.cos(4 * HPrimeBar - Math.PI*7/20);
    
    const SL = 1 + (0.015 * Math.pow(LBar - 50, 2)) / Math.sqrt(20 + Math.pow(LBar - 50, 2));
    const SC = 1 + 0.045 * CPrimeBar;
    const SH = 1 + 0.015 * CPrimeBar * T;
    
    const RT = -2 * Math.sqrt(Math.pow(CPrimeBar, 7) / (Math.pow(CPrimeBar, 7) + Math.pow(25, 7))) * 
              Math.sin(2 * Math.PI * Math.pow((Math.abs(HPrimeBar - 275) / 25), 3));
    
    const kl = 1, kc = 1, kh = 1;
    
    return Math.sqrt(
        Math.pow(deltaLPrime / (kl * SL), 2) +
        Math.pow(deltaCPrime / (kc * SC), 2) +
        Math.pow(deltaHP / (kh * SH), 2) +
        RT * (deltaCPrime / (kc * SC)) * (deltaHP / (kh * SH))
    );
}

// 色域映射：将输入颜色映射到可用的拼豆颜色色域中
function gamutMapping(rgb) {
    // 计算拼豆颜色的色域边界
    let minR = 255, maxR = 0;
    let minG = 255, maxG = 0;
    let minB = 255, maxB = 0;
    
    for (const color of BEAD_COLORS) {
        minR = Math.min(minR, color.rgb[0]);
        maxR = Math.max(maxR, color.rgb[0]);
        minG = Math.min(minG, color.rgb[1]);
        maxG = Math.max(maxG, color.rgb[1]);
        minB = Math.min(minB, color.rgb[2]);
        maxB = Math.max(maxB, color.rgb[2]);
    }
    
    // 将输入颜色映射到拼豆色域
    const mappedR = Math.max(minR, Math.min(maxR, rgb[0]));
    const mappedG = Math.max(minG, Math.min(maxG, rgb[1]));
    const mappedB = Math.max(minB, Math.min(maxB, rgb[2]));
    
    // 如果颜色被裁剪，进行简单的色域映射调整
    if (mappedR !== rgb[0] || mappedG !== rgb[1] || mappedB !== rgb[2]) {
        // 计算到色域中心的向量，并按比例调整
        const centerR = (minR + maxR) / 2;
        const centerG = (minG + maxG) / 2;
        const centerB = (minB + maxB) / 2;
        
        const vectorR = rgb[0] - centerR;
        const vectorG = rgb[1] - centerG;
        const vectorB = rgb[2] - centerB;
        
        // 计算向量长度
        const vectorLength = Math.sqrt(vectorR ** 2 + vectorG ** 2 + vectorB ** 2);
        if (vectorLength > 0) {
            // 计算色域边界到中心的最大距离
            let maxDistance = 0;
            for (const color of BEAD_COLORS) {
                const distance = Math.sqrt(
                    (color.rgb[0] - centerR) ** 2 +
                    (color.rgb[1] - centerG) ** 2 +
                    (color.rgb[2] - centerB) ** 2
                );
                maxDistance = Math.max(maxDistance, distance);
            }
            
            // 计算新的向量长度，确保在色域内
            const newLength = Math.min(vectorLength, maxDistance);
            
            // 归一化向量并缩放
            const scale = newLength / vectorLength;
            return [
                Math.round(centerR + vectorR * scale),
                Math.round(centerG + vectorG * scale),
                Math.round(centerB + vectorB * scale)
            ];
        }
    }
    
    return [mappedR, mappedG, mappedB];
}

// 查找最接近的拼豆颜色 - 增强版本，支持边缘感知和色域映射
function findNearestBeadColor(rgb, isEdgePixel = false) {
    // 1. 色域映射：将输入颜色映射到可用的拼豆颜色色域中
    const mappedRgb = gamutMapping(rgb);
    
    // 2. 转换输入RGB到LAB色彩空间
    const lab1 = rgbToLab(mappedRgb);
    
    let minDistance = Infinity;
    let nearestColor = BEAD_COLORS[0];
    
    for (const color of BEAD_COLORS) {
        // 转换拼豆颜色到LAB色彩空间
        const lab2 = rgbToLab(color.rgb);
        
        // 3. 使用CIEDE2000计算颜色差异
        let distance = ciede2000(lab1, lab2);
        
        // 4. 边缘感知调整：边缘像素使用更严格的颜色匹配
        if (isEdgePixel) {
            // 对于边缘像素，增加对比度权重，提高边缘清晰度
            const contrastFactor = 1.2;
            distance *= contrastFactor;
        }
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestColor = color;
        }
    }
    
    return nearestColor;
}

// 旧的颜色距离计算方法（保留用于对比测试）
function calculateColorDistance(rgb1, rgb2) {
    const rDiff = rgb1[0] - rgb2[0];
    const gDiff = rgb1[1] - rgb2[1];
    const bDiff = rgb1[2] - rgb2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// 导出颜色数组和工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BEAD_COLORS,
        findNearestBeadColor,
        calculateColorDistance
    };
}