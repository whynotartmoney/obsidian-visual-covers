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
