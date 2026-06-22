# Visual Covers

[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=purple&label=downloads&query=%24%5B%2A%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://obsidian.md/plugins)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/your-github-username/visual-covers?color=forestgreen)](https://github.com/your-github-username/visual-covers/releases)

Transform your raw note lists and folder items into a stunning, interactive gallery of 1:1 aspect-ratio, CD/Vinyl-style visual covers. Say goodbye to boring text directories and give your Obsidian vault a gorgeous, designer-grade aesthetic facelift.

![Visual Covers Showcase](https://raw.githubusercontent.com/your-github-username/visual-covers/main/images/showcase.gif) *(Optional: Replace with your actual screenshot/GIF URL later)*

---

## ✨ Features

- **💿 1:1 CD/Vinyl Aesthetic**: Renders folder contents into a clean, modern, responsive CSS Grid layout.
- **🎨 Dynamic Gradients**: Automatically generates sleek, multi-tone gradients as default backdrops.
- **🖼️ Custom Artwork**: Overlay any cover with local vault images or online URLs via YAML Frontmatter.
- **✍️ Tailored Typography**: Adjust global or per-note title font sizes dynamically to fit long names perfectly.
- **✨ Smooth Interactions**: Responsive hover effects featuring elegant scale-ups, flowing gradients, and floating shadows.

---

## 🚀 How to Use

`Visual Covers` can render your notes using two methods: **Folder View** (via the sidebar/tab view) or by embedding a dynamic query block using standard markdown code blocks.

### 1. Code Block Method (Recommended)
Insert a `visual-covers` code block in any note to target and display a folder's content as a grid:

```cd-cover
folder: "Projects/2026"

2. Customizing Individual Covers (YAML Frontmatter)
You can fine-tune the look of any individual note's cover card by adding custom configuration properties into that specific note's YAML Frontmatter:
---
cover-image: "assets/covers/album-art.jpg" # Can be a local vault path or https:// URL
cover-gradient: "aurora"                   # Choose from preset gradient themes
cover-font-size: "1.4rem"                  # Override global title text size
cover-text-color: "#ffffff"               # Customize text color for contrast
---

🎨 Built-in Gradient Themes
Don't have images for every note? No problem. Visual Covers comes with carefully curated, designer-approved gradient presets. Reference these names in your cover-gradient Frontmatter property:
Preset Name	Color Vibe	Ideal For
cyberpunk	Deep Purple \rightarrow Neon Pink	Creative projects, Tech logs
aurora	Emerald Green \rightarrow Arctic Cyan	Daily journals, Nature notes
sunset	Warm Orange \rightarrow Coral Red	Mood boards, Personal goals
twilight	Deep Royal Blue \rightarrow Indigo	Heavy research, Archives
minimal	Soft Silk Gray \rightarrow Muted Chalk	Clean, distraction-free vaults
⚙️ Global Configuration
Go to Obsidian Settings ‭$\rightarrow$‬ Visual Covers to tweak the default behaviors:
•	Default Font Size: Sets the base typography scaling for all card text.
•	Default Gradient Style: Pick the default color scheme for cards lacking custom images.
•	Grid Card Min-Width: Controls how many columns fit on your screen before stacking.
📦 Installation
From the Obsidian Community Mall (Pending)
	1.	Open Settings in Obsidian.
	2.	Navigate to Community plugins ‭$\rightarrow$‬ Browse.
	3.	Search for Visual Covers.
	4.	Click Install, then Enable.
Beta Testing via BRAT
Want to test the latest bleeding-edge features?
	1.	Install the BRAT plugin from the community market.
	2.	In BRAT settings, click Add Beta plugin.
	3.	Paste this repository URL: your-github-username/visual-covers
	4.	Click Add Plugin and enable it under your core settings.
🤝 Contributing & Feedback
Got ideas to make this look even sleeker? Found a bug?
Feel free to open an Issue or submit a Pull Request. All design-oriented suggestions are highly appreciated!
License: MIT
