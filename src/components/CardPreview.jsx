import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Lunar, Solar, HolidayUtil } from "lunar-javascript";

// 获取当前日期、星期、农历和节气信息
function getDateInfo() {
  // 使用当前日期
  const now = new Date();
  
  // 格式化年月日
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // 中文格式日期
  const dateStr = `${year}年${month}月${day}日`;
  const weekStr = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
  
  // 使用lunar-javascript库精确计算农历和节气
  // 创建公历日期对象
  const solar = Solar.fromDate(now);
  
  // 转换为农历日期
  const lunar = solar.getLunar();
  
  // 获取农历年、月、日信息
  // 获取天干地支年份
  const lunarYear = lunar.getYearInGanZhi() + '年';
  // 获取农历月份和日期
  // 如果是闰月，会自动带上“闰”字
  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();
  
  // 获取节气信息
  // 如果当天恰好是节气，返回节气名称，否则返回null
  const solarTerm = lunar.getJieQi();
  
  // 获取传统节日信息（如春节、元宵等）
  const festivals = [];
  
  // 检查农历节日
  const lunarFestivals = lunar.getFestivals();
  if (lunarFestivals && lunarFestivals.length > 0) {
    festivals.push(...lunarFestivals);
  }
  
  // 检查公历节日
  const solarFestivals = solar.getFestivals();
  if (solarFestivals && solarFestivals.length > 0) {
    festivals.push(...solarFestivals);
  }
  
  // 返回完整的日期信息
  return {
    year,
    month,
    day,
    dateStr,
    weekStr,
    lunarYear,
    lunarMonth,
    lunarDay,
    solarTerm,
    festivals: festivals.length > 0 ? festivals : null
  };
}

// 渲染上部装饰线条
function renderDecorationTop(style, color) {
  switch(style) {
    case 'simple':
      return <div style={{ borderTop: `2px solid ${color}`, width: '40%', margin: '0 auto 16px' }} />;
    case 'dotted':
      return <div style={{ borderTop: `2px dotted ${color}`, width: '50%', margin: '0 auto 16px' }} />;
    case 'double':
      return (
        <div style={{ marginBottom: 16 }}>
          <div style={{ borderTop: `1px solid ${color}`, width: '60%', margin: '0 auto 4px' }} />
          <div style={{ borderTop: `1px solid ${color}`, width: '60%', margin: '0 auto' }} />
        </div>
      );
    case 'wave':
      return (
        <div style={{ height: 10, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0,
            height: 20,
            backgroundImage: `radial-gradient(circle at 10px -5px, transparent 12px, ${color} 13px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center top'
          }} />
        </div>
      );
    case 'corner':
      return (
        <div style={{ position: 'relative', marginBottom: 16, height: 20 }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', width: 20, height: 20, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
          <div style={{ position: 'absolute', top: 0, right: '20%', width: 20, height: 20, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
        </div>
      );
    default:
      return null;
  }
}

// 渲染下部装饰线条
function renderDecorationBottom(style, color) {
  switch(style) {
    case 'simple':
      return <div style={{ borderBottom: `2px solid ${color}`, width: '40%', margin: '16px auto 0' }} />;
    case 'dotted':
      return <div style={{ borderBottom: `2px dotted ${color}`, width: '50%', margin: '16px auto 0' }} />;
    case 'double':
      return (
        <div style={{ marginTop: 16 }}>
          <div style={{ borderBottom: `1px solid ${color}`, width: '60%', margin: '4px auto 0' }} />
          <div style={{ borderBottom: `1px solid ${color}`, width: '60%', margin: '4px auto 0' }} />
        </div>
      );
    case 'wave':
      return (
        <div style={{ height: 10, marginTop: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0,
            bottom: 0,
            height: 20,
            backgroundImage: `radial-gradient(circle at 10px 15px, transparent 12px, ${color} 13px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center bottom'
          }} />
        </div>
      );
    case 'corner':
      return (
        <div style={{ position: 'relative', marginTop: 16, height: 20 }}>
          <div style={{ position: 'absolute', bottom: 0, left: '20%', width: 20, height: 20, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
          <div style={{ position: 'absolute', bottom: 0, right: '20%', width: 20, height: 20, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
        </div>
      );
    default:
      return null;
  }
}

function CardPreview({ formData }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  
  // 获取当前日期信息
  const { year, month, day, weekStr, lunarYear, lunarMonth, lunarDay, solarTerm, festivals } = getDateInfo();
  
  // 创建文件URL
  const avatarUrl = formData.avatar ? URL.createObjectURL(formData.avatar) : null;
  const illustrationUrl = typeof formData.illustration === "string"
    ? formData.illustration
    : (formData.illustration ? URL.createObjectURL(formData.illustration) : null);
  const qrcodeUrl = formData.qrcode ? URL.createObjectURL(formData.qrcode) : null;
  
  // 根据布局模板选择不同的样式
  const getLayoutStyles = () => {
    switch(formData.layoutTemplate) {
      case 'framed':
        return {
          container: {
            border: `2px solid ${formData.primaryColor}`,
            padding: "20px",
            borderRadius: "8px",
            position: "relative",
            background: formData.backgroundColor,
            color: formData.isDarkMode ? "#fff" : "#333",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          },
          // 插图部分放在最上面
          illustrationSection: {
            marginBottom: "15px",
            maxHeight: "200px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px"
          },
          illustrationStyle: {
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxHeight: "200px",
            borderRadius: "8px"
          },
          // 文本部分放在插图下面
          textSection: {
            marginBottom: "15px",
            flex: 1,
            overflow: "hidden"
          },
          // 文本下方的分隔线
          dividerStyle: {
            width: "100%",
            height: "1px",
            backgroundColor: formData.primaryColor,
            opacity: 0.5,
            marginBottom: "15px"
          },
          // 底部容器，包含左侧日期和右侧个人信息
          bottomSection: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%"
          },
          // 左侧日期部分
          dateSection: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "45%"
          },
          // 日期部分的样式
          dayStyle: {
            fontSize: "36px",
            fontWeight: "bold",
            color: formData.primaryColor,
            lineHeight: "1"
          },
          monthYearStyle: {
            fontSize: "14px",
            color: formData.isDarkMode ? "#ddd" : "#666",
            marginLeft: "8px",
            marginBottom: "4px"
          },
          weekLunarStyle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginTop: "8px"
          },
          // 右侧个人信息部分
          profileSection: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            width: "45%",
            maxHeight: "115px", // 调整：根据用户反馈，设置为总高度概念的约18% (640px * 0.18 ≈ 115px)
            overflow: "hidden"  // 新增：超出部分隐藏
          },
          // 个人信息的样式
          nicknameStyle: {
            fontWeight: "bold",
            fontSize: "16px",
            color: formData.isDarkMode ? "#fff" : "#333",
            marginBottom: "8px",
            textAlign: "right"
          },
          qrcodeStyle: {
            width: "64px",
            height: "64px",
            borderRadius: "4px",
            border: `1px solid ${formData.primaryColor}30`
          },
          avatarStyle: {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            marginRight: "12px",
            border: `1px solid ${formData.primaryColor}30`
          },
          
          signatureStyle: {
            fontSize: "12px",
            color: formData.isDarkMode ? "#ddd" : "#888",
            textAlign: "right", // 确保文本右对齐
            width: "100%" // 确保容器占满可用宽度以便对齐
          },
          
          
        };
      case 'card':
        return {
          container: {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "12px",
            background: formData.backgroundColor,
            color: formData.isDarkMode ? "#fff" : "#333",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          },
          dateSection: {
            background: formData.primaryColor + '15',
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          },
          dateContainer: {
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "8px"
          },
          dayStyle: {
            fontSize: "48px",
            fontWeight: "bold",
            color: formData.primaryColor
          },
          monthYearStyle: {
            fontSize: "16px",
            color: formData.isDarkMode ? "#ddd" : "#666"
          },
          weekLunarStyle: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            flexWrap: "wrap",
            background: formData.secondaryColor + '10',
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "14px"
          },
          profileSection: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0",
            padding: "16px",
            background: formData.secondaryColor + '10',
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          },
          avatarStyle: {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            marginRight: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          },
          nicknameStyle: {
            fontWeight: "bold",
            fontSize: "16px",
            color: formData.isDarkMode ? "#fff" : "#333"
          },
          signatureStyle: {
            fontSize: "12px",
            color: formData.isDarkMode ? "#ddd" : "#888",
            textAlign: "right", // 确保文本右对齐
            width: "100%" // 确保容器占满可用宽度以便对齐
          },
          qrcodeStyle: {
            width: "64px",
            height: "64px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          },
          illustrationSection: {
            margin: "16px 0",
            maxHeight: "160px", // 限制高度为画面的1/4
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          },
          illustrationStyle: {
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxHeight: "160px",
            borderRadius: "12px"
          },
          textSection: {
            padding: "16px",
            background: formData.isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            marginTop: "16px",
            flex: 1,
            overflow: "hidden" // 修改为hidden删除滚动条
          }
        };


      default: // classic
        return {
          container: {
            background: formData.backgroundColor,
            color: formData.isDarkMode ? "#fff" : "#333",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          },
          dateSection: {
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            marginTop: "0", // 移除顶部外边距
            marginBottom: "8px", // 进一步减小底部边距
            paddingBottom: "5px", // 保持底部内边距
            paddingTop: "2px", // 减小顶部内边距
            width: "100%",
            height: "45px" // 进一步减小高度
          },
          dateContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "40%", // 增加左侧宽度
            paddingLeft: "5px" // 添加左内边距
          },
          dayStyle: {
            fontSize: "36px",
            fontWeight: "bold",
            color: formData.isDarkMode ? "#ffffff" : formData.primaryColor, // 暗色模式下使用白色
            lineHeight: "1",
            marginRight: "8px" // 添加右边距
          },
          monthYearStyle: {
            fontSize: "14px",
            color: formData.isDarkMode ? "#ffffff" : "#666", // 暗色模式下使用白色
            fontWeight: "bold", // 添加加粗样式
            alignSelf: "flex-end", // 底部对齐
            paddingBottom: "6px", // 底部内边距调整
            whiteSpace: "nowrap" // 防止文本换行
          },
          solarTermStyle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "20%", // 减小中间部分宽度
            fontSize: "16px",
            fontWeight: "bold",
            color: formData.primaryColor
          },
          weekLunarStyle: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "40%", // 增加右侧宽度
            fontSize: "12px",
            fontWeight: "bold", // 添加加粗样式
            paddingRight: "5px" // 添加右内边距
          },
          illustrationSection: {
            margin: "15px 0", // 减小上下边距
            maxHeight: "170px", // 增加插图高度
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px"
          },
          illustrationStyle: {
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxHeight: "170px", // 增加插图高度
            borderRadius: "12px"
          },
          textSection: {
            margin: "15px 0", // 减小上下边距
            flex: 1,
            overflow: "hidden" // 修改为hidden删除滚动条
          },
          profileSection: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px", // 减小上边距
            paddingTop: "10px", // 减小上内边距
            borderTop: "1px solid " + (formData.isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
            height: "50px" // 固定高度
          },
          avatarStyle: {
            width: "36px", // 减小头像大小
            height: "36px", // 减小头像大小
            borderRadius: "50%",
            marginRight: "8px" // 减小右边距
          },
          nicknameStyle: {
            fontWeight: "bold",
            fontSize: "14px", // 减小字体大小
            color: formData.isDarkMode ? "#fff" : "#333"
          },
          signatureStyle: {
            fontSize: "12px",
            color: formData.isDarkMode ? "#ddd" : "#888",
            textAlign: "right", // 确保文本右对齐
            width: "100%" // 确保容器占满可用宽度以便对齐
          },
          qrcodeStyle: {
            width: "50px", // 减小二维码大小
            height: "50px", // 减小二维码大小
            borderRadius: "4px"
          }
        };
    }
  };
  
  const styles = getLayoutStyles();

  // 生成图片并下载
  const generateImage = async () => {
    if (!cardRef.current) return;
    
    try {
      setDownloading(true);
      
      // 使用html2canvas将DOM元素转换为canvas
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // 允许跨域图片
        scale: 2, // 提高图片质量
        backgroundColor: "#faf9f6", // 使用背景色
        logging: false, // 关闭日志
        allowTaint: true // 允许污染画布
      });
      
      // 转换为图片URL
      const imgUrl = canvas.toDataURL("image/png");
      setImageUrl(imgUrl);
      
      // 创建下载链接
      const link = document.createElement("a");
      link.download = `日签-${year}年${month}月${day}日.png`;
      link.href = imgUrl;
      link.click();
      
      setDownloading(false);
    } catch (error) {
      console.error("生成图片失败:", error);
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 预览卡片 */}
      <div 
        ref={cardRef}
        style={{
          width: "100%",
          maxWidth: "360px", // 9:16比例的宽度 (基于640px高度)
          height: "640px", // 固定高度，与宽度保持9:16比例
          borderRadius: formData.showBorder ? "8px" : "0",
          border: formData.showBorder ? "1px solid #ddd" : "none",
          boxShadow: formData.showBorder ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          fontFamily: formData.fontFamily,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          ...styles.container
        }}
      >
        {formData.layoutTemplate === 'classic' ? (
          <>
            {/* 经典布局 - 日期部分在最上面 */}
            <div style={styles.dateSection}>
              {renderDecorationTop(formData.decorationStyle, formData.primaryColor)}
              
              {/* 左侧公历日期 */}
              <div style={styles.dateContainer}>
                {/* 左侧将仅显示公历日期（日、月年） */}
                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "100%"}}>
                  <div style={{display: "flex", alignItems: "baseline"}}>
                    <div style={styles.dayStyle}>{day < 10 ? `0${day}` : day}</div>
                    <div style={styles.monthYearStyle}>{year}年{month < 10 ? `0${month}` : month}月</div>
                  </div>
                </div>
              </div>
              
              {/* 中间节气和节日 */}
              <div style={styles.solarTermStyle}>
                {/* 中间区域将显示节气，并且如果当天有其他节日也会一并展示出来 */}
                {(solarTerm || (festivals && festivals.length > 0)) ? (
                  <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center"}}>
                    {solarTerm && <div>{solarTerm}</div>}
                    {festivals && festivals.length > 0 && (
                      <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: solarTerm ? "4px" : "0" }}>
                        {/* 显示所有节日，用空格隔开 */}
                        {festivals.join(' ')}
                      </div>
                    )}
                  </div>
                ) : (
                  // 当没有节气和节日时不显示任何内容
                  <div style={{flex: 1}}></div> /* 占位以保持布局稳定 */
                )}
              </div>
              
              {/* 右侧星期和农历 */}
              <div style={styles.weekLunarStyle}>
                {/* 右侧区域将显示星期和完整的农历日期 */}
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", height: "100%"}}>
                  <div style={{fontWeight: "bold", width: "100%", textAlign: "right", letterSpacing: "2px", marginBottom: "4px", color: formData.isDarkMode ? "#ffffff" : "inherit"}}>星期{weekStr}</div>
                  {/* lunarMonth 本身包含 '月'，lunarYear 本身包含 '年' */}
                  <div style={{ color: formData.isDarkMode ? "#ffffff" : formData.secondaryColor, fontWeight: "bold", width: "100%", textAlign: "right", fontSize: styles.monthYearStyle.fontSize }}>{lunarYear}{lunarMonth}月{lunarDay}</div>
                </div>
              </div>
              
              {renderDecorationBottom(formData.decorationStyle, formData.primaryColor)}
            </div>
            
            {/* 日期下方分隔线 */}
            <div style={{
              width: "100%",
              height: "1px",
              backgroundColor: formData.primaryColor,
              opacity: 0.3,
              marginBottom: "10px"
            }}></div>

            {/* 插图部分 */}
            {illustrationUrl && (
              <div style={styles.illustrationSection}>
                <img 
                  src={illustrationUrl} 
                  alt="illustration" 
                  style={styles.illustrationStyle} 
                />
              </div>
            )}
            
            {/* 文本部分 */}
            <div style={styles.textSection}>
              {formData.textBlocks.map((block) => (
                <div 
                  key={block.id}
                  style={{
                    marginBottom: 16,
                    fontSize: `${block.fontSize}px`,
                    fontWeight: block.fontWeight,
                    fontStyle: block.fontStyle,
                    textAlign: block.textAlign,
                    color: block.color || (formData.isDarkMode ? "#fff" : "#333"),
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap" // 新增：保留空格和换行
                  }}
                >
                  {block.content}
                </div>
              ))}
              {formData.sourceLabel && (
                <div style={{ marginTop: 8, fontSize: "13px", color: formData.isDarkMode ? "#ccc" : "#666", fontStyle: "italic" }}>
                  来源：{formData.sourceLabel}
                </div>
              )}
            </div>
            
            {/* 个人信息部分 */}
            <div style={styles.profileSection}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {avatarUrl && (
                  <img src={avatarUrl} alt="avatar" style={styles.avatarStyle} />
                )}
                <div>
                  <div style={styles.nicknameStyle}>{formData.nickname}</div>
                  <div style={styles.signatureStyle}>{formData.signature}</div>
                </div>
              </div>
              {qrcodeUrl && (
                <div style={{ marginLeft: 16 }}>
                  <img src={qrcodeUrl} alt="qrcode" style={styles.qrcodeStyle} />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 简约框架布局 - 插图部分放在最上面 */}
            {illustrationUrl && (
              <div style={styles.illustrationSection}>
                <img 
                  src={illustrationUrl} 
                  alt="illustration" 
                  style={styles.illustrationStyle} 
                />
              </div>
            )}
            
            {/* 文本部分放在插图下面 */}
            <div style={styles.textSection}>
              {formData.textBlocks.map((block) => (
                <div 
                  key={block.id}
                  style={{
                    marginBottom: 16,
                    fontSize: `${block.fontSize}px`,
                    fontWeight: block.fontWeight,
                    fontStyle: block.fontStyle,
                    textAlign: block.textAlign,
                    color: block.color || (formData.isDarkMode ? "#fff" : "#333"),
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap" // 新增：保留空格和换行
                  }}
                >
                  {block.content}
                </div>
              ))}
              {formData.sourceLabel && (
                <div style={{ marginTop: 8, fontSize: "13px", color: formData.isDarkMode ? "#ccc" : "#666", fontStyle: "italic" }}>
                  来源：{formData.sourceLabel}
                </div>
              )}
            </div>
            
            {/* 文本下方的分隔线 */}
            <div style={styles.dividerStyle} />
            
            {/* 底部容器，包含左侧日期和右侧个人信息 */}
            <div style={styles.bottomSection}>
              {/* 左侧日期部分 */}
              <div style={styles.dateSection}>
                {/* 1. 星期 */}
                <div style={{ fontSize: styles.monthYearStyle.fontSize, color: styles.monthYearStyle.color, marginBottom: '4px' }}>
                  星期{weekStr}
                </div>
                {/* 2. 农历 */}
                <div style={{ fontSize: styles.monthYearStyle.fontSize, color: styles.monthYearStyle.color, marginBottom: '8px' }}>
                  <span>{lunarYear}{lunarMonth}月{lunarDay}</span>
                  {solarTerm && <span> {solarTerm}</span>}
                  {festivals && festivals.map(f => <span key={f}> {f}</span>)}
                </div>
                {/* 3. 公历日和年月 */}
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <div style={styles.dayStyle}>{day < 10 ? `0${day}` : day}</div>
                  <div style={styles.monthYearStyle}>{year}年{month < 10 ? `0${month}` : month}月</div>
                </div>
              </div>
              
              {/* 右侧个人信息部分 */}
              <div style={styles.profileSection}>
                {/* 昵称和签名 */}
                <div style={styles.nicknameStyle}>{formData.nickname}</div>
                <div style={styles.signatureStyle}>{formData.signature}</div>
                
                {/* 二维码 */}
                {qrcodeUrl && (
                  <div style={{ marginTop: "8px" }}>
                    <img src={qrcodeUrl} alt="qrcode" style={styles.qrcodeStyle} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* 下载按钮 */}
      <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}>
        <button 
          onClick={generateImage} 
          disabled={downloading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1677ff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: downloading ? "not-allowed" : "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          {downloading ? "生成中..." : "生成并下载图片"}
        </button>
        
        {imageUrl && (
          <button 
            onClick={() => {
              const link = document.createElement("a");
              link.download = `日签-${year}年${month}月${day}日.png`;
              link.href = imageUrl;
              link.click();
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#52c41a",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 16
            }}
          >
            重新下载
          </button>
        )}
      </div>
    </div>
  );
}

export default CardPreview;
