# Visual Covers 💿

*An incredibly aesthetic, highly customizable grid-based folder visualizer for Obsidian. Convert your raw note directories and text lists into stunning 1:1 aspect-ratio interactive vinyl CD covers with smooth, realistic spinning animations.*

---

## ✨ Features

- 📁 **Automated Folder grids**: Renders your specified vault folder notes as professional grid layouts with customizable columns.
- 💿 **Dynamic Vinyl Record Animations**: Hover over any CD cover to watch an analog black vinyl record slide out smoothly and spin in real-time.
- 🎨 **Fallback Gradient Themes**: 8 exquisite high-contrast CSS gradient presets (Dreamy Purple, Sunset Warmth, Synthwave Cyan, Midnight Cyber, Aurora Sky, Mint Emerald, Crimson Stage, and Soft Lavender) that automatically activate when no cover thumbnail image is loaded.
- 🖼️ **Flexible Frontmatter Cover Mapping**: Instantly display customized images by mapping standard external links (such as Unsplash) or local attachments via simple YAML frontmatter.
- 🎛️ **Obsidian Native Setting Panel**: Fine-tune grid header text sizes, enable or disable 3D case tilt effects, toggle vinyl record hover physics, and filter out non-markdown notes easily.

---

## 🚀 How to Use in Obsidian

`Visual Covers` parses your notes' YAML frontmatter at the top of each `.md` file to generate the cover title, subtitle, fallback gradient, and custom thumbnail image.

### 1. Configure note frontmatter

Add a simple frontmatter block to the top of any note inside your target folder:

```yaml
---
title: "The Dark Side of the Moon"
subtitle: "Pink Floyd — Psychedelic Rock"
gradient: "cyber"
cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600"
---

# Album Review: The Dark Side of the Moon
Write your review, track rankings, memories, or metadata down here in Obsidian's standard markdown layout.
```

### 2. Available Frontmatter Attributes

| YAML Property | Expected Value | Description |
| :--- | :--- | :--- |
| `title` | `String` | The primary bold title displayed on the CD cover's lower label (defaults to note name). |
| `subtitle` | `String` | A secondary metadata subtitle printed below the title (perfect for genre, artist, or rating). |
| `gradient` | `dreamy` \| `sunset` \| `synth` \| `cyber` \| `aurora` \| `emerald` \| `coral` \| `lavender` | The color theme applied to the CD backing if no custom cover photo is selected. |
| `cover` | `URL` \| `Local Image Path` | Direct hyperlinked URL or internal vault reference to render as the 1:1 cover background. |

---

## 🛠️ Installation

### Method 1: BRAT (Beta Reviewer's Auto-update Tool) — Recommended for Testers
1. Ensure you have the **BRAT** plugin installed from Obsidian's official Community Plugins directory.
2. Open Obsidian settings and navigate to **BRAT**.
3. Click **Add Beta plugin**.
4. Input your GitHub repository link: `your-github-username/obsidian-visual-covers`.
5. Enable `Visual Covers` under Community Plugins toggle!

### Method 2: Manual Installation
1. Go to the [Releases](https://github.com/your-github-username/obsidian-visual-covers/releases) page of your GitHub repository.
2. Download the three core release files: `main.js`, `manifest.json`, and `styles.css`.
3. Locate your Obsidian Vault folder, enable hidden folders, and navigate to:
   ```bash
   <your-vault-root>/.obsidian/plugins/
   ```
4. Create a folder named exactly `visual-covers` and paste the three downloaded files inside.
5. Restart Obsidian, load your settings panel, navigate to **Community plugins**, and enable **Visual Covers**.

---

## 📦 For Obsidian Reviewers & Developers

### 🏗️ Compiling Locally
To modify, build, or contribute to `Visual Covers`, follow these instructions:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-github-username/obsidian-visual-covers.git
   cd obsidian-visual-covers
   ```
2. Install the developer dependencies:
   ```bash
   npm install
   ```
3. Run the development watch server:
   ```bash
   npm run dev
   ```
4. Build the final optimized bundle for production:
   ```bash
   npm run build
   ```
   *(This outputs the compiled and bundled `main.js` and `styles.css` along with the necessary `manifest.json` configurations for release).*

---

## 🤝 Submitting to the Obsidian Community List

Below is the entry schema ready to be added to the official `community-plugins.json` index inside the `obsidianmd/obsidian-releases` repository:

```json
{
  "id": "visual-covers",
  "name": "Visual Covers",
  "author": "Your Name",
  "description": "Transforms your folder notes and markdown vaults into a beautiful, interactive 1:1 CD and Vinyl record covers wall.",
  "repo": "your-github-username/obsidian-visual-covers"
}
```

---

## 📄 License & Integrity
This plugin is licensed under the [MIT License](LICENSE). There is absolutely no external telemetry, unauthorized collection of private vault notes, or persistent backend queries. Your thoughts stay entirely local and secure.

---

*Crafted with 💜 for digital archivists, vinyl collectors, and aesthetic journalers.*
