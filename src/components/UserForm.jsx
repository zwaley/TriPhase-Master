import React from "react";

// 预设的主题颜色
const colorThemes = [
  { name: "默认", primary: "#1677ff", secondary: "#d81e06", background: "#faf9f6" },
  { name: "暖阳", primary: "#fa8c16", secondary: "#f5222d", background: "#fff7e6" },
  { name: "青柠", primary: "#52c41a", secondary: "#13c2c2", background: "#f6ffed" },
  { name: "梦幻", primary: "#722ed1", secondary: "#eb2f96", background: "#f9f0ff" },
  { name: "静谧", primary: "#1890ff", secondary: "#597ef7", background: "#e6f7ff" },
  { name: "暗夜", primary: "#85a5ff", secondary: "#f759ab", background: "#141414", isDark: true },
  { name: "薄荷", primary: "#00b96b", secondary: "#00a2ae", background: "#e8f9f2" },
  { name: "珊瑚", primary: "#ff7875", secondary: "#ff9c6e", background: "#fff1f0" },
  { name: "海洋", primary: "#0050b3", secondary: "#096dd9", background: "#e6f7ff" },
  { name: "秋叶", primary: "#d4b106", secondary: "#d48806", background: "#fffbe6" },
  { name: "深邃", primary: "#303f9f", secondary: "#7986cb", background: "#1a237e", isDark: true },
  { name: "樱花", primary: "#f06292", secondary: "#ec407a", background: "#fce4ec" },
  { name: "墨玉", primary: "#00c853", secondary: "#69f0ae", background: "#1b5e20", isDark: true },
  { name: "玄黑", primary: "#b0bec5", secondary: "#78909c", background: "#263238", isDark: true },
  { name: "暗红", primary: "#ff5252", secondary: "#ff8a80", background: "#b71c1c", isDark: true },
  { name: "星空", primary: "#448aff", secondary: "#82b1ff", background: "#0d47a1", isDark: true },
  { name: "紫暗", primary: "#e040fb", secondary: "#ea80fc", background: "#4a148c", isDark: true },
  { name: "浅蓝", primary: "#0288d1", secondary: "#29b6f6", background: "#e1f5fe" },
  { name: "科技蓝", primary: "#00bcd4", secondary: "#00e5ff", background: "#e0f7fa" },
  { name: "未来感", primary: "#00b0ff", secondary: "#18ffff", background: "#212121", isDark: true },
  { name: "数字风", primary: "#00e676", secondary: "#1de9b6", background: "#202124", isDark: true },
  { name: "极简科技", primary: "#eceff1", secondary: "#b0bec5", background: "#37474f", isDark: true },
  { name: "青色科技", primary: "#64ffda", secondary: "#a7ffeb", background: "#004d40", isDark: true },
];

// 布局模板选项
const layoutTemplates = [
  { 
    name: "经典布局", 
    value: "classic", 
    description: "日期在顶部，个人信息在中部，文本内容在底部的传统布局" 
  },
  { 
    name: "简约框架", 
    value: "framed", 
    description: "带有简约边框的布局，各元素均匀分布" 
  },
  { 
    name: "卡片式", 
    value: "card", 
    description: "各部分内容以卡片形式展示，有明显的分隔和阴影" 
  }
];

// 可选字体
const fontOptions = [
  { name: "默认", value: "sans-serif" },
  { name: "宋体", value: "SimSun, serif" },
  { name: "黑体", value: "SimHei, sans-serif" },
  { name: "楷体", value: "KaiTi, serif" },
  { name: "圆体", value: "\"Microsoft YaHei\", sans-serif" },
  { name: "行楷", value: "\"STXingkai\", serif" },
];

// 装饰线条样式
const decorationStyles = [
  { name: "无", value: "none" },
  { name: "简约线条", value: "simple" },
  { name: "点线", value: "dotted" },
  { name: "双线", value: "double" },
  { name: "波浪线", value: "wave" },
  { name: "角框", value: "corner" },
];

function UserForm({ formData, setFormData, onRefreshText, onRefreshImage }) {
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  // 处理主题选择
  const handleThemeChange = (theme) => {
    setFormData((prev) => ({ 
      ...prev, 
      colorTheme: theme.name,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      backgroundColor: theme.background,
      isDarkMode: theme.isDark || false
    }));
  };
  
  // 添加新的文本块
  const addTextBlock = () => {
    const newId = Math.max(0, ...formData.textBlocks.map(block => block.id)) + 1;
    setFormData(prev => ({
      ...prev,
      textBlocks: [
        ...prev.textBlocks,
        { 
          id: newId, 
          content: "", 
          fontSize: 16, 
          fontWeight: "normal", 
          fontStyle: "normal", 
          textAlign: "left", 
          color: "" 
        }
      ]
    }));
  };
  
  // 删除文本块
  const removeTextBlock = (id) => {
    setFormData(prev => ({
      ...prev,
      textBlocks: prev.textBlocks.filter(block => block.id !== id)
    }));
  };
  
  // 处理文本块属性变化
  const handleTextBlockChange = (id, property, value) => {
    setFormData(prev => ({
      ...prev,
      textBlocks: prev.textBlocks.map(block => 
        block.id === id ? { ...block, [property]: value } : block
      )
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "100%" }}>
      <div>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "16px" }}>基本信息</h3>
      </div>

      <div>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", margin: "16px 0" }}>自动生成设置</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" name="autoGenerate" checked={formData.autoGenerate || false} onChange={handleChange} />
            自动生成
          </label>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "4px" }}>内容主题：</label>
            <select
              name="contentTheme"
              value={formData.contentTheme || "电影"}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
            >
              <option value="电影">电影</option>
              <option value="文学">文学</option>
              <option value="人生感悟">人生感悟</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" name="onlineEnhance" checked={formData.onlineEnhance || false} onChange={handleChange} />
            尝试在线增强
          </label>
          {formData.autoGenerate && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={onRefreshText}
                style={{ padding: "6px 12px", backgroundColor: "#1677ff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                换文字
              </button>
              <button
                type="button"
                onClick={onRefreshImage}
                style={{ padding: "6px 12px", backgroundColor: "#00b96b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                换图片
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>昵称：</label>
          <input 
            name="nickname" 
            value={formData.nickname} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>签名：</label>
          <input 
            name="signature" 
            value={formData.signature} 
            onChange={handleChange} 
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
          />
        </div>
      </div>
      
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ display: "block" }}>自定义内容：</label>
          <button 
            type="button" 
            onClick={addTextBlock}
            style={{
              padding: "4px 12px",
              backgroundColor: "#1677ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            添加段落
          </button>
        </div>
        
        {formData.textBlocks.map((block, index) => (
          <div key={block.id} style={{ marginBottom: "16px", border: "1px solid #eee", padding: "12px", borderRadius: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: "bold" }}>段落 {index + 1}</span>
              {formData.textBlocks.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeTextBlock(block.id)}
                  style={{
                    padding: "2px 8px",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  删除
                </button>
              )}
            </div>
            
            <textarea 
              value={block.content} 
              onChange={(e) => handleTextBlockChange(block.id, 'content', e.target.value)} 
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9", minHeight: "60px", marginBottom: "8px" }}
              placeholder="输入文本内容..."
            />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>字号</label>
                <select 
                  value={block.fontSize} 
                  onChange={(e) => handleTextBlockChange(block.id, 'fontSize', Number(e.target.value))}
                  style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>样式</label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button 
                    type="button" 
                    onClick={() => handleTextBlockChange(block.id, 'fontWeight', block.fontWeight === 'bold' ? 'normal' : 'bold')}
                    style={{
                      flex: 1,
                      padding: "4px",
                      backgroundColor: block.fontWeight === 'bold' ? "#1677ff" : "#f0f0f0",
                      color: block.fontWeight === 'bold' ? "white" : "black",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    B
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleTextBlockChange(block.id, 'fontStyle', block.fontStyle === 'italic' ? 'normal' : 'italic')}
                    style={{
                      flex: 1,
                      padding: "4px",
                      backgroundColor: block.fontStyle === 'italic' ? "#1677ff" : "#f0f0f0",
                      color: block.fontStyle === 'italic' ? "white" : "black",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontStyle: "italic"
                    }}
                  >
                    I
                  </button>
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>对齐</label>
                <select 
                  value={block.textAlign} 
                  onChange={(e) => handleTextBlockChange(block.id, 'textAlign', e.target.value)}
                  style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
                >
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                  <option value="justify">两端对齐</option>
                </select>
              </div>
              
              <div style={{ gridColumn: "1 / 4" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>文本颜色</label>
                <input 
                  type="color" 
                  value={block.color || (formData.isDarkMode ? "#ffffff" : "#333333")} 
                  onChange={(e) => handleTextBlockChange(block.id, 'color', e.target.value)}
                  style={{ width: "100%", height: "24px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", margin: "16px 0" }}>图片上传</h3>
      </div>
      
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>上传头像：</label>
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>上传二维码：</label>
          <input type="file" name="qrcode" accept="image/*" onChange={handleChange} />
        </div>
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "4px" }}>上传插画：</label>
        <input type="file" name="illustration" accept="image/*" onChange={handleChange} />
      </div>
      
      <div>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", margin: "16px 0" }}>文本内容</h3>
      </div>
      
      {/* 文本块管理区域 */}
      <div>
        {formData.textBlocks.map((block) => (
          <div key={block.id} style={{ marginBottom: "16px", padding: "12px", border: "1px solid #eee", borderRadius: "4px" }}>
            <div style={{ marginBottom: "8px" }}>
              <textarea
                value={block.content}
                onChange={(e) => handleTextBlockChange(block.id, "content", e.target.value)}
                placeholder="输入文本内容..."
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  borderRadius: "4px", 
                  border: "1px solid #d9d9d9",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {/* 字号选择 */}
              <div style={{ minWidth: "120px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>字号：</label>
                <select
                  value={block.fontSize}
                  onChange={(e) => handleTextBlockChange(block.id, "fontSize", parseInt(e.target.value))}
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>
              
              {/* 文本颜色 */}
              <div style={{ minWidth: "120px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>文本颜色：</label>
                <input
                  type="color"
                  value={block.color || "#000000"}
                  onChange={(e) => handleTextBlockChange(block.id, "color", e.target.value)}
                  style={{ width: "100%", padding: "2px", borderRadius: "4px", border: "1px solid #d9d9d9", height: "31px" }}
                />
              </div>
              
              {/* 对齐方式 */}
              <div style={{ minWidth: "120px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>对齐方式：</label>
                <select
                  value={block.textAlign}
                  onChange={(e) => handleTextBlockChange(block.id, "textAlign", e.target.value)}
                  style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
                >
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                  <option value="justify">两端对齐</option>
                </select>
              </div>
              
              {/* 字体样式按钮组 */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleTextBlockChange(
                    block.id, 
                    "fontWeight", 
                    block.fontWeight === "bold" ? "normal" : "bold"
                  )}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    background: block.fontWeight === "bold" ? "#e6f7ff" : "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  B
                </button>
                
                <button
                  type="button"
                  onClick={() => handleTextBlockChange(
                    block.id, 
                    "fontStyle", 
                    block.fontStyle === "italic" ? "normal" : "italic"
                  )}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    background: block.fontStyle === "italic" ? "#e6f7ff" : "white",
                    fontStyle: "italic",
                    cursor: "pointer"
                  }}
                >
                  I
                </button>
                
                <button
                  type="button"
                  onClick={() => removeTextBlock(block.id)}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ff4d4f",
                    borderRadius: "4px",
                    background: "white",
                    color: "#ff4d4f",
                    cursor: "pointer",
                    marginLeft: "auto"
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addTextBlock}
          style={{
            padding: "8px 16px",
            background: "#f0f0f0",
            border: "1px dashed #d9d9d9",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            marginBottom: "16px"
          }}
        >
          + 添加文本段落
        </button>
      </div>
      
      <div>
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "8px", margin: "16px 0" }}>样式设置</h3>
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "8px" }}>布局模板：</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          {layoutTemplates.map(template => (
            <div 
              key={template.value}
              onClick={() => handleChange({ target: { name: "layoutTemplate", value: template.value } })}
              style={{
                width: "calc(33.33% - 8px)",
                padding: "12px",
                borderRadius: "4px",
                border: formData.layoutTemplate === template.value ? `2px solid ${formData.primaryColor}` : "1px solid #d9d9d9",
                cursor: "pointer",
                background: formData.layoutTemplate === template.value ? `${formData.primaryColor}10` : "white",
                transition: "all 0.3s"
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{template.name}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>{template.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>字体选择：</label>
          <select 
            name="fontFamily" 
            value={formData.fontFamily} 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
          >
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>装饰样式：</label>
          <select 
            name="decorationStyle" 
            value={formData.decorationStyle} 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
          >
            {decorationStyles.map(style => (
              <option key={style.value} value={style.value}>{style.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label style={{ display: "block", marginBottom: "8px" }}>颜色主题：</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {colorThemes.map(theme => (
            <div 
              key={theme.name}
              onClick={() => handleThemeChange(theme)}
              style={{
                width: "80px",
                height: "40px",
                background: theme.background,
                borderRadius: "4px",
                cursor: "pointer",
                border: formData.colorTheme === theme.name ? `2px solid ${theme.primary}` : "1px solid #d9d9d9",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: theme.primary, opacity: 0.7 }}></div>
              <div style={{ position: "absolute", top: "50%", right: 0, width: "50%", height: "50%", background: theme.secondary, opacity: 0.7 }}></div>
              <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center", fontSize: "12px", color: theme.isDark ? "white" : "black", padding: "2px" }}>
                {theme.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "4px" }}>自定义背景色：</label>
          <input 
            type="color" 
            name="backgroundColor" 
            value={formData.backgroundColor || "#faf9f6"} 
            onChange={handleChange}
            style={{ width: "100%", height: "40px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
          />
        </div>
        
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
          <label style={{ display: "flex", alignItems: "center", height: "40px" }}>
            <input 
              type="checkbox" 
              name="showBorder" 
              checked={formData.showBorder} 
              onChange={handleChange}
              style={{ marginRight: "8px" }}
            />
            显示边框
          </label>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
