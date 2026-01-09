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

// 查找最接近的拼豆颜色
function findNearestBeadColor(rgb) {
    let minDistance = Infinity;
    let nearestColor = BEAD_COLORS[0];
    
    for (const color of BEAD_COLORS) {
        const distance = calculateColorDistance(rgb, color.rgb);
        if (distance < minDistance) {
            minDistance = distance;
            nearestColor = color;
        }
    }
    
    return nearestColor;
}

// 计算颜色距离（欧几里得距离）
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