import React, { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import CardPreview from "./components/CardPreview";
import { selectContent, refreshContent } from "./services/contentSelector";
import { generatePlaceholder } from "./utils/placeholder";
import { randomImageDataUrl } from "./services/imageSource";

function App() {
  // 用于存储用户输入信息
  const [formData, setFormData] = useState({
    // 基本信息
    nickname: "",
    signature: "",
    // 自定义文本内容改为数组格式，支持多段文本和不同的样式
    textBlocks: [
      { 
        id: 1, 
        content: "", 
        fontSize: 16, 
        fontWeight: "normal", 
        fontStyle: "normal", 
        textAlign: "left", 
        color: "" 
      }
    ],
    
    // 图片上传
    avatar: null,
    illustration: null,
    qrcode: null,
    
    // 样式设置
    colorTheme: "默认",
    primaryColor: "#1677ff",
    secondaryColor: "#d81e06",
    backgroundColor: "#faf9f6",
    fontFamily: "sans-serif",
    decorationStyle: "none",
    showBorder: true,
    isDarkMode: false,
    
    // 布局模板
    layoutTemplate: "classic",
    autoGenerate: false,
    contentTheme: "电影",
    onlineEnhance: false,
  });
  const [onlineStatus, setOnlineStatus] = useState("unknown");

  useEffect(() => {
    if (!formData.autoGenerate) return;
    (async () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      let pick = null;
      if (formData.onlineEnhance) {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";
          const res = await fetch(`${API_BASE}/api/content?theme=${encodeURIComponent(formData.contentTheme)}&date=${y}-${m}-${d}&ext=1`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.status === "success" && json.data) pick = json.data;
            setOnlineStatus("success");
          } else {
            setOnlineStatus("error");
          }
        } catch (e) { setOnlineStatus("error"); }
      }
      if (!pick) pick = await selectContent({ date: now, theme: formData.contentTheme });
      if (!pick) return;
      let img = null;
      if (formData.onlineEnhance) {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";
          img = await randomImageDataUrl({ theme: formData.contentTheme, apiBase: API_BASE });
        } catch (e) {}
      }
      setFormData((prev) => ({
        ...prev,
        textBlocks: [
          {
            id: 1,
            content: pick.text || "",
            fontSize: 20,
            fontWeight: "normal",
            fontStyle: "normal",
            textAlign: "left",
            color: prev.isDarkMode ? "#ffffff" : "#333333",
          },
        ],
        illustration: img || generatePlaceholder(formData.contentTheme),
      }));
    })();
  }, [formData.autoGenerate, formData.contentTheme, formData.onlineEnhance]);

  const handleRefreshText = async () => {
    const now = new Date();
    let pick = null;
    if (formData.onlineEnhance) {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const res = await fetch(`${API_BASE}/api/content?theme=${encodeURIComponent(formData.contentTheme)}&date=${y}-${m}-${d}&ext=1&refresh=1`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.status === "success" && json.data) pick = json.data;
        }
      } catch (e) {}
    }
    if (!pick) pick = await refreshContent({ date: now, theme: formData.contentTheme });
    if (!pick) return;
    setFormData((prev) => ({
      ...prev,
      textBlocks: [
        {
          id: 1,
          content: pick.text || prev.textBlocks[0]?.content || "",
          fontSize: prev.textBlocks[0]?.fontSize || 20,
          fontWeight: prev.textBlocks[0]?.fontWeight || "normal",
          fontStyle: prev.textBlocks[0]?.fontStyle || "normal",
          textAlign: prev.textBlocks[0]?.textAlign || "left",
          color: prev.textBlocks[0]?.color || (prev.isDarkMode ? "#ffffff" : "#333333"),
        },
      ],
    }));
  };

  const handleRefreshImage = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";
      const img = await randomImageDataUrl({ theme: formData.contentTheme, apiBase: API_BASE });
      setFormData((prev) => ({ ...prev, illustration: img }));
    } catch (e) {
      setFormData((prev) => ({ ...prev, illustration: generatePlaceholder(formData.contentTheme) }));
    }
  };

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <h1 style={{ margin: "0 0 16px 0" }}>日签生成器</h1>
      
      <div style={{ display: "flex", flex: 1, gap: "20px", height: "calc(100vh - 80px)", overflow: "hidden" }}>
        {/* 左侧编辑区 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px 0", borderRight: "1px solid #eee" }}>
          <UserForm formData={formData} setFormData={setFormData} onRefreshText={handleRefreshText} onRefreshImage={handleRefreshImage} />
        </div>
        
        {/* 右侧预览区 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "0 0 16px 8px" }}>
          <CardPreview formData={formData} />
        </div>
      </div>
    </div>
  );
}

export default App;
