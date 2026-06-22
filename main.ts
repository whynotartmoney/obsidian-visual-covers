import { 
  App, 
  Plugin, 
  PluginSettingTab, 
  Setting, 
  ItemView, 
  WorkspaceLeaf, 
  TFolder, 
  TFile,
  MarkdownView
} from "obsidian";

interface CDCoverSettings {
  defaultFontSize: number;
  defaultGradient: string;
  enableVinylAnimation: boolean;
  enable3DEffect: boolean;
  filterMarkdownOnly: boolean;
  customCovers: Record<string, string>; // 記錄特定筆記路徑對應的自訂圖片 URL/本機圖片路徑
}

const DEFAULT_SETTINGS: CDCoverSettings = {
  defaultFontSize: 14,
  defaultGradient: "dreamy",
  enableVinylAnimation: true,
  enable3DEffect: false,
  filterMarkdownOnly: true,
  customCovers: {}
};

const VIEW_TYPE = "cd-cover-folder-visualizer-view";

/**
 * CD-Cover Folder Visualizer 自訂視圖類別
 */
class CDCoverView extends ItemView {
  plugin: CDCoverVisualizerPlugin;
  folderPath: string = "";

  constructor(leaf: WorkspaceLeaf, plugin: CDCoverVisualizerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    if (this.folderPath) {
      const parts = this.folderPath.split("/");
      return `CD 封面牆: ${parts[parts.length - 1]}`;
    }
    return "CD 封面資料夾視覺化";
  }

  getIcon(): string {
    return "disc"; // Obsidian 原生圖示：黑膠/光碟
  }

  /**
   * 設定欲視覺化的資料夾路徑，並重繪
   */
  async setFolder(folderPath: string) {
    this.folderPath = folderPath;
    await this.renderView();
  }

  async onOpen() {
    this.renderView();
  }

  async onClose() {
    // 釋放資源，ItemView 的內容會自動被銷毀
  }

  /**
   * 主要渲染邏輯
   */
  async renderView() {
    const container = this.contentEl;
    container.empty();

    // 1. 建立頂部容器
    const viewContainer = container.createDiv({ cls: "cd-cover-container" });
    
    // 2. 建立標頭列
    const headerEl = viewContainer.createDiv({ cls: "cd-cover-header" });
    const titleEl = headerEl.createEl("h3", { cls: "cd-cover-title" });
    
    // 放入光碟圖示
    const iconSpan = titleEl.createSpan();
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-disc"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`;
    
    const folderName = this.folderPath ? this.folderPath.split("/").pop() : "根目錄";
    titleEl.createSpan({ text: ` CD 封面牆 - ${folderName}` });

    // 快速變更字型大小調整鈕
    const controlsEl = headerEl.createDiv({ cls: "cd-cover-controls" });
    
    // 3. 取得資料夾內所有的子筆記與檔案
    let files: TFile[] = [];
    if (this.folderPath === "") {
      // 搜尋根資料夾
      files = this.app.vault.getMarkdownFiles();
    } else {
      const folder = this.app.vault.getAbstractFileByPath(this.folderPath);
      if (folder instanceof TFolder) {
        // 遞迴遍歷或只搜尋第一層
        this.app.vault.getFiles().forEach(file => {
          if (file.parent && (file.parent.path === folder.path)) {
            if (this.plugin.settings.filterMarkdownOnly && file.extension !== "md") {
              return;
            }
            files.push(file);
          }
        });
      }
    }

    if (files.length === 0) {
      const emptyEl = viewContainer.createDiv({ cls: "cd-cover-empty" });
      emptyEl.createDiv({ 
        cls: "cd-cover-empty-icon", 
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="lucide lucide-folder-open"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>` 
      });
      emptyEl.createEl("p", { text: "此資料夾內目前沒有任何合適的筆記檔案 🎵" });
      return;
    }

    // 4. 建立 Grid 網格佈局
    const gridEl = viewContainer.createDiv({ cls: "cd-cover-grid" });

    // 設定字型大小 CSS 變數
    gridEl.style.setProperty("--cd-cover-font-size", `${this.plugin.settings.defaultFontSize}px`);

    for (const file of files) {
      // 讀取 Frontmatter 檢查額外定義
      const fileCache = this.app.metadataCache.getFileCache(file);
      const frontmatter = fileCache?.frontmatter || {};

      const title = frontmatter.title || file.basename;
      const subtitle = frontmatter.subtitle || `${(file.stat.size / 1024).toFixed(1)} KB`;
      
      // 自訂圖片路徑順序：Frontmatter 優先 -> data.json 中的路徑映射 -> 漸層色
      const frontmatterCover = frontmatter.cover || frontmatter.image;
      const mappedCover = this.plugin.settings.customCovers[file.path];
      const imageUrl = frontmatterCover || mappedCover || "";

      // 漸層主題設定
      const cardGradient = frontmatter.gradient || this.plugin.settings.defaultGradient;

      // 建立包裝外層 (為了黑膠唱片懸停動畫定位)
      const wrapperCls = ["cd-cover-wrapper"];
      if (this.plugin.settings.enableVinylAnimation) {
        wrapperCls.push("has-vinyl-animation");
      }
      if (this.plugin.settings.enable3DEffect) {
        wrapperCls.push("cd-hover-3d");
      }
      const wrapperEl = gridEl.createDiv({ cls: wrapperCls.join(" ") });

      // 建立正方形封面卡片主體
      const cardCls = ["cd-cover-card"];
      // 若無圖片路徑，則渲染對應的漸層 CSS Class
      if (!imageUrl) {
        cardCls.push(`cd-gradient-${cardGradient}`);
      }
      const cardEl = wrapperEl.createDiv({ cls: cardCls.join(" ") });

      if (imageUrl) {
        // 設定背景圖片 (本機檔案轉換或網路 URL)
        let resolvedUrl = imageUrl;
        if (imageUrl.startsWith("app://") || imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
          resolvedUrl = imageUrl;
        } else {
          // 嘗試在 Obsidian 倉庫中查找該本機圖片
          const tFile = this.app.vault.getAbstractFileByPath(imageUrl);
          if (tFile instanceof TFile) {
            resolvedUrl = this.app.vault.getResourcePath(tFile);
          } else {
            // 模糊搜尋檔名
            const fileByMaybeName = this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (fileByMaybeName instanceof TFile) {
              resolvedUrl = this.app.vault.getResourcePath(fileByMaybeName);
            }
          }
        }
        cardEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
      }

      // 卡片資訊區 (毛玻璃質感文字層)
      const infoEl = cardEl.createDiv({ cls: "cd-cover-info" });
      infoEl.createEl("div", { cls: "cd-cover-title-text", text: title });
      infoEl.createEl("div", { cls: "cd-cover-subtitle-text", text: subtitle });

      // 建立高細節黑膠唱片元件
      const vinylEl = wrapperEl.createDiv({ cls: "cd-cover-vinyl" });
      const vinylCenterEl = vinylEl.createDiv({ cls: "cd-cover-vinyl-center" });
      vinylCenterEl.createDiv({ cls: "cd-cover-vinyl-spindle" });

      // 唱片中心彩膠圓標背景 (複用卡片本身圖片或設定預設漸層)
      if (imageUrl) {
         let resolvedUrl = imageUrl;
         if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
            const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (tFile instanceof TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
         }
         vinylCenterEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
      } else {
         const presets: Record<string, string> = {
           dreamy: "linear-gradient(135deg, #8a2be2 0%, #ff1493 100%)",
           sunset: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
           synth: "linear-gradient(135deg, #f012be 0%, #00ffff 100%)",
           cyber: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
           aurora: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
           emerald: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
           coral: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
           lavender: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
         };
         vinylCenterEl.style.backgroundImage = presets[cardGradient] || presets["dreamy"];
      }

      // 互動動作：點選地雷區(封面卡片) 即可開啟該筆記
      cardEl.addEventListener("click", async (evt) => {
        evt.preventDefault();
        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(file);
      });
    }
  }
}

/**
 * Obsidian 插件主程式類別
 */
export default class CDCoverVisualizerPlugin extends Plugin {
  settings: CDCoverSettings;

  async onload() {
    console.log("載入 CD-Cover Folder Visualizer 外掛 📀");

    // 1. 載入資料持久化設定
    await this.loadSettings();

    // 2. 註冊自訂視圖類別至 Obsidian 控制中心
    this.registerView(
      VIEW_TYPE,
      (leaf) => new CDCoverView(leaf, this)
    );

    // 3. 註冊頂部左側 Ribbon 功能圖示，快速點擊啟動視覺化
    this.addRibbonIcon("disc", "開啟 CD-Cover 資料夾視覺化", async () => {
      this.activateView();
    });

    // 4. 註冊資料夾右鍵 Context 菜單
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof TFolder) {
          menu.addItem((item) => {
            item
              .setTitle("使用 CD-Cover 封面牆打開資料夾")
              .setIcon("disc")
              .onClick(async () => {
                await this.activateView(file.path);
              });
          });
        }
      })
    );

    // 5. 註冊 Markdown 嵌入式 Code Block 處理器 (```cd-cover 語法糖)
    // 讓使用者可以直接在 MOC 或 Canvas 筆記中嵌入美觀的封面牆
    this.registerMarkdownCodeBlockProcessor("cd-cover", async (source, el, ctx) => {
      // 解析 YAML 參數內容
      let config: { folder?: string; size?: number; gradient?: string } = {};
      try {
        const lines = source.split("\n");
        lines.forEach(line => {
          const parts = line.split(":");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
            if (key === "folder") config.folder = val;
            if (key === "size") config.size = parseInt(val);
            if (key === "gradient") config.gradient = val;
          }
        });
      } catch (err) {
        el.createEl("div", { text: "⚠️ cd-cover 格式解析錯誤：請確保為 yaml 索引格式" });
        return;
      }

      const targetFolderPath = config.folder || "";
      const fontSize = config.size || this.settings.defaultFontSize;
      const gradientPreset = config.gradient || this.settings.defaultGradient;

      // 渲染在 Markdown 的預覽內嵌容器
      const mainEl = el.createDiv({ cls: "cd-cover-container" });
      const gridEl = mainEl.createDiv({ cls: "cd-cover-grid" });
      gridEl.style.setProperty("--cd-cover-font-size", `${fontSize}px`);

      let files: TFile[] = [];
      if (targetFolderPath === "") {
        files = this.app.vault.getMarkdownFiles().slice(0, 10); // 預設顯示前10筆
      } else {
        const folder = this.app.vault.getAbstractFileByPath(targetFolderPath);
        if (folder instanceof TFolder) {
          this.app.vault.getFiles().forEach(file => {
            if (file.parent && file.parent.path === folder.path) {
              if (this.settings.filterMarkdownOnly && file.extension !== "md") return;
              files.push(file);
            }
          });
        }
      }

      if (files.length === 0) {
        gridEl.createEl("div", { cls: "cd-cover-empty", text: "無對應檔案。請確認 yaml 引數 folder 路徑正確。" });
        return;
      }

      for (const file of files) {
        const fileCache = this.app.metadataCache.getFileCache(file);
        const frontmatter = fileCache?.frontmatter || {};
        
        const title = frontmatter.title || file.basename;
        const subtitle = frontmatter.subtitle || `${(file.stat.size / 1024).toFixed(1)} KB`;
        const frontmatterCover = frontmatter.cover || frontmatter.image;
        const mappedCover = this.settings.customCovers[file.path];
        const imageUrl = frontmatterCover || mappedCover || "";
        const cardGradient = frontmatter.gradient || gradientPreset;

        const wrapperCls = ["cd-cover-wrapper"];
        if (this.settings.enableVinylAnimation) wrapperCls.push("has-vinyl-animation");
        if (this.settings.enable3DEffect) wrapperCls.push("cd-hover-3d");
        const wrapperEl = gridEl.createDiv({ cls: wrapperCls.join(" ") });

        const cardCls = ["cd-cover-card"];
        if (!imageUrl) cardCls.push(`cd-gradient-${cardGradient}`);
        const cardEl = wrapperEl.createDiv({ cls: cardCls.join(" ") });

        if (imageUrl) {
          let resolvedUrl = imageUrl;
          if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
            const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (tFile instanceof TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
          }
          cardEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
        }

        const infoEl = cardEl.createDiv({ cls: "cd-cover-info" });
        infoEl.createEl("div", { cls: "cd-cover-title-text", text: title });
        infoEl.createEl("div", { cls: "cd-cover-subtitle-text", text: subtitle });

        const vinylEl = wrapperEl.createDiv({ cls: "cd-cover-vinyl" });
        const vinylCenterEl = vinylEl.createDiv({ cls: "cd-cover-vinyl-center" });
        vinylCenterEl.createDiv({ cls: "cd-cover-vinyl-spindle" });

        if (imageUrl) {
          let resolvedUrl = imageUrl;
          if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
            const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (tFile instanceof TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
          }
          vinylCenterEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
        } else {
          const presets: Record<string, string> = {
            dreamy: "linear-gradient(135deg, #8a2be2 0%, #ff1493 100%)",
            sunset: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
            synth: "linear-gradient(135deg, #f012be 0%, #00ffff 100%)",
            cyber: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
            aurora: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
            emerald: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            coral: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
            lavender: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
          };
          vinylCenterEl.style.backgroundImage = presets[cardGradient] || presets["dreamy"];
        }

        cardEl.addEventListener("click", () => {
          this.app.workspace.getLeaf(false).openFile(file);
        });
      }
    });

    // 6. 註冊設定頁面標籤 Tab 以便調整參數
    this.addSettingTab(new CDCoverSettingTab(this.app, this));
  }

  async onunload() {
    console.log("卸載 CD-Cover Folder Visualizer 外掛 💿");
    // 解構與清除視圖
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
      leaf.detach();
    });
  }

  /**
   * 啟動/啟動自訂的 CD-Cover View，並聚焦
   */
  async activateView(folderPath: string = "") {
    let leaf: WorkspaceLeaf | null = null;
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = this.app.workspace.getLeaf(true); // 開啟在新 Tab
      await leaf.setViewState({
        type: VIEW_TYPE,
        active: true,
      });
    }

    if (leaf) {
      this.app.workspace.revealLeaf(leaf);
      const view = leaf.view as CDCoverView;
      await view.setFolder(folderPath);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    
    // 即時重繪所有啟動中的視圖以預覽更新成果
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
      if (leaf.view instanceof CDCoverView) {
        leaf.view.renderView();
      }
    });
  }
}

/**
 * Obsidian 社群外掛設定面板
 */
class CDCoverSettingTab extends PluginSettingTab {
  plugin: CDCoverVisualizerPlugin;

  constructor(app: App, plugin: CDCoverVisualizerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "CD-Cover Folder Visualizer 設定面盤" });
    containerEl.createEl("p", { text: "微調網格卡片的字型、預設主題，以及極具質感的黑膠動態等配置項目。" });

    // 1. 設定字型大小
    new Setting(containerEl)
      .setName("封面標題字型大小 (Title Font Size)")
      .setDesc("設定封面網格內，唱片主標題的文字顯示大小（px）。")
      .addSlider((slider) => {
        slider
          .setLimits(10, 24, 1)
          .setValue(this.plugin.settings.defaultFontSize)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.defaultFontSize = value;
            await this.plugin.saveSettings();
          });
      });

    // 2. 設定預設漸層色 preset
    new Setting(containerEl)
      .setName("預設背景漸層主題 (Default Gradient Theme)")
      .setDesc("在沒有配置 cover 封面圖片的狀況下，筆記將自動採用的多彩漸層外觀樣式。")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("dreamy", "夢幻粉紫 (Dreamy Pink-Violet)")
          .addOption("sunset", "破曉暖橘 (Sunset Orange-Yellow)")
          .addOption("synth", "復古霓虹 (Neon Synthwave)")
          .addOption("cyber", "極緻科技 (Deep Cyberpunk)")
          .addOption("aurora", "極光深藍 Blue Aurora")
          .addOption("emerald", "翠綠森林 (Forest Emerald)")
          .addOption("coral", "熾天使紅 (Seraph Coral)")
          .addOption("lavender", "薰衣草紫 (Soft Lavender)")
          .setValue(this.plugin.settings.defaultGradient)
          .onChange(async (value) => {
            this.plugin.settings.defaultGradient = value;
            await this.plugin.saveSettings();
          });
      });

    // 3. 黑膠唱片滑出動畫 toggle
    new Setting(containerEl)
      .setName("啟用黑膠唱片滑出動畫 (Enable Vinyl Animation)")
      .setDesc("當滑鼠懸停在卡片上時，黑膠唱片將極具動態感地自轉並朝右側滑出露出，提升視覺質感。")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.enableVinylAnimation)
          .onChange(async (value) => {
            this.plugin.settings.enableVinylAnimation = value;
            await this.plugin.saveSettings();
          });
      });

    // 4. 立體傾斜動畫
    new Setting(containerEl)
      .setName("開啟電影級立體傾斜特效 (Enable Movie-like 3D Effect)")
      .setDesc("增加景深立體空間感。")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.enable3DEffect)
          .onChange(async (value) => {
            this.plugin.settings.enable3DEffect = value;
            await this.plugin.saveSettings();
          });
      });

    // 5. 是否過濾僅顯示 Markdown *.md
    new Setting(containerEl)
      .setName("僅顯示 Markdown 筆記面盤")
      .setDesc("關閉後將同時讀取資料夾內的 PDF、圖片等非筆記的一般檔案格式，並渲染為封面。")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.filterMarkdownOnly)
          .onChange(async (value) => {
            this.plugin.settings.filterMarkdownOnly = value;
            await this.plugin.saveSettings();
          });
      });

    // 6. 列出自訂圖片對應映射管理
    containerEl.createEl("h3", { text: "自訂封面圖像快速對應管理" });
    containerEl.createEl("p", { 
      text: "當前各檔案對應的圖片列表（您可以在各個筆記的前置屬性 frontmatter 中使用 cover: '圖片網址' 進行快速自訂，此處為全域備用清單）。",
      cls: "setting-item-description"
    });

    const coverKeys = Object.keys(this.plugin.settings.customCovers);
    if (coverKeys.length === 0) {
      containerEl.createEl("div", { 
        text: "目前未透過外掛面板設定任何手動圖片。筆記內 frontmatter 所設定的 cover 為最高優先權。",
        style: "color: var(--text-muted); font-size: 0.9em; padding: 0.5rem 0;"
      });
    } else {
      coverKeys.forEach(filePath => {
        const pathRow = containerEl.createDiv({ 
          style: "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--background-modifier-border); padding: 0.5rem 0;" 
        });
        
        pathRow.createSpan({ 
          text: filePath.split("/").pop() || filePath, 
          style: "font-weight: 500; overflow: hidden; text-overflow: ellipsis; max-width: 50%;" 
        });

        const imgInput = pathRow.createEl("input", { 
          type: "text", 
          value: this.plugin.settings.customCovers[filePath],
          style: "flex: 1; margin: 0 1rem; font-size: 0.85em;"
        });

        imgInput.addEventListener("change", async () => {
          this.plugin.settings.customCovers[filePath] = imgInput.value;
          await this.plugin.saveSettings();
        });

        const delBtn = pathRow.createEl("button", { 
          text: "移除", 
          style: "color: var(--text-error);" 
        });
        delBtn.addEventListener("click", async () => {
          delete this.plugin.settings.customCovers[filePath];
          await this.plugin.saveSettings();
          this.display(); // 刷新界面
        });
      });
    }
  }
}
