"use client";

import { useEffect, useState } from "react";

const NAMES = [
  "雷电将军","纳西妲","芙宁娜","胡桃","甘雨","刻晴","神里绫华","宵宫",
  "八重神子","布洛妮娅","希儿","银狼","符玄","镜流","卡芙卡","黑天鹅",
  "花火","黄泉","流萤","阿米娅","陈","能天使","斯卡蒂","W","凯尔希",
  "企业","贝尔法斯特","赤城","加贺","一姬","二阶堂美树","白子","星野",
  "爱丽丝","日奈"
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(true);
  const [avatarOk, setAvatarOk] = useState(true);

  useEffect(() => {
    function spawn() {
      const el = document.createElement("div");
      el.className = "falling-name";
      el.textContent = NAMES[Math.floor(Math.random() * NAMES.length)];
      const colors = ["#ffadad","#ffd6a5","#fdffb6","#caffbf","#a0c4ff","#bdb2ff"];
      el.style.left = Math.random() * 90 + 5 + "%";
      el.style.fontSize = Math.random() * 14 + 14 + "px";
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = Math.random() * 8 + 6 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 14600);
    }
    for (let i = 0; i < 10; i++) setTimeout(spawn, i * 180);
    const interval = setInterval(spawn, Math.random() * 1500 + 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box">
            <h3>🚧 网站搭建中</h3>
            <p>本站正在修缮，部分功能暂不可用<br />敬请期待！</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>我知道了</button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="card-glass avatar-block">
          {avatarOk ? (
            <img
              src="/avatar.jpg"
              alt="avatar"
              onError={() => setAvatarOk(false)}
            />
          ) : (
            <div className="avatar-placeholder">月</div>
          )}
          <h1>月月子代代雪</h1>
          <p>热爱技术，热爱生活的探索者</p>
        </div>

        <div className="card-glass">
          <div className="section-title">⭐ 星标项目</div>
          <div className="link-list">
            <a href="https://github.com/yueyuezidaidaixue" target="_blank">📦 个人主页源码</a>
            <a href="https://github.com/yueyuezidaidaixue" target="_blank">🧑💻 我的 GitHub</a>
          </div>
        </div>

        <div className="card-glass">
          <div className="section-title">📂 开源仓库</div>
          <div className="link-list">
            <a href="https://github.com/yueyuezidaidaixue?tab=repositories" target="_blank">🔗 全部仓库</a>
          </div>
        </div>

        <div className="card-glass">
          <div className="section-title">🌐 其他空间</div>
          <div className="link-list">
            <a href="#">📺 Bilibili</a>
            <a href="#">🐦 Twitter / X</a>
          </div>
        </div>

        <div style={{ height: 80 }}></div>
      </div>

      <div className="footer-bar">
        <span>© 2026 月月子代代雪</span>
        <LiveClock />
      </div>
    </>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        String(d.getHours()).padStart(2,"0") + ":" +
        String(d.getMinutes()).padStart(2,"0") + ":" +
        String(d.getSeconds()).padStart(2,"0")
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}
