var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CDCoverVisualizerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  defaultFontSize: 14,
  defaultGradient: "dreamy",
  enableVinylAnimation: true,
  enable3DEffect: false,
  filterMarkdownOnly: true,
  customCovers: {}
};
var VIEW_TYPE = "cd-cover-folder-visualizer-view";
var CDCoverView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.folderPath = "";
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    if (this.folderPath) {
      const parts = this.folderPath.split("/");
      return `CD \u5C01\u9762\u7246: ${parts[parts.length - 1]}`;
    }
    return "CD \u5C01\u9762\u8CC7\u6599\u593E\u8996\u89BA\u5316";
  }
  getIcon() {
    return "disc";
  }
  /**
   * 設定欲視覺化的資料夾路徑，並重繪
   */
  async setFolder(folderPath) {
    this.folderPath = folderPath;
    await this.renderView();
  }
  async onOpen() {
    this.renderView();
  }
  async onClose() {
  }
  /**
   * 主要渲染邏輯
   */
  async renderView() {
    const container = this.contentEl;
    container.empty();
    const viewContainer = container.createDiv({ cls: "cd-cover-container" });
    const headerEl = viewContainer.createDiv({ cls: "cd-cover-header" });
    const titleEl = headerEl.createEl("h3", { cls: "cd-cover-title" });
    const iconSpan = titleEl.createSpan();
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-disc"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`;
    const folderName = this.folderPath ? this.folderPath.split("/").pop() : "\u6839\u76EE\u9304";
    titleEl.createSpan({ text: ` CD \u5C01\u9762\u7246 - ${folderName}` });
    const controlsEl = headerEl.createDiv({ cls: "cd-cover-controls" });
    let files = [];
    if (this.folderPath === "") {
      files = this.app.vault.getMarkdownFiles();
    } else {
      const folder = this.app.vault.getAbstractFileByPath(this.folderPath);
      if (folder instanceof import_obsidian.TFolder) {
        this.app.vault.getFiles().forEach((file) => {
          if (file.parent && file.parent.path === folder.path) {
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
      emptyEl.createEl("p", { text: "\u6B64\u8CC7\u6599\u593E\u5167\u76EE\u524D\u6C92\u6709\u4EFB\u4F55\u5408\u9069\u7684\u7B46\u8A18\u6A94\u6848 \u{1F3B5}" });
      return;
    }
    const gridEl = viewContainer.createDiv({ cls: "cd-cover-grid" });
    gridEl.style.setProperty("--cd-cover-font-size", `${this.plugin.settings.defaultFontSize}px`);
    for (const file of files) {
      const fileCache = this.app.metadataCache.getFileCache(file);
      const frontmatter = fileCache?.frontmatter || {};
      const title = frontmatter.title || file.basename;
      const subtitle = frontmatter.subtitle || `${(file.stat.size / 1024).toFixed(1)} KB`;
      const frontmatterCover = frontmatter.cover || frontmatter.image;
      const mappedCover = this.plugin.settings.customCovers[file.path];
      const imageUrl = frontmatterCover || mappedCover || "";
      const cardGradient = frontmatter.gradient || this.plugin.settings.defaultGradient;
      const wrapperCls = ["cd-cover-wrapper"];
      if (this.plugin.settings.enableVinylAnimation) {
        wrapperCls.push("has-vinyl-animation");
      }
      if (this.plugin.settings.enable3DEffect) {
        wrapperCls.push("cd-hover-3d");
      }
      const wrapperEl = gridEl.createDiv({ cls: wrapperCls.join(" ") });
      const cardCls = ["cd-cover-card"];
      if (!imageUrl) {
        cardCls.push(`cd-gradient-${cardGradient}`);
      }
      const cardEl = wrapperEl.createDiv({ cls: cardCls.join(" ") });
      const customFontSize = frontmatter.fontSize || frontmatter.font_size;
      if (customFontSize) {
        cardEl.style.setProperty("--cd-cover-font-size", `${customFontSize}px`);
      }
      if (imageUrl) {
        let resolvedUrl = imageUrl;
        if (imageUrl.startsWith("app://") || imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
          resolvedUrl = imageUrl;
        } else {
          const tFile = this.app.vault.getAbstractFileByPath(imageUrl);
          if (tFile instanceof import_obsidian.TFile) {
            resolvedUrl = this.app.vault.getResourcePath(tFile);
          } else {
            const fileByMaybeName = this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (fileByMaybeName instanceof import_obsidian.TFile) {
              resolvedUrl = this.app.vault.getResourcePath(fileByMaybeName);
            }
          }
        }
        cardEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
      }
      const infoEl = cardEl.createDiv({ cls: "cd-cover-info" });
      infoEl.createEl("div", { cls: "cd-cover-title-text", text: title });
      const vinylEl = wrapperEl.createDiv({ cls: "cd-cover-vinyl" });
      const vinylCenterEl = vinylEl.createDiv({ cls: "cd-cover-vinyl-center" });
      vinylCenterEl.createDiv({ cls: "cd-cover-vinyl-spindle" });
      if (imageUrl) {
        let resolvedUrl = imageUrl;
        if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
          const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
          if (tFile instanceof import_obsidian.TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
        }
        vinylCenterEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
      } else {
        const presets = {
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
      cardEl.addEventListener("click", async (evt) => {
        evt.preventDefault();
        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(file);
      });
    }
  }
};
var CDCoverVisualizerPlugin = class extends import_obsidian.Plugin {
  async onload() {
    console.log("\u8F09\u5165 CD-Cover Folder Visualizer \u5916\u639B \u{1F4C0}");
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE,
      (leaf) => new CDCoverView(leaf, this)
    );
    this.addRibbonIcon("disc", "\u958B\u555F CD-Cover \u8CC7\u6599\u593E\u8996\u89BA\u5316", async () => {
      this.activateView();
    });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof import_obsidian.TFolder) {
          menu.addItem((item) => {
            item.setTitle("\u4F7F\u7528 CD-Cover \u5C01\u9762\u7246\u6253\u958B\u8CC7\u6599\u593E").setIcon("disc").onClick(async () => {
              await this.activateView(file.path);
            });
          });
        }
      })
    );
    this.registerMarkdownCodeBlockProcessor("cd-cover", async (source, el, ctx) => {
      let config = {};
      try {
        const lines = source.split("\n");
        lines.forEach((line) => {
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
        el.createEl("div", { text: "\u26A0\uFE0F cd-cover \u683C\u5F0F\u89E3\u6790\u932F\u8AA4\uFF1A\u8ACB\u78BA\u4FDD\u70BA yaml \u7D22\u5F15\u683C\u5F0F" });
        return;
      }
      const targetFolderPath = config.folder || "";
      const fontSize = config.size || this.settings.defaultFontSize;
      const gradientPreset = config.gradient || this.settings.defaultGradient;
      const mainEl = el.createDiv({ cls: "cd-cover-container" });
      const gridEl = mainEl.createDiv({ cls: "cd-cover-grid" });
      gridEl.style.setProperty("--cd-cover-font-size", `${fontSize}px`);
      let files = [];
      if (targetFolderPath === "") {
        files = this.app.vault.getMarkdownFiles().slice(0, 10);
      } else {
        const folder = this.app.vault.getAbstractFileByPath(targetFolderPath);
        if (folder instanceof import_obsidian.TFolder) {
          this.app.vault.getFiles().forEach((file) => {
            if (file.parent && file.parent.path === folder.path) {
              if (this.settings.filterMarkdownOnly && file.extension !== "md") return;
              files.push(file);
            }
          });
        }
      }
      if (files.length === 0) {
        gridEl.createEl("div", { cls: "cd-cover-empty", text: "\u7121\u5C0D\u61C9\u6A94\u6848\u3002\u8ACB\u78BA\u8A8D yaml \u5F15\u6578 folder \u8DEF\u5F91\u6B63\u78BA\u3002" });
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
        const customFontSize = frontmatter.fontSize || frontmatter.font_size;
        if (customFontSize) {
          cardEl.style.setProperty("--cd-cover-font-size", `${customFontSize}px`);
        }
        if (imageUrl) {
          let resolvedUrl = imageUrl;
          if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
            const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (tFile instanceof import_obsidian.TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
          }
          cardEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
        }
        const infoEl = cardEl.createDiv({ cls: "cd-cover-info" });
        infoEl.createEl("div", { cls: "cd-cover-title-text", text: title });
        const vinylEl = wrapperEl.createDiv({ cls: "cd-cover-vinyl" });
        const vinylCenterEl = vinylEl.createDiv({ cls: "cd-cover-vinyl-center" });
        vinylCenterEl.createDiv({ cls: "cd-cover-vinyl-spindle" });
        if (imageUrl) {
          let resolvedUrl = imageUrl;
          if (!imageUrl.startsWith("app://") && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://") && !imageUrl.startsWith("data:")) {
            const tFile = this.app.vault.getAbstractFileByPath(imageUrl) || this.app.metadataCache.getFirstLinkpathDest(imageUrl, "/");
            if (tFile instanceof import_obsidian.TFile) resolvedUrl = this.app.vault.getResourcePath(tFile);
          }
          vinylCenterEl.style.backgroundImage = `url(${encodeURI(resolvedUrl)})`;
        } else {
          const presets = {
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
    this.addSettingTab(new CDCoverSettingTab(this.app, this));
  }
  async onunload() {
    console.log("\u5378\u8F09 CD-Cover Folder Visualizer \u5916\u639B \u{1F4BF}");
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
      leaf.detach();
    });
  }
  /**
   * 啟動/啟動自訂的 CD-Cover View，並聚焦
   */
  async activateView(folderPath = "") {
    let leaf = null;
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = this.app.workspace.getLeaf(true);
      await leaf.setViewState({
        type: VIEW_TYPE,
        active: true
      });
    }
    if (leaf) {
      this.app.workspace.revealLeaf(leaf);
      const view = leaf.view;
      await view.setFolder(folderPath);
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
      if (leaf.view instanceof CDCoverView) {
        leaf.view.renderView();
      }
    });
  }
};
var CDCoverSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "CD-Cover Folder Visualizer \u8A2D\u5B9A\u9762\u76E4" });
    containerEl.createEl("p", { text: "\u5FAE\u8ABF\u7DB2\u683C\u5361\u7247\u7684\u5B57\u578B\u3001\u9810\u8A2D\u4E3B\u984C\uFF0C\u4EE5\u53CA\u6975\u5177\u8CEA\u611F\u7684\u9ED1\u81A0\u52D5\u614B\u7B49\u914D\u7F6E\u9805\u76EE\u3002" });
    new import_obsidian.Setting(containerEl).setName("\u5C01\u9762\u6A19\u984C\u5B57\u578B\u5927\u5C0F (Title Font Size)").setDesc("\u8A2D\u5B9A\u5C01\u9762\u7DB2\u683C\u5167\uFF0C\u5531\u7247\u4E3B\u6A19\u984C\u7684\u6587\u5B57\u986F\u793A\u5927\u5C0F\uFF08px\uFF09\u3002").addSlider((slider) => {
      slider.setLimits(10, 80, 1).setValue(this.plugin.settings.defaultFontSize).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.defaultFontSize = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u9810\u8A2D\u80CC\u666F\u6F38\u5C64\u4E3B\u984C (Default Gradient Theme)").setDesc("\u5728\u6C92\u6709\u914D\u7F6E cover \u5C01\u9762\u5716\u7247\u7684\u72C0\u6CC1\u4E0B\uFF0C\u7B46\u8A18\u5C07\u81EA\u52D5\u63A1\u7528\u7684\u591A\u5F69\u6F38\u5C64\u5916\u89C0\u6A23\u5F0F\u3002").addDropdown((dropdown) => {
      dropdown.addOption("dreamy", "\u5922\u5E7B\u7C89\u7D2B (Dreamy Pink-Violet)").addOption("sunset", "\u7834\u66C9\u6696\u6A58 (Sunset Orange-Yellow)").addOption("synth", "\u5FA9\u53E4\u9713\u8679 (Neon Synthwave)").addOption("cyber", "\u6975\u7DFB\u79D1\u6280 (Deep Cyberpunk)").addOption("aurora", "\u6975\u5149\u6DF1\u85CD Blue Aurora").addOption("emerald", "\u7FE0\u7DA0\u68EE\u6797 (Forest Emerald)").addOption("coral", "\u71BE\u5929\u4F7F\u7D05 (Seraph Coral)").addOption("lavender", "\u85B0\u8863\u8349\u7D2B (Soft Lavender)").setValue(this.plugin.settings.defaultGradient).onChange(async (value) => {
        this.plugin.settings.defaultGradient = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u555F\u7528\u9ED1\u81A0\u5531\u7247\u6ED1\u51FA\u52D5\u756B (Enable Vinyl Animation)").setDesc("\u7576\u6ED1\u9F20\u61F8\u505C\u5728\u5361\u7247\u4E0A\u6642\uFF0C\u9ED1\u81A0\u5531\u7247\u5C07\u6975\u5177\u52D5\u614B\u611F\u5730\u81EA\u8F49\u4E26\u671D\u53F3\u5074\u6ED1\u51FA\u9732\u51FA\uFF0C\u63D0\u5347\u8996\u89BA\u8CEA\u611F\u3002").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.enableVinylAnimation).onChange(async (value) => {
        this.plugin.settings.enableVinylAnimation = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u958B\u555F\u96FB\u5F71\u7D1A\u7ACB\u9AD4\u50BE\u659C\u7279\u6548 (Enable Movie-like 3D Effect)").setDesc("\u589E\u52A0\u666F\u6DF1\u7ACB\u9AD4\u7A7A\u9593\u611F\u3002").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.enable3DEffect).onChange(async (value) => {
        this.plugin.settings.enable3DEffect = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u50C5\u986F\u793A Markdown \u7B46\u8A18\u9762\u76E4").setDesc("\u95DC\u9589\u5F8C\u5C07\u540C\u6642\u8B80\u53D6\u8CC7\u6599\u593E\u5167\u7684 PDF\u3001\u5716\u7247\u7B49\u975E\u7B46\u8A18\u7684\u4E00\u822C\u6A94\u6848\u683C\u5F0F\uFF0C\u4E26\u6E32\u67D3\u70BA\u5C01\u9762\u3002").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.filterMarkdownOnly).onChange(async (value) => {
        this.plugin.settings.filterMarkdownOnly = value;
        await this.plugin.saveSettings();
      });
    });
    containerEl.createEl("h3", { text: "\u81EA\u8A02\u5C01\u9762\u5716\u50CF\u5FEB\u901F\u5C0D\u61C9\u7BA1\u7406" });
    containerEl.createEl("p", {
      text: "\u7576\u524D\u5404\u6A94\u6848\u5C0D\u61C9\u7684\u5716\u7247\u5217\u8868\uFF08\u60A8\u53EF\u4EE5\u5728\u5404\u500B\u7B46\u8A18\u7684\u524D\u7F6E\u5C6C\u6027 frontmatter \u4E2D\u4F7F\u7528 cover: '\u5716\u7247\u7DB2\u5740' \u9032\u884C\u5FEB\u901F\u81EA\u8A02\uFF0C\u6B64\u8655\u70BA\u5168\u57DF\u5099\u7528\u6E05\u55AE\uFF09\u3002",
      cls: "setting-item-description"
    });
    const coverKeys = Object.keys(this.plugin.settings.customCovers);
    if (coverKeys.length === 0) {
      containerEl.createEl("div", {
        text: "\u76EE\u524D\u672A\u900F\u904E\u5916\u639B\u9762\u677F\u8A2D\u5B9A\u4EFB\u4F55\u624B\u52D5\u5716\u7247\u3002\u7B46\u8A18\u5167 frontmatter \u6240\u8A2D\u5B9A\u7684 cover \u70BA\u6700\u9AD8\u512A\u5148\u6B0A\u3002",
        style: "color: var(--text-muted); font-size: 0.9em; padding: 0.5rem 0;"
      });
    } else {
      coverKeys.forEach((filePath) => {
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
          text: "\u79FB\u9664",
          style: "color: var(--text-error);"
        });
        delBtn.addEventListener("click", async () => {
          delete this.plugin.settings.customCovers[filePath];
          await this.plugin.saveSettings();
          this.display();
        });
      });
    }
  }
};
