document.addEventListener("DOMContentLoaded", () => {
  /* ==================== Light 点状进度条 ==================== */
  document.querySelectorAll(".dot-progress").forEach(progress => {
    const dots = progress.querySelectorAll(".dot");
    const percentageText = progress.querySelector(".percentage");
    if (!dots.length) return;

    const progressRect = progress.getBoundingClientRect();
    const firstDotRect = dots[0].getBoundingClientRect();
    const lastDotRect  = dots[dots.length - 1].getBoundingClientRect();

    const dotsLeft  = firstDotRect.left - progressRect.left;
    const dotsRight = lastDotRect.right - progressRect.left;
    const dotsWidth = dotsRight - dotsLeft;

    progress.dataset.value = 0;
    render();

    progress.addEventListener("click", e => {
      let x = e.clientX - progressRect.left;
      x = Math.max(dotsLeft, Math.min(dotsRight, x));

      const ratio = (x - dotsLeft) / dotsWidth;
      let value = Math.round(ratio * 100);
      value = Math.max(0, Math.min(100, value));

      progress.dataset.value = value;
      render();
    });

    function render() {
      const value = parseInt(progress.dataset.value || "0", 10);
      const activeCount = Math.round((value / 100) * dots.length);
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index < activeCount);
      });
      if (percentageText) percentageText.textContent = value + "%";
    }
  });

  /* ==================== 图标按钮 active 状态 ==================== */
  document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".icon-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ==================== 日期下拉（只在 Dashboard 存在） ==================== */
  const dateBtn = document.getElementById("dateBtn");
  const dateMenu = document.getElementById("dateMenu");

  if (dateBtn && dateMenu) {
    dateBtn.addEventListener("click", () => {
      dateMenu.style.display = dateMenu.style.display === "block" ? "none" : "block";
    });

    dateMenu.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => {
        dateMenu.querySelectorAll("li").forEach(x => x.classList.remove("active"));
        li.classList.add("active");
        dateBtn.textContent = li.textContent + " ▼";
        dateMenu.style.display = "none";
      });
    });

    document.addEventListener("click", e => {
      if (!dateBtn.contains(e.target)) dateMenu.style.display = "none";
    });
  }

  /* ==================== Air Conditioner（只在 Dashboard 存在） ==================== */
  const acToggle = document.getElementById("acToggle");
  if (acToggle) {
    acToggle.addEventListener("click", () => {
      acToggle.classList.toggle("on");
    });
  }

  const slider = document.getElementById("acSlider");
  const tempDisplay = document.getElementById("acTempValue");
  if (slider && tempDisplay) {
    slider.addEventListener("input", () => {
      tempDisplay.textContent = slider.value;
    });
  }

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ==================== Chips ==================== */
  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  const chipAdd = document.querySelector(".chip-add");
  if (chipAdd) {
    chipAdd.addEventListener("click", () => {
      alert("Add new room…");
    });
  }

  /* ============ Header 交互 ============ */
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      alert("Searching: " + searchInput.value);
    });
  }

  const helpBtn = document.getElementById("helpBtn");
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      alert("Need help?");
    });
  }

  const notificationBtn = document.getElementById("notificationBtn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      alert("You have no new notifications.");
    });
  }

  const arrowBtn = document.getElementById("arrowBtn");
  const userMenu = document.getElementById("userMenu");
  if (arrowBtn && userMenu) {
    arrowBtn.addEventListener("click", () => {
      userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!arrowBtn.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = "none";
      }
    });
  }

  /* ============ Sidebar 菜单交互 ============ */
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });





/* ========= Utilities 饼图 hover 高亮 ========= */
(function () {
  const pie = document.querySelector(".usage-pie-card .pie-chart");
  const legendItems = document.querySelectorAll(
    ".usage-pie-card .usage-legend-item"
  );
  if (!pie) return;       // 在 Dashboard 页面不会报错

  // 三块的百分比分布（和 CSS 保持一致）
  const PCT_ELEC = 52;
  const PCT_WATER = 28;
  const PCT_GAS = 20;

  const angleElecEnd  = (PCT_ELEC / 100) * 360;               // 0  ~ 52%
  const angleWaterEnd = angleElecEnd + (PCT_WATER / 100) * 360; // 52 ~ 80%
  // 80 ~ 100% 就是 Gas

  function setHighlight(type) {
    pie.classList.remove(
      "highlight-elec",
      "highlight-water",
      "highlight-gas"
    );
    if (!type) return;
    pie.classList.add("highlight-" + type);
  }

  // legend hover
  legendItems.forEach((item) => {
    const type = item.dataset.type; // elec / water / gas
    item.addEventListener("mouseenter", () => setHighlight(type));
    item.addEventListener("mouseleave", () => setHighlight(null));
  });

  
    // 在饼图上移动鼠标时，根据角度算是哪一块
  pie.addEventListener("mousemove", (e) => {
    const rect = pie.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // 数学坐标系下的角度，0° 在右侧
    let angle = Math.atan2(dy, dx);
    let deg = angle * 180 / Math.PI;
    if (deg < 0) deg += 360;

    // conic-gradient 的 0deg 在正上方，所以整体 +90° 做对齐
    const cssDeg = (deg + 90) % 360;

    let type;
    if (cssDeg < angleElecEnd) {
      type = "elec";      // Electricity
    } else if (cssDeg < angleWaterEnd) {
      type = "water";     // Water
    } else {
      type = "gas";       // Gas
    }

    setHighlight(type);
  });


  pie.addEventListener("mouseleave", () => setHighlight(null));
})();











  /* ===== Utilities Details - simple filtering ===== */
  const table = document.querySelector('.utilities-table');
  if (table) {                       // 只在 details 页面生效

      const monthSelect  = document.getElementById('detailsMonth');
      const statusSelect = document.getElementById('detailsStatus');
      const searchInput  = document.getElementById('detailsSearch');
      const typeChips    = document.querySelectorAll('.filter-chip');

      let currentType = 'all';

      typeChips.forEach(chip => {
          chip.addEventListener('click', () => {
              typeChips.forEach(c => c.classList.remove('active'));
              chip.classList.add('active');
              currentType = chip.dataset.type;     // all / Electricity / Water / Gas
              applyFilters();
          });
      });

      if (monthSelect) {
          monthSelect.addEventListener('change', applyFilters);
      }
      if (statusSelect) {
          statusSelect.addEventListener('change', applyFilters);
      }
      if (searchInput) {
          searchInput.addEventListener('input', applyFilters);
      }

      function applyFilters() {
          const month   = monthSelect  ? monthSelect.value  : 'all';
          const status  = statusSelect ? statusSelect.value : 'all';
          const keyword = searchInput  ? searchInput.value.trim().toLowerCase() : '';

          const rows = table.querySelectorAll('tbody tr');

          rows.forEach(row => {
              const rowType   = row.dataset.type;    // 例如 "Electricity"
              const rowMonth  = row.dataset.month;   // 例如 "Jan"
              const rowStatus = row.dataset.status;  // 例如 "paid"

              const matchType   = currentType === 'all' || rowType === currentType;
              const matchMonth  = month === 'all' || rowMonth === month;
              const matchStatus = status === 'all' || rowStatus === status;
              const matchText   = !keyword || row.textContent.toLowerCase().includes(keyword);

              row.style.display = (matchType && matchMonth && matchStatus && matchText) ? '' : 'none';
          });
      }

      // 初次渲染跑一次
      applyFilters();
 }
});



