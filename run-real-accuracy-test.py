#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
拼豆颜色识别精度测试脚本（真实场景）
使用带有噪声的真实测试样本，验证优化前后的颜色识别准确率对比
"""

import json
import math
import random

# 拼豆颜色数据
BEAD_COLORS = [
    {"id": "B001", "name": "纯白", "rgb": [255, 255, 255], "hex": "#FFFFFF"},
    {"id": "B002", "name": "米白", "rgb": [255, 250, 240], "hex": "#FAF0E6"},
    {"id": "B003", "name": "奶白", "rgb": [255, 255, 245], "hex": "#FFF5F5"},
    {"id": "B004", "name": "纯黑", "rgb": [0, 0, 0], "hex": "#000000"},
    {"id": "B005", "name": "深灰", "rgb": [64, 64, 64], "hex": "#404040"},
    {"id": "B006", "name": "中灰", "rgb": [128, 128, 128], "hex": "#808080"},
    {"id": "B007", "name": "浅灰", "rgb": [192, 192, 192], "hex": "#C0C0C0"},
    {"id": "B008", "name": "大红", "rgb": [255, 0, 0], "hex": "#FF0000"},
    {"id": "B009", "name": "深红", "rgb": [128, 0, 0], "hex": "#800000"},
    {"id": "B010", "name": "粉红", "rgb": [255, 192, 203], "hex": "#FFC0CB"},
    {"id": "B011", "name": "玫瑰红", "rgb": [255, 0, 127], "hex": "#FF007F"},
    {"id": "B012", "name": "珊瑚红", "rgb": [255, 127, 80], "hex": "#FF7F50"},
    {"id": "B013", "name": "橙色", "rgb": [255, 165, 0], "hex": "#FFA500"},
    {"id": "B014", "name": "深橙", "rgb": [255, 140, 0], "hex": "#FF8C00"},
    {"id": "B015", "name": "浅橙", "rgb": [255, 215, 0], "hex": "#FFD700"},
    {"id": "B016", "name": "纯黄", "rgb": [255, 255, 0], "hex": "#FFFF00"},
    {"id": "B017", "name": "柠檬黄", "rgb": [255, 250, 205], "hex": "#FFFA80"},
    {"id": "B018", "name": "金黄", "rgb": [218, 165, 32], "hex": "#DAA520"},
    {"id": "B019", "name": "纯绿", "rgb": [0, 255, 0], "hex": "#00FF00"},
    {"id": "B020", "name": "深绿", "rgb": [0, 128, 0], "hex": "#008000"},
    {"id": "B021", "name": "浅绿", "rgb": [144, 238, 144], "hex": "#90EE90"},
    {"id": "B022", "name": "橄榄绿", "rgb": [128, 128, 0], "hex": "#808000"},
    {"id": "B023", "name": "薄荷绿", "rgb": [152, 251, 152], "hex": "#98FB98"},
    {"id": "B024", "name": "翠绿", "rgb": [0, 255, 127], "hex": "#00FF7F"},
    {"id": "B025", "name": "纯蓝", "rgb": [0, 0, 255], "hex": "#0000FF"},
    {"id": "B026", "name": "深蓝", "rgb": [0, 0, 128], "hex": "#000080"},
    {"id": "B027", "name": "浅蓝", "rgb": [135, 206, 235], "hex": "#87CEEB"},
    {"id": "B028", "name": "天蓝", "rgb": [135, 206, 250], "hex": "#87CEFA"},
    {"id": "B029", "name": "海军蓝", "rgb": [0, 0, 139], "hex": "#00008B"},
    {"id": "B030", "name": "湖蓝", "rgb": [64, 224, 208], "hex": "#40E0D0"},
    {"id": "B031", "name": "纯紫", "rgb": [128, 0, 128], "hex": "#800080"},
    {"id": "B032", "name": "深紫", "rgb": [75, 0, 130], "hex": "#4B0082"},
    {"id": "B033", "name": "浅紫", "rgb": [218, 112, 214], "hex": "#DA70D6"},
    {"id": "B034", "name": "粉紫", "rgb": [255, 182, 193], "hex": "#FFB6C1"},
    {"id": "B035", "name": "棕色", "rgb": [165, 42, 42], "hex": "#A52A2A"},
    {"id": "B036", "name": "深棕", "rgb": [139, 69, 19], "hex": "#8B4513"},
    {"id": "B037", "name": "浅棕", "rgb": [210, 180, 140], "hex": "#D2B48C"},
    {"id": "B038", "name": "卡其色", "rgb": [240, 230, 140], "hex": "#F0E68C"},
    {"id": "B039", "name": "青色", "rgb": [0, 255, 255], "hex": "#00FFFF"},
    {"id": "B040", "name": "品红", "rgb": [255, 0, 255], "hex": "#FF00FF"},
    {"id": "B041", "name": "银色", "rgb": [192, 192, 192], "hex": "#C0C0C0"},
    {"id": "B042", "name": "金色", "rgb": [255, 215, 0], "hex": "#FFD700"}
]

# 生成真实测试样本（在拼豆颜色基础上添加噪声）
def generate_real_test_samples():
    """生成真实测试样本"""
    test_samples = []
    
    for bead_color in BEAD_COLORS[:20]:  # 使用前20种颜色
        for i in range(5):  # 每种颜色生成5个带噪声的样本
            # 添加随机噪声（±10到±30之间的随机值）
            noise_range = random.randint(10, 30)
            r = max(0, min(255, bead_color["rgb"][0] + random.randint(-noise_range, noise_range)))
            g = max(0, min(255, bead_color["rgb"][1] + random.randint(-noise_range, noise_range)))
            b = max(0, min(255, bead_color["rgb"][2] + random.randint(-noise_range, noise_range)))
            
            test_samples.append({
                "name": f"{bead_color['name']}_样本{i+1}",
                "rgb": [r, g, b],
                "original_color": bead_color
            })
    
    return test_samples

# 旧的RGB距离计算函数
def calculate_color_distance(rgb1, rgb2):
    """计算RGB颜色距离"""
    r_diff = rgb1[0] - rgb2[0]
    g_diff = rgb1[1] - rgb2[1]
    b_diff = rgb1[2] - rgb2[2]
    return math.sqrt(r_diff * r_diff + g_diff * g_diff + b_diff * b_diff)

# RGB转LAB色彩空间
def rgb_to_lab(rgb):
    """RGB转LAB色彩空间"""
    r, g, b = rgb
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0
    
    # RGB到XYZ转换
    r = r ** 2.4 if r > 0.04045 else r / 12.92
    g = g ** 2.4 if g > 0.04045 else g / 12.92
    b = b ** 2.4 if b > 0.04045 else b / 12.92
    
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
    
    # XYZ到LAB转换
    x = x ** (1/3) if x > 0.008856 else (7.787 * x) + 16/116
    y = y ** (1/3) if y > 0.008856 else (7.787 * y) + 16/116
    z = z ** (1/3) if z > 0.008856 else (7.787 * z) + 16/116
    
    return {
        "l": (116 * y) - 16,
        "a": 500 * (x - y),
        "b": 200 * (y - z)
    }

# CIEDE2000颜色差异公式
def ciede2000(lab1, lab2):
    """CIEDE2000颜色差异计算"""
    delta_l_prime = lab2["l"] - lab1["l"]
    
    l_bar = (lab1["l"] + lab2["l"]) / 2
    c1 = math.sqrt(lab1["a"] ** 2 + lab1["b"] ** 2)
    c2 = math.sqrt(lab2["a"] ** 2 + lab2["b"] ** 2)
    c_bar = (c1 + c2) / 2
    
    g = 0.5 * (1 - math.sqrt(c_bar ** 7 / (c_bar ** 7 + 25 ** 7)))
    a1_prime = lab1["a"] * (1 + g)
    a2_prime = lab2["a"] * (1 + g)
    
    c_prime1 = math.sqrt(a1_prime ** 2 + lab1["b"] ** 2)
    c_prime2 = math.sqrt(a2_prime ** 2 + lab2["b"] ** 2)
    c_prime_bar = (c_prime1 + c_prime2) / 2
    
    delta_c_prime = c_prime2 - c_prime1
    
    h_prime1 = math.atan2(lab1["b"], a1_prime) if c_prime1 != 0 else 0
    h_prime2 = math.atan2(lab2["b"], a2_prime) if c_prime2 != 0 else 0
    
    delta_h_prime = 0
    if c_prime1 != 0 and c_prime2 != 0:
        delta_h_prime = h_prime2 - h_prime1
        if delta_h_prime > math.pi:
            delta_h_prime -= 2 * math.pi
        elif delta_h_prime < -math.pi:
            delta_h_prime += 2 * math.pi
    
    delta_h_p = 2 * math.sqrt(c_prime1 * c_prime2) * math.sin(delta_h_prime / 2)
    
    h_prime_bar = 0
    if c_prime1 != 0 and c_prime2 != 0:
        if abs(h_prime1 - h_prime2) <= math.pi:
            h_prime_bar = (h_prime1 + h_prime2) / 2
        else:
            h_prime_bar = (h_prime1 + h_prime2 + 2 * math.pi) / 2 if h_prime1 + h_prime2 < 2 * math.pi else (h_prime1 + h_prime2 - 2 * math.pi) / 2
    
    t = 1 - 0.17 * math.cos(h_prime_bar - math.pi/6) + \
        0.24 * math.cos(2 * h_prime_bar) + \
        0.32 * math.cos(3 * h_prime_bar + math.pi/30) - \
        0.20 * math.cos(4 * h_prime_bar - math.pi*7/20)
    
    s_l = 1 + (0.015 * (l_bar - 50) ** 2) / math.sqrt(20 + (l_bar - 50) ** 2)
    s_c = 1 + 0.045 * c_prime_bar
    s_h = 1 + 0.015 * c_prime_bar * t
    
    r_t = -2 * math.sqrt(c_prime_bar ** 7 / (c_prime_bar ** 7 + 25 ** 7)) * \
          math.sin(2 * math.pi * ((abs(h_prime_bar - 275) / 25) ** 3))
    
    k_l = 1
    k_c = 1
    k_h = 1
    
    return math.sqrt(
        (delta_l_prime / (k_l * s_l)) ** 2 +
        (delta_c_prime / (k_c * s_c)) ** 2 +
        (delta_h_p / (k_h * s_h)) ** 2 +
        r_t * (delta_c_prime / (k_c * s_c)) * (delta_h_p / (k_h * s_h))
    )

# 旧的颜色匹配函数
def old_find_nearest_bead_color(rgb):
    """旧的颜色匹配方法：简单RGB距离"""
    min_distance = float('inf')
    nearest_color = BEAD_COLORS[0]
    
    for color in BEAD_COLORS:
        distance = calculate_color_distance(rgb, color["rgb"])
        if distance < min_distance:
            min_distance = distance
            nearest_color = color
    
    return {"color": nearest_color, "distance": min_distance}

# 新的颜色匹配函数
def new_find_nearest_bead_color(rgb):
    """新的颜色匹配方法：LAB/CIEDE2000"""
    lab1 = rgb_to_lab(rgb)
    min_distance = float('inf')
    nearest_color = BEAD_COLORS[0]
    
    for color in BEAD_COLORS:
        lab2 = rgb_to_lab(color["rgb"])
        distance = ciede2000(lab1, lab2)
        if distance < min_distance:
            min_distance = distance
            nearest_color = color
    
    return {"color": nearest_color, "distance": min_distance}

# 运行真实颜色精度测试
def run_real_color_accuracy_test():
    """运行真实颜色精度测试"""
    print("=" * 80)
    print("拼豆颜色识别精度测试（真实场景）")
    print("=" * 80)
    
    # 生成真实测试样本
    test_samples = generate_real_test_samples()
    print(f"测试样本数量: {len(test_samples)}")
    print("=" * 80)
    
    old_correct = 0
    new_correct = 0
    
    # 打印测试结果表头
    print(f"{'测试样本':<20} {'原始RGB':<20} {'目标颜色':<15} {'优化前匹配':<15} {'优化前距离':<15} {'优化后匹配':<15} {'优化后距离':<15} {'结果':<15}")
    print("-" * 120)
    
    for test_sample in test_samples:
        # 优化前匹配
        old_result = old_find_nearest_bead_color(test_sample["rgb"])
        
        # 优化后匹配
        new_result = new_find_nearest_bead_color(test_sample["rgb"])
        
        # 判断是否匹配正确（距离阈值：RGB<50，CIEDE2000<10）
        # 同时检查是否匹配到了原始颜色
        old_match = old_result["distance"] < 50 and old_result["color"]["id"] == test_sample["original_color"]["id"]
        new_match = new_result["distance"] < 10 and new_result["color"]["id"] == test_sample["original_color"]["id"]
        
        if old_match:
            old_correct += 1
        if new_match:
            new_correct += 1
        
        # 打印测试结果行
        old_status = "✓" if old_match else "✗"
        new_status = "✓" if new_match else "✗"
        print(f"{test_sample['name']:<20} {str(test_sample['rgb']):<20} {test_sample['original_color']['name']:<15} {old_result['color']['name']:<15} {old_result['distance']:<15.2f} {new_result['color']['name']:<15} {new_result['distance']:<15.2f} {old_status}/{new_status:<15}")
    
    print("-" * 120)
    
    # 计算准确率
    old_accuracy = (old_correct / len(test_samples)) * 100
    new_accuracy = (new_correct / len(test_samples)) * 100
    improvement = new_accuracy - old_accuracy
    
    print(f"优化前准确率: {old_accuracy:.1f}% ({old_correct}/{len(test_samples)})")
    print(f"优化后准确率: {new_accuracy:.1f}% ({new_correct}/{len(test_samples)})")
    print(f"准确率提升: {improvement:.1f}%")
    print("=" * 80)
    
    # 验证是否达到20%的提升要求
    if improvement >= 20:
        print("✅ 测试通过：准确率提升达到20%以上！")
    else:
        print("❌ 测试未通过：准确率提升未达到20%！")
    print("=" * 80)
    
    return {
        "old_accuracy": old_accuracy,
        "new_accuracy": new_accuracy,
        "improvement": improvement,
        "pass": improvement >= 20
    }

if __name__ == "__main__":
    # 运行测试
    result = run_real_color_accuracy_test()
    
    # 保存测试结果
    with open("real-accuracy-test-result.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"测试结果已保存到: real-accuracy-test-result.json")
