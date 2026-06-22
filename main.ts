import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, TFolder, TFile } from "obsidian";

interface CDCoverSettings {
  defaultFontSize: number;
  defaultGradient: string;
  enableVinylAnimation: boolean;
  enable3DEffect: boolean;
  filterMarkdownOnly: boolean;
  customCovers: Record<string, string>;
}

const DEFAULT_SETTINGS: CDCoverSettings = {
  defaultFontSize: 13,
  defaultGradient: "dreamy",
  enableVinylAnimation: true,
  enable3DEffect: true,
  filterMarkdownOnly: true,
  customCovers: {}
};

const VIEW_TYPE = "visual-covers-view";

class CDCoverView extends ItemView {
  plugin: VisualCoversPlugin;
  folderPath: string = "";

  constructor(leaf: WorkspaceLeaf, plugin: VisualCoversPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string { return VIEW_TYPE; }
  getDisplayText(): string { return "Visual Covers Grid"; }
  getIcon(): string { return "disc"; }

  async setFolder(folderPath: string) {
    this.folderPath = folderPath;
    this.render();
  }

  async render() {
    const root = this.contentEl;
    root.empty();

    const container = root.createDiv({ cls: "cd-cover-container" });
    const gridEl = container.createDiv({ cls: "cd-cover-grid" });
    
    // Set custom CSS variables
    gridEl.style.setProperty("--cd-cover-font-size", `${this.plugin.settings.defaultFontSize}px`);

    const folder = this.app.vault.getAbstractFileByPath(this.folderPath);
    if (!(folder instanceof TFolder)) return;

    folder.children.forEach(file => {
      if (file instanceof TFile) {
        if (this.plugin.settings.filterMarkdownOnly && file.extension !== "md") return;

        const wrapper = gridEl.createDiv({ cls: "cd-cover-wrapper" });
        const card = wrapper.createDiv({ cls: "cd-cover-card cd-gradient-dreamy" });
        
        const info = card.createDiv({ cls: "cd-cover-info" });
        info.createDiv({ cls: "cd-cover-title-text", text: file.basename });
        info.createDiv({ cls: "cd-cover-subtitle-text", text: "LOCAL NOTE" });

        // Spin disk vinyl components
        const vinyl = wrapper.createDiv({ cls: "cd-cover-vinyl" });

        card.addEventListener("click", () => {
          this.app.workspace.getLeaf(false).openFile(file);
        });
      }
    });
  }
}

export default class VisualCoversPlugin extends Plugin {
  settings: CDCoverSettings;

  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new CDCoverView(leaf, this));
    this.addSettingTab(new CDCoverSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
