import React, { useState, useEffect } from "react";
import { 
  Folder, 
  FileText, 
  Settings, 
  Disc, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  LayoutGrid, 
  FileCode, 
  Sliders, 
  Image as ImageIcon,
  BookOpen,
  Maximize2,
  ExternalLink,
  Edit,
  Info,
  HelpCircle,
  Eye,
  Settings2,
  GitPullRequest,
  CheckCircle2,
  Share2,
  FileJson,
  Grid
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface MockNote {
  path: string;
  name: string;
  folder: string;
  content: string;
  frontmatter: {
    title?: string;
    subtitle?: string;
    cover?: string;
    gradient?: string;
    fontSize?: number;
  };
  stat: {
    size: number; // in bytes
  };
}

interface PluginSettings {
  defaultFontSize: number;
  defaultGradient: string;
  enableVinylAnimation: boolean;
  enable3DEffect: boolean;
  filterMarkdownOnly: boolean;
  customCovers: Record<string, string>;
}

// Pre-curated high-quality 2D digital graphic art presets
const COVER_PRESETS = [
  { name: "2D Memphis Abstract Shapes", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Bauhaus Color Blocks", url: "https://images.unsplash.com/photo-1502691876148-a84978e59fa8?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Geometric Minimalist Art", url: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Fluid Neon Cyber Design", url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Aesthetic Matisse Painting", url: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Retro Wave Liquid Graphic", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop" },
  { name: "2D Pastel Marble Texture Lines", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop" },
];

const INITIAL_NOTES: MockNote[] = [
  {
    path: "000 MOC - Vinyl Index.md",
    name: "000 MOC - Vinyl Index",
    folder: "",
    content: `---
title: "MOC Digital Music Box 🎵"
subtitle: "Master Directory - Favorite Albums"
gradient: "dreamy"
---

# My Personal Vinyl Record MOC Space
Welcome to my Obsidian Map of Content directory using \`Visual Covers\`!
Change folders or customize properties using the Frontmatter block to watch covers update in real-time.

### Showcase Categories:
- Rock & Heavy Overdrive
- Synthwave Frontiers
- Late Night Coffeehouse Jazz
`,
    frontmatter: {
      title: "MOC Digital Music Box 🎵",
      subtitle: "Master Directory - Favorite Albums",
      gradient: "dreamy"
    },
    stat: { size: 1220 }
  },
  // Rock & Metal Folder
  {
    path: "Rock Classics/Led Zeppelin IV.md",
    name: "Led Zeppelin IV",
    folder: "Rock Classics",
    content: `---
title: "Led Zeppelin IV"
subtitle: "Hard Rock - Released 1971"
gradient: "sunset"
cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop"
---

# Led Zeppelin IV
The legendary fourth studio album by the English rock band, featuring the iconic anthem "Stairway to Heaven". This file holds key vinyl artwork configurations.
`,
    frontmatter: {
      title: "Led Zeppelin IV",
      subtitle: "Hard Rock - Released 1971",
      gradient: "sunset",
      cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop"
    },
    stat: { size: 940 }
  },
  {
    path: "Rock Classics/The Dark Side of the Moon.md",
    name: "The Dark Side of the Moon",
    folder: "Rock Classics",
    content: `---
title: "Dark Side of the Moon"
subtitle: "Pink Floyd - Psychedelic Masterpiece"
gradient: "cyber"
cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop"
---

# The Dark Side of the Moon
Pink Floyd's landmark conceptual record. Features iconic glass prism refraction light cover configurations.
`,
    frontmatter: {
      title: "Dark Side of the Moon",
      subtitle: "Pink Floyd - Psychedelic Masterpiece",
      gradient: "cyber",
      cover: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop"
    },
    stat: { size: 850 }
  },
  {
    path: "Rock Classics/Queen - A Night at the Opera.md",
    name: "Queen - A Night at the Opera",
    folder: "Rock Classics",
    content: `---
title: "A Night at the Opera"
subtitle: "Queen - Symphonic Progressive Rock"
gradient: "coral"
---

# A Night at the Opera
Featuring Bohemians Rhapsody! Currently uses our gorgeous, high-contrast coral gradient vector theme because no cover image is explicitly configured. We can assign one inside our custom panel.
`,
    frontmatter: {
      title: "A Night at the Opera",
      subtitle: "Queen - Symphonic Progressive Rock",
      gradient: "coral"
    },
    stat: { size: 760 }
  },

  // Synthwave Folder
  {
    path: "Synthwave Frontiers/OutRun 1986.md",
    name: "OutRun 1986",
    folder: "Synthwave Frontiers",
    content: `---
title: "OutRun 1986"
subtitle: "Kavinsky - Grid Racing Horizon"
gradient: "synth"
cover: "https://images.unsplash.com/photo-1515462277126-270d878326e5?q=80&w=600&auto=format&fit=crop"
---

# OutRun 1986
An homage to the gorgeous neon aesthetics and FM-synthesizer chords of old 80s arcade simulators.
`,
    frontmatter: {
      title: "OutRun 1986",
      subtitle: "Kavinsky - Grid Racing Horizon",
      gradient: "synth",
      cover: "https://images.unsplash.com/photo-1515462277126-270d878326e5?q=80&w=600&auto=format&fit=crop"
    },
    stat: { size: 910 }
  },
  {
    path: "Synthwave Frontiers/NightDrive Ambient.md",
    name: "NightDrive Ambient",
    folder: "Synthwave Frontiers",
    content: `---
title: "NightDrive Electronic"
subtitle: "Highways & Retro Nightscapes"
gradient: "aurora"
---

# NightDrive Electronic
Pure instrumental synthwave beats perfectly tailored for programming and deep focus.
`,
    frontmatter: {
      title: "NightDrive Electronic",
      subtitle: "Highways & Retro Nightscapes",
      gradient: "aurora"
    },
    stat: { size: 610 }
  },
  {
    path: "Synthwave Frontiers/Lofi Tokyo Rain.md",
    name: "Lofi Tokyo Rain",
    folder: "Synthwave Frontiers",
    content: `---
title: "Lofi Tokyo Rain"
subtitle: "Rainy Streets & Mellow Beats"
gradient: "cyber"
cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"
---

# Lofi Tokyo Rain
Slow-paced tape saturation beats with city rain field recordings mixed inside.
`,
    frontmatter: {
      title: "Lofi Tokyo Rain",
      subtitle: "Rainy Streets & Mellow Beats",
      gradient: "cyber",
      cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop"
    },
    stat: { size: 810 }
  },

  // Midnight Cafe Jazz
  {
    path: "Midnight Cafe Jazz/Kind of Blue.md",
    name: "Kind of Blue",
    folder: "Midnight Cafe Jazz",
    content: `---
title: "Kind of Blue"
subtitle: "Miles Davis - Jazz Standard Landmark"
gradient: "lavender"
cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop"
---

# Kind of Blue
Miles Davis' peak modal jazz album from 1959. Perfect midnight relaxation audio record.
`,
    frontmatter: {
      title: "Kind of Blue",
      subtitle: "Miles Davis - Jazz Standard Landmark",
      gradient: "lavender",
      cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop"
    },
    stat: { size: 900 }
  },
  {
    path: "Midnight Cafe Jazz/Cozy Rain Session.md",
    name: "Cozy Rain Session",
    folder: "Midnight Cafe Jazz",
    content: `---
title: "Midnight Saxophone Cafe"
subtitle: "Subtle Bass & Vintage Piano Trio"
gradient: "emerald"
---

# Midnight Saxophone Cafe
Mellow acoustic trio record. Great for journaling or typing during late night hours.
`,
    frontmatter: {
      title: "Midnight Saxophone Cafe",
      subtitle: "Subtle Bass & Vintage Piano Trio",
      gradient: "emerald"
    },
    stat: { size: 490 }
  }
];

export default function App() {
  // ==========================================================================
  // State Initialization
  // ==========================================================================
  const [notes, setNotes] = useState<MockNote[]>(() => {
    const saved = localStorage.getItem("cd_cover_v2_notes");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [settings, setSettings] = useState<PluginSettings>(() => {
    const saved = localStorage.getItem("cd_cover_v2_settings");
    return saved ? JSON.parse(saved) : {
      defaultFontSize: 13,
      defaultGradient: "dreamy",
      enableVinylAnimation: true,
      enable3DEffect: true,
      filterMarkdownOnly: true,
      customCovers: {
        "Rock Classics/Queen - A Night at the Opera.md": ""
      }
    };
  });

  // Current Simulator Navigation Path
  const [selectedFolder, setSelectedFolder] = useState<string>("Rock Classics");
  const [selectedNote, setSelectedNote] = useState<MockNote | null>(INITIAL_NOTES[1]); // Led Zeppelin IV
  const [activeCodeTab, setActiveCodeTab] = useState<"manifest.json" | "main.ts" | "styles.css">("main.ts");
  const [isFrontmatterOpen, setIsFrontmatterOpen] = useState<boolean>(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  
  // Tab Management
  const [mainTab, setMainTab] = useState<"workspace" | "publishing">("workspace");

  // Local Editor State
  const [localEditorContent, setLocalEditorContent] = useState<string>("");

  // Hover animations & status triggers
  const [hoveredNotePath, setHoveredNotePath] = useState<string | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<boolean>(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Ref for custom local file uploader
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync to Storage
  useEffect(() => {
    localStorage.setItem("cd_cover_v2_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("cd_cover_v2_settings", JSON.stringify(settings));
  }, [settings]);

  // Set default edit content when note selection shifts
  useEffect(() => {
    if (selectedNote) {
      setLocalEditorContent(selectedNote.content);
    }
  }, [selectedNote]);

  // ==========================================================================
  // Handlers & Event Helpers
  // ==========================================================================
  const folderNames = Array.from(new Set(notes.map(n => n.folder).filter(f => f !== "")));

  const handleSelectNote = (note: MockNote) => {
    setSelectedNote(note);
    setSelectedFolder(note.folder || "MOC Index");
  };

  const handleUpdateNoteContent = (newContent: string) => {
    setLocalEditorContent(newContent);
    if (!selectedNote) return;

    // Parse Frontmatter YAML (simple key-value parser)
    const frontmatterMatch = newContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const parsedFm: Record<string, string> = {};
    if (frontmatterMatch) {
      const lines = frontmatterMatch[1].split("\n");
      lines.forEach(line => {
        const separatorIdx = line.indexOf(":");
        if (separatorIdx !== -1) {
          const key = line.slice(0, separatorIdx).trim();
          const val = line.slice(separatorIdx + 1).trim().replace(/^['"]|['"]$/g, "");
          parsedFm[key] = val;
        }
      });
    }

    const updatedNotes = notes.map(n => {
      if (n.path === selectedNote.path) {
        return {
          ...n,
          content: newContent,
          frontmatter: {
            title: parsedFm.title || n.name,
            subtitle: parsedFm.subtitle || "",
            cover: parsedFm.cover || parsedFm.image || "",
            gradient: parsedFm.gradient || "dreamy",
            fontSize: parsedFm.fontSize ? parseInt(parsedFm.fontSize) : (parsedFm.font_size ? parseInt(parsedFm.font_size) : undefined)
          },
          stat: {
            size: newContent.length
          }
        };
      }
      return n;
    });

    setNotes(updatedNotes);
    
    // Maintain active note state sync
    const currentActive = updatedNotes.find(n => n.path === selectedNote.path);
    if (currentActive) {
       setSelectedNote(currentActive);
    }

    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 1200);
  };

  const handleAddNoteToFolder = (folderName: string) => {
    const rawNumber = notes.length + 1;
    const path = folderName ? `${folderName}/New Record ${rawNumber}.md` : `New Record ${rawNumber}.md`;
    
    const newNote: MockNote = {
      path,
      name: `New Record ${rawNumber}`,
      folder: folderName,
      content: `---
title: "Scent of Summer ${rawNumber}"
subtitle: "Chill Beats Collection - Stereo"
gradient: "aurora"
cover: ""
---

# New Record Tracklist
Welcome to your new vinyl layout markdown page! Edit this markdown description inside the Obsidian editor box to see details change instantly.
`,
      frontmatter: {
        title: `Scent of Summer ${rawNumber}`,
        subtitle: "Chill Beats Collection - Stereo",
        gradient: "aurora"
      },
      stat: { size: 320 }
    };

    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    if (folderName) setSelectedFolder(folderName);
  };

  const handleCreateNewFolder = () => {
    const folderName = prompt("Please enter the new folder (Genre) name:");
    if (!folderName) return;
    if (folderNames.includes(folderName)) {
      alert("A folder with this name already exists.");
      return;
    }

    // Add immediate placeholder note in directory to register folder structure
    const newNote: MockNote = {
      path: `${folderName}/Intro Session.md`,
      name: "Intro Session",
      folder: folderName,
      content: `---
title: "Intro Session Disc"
subtitle: "Acoustic Beats"
gradient: "dreamy"
---

# Intro Session
Establish your gorgeous CD-Cover Grid layout for categorized documents!
`,
      frontmatter: {
        title: "Intro Session Disc",
        subtitle: "Acoustic Beats",
        gradient: "dreamy"
      },
      stat: { size: 180 }
    };

    setNotes(prev => [...prev, newNote]);
    setSelectedFolder(folderName);
    setSelectedNote(newNote);
  };

  const handleDeleteActiveNote = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this file from the Vault?")) return;
    
    const filtered = notes.filter(n => n.path !== path);
    setNotes(filtered);
    if (selectedNote?.path === path) {
      setSelectedNote(filtered[0] || null);
    }
  };

  // Preset quick assignments
  const handleAssignCoverUrl = (url: string) => {
    if (!selectedNote) return;
    const contents = selectedNote.content;
    const hasFm = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (hasFm) {
      let fmText = hasFm[1];
      if (fmText.includes("cover:")) {
        fmText = fmText.replace(/cover:\s*".*?"/g, `cover: "${url}"`);
        fmText = fmText.replace(/cover:\s*.*$/gm, `cover: "${url}"`);
      } else {
        fmText += `\ncover: "${url}"`;
      }
      const rebuilt = `---\n${fmText.trim()}\n---` + contents.replace(/^---\r?\n([\s\S]*?)\r?\n---/, "");
      handleUpdateNoteContent(rebuilt);
    }
  };

  const handleAssignGradient = (gradName: string) => {
    if (!selectedNote) return;
    const contents = selectedNote.content;
    const hasFm = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (hasFm) {
      let fmText = hasFm[1];
      // strip existing cover so the premium gradient shines live
      fmText = fmText.split("\n").filter(line => !line.trim().startsWith("cover:") && !line.trim().startsWith("image:")).join("\n");
      
      if (fmText.includes("gradient:")) {
        fmText = fmText.replace(/gradient:\s*".*?"/g, `gradient: "${gradName}"`);
        fmText = fmText.replace(/gradient:\s*.*$/gm, `gradient: "${gradName}"`);
      } else {
        fmText += `\ngradient: "${gradName}"`;
      }
      const rebuilt = `---\n${fmText.trim()}\n---` + contents.replace(/^---\r?\n([\s\S]*?)\r?\n---/, "");
      handleUpdateNoteContent(rebuilt);
    }
  };

  // Clipboard copies
  const triggerCopyCode = (filename: string, codeString: string) => {
    navigator.clipboard.writeText(codeString);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // AI Creator simulation
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        handleAssignCoverUrl(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderFolderCDWall = (folderPath: string) => {
    const folderNotes = notes.filter(n => n.folder === folderPath);

    const gradientMap: Record<string, string> = {
      dreamy: "from-purple-600 to-pink-500",
      sunset: "from-orange-500 to-amber-500",
      synth: "from-fuchsia-600 to-cyan-400",
      cyber: "from-slate-950 to-blue-900 border-indigo-950",
      aurora: "from-cyan-400 to-sky-600",
      emerald: "from-emerald-600 to-green-500",
      coral: "from-red-600 to-orange-500",
      lavender: "from-[#e0c3fc] to-[#8ec5fc] text-gray-900"
    };

    if (folderNotes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <BookOpen className="w-10 h-10 text-gray-600 stroke-1 mb-3 animate-pulse" />
          <p className="text-xs">This folder is currently empty.</p>
          <button
            type="button"
            onClick={() => handleAddNoteToFolder(folderPath)}
            className="mt-2 text-purple-400 hover:text-white text-[11px] underline font-medium"
          >
            + Create a note inside
          </button>
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${isFrontmatterOpen ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"} gap-6 py-2`}>
        {folderNotes.map((note) => {
          const isSelected = selectedNote?.path === note.path;
          const gradientClass = gradientMap[note.frontmatter.gradient || "dreamy"] || "from-pink-500 to-purple-500";
          const coverImg = note.frontmatter.cover;

          return (
            <div
              key={note.path}
              onClick={() => handleSelectNote(note)}
              className="relative cursor-pointer group"
            >
              {/* Album Cover Main Card */}
              <div
                className={`relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-tr ${gradientClass} border transition-all duration-150 ease-out shadow-lg group-hover:scale-[1.02] ${
                  isSelected 
                    ? "ring-2 ring-purple-500 border-white shadow-purple-500/10" 
                    : "border-white/10 group-hover:border-white/30 group-hover:shadow-xl"
                }`}
                style={{
                  backgroundImage: coverImg ? `url(${coverImg})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* Visual Glass Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-black/20 pointer-events-none z-10" />

                {/* Cover info full face typographic layout */}
                <div className="absolute inset-0 p-5 flex flex-col items-start justify-center text-left z-20 gap-1 select-none animate-[fadeIn_0.2s_ease-out]">
                  <span 
                    className="font-extrabold text-white tracking-tight text-left max-w-full overflow-hidden"
                    style={{ 
                      fontSize: `${note.frontmatter.fontSize || settings.defaultFontSize}px`,
                      textShadow: "0 2px 5px rgba(0,0,0,0.45)",
                      lineHeight: 1.1,
                      wordBreak: "break-word"
                    }}
                  >
                    {note.frontmatter.title || note.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Static strings for 3 Obsidian developer release files in English
  const manifestJSONContent = `{
  "id": "visual-covers",
  "name": "Visual Covers",
  "version": "1.0.0",
  "minAppVersion": "1.4.0",
  "description": "Converts Obsidian text lists/folder notes into an incredibly aesthetic, highly customizable grid of aspect-ratio 1:1 CD covers with dynamic spinning Vinyl Record hover transitions.",
  "author": "Obsidian Elite Developer",
  "authorUrl": "https://ai.studio/build",
  "isDesktopOnly": false
}`;

  const stylesCSSContent = `/* ==============================================
   Visual Covers - Official Stylesheet
   ============================================== */
.cd-cover-container {
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow-y: auto;
  font-family: var(--font-interface, var(--font-sans, system-ui));
}

.cd-cover-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  gap: 2.2rem;
  padding: 1rem 0;
  width: 100%;
}

.cd-cover-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  perspective: 1000px;
}

.cd-cover-card {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1 !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cd-cover-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.15) 100%);
  z-index: 3;
}

.cd-cover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.9rem 0.75rem;
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cd-cover-title-text {
  color: #ffffff;
  font-size: var(--cd-cover-font-size, 14px);
  font-weight: 600;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cd-cover-subtitle-text {
  color: rgba(255, 255, 255, 0.55);
  font-size: calc(var(--cd-cover-font-size, 14px) * 0.78);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
}

/* Fast, lag-free premium hover animations */
.cd-cover-card {
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease-out;
}

.cd-cover-wrapper:hover .cd-cover-card {
  transform: scale(1.02);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.45);
}

/* Elegant High-Fidelity Vinyl Disc Styles */
.cd-cover-vinyl {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle,
    #181818,
    #101010 1px,
    #1e1e1e 2px,
    #101010 3px
  );
  box-shadow: 
    0 4px 10px rgba(0, 0, 0, 0.4),
    inset 0 0 10px rgba(0, 0, 0, 0.8);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), z-index 0.6s;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cd-cover-vinyl-center {
  width: 28%;
  height: 28%;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.cd-cover-vinyl-spindle {
  width: 14%;
  height: 14%;
  border-radius: 50%;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
}

.cd-cover-wrapper:hover .cd-cover-vinyl {
  transform: translate(35%, 0) rotate(360deg);
  z-index: 1;
}

/* Theme presets CSS gradients definitions */
.cd-gradient-dreamy { background-image: linear-gradient(135deg, #8a2be2 0%, #ff1493 100%); }
.cd-gradient-sunset { background-image: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%); }
.cd-gradient-synth { background-image: linear-gradient(135deg, #f012be 0%, #00ffff 100%); }
.cd-gradient-cyber { background-image: linear-gradient(135deg, #0f2027 0%, #203a43 100%); }
.cd-gradient-aurora { background-image: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); }
.cd-gradient-emerald { background-image: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.cd-gradient-coral { background-image: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }
.cd-gradient-lavender { background-image: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); }`;

  const mainTSCodeContent = `import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, TFolder, TFile } from "obsidian";

interface CDCoverSettings {
  defaultFontSize: number;
  defaultGradient: string;
  enableVinylAnimation: boolean;
  enable3DEffect: boolean;
  filterMarkdownOnly: boolean;
  customCovers: Record<string, string>;
}

const DEFAULT_SETTINGS: CDCoverSettings = {
  defaultFontSize: 14,
  defaultGradient: "dreamy",
  enableVinylAnimation: true,
  enable3DEffect: true,
  filterMarkdownOnly: true,
  customCovers: {}
};

const VIEW_TYPE = "visual-covers-view";

class CDCoverView extends ItemView {
  plugin: VisualCoversPlugin;
  folderPath: string = "/";

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

    const container = root.createDiv({ cls: "cd-cover-container animate-fade-in" });

    // Header structure inside Obsidian with Folder Selector dropdown
    const headerEl = container.createDiv({ 
      cls: "cd-cover-header", 
      style: "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 15px;" 
    });
    headerEl.createEl("h3", { text: "Visual Covers Grid Focus", style: "margin: 0; font-size: 1.1em;" });

    const folderSelect = headerEl.createEl("select", { 
      cls: "cd-cover-folder-select",
      style: "background: var(--background-secondary); border: 1px solid var(--border-color); padding: 5px 10px; border-radius: 6px; color: var(--text-normal); font-size: 12px; cursor: pointer;"
    });

    // Populate all vault folders
    const allFiles = this.app.vault.getAllLoadedFiles();
    const folders = allFiles.filter(f => f instanceof TFolder) as TFolder[];
    
    // Root option
    const rootOpt = folderSelect.createEl("option", { text: "Root Vault" });
    rootOpt.value = "/";
    if (this.folderPath === "/") rootOpt.selected = true;

    folders.forEach(f => {
      if (f.path === "/" || f.path === "") return;
      const opt = folderSelect.createEl("option", { text: f.path });
      opt.value = f.path;
      if (this.folderPath === f.path) {
        opt.selected = true;
      }
    });

    folderSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      this.setFolder(target.value);
    });

    const gridEl = container.createDiv({ cls: "cd-cover-grid" });
    
    // Set customized layout font sizing variables
    gridEl.style.setProperty("--cd-cover-font-size", \`\${this.plugin.settings.defaultFontSize}px\`);

    // Fetch the parsed folder or root listing
    let filesInFolder: TFile[] = [];
    if (this.folderPath === "/") {
      const allVaultFiles = this.app.vault.getFiles();
      filesInFolder = allVaultFiles;
    } else {
      const folderObj = this.app.vault.getAbstractFileByPath(this.folderPath);
      if (folderObj instanceof TFolder) {
        filesInFolder = folderObj.children.filter(f => f instanceof TFile) as TFile[];
      }
    }

    filesInFolder.forEach(file => {
      // Filter out non-markdown references if settings demand
      if (this.plugin.settings.filterMarkdownOnly && file.extension !== "md") return;

      // Extract high fidelity frontmatter properties
      const cache = this.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter || {};

      const title = frontmatter.title || file.basename;
      const gradient = frontmatter.gradient || this.plugin.settings.defaultGradient;
      const cover = frontmatter.cover || "";
      const fontSize = frontmatter.fontSize || this.plugin.settings.defaultFontSize;

      const wrapper = gridEl.createDiv({ cls: "cd-cover-wrapper" });

      // 1. High fidelity spinning Vinyl disk
      if (this.plugin.settings.enableVinylAnimation) {
        const vinyl = wrapper.createDiv({ cls: "cd-cover-vinyl" });
        const center = vinyl.createDiv({ cls: "cd-cover-vinyl-center" });
        vinyl.createDiv({ cls: "cd-cover-vinyl-spindle" });
        if (cover) {
          center.style.backgroundImage = \`url("\${cover}")\`;
        }
      }

      // 2. Front cover artwork card
      const card = wrapper.createDiv({ cls: \`cd-cover-card cd-gradient-\${gradient}\` });
      if (cover) {
        card.style.backgroundImage = \`url("\${cover}")\`;
      }
      if (fontSize) {
        card.style.setProperty("--cd-cover-font-size", \`\${fontSize}px\`);
      }

      // Glowing reflection shine
      card.createDiv({ 
        cls: "cd-cover-shine", 
        style: "position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%); pointer-events: none; z-index: 3;" 
      });

      // Details overlay area
      const info = card.createDiv({ cls: "cd-cover-info" });
      info.createDiv({ cls: "cd-cover-title-text", text: title });
      info.createDiv({ cls: "cd-cover-subtitle-text", text: file.name.toUpperCase() });

      // Click event block to open Obsidian note file instantly
      card.addEventListener("click", () => {
        this.app.workspace.getLeaf(false).openFile(file);
      });
    });
  }
}

class CDCoverSettingTab extends PluginSettingTab {
  plugin: VisualCoversPlugin;

  constructor(app: App, plugin: VisualCoversPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Visual Covers Grid settings" });

    new Setting(containerEl)
      .setName("Default Frontmatter Font Size")
      .setDesc("The font size sizing parameter applied on card labels (in pixels)")
      .addSlider(slider => slider
        .setLimits(10, 48, 1)
        .setValue(this.plugin.settings.defaultFontSize)
        .onChange(async (value) => {
          this.plugin.settings.defaultFontSize = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Default Card Gradient")
      .setDesc("When no custom cover artwork URL is configured, this gradient applies")
      .addDropdown(dropdown => dropdown
        .addOption("dreamy", "Dreamy Purple")
        .addOption("sunset", "Sunset Glow")
        .addOption("synth", "Synthwave Neon")
        .addOption("cyber", "Cyberpunk Steel")
        .addOption("aurora", "Aurora Borealis")
        .addOption("emerald", "Emerald Forest")
        .addOption("coral", "Vibrant Coral")
        .addOption("lavender", "Cool Lavender")
        .setValue(this.plugin.settings.defaultGradient)
        .onChange(async (value) => {
          this.plugin.settings.defaultGradient = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Spinning Vinyl Record Animation")
      .setDesc("Slide outward the rotating Vinyl Record on cover hovering")
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableVinylAnimation)
        .onChange(async (value) => {
          this.plugin.settings.enableVinylAnimation = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Filter Markdown Notes Only")
      .setDesc("Hide non-markdown assets and attachment files from the grid")
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.filterMarkdownOnly)
        .onChange(async (value) => {
          this.plugin.settings.filterMarkdownOnly = value;
          await this.plugin.saveSettings();
        })
      );
  }
}

export default class VisualCoversPlugin extends Plugin {
  settings: CDCoverSettings;

  async onload() {
    await this.loadSettings();

    // Register active workspace view
    this.registerView(VIEW_TYPE, (leaf) => new CDCoverView(leaf, this));

    // Register ribbon button icon
    this.addRibbonIcon("disc", "Open Visual Covers Grid", () => {
      this.activateView();
    });

    // Register command palette entry
    this.addCommand({
      id: "open-visual-covers-palette",
      name: "Open Visual Covers Grid View",
      callback: () => this.activateView(),
    });

    // Add settings tab panel
    this.addSettingTab(new CDCoverSettingTab(this.app, this));
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        leaf = rightLeaf;
        await leaf.setViewState({ type: VIEW_TYPE, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }
}`;

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-gray-200 font-sans flex flex-col overflow-x-hidden selection:bg-purple-600/30 selection:text-white">
      
      {/* Top Header Controls / Navigation */}
      <header className="border-b border-[#1e1e1e] bg-[#121212]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl shadow-lg border border-purple-400/20 shadow-purple-500/10">
            <Disc className="w-6 h-6 text-white animate-[spin_8s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-md md:text-lg font-bold font-display tracking-tight text-white">Visual Covers</h1>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-medium font-mono">Sim v1.0</span>
            </div>
          </div>
        </div>

        {/* Global Primary Navigation Switching */}
        <div className="flex items-center bg-[#1c1c1c] p-1 rounded-xl border border-[#2b2b2b]">
          <button
            type="button"
            id="tab-sim-nav"
            onClick={() => setMainTab("workspace")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mainTab === "workspace" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/15" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Live Obsidian Vault Simulator
          </button>
          
          <button
            type="button"
            id="tab-publishing-nav"
            onClick={() => setMainTab("publishing")}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mainTab === "publishing" 
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/15" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            Obsidian Release & PR Center
          </button>
        </div>
      </header>

      {/* Primary Container View */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">

        {/* ====================================================================
            TAB 1: LIVE INTERACTIVE WORKSPACE
            ==================================================================== */}
        {mainTab === "workspace" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 1. Left Side Column: Vault Files & Categories Folder structure */}
            {isLeftSidebarOpen && (
              <div className="lg:col-span-3 bg-[#111111] border border-[#222222] rounded-2xl p-4 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  VAULT FILE SYSTEM
                </span>
                <button
                  type="button"
                  id="create-folder-btn"
                  onClick={handleCreateNewFolder}
                  title="Create new musical genre folder"
                  className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-white rounded font-medium border border-white/10 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Folder
                </button>
              </div>

              {/* Folder list selection */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[10px] text-gray-500 uppercase font-mono">Current Folder Grid Focus</label>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolder("MOC Index");
                      setSelectedNote(notes.find(n => n.folder === "") || null);
                    }}
                    className={`flex items-center justify-between pointer px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                      selectedFolder === "MOC Index" 
                        ? "bg-purple-600/15 text-purple-300 border-l-2 border-purple-500" 
                        : "bg-white/[0.02] text-gray-300 hover:bg-[#181818]"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileJson className="w-3.5 h-3.5 text-amber-400" />
                      Vault Root MOC (000 Index)
                    </span>
                  </button>

                  {folderNames.map(fName => {
                    const count = notes.filter(n => n.folder === fName).length;
                    return (
                      <button
                        key={fName}
                        type="button"
                        onClick={() => {
                          setSelectedFolder(fName);
                          const firstNote = notes.find(n => n.folder === fName);
                          if (firstNote) setSelectedNote(firstNote);
                        }}
                        className={`flex items-center justify-between pointer px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                          selectedFolder === fName 
                            ? "bg-purple-600/15 text-purple-300 border-l-2 border-purple-500" 
                            : "bg-white/[0.02] text-gray-300 hover:bg-[#1c1c1c]"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          {fName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Notes of focused Folder */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2 border-t border-white/5 pt-3 mt-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Notes inside {selectedFolder === "MOC Index" ? "Root" : "Folder"}</span>
                  <button
                    type="button"
                    onClick={() => handleAddNoteToFolder(selectedFolder === "MOC Index" ? "" : selectedFolder)}
                    className="p-1 hover:bg-white/5 hover:text-white rounded text-gray-400"
                    title="Add new digital record note"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[300px]">
                  {notes.filter(n => selectedFolder === "MOC Index" ? n.folder === "" : n.folder === selectedFolder).map(note => {
                    const isNoteActive = selectedNote?.path === note.path;
                    return (
                      <div
                        key={note.path}
                        onClick={() => setSelectedNote(note)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors group ${
                          isNoteActive 
                            ? "bg-[#1f1e24] text-white font-medium border border-purple-500/30" 
                            : "text-gray-400 hover:bg-white/[0.02] hover:text-gray-100"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{note.frontmatter.title || note.name}</span>
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => handleDeleteActiveNote(note.path, e)}
                          title="Delete note"
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-rose-400 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  {notes.filter(n => selectedFolder === "MOC Index" ? n.folder === "" : n.folder === selectedFolder).length === 0 && (
                    <div className="text-center p-6 text-gray-600 text-xs">No records inside</div>
                  )}
                </div>
              </div>
            </div>
          )}

            {/* 2. Middle Column: Responsive Square Card GRID view (Live Plugin Preview) */}
            <div className={`${
              isLeftSidebarOpen && isFrontmatterOpen 
                ? "lg:col-span-6" 
                : isLeftSidebarOpen || isFrontmatterOpen 
                ? "lg:col-span-9" 
                : "lg:col-span-12"
            } bg-[#141414] border border-[#222222] rounded-2xl p-5 flex flex-col min-h-[500px] transition-all duration-300`}>
              
              {/* Plugin Header with controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#222222] pb-3 mb-4 gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-purple-400" />
                    Cover Wall View
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Renders selected directory contents synchronously</p>
                </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Left Sidebar Collapse UI Icon Button */}
                    <button
                      type="button"
                      onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                      title={isLeftSidebarOpen ? "Collapse Vault Sidebar" : "Expand Vault Sidebar"}
                      className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                        isLeftSidebarOpen
                          ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                          : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>

                    <span className="h-4 w-px bg-white/10 mx-1" />

                    {/* Frontmatter Editor Sidebar Icon Button selector */}
                    {selectedNote && (
                      <button
                        type="button"
                        onClick={() => setIsFrontmatterOpen(!isFrontmatterOpen)}
                        title={isFrontmatterOpen ? "Collapse Frontmatter Editor" : "Open Frontmatter Editor"}
                        className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                          isFrontmatterOpen
                            ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                            : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
              </div>

              {/* Render dynamic CD Wall view */}
              <div className="flex-1 overflow-y-auto pr-1">
                {selectedFolder === "MOC Index" ? (
                  renderFolderCDWall("")
                ) : (
                  renderFolderCDWall(selectedFolder)
                )}
              </div>


            </div>

            {/* 3. Right Column: Obsidian Note Markdown Code Editor & Quick Art Generator */}
            {isFrontmatterOpen && (
              <div className="lg:col-span-3 flex flex-col gap-6 animate-in fade-in slide-in-from-right-3 duration-300">
              
              {/* Note Metadata Properties Controller */}
              {selectedNote ? (
                <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-purple-400 flex items-center p-0.5 animate-pulse" title="Frontmatter Editor">
                      <Edit className="w-4 h-4 text-purple-400" />
                    </span>
                    {savedSuccessMsg && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 animate-pulse">
                        <Check className="w-3 h-3" /> Saved!
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={selectedNote.frontmatter.title || ""}
                        onChange={(e) => {
                          const currentProperties = selectedNote.content;
                          const hasCover = currentProperties.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                          if (hasCover) {
                            let fmText = hasCover[1];
                            if (fmText.includes("title:")) {
                              fmText = fmText.replace(/title:\s*".*?"/g, `title: "${e.target.value}"`);
                              fmText = fmText.replace(/title:\s*.*$/gm, `title: "${e.target.value}"`);
                            } else {
                              fmText += `\ntitle: "${e.target.value}"`;
                            }
                            const rebuilt = `---\n${fmText.trim()}\n---` + currentProperties.replace(/^---\r?\n([\s\S]*?)\r?\n---/, "");
                            handleUpdateNoteContent(rebuilt);
                          }
                        }}
                        className="w-full bg-white/5 hover:bg-white/10 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-purple-600 transition-all border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
                        placeholder="Album Title"
                      />
                    </div>

                    {/* Per-Cover Custom Font Size */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-400">Cover Font Size</label>
                        <span className="text-purple-400 font-mono font-medium">
                          {selectedNote.frontmatter.fontSize || settings.defaultFontSize}px
                          {selectedNote.frontmatter.fontSize ? " (Custom)" : " (Default)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={selectedNote.frontmatter.fontSize || settings.defaultFontSize}
                        onChange={(e) => {
                          const currentProperties = selectedNote.content;
                          const hasCover = currentProperties.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                          if (hasCover) {
                            let fmText = hasCover[1];
                            const val = e.target.value;
                            if (fmText.includes("fontSize:")) {
                              fmText = fmText.replace(/fontSize:\s*\d+/g, `fontSize: ${val}`);
                              fmText = fmText.replace(/fontSize:\s*.*$/gm, `fontSize: ${val}`);
                            } else if (fmText.includes("font_size:")) {
                              fmText = fmText.replace(/font_size:\s*\d+/g, `fontSize: ${val}`);
                              fmText = fmText.replace(/font_size:\s*.*$/gm, `fontSize: ${val}`);
                            } else {
                              fmText += `\nfontSize: ${val}`;
                            }
                            const rebuilt = `---\n${fmText.trim()}\n---` + currentProperties.replace(/^---\r?\n([\s\S]*?)\r?\n---/, "");
                            handleUpdateNoteContent(rebuilt);
                          }
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>

                    {/* Gradient Themes Selector */}
                    <div>
                      <label className="block text-gray-400 mb-1.5">No-Image Color Theme (Gradient)</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { key: "dreamy", label: "Pink", style: "bg-gradient-to-tr from-purple-600 to-pink-500" },
                          { key: "sunset", label: "Warm", style: "bg-gradient-to-tr from-orange-500 to-amber-400" },
                          { key: "synth", label: "Synth", style: "bg-gradient-to-tr from-fuchsia-600 to-cyan-400" },
                          { key: "cyber", label: "Dark", style: "bg-gradient-to-tr from-slate-900 to-blue-900" },
                          { key: "aurora", label: "Cyan", style: "bg-gradient-to-tr from-cyan-400 to-sky-600" },
                          { key: "emerald", label: "Mint", style: "bg-gradient-to-tr from-emerald-600 to-green-400" },
                          { key: "coral", label: "Red", style: "bg-gradient-to-tr from-red-600 to-orange-500" },
                          { key: "lavender", label: "Blue", style: "bg-gradient-to-tr from-[#e0c3fc] to-[#8ec5fc]" }
                        ].map((grad) => (
                          <button
                            key={grad.key}
                            type="button"
                            onClick={() => handleAssignGradient(grad.key)}
                            title={`Apply ${grad.key} preset`}
                            className={`h-7 rounded-md transition-all relative border ${
                              selectedNote.frontmatter.gradient === grad.key 
                                ? "ring-2 ring-purple-500 border-white" 
                                : "border-transparent"
                            } ${grad.style}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Custom Cover presets */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-400">Custom Image Overlay</label>
                        {selectedNote.frontmatter.cover && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentProperties = selectedNote.content;
                              const hasCover = currentProperties.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                              if (hasCover) {
                                let fmText = hasCover[1];
                                fmText = fmText.split("\n")
                                  .filter(line => !line.trim().startsWith("cover:") && !line.trim().startsWith("image:"))
                                  .join("\n");
                                const rebuilt = `---\n${fmText.trim()}\n---` + currentProperties.replace(/^---\r?\n([\s\S]*?)\r?\n---/, "");
                                handleUpdateNoteContent(rebuilt);
                              }
                            }}
                            className="text-rose-400 hover:underline hover:text-rose-300 text-[10px]"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleCustomImageUpload}
                          accept="image/*"
                          className="hidden"
                          id="custom-cover-file-picker"
                        />

                        {Array.from({ length: 8 }).map((_, slotIdx) => {
                          if (slotIdx === 1) {
                            // File selector/Uploader button
                            const isCurrentCustom = selectedNote.frontmatter.cover && !COVER_PRESETS.some(p => p.url === selectedNote.frontmatter.cover);
                            return (
                              <button
                                key="uploader-slot"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                title="Upload your own custom cover art"
                                className={`h-9 relative flex flex-col items-center justify-center rounded-md border text-[9px] font-semibold transition-all border-dashed ${
                                  isCurrentCustom
                                    ? "bg-purple-600/20 border-purple-500 text-purple-300 ring-2 ring-purple-500 scale-95"
                                    : "bg-white/[0.02] hover:bg-white/5 border-white/20 text-gray-400 hover:text-white"
                                }`}
                              >
                                {isCurrentCustom ? (
                                  <div className="absolute inset-0 rounded-md bg-cover bg-center overflow-hidden opacity-30" style={{ backgroundImage: `url(${selectedNote.frontmatter.cover})` }} />
                                ) : null}
                                <span className="relative z-10 font-bold text-center leading-none">Upload Cover</span>
                                <span className="relative z-10 text-[7px] text-gray-500 block leading-tight mt-0.5">(Custom)</span>
                              </button>
                            );
                          }

                          // Get original preset: index is slotIdx if < 1 else slotIdx - 1
                          const presetIdx = slotIdx < 1 ? slotIdx : slotIdx - 1;
                          const preset = COVER_PRESETS[presetIdx];
                          if (!preset) return null;

                          return (
                            <button
                              key={presetIdx}
                              type="button"
                              onClick={() => handleAssignCoverUrl(preset.url)}
                              title={preset.name}
                              className={`h-9 bg-cover bg-center rounded-md border text-[10px] font-semibold text-white/90 shadow transition-all relative ${
                                selectedNote.frontmatter.cover === preset.url 
                                  ? "ring-2 ring-purple-500 border-white scale-95" 
                                  : "border-white/10 hover:border-white/30"
                              }`}
                              style={{ backgroundImage: `url(${preset.url})` }}
                            />
                          );
                        })}
                      </div>
                    </div>


                  </div>
                </div>
              ) : (
                <div className="bg-[#111] border border-[#222] rounded-2xl p-6 text-center text-gray-500 text-xs">
                  Select a Markdown file to configure parameters
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 2: COMMUNITY PUBLISHING CENTER
            ==================================================================== */}
        {mainTab === "publishing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Obsidian Directory Release Step-By-Step Instruction */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Obsidian Community Plugin Submission Guide</h2>
                  <p className="text-xs text-gray-400">Step-by-step developer tutorial to publish your "Visual Covers" plug-in</p>
                </div>
              </div>

              {/* Step 1: Release Artifacts */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">1</span>
                    <h3 className="text-sm font-semibold text-white">Generate Obsidian Release Artifacts</h3>
                  </div>
                  <span className="text-[10px] bg-purple-600/10 text-purple-400 px-2.5 py-0.5 border border-purple-500/25 rounded-full font-semibold">REQUIRED</span>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  Before applying, your GitHub repository root directory must contain the following compilation output files. Since Obsidian loads plugins asynchronously, they expect built bundles directly:
                </p>

                <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                  <li><strong className="text-white">manifest.json</strong>: Key plugin metadata (ID, version, name). Must matches manifest format precisely.</li>
                  <li><strong className="text-white">main.js</strong>: The compiled JavaScript bundle (translated and bundled from raw TypeScript files).</li>
                  <li><strong className="text-white">styles.css</strong>: Custom styles detailing beautiful aspect-ratio 1:1 grids and sliding vinyl animation keyframes.</li>
                  <li><strong className="text-white">README.md</strong>: Clear markdown instructions explaining the setup process, features, and visual previews.</li>
                </ul>

                <p className="text-[11px] text-amber-400 italic">
                  💡 Hint: We generated matching compliant code tabs in the right column. Feel free to copy them directly into your actual files.
                </p>
              </div>

              {/* Step 2: GitHub Releases */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">2</span>
                  <h3 className="text-sm font-semibold text-white">Create a Tagged GitHub Release</h3>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  Obsidian's discovery index queries releases on GitHub based on semver tags:
                </p>

                <ol className="text-xs text-gray-400 space-y-1.5 pl-4 list-decimal">
                  <li>Go to your GitHub repository and click <strong className="text-white">Create a new release</strong> on the right footer menu.</li>
                  <li>Draft a Tag matching the exact version inside your <code className="text-purple-300 font-mono">manifest.json</code> (e.g., <code className="text-white bg-white/5 px-1 rounded">1.0.0</code>).</li>
                  <li>Upload three files (<code className="text-purple-300 font-mono">main.js</code>, <code className="text-purple-300 font-mono">manifest.json</code>, and <code className="text-purple-300 font-mono">styles.css</code>) directly as asset attachments.</li>
                  <li>Publish the release!</li>
                </ol>
              </div>

              {/* Step 3: Submitting pull request to community-plugins.json */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">3</span>
                  <h3 className="text-sm font-semibold text-white">Submit Obsidian Community Pull Request</h3>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  Register your plugin in the official community store index file:
                </p>

                <ol className="text-xs text-gray-400 space-y-2 pl-4 list-decimal">
                  <li>
                    Fork the official index repository on GitHub: {" "}
                    <a href="https://github.com/obsidianmd/obsidian-releases" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline inline-flex items-center gap-0.5 font-bold">
                      obsidianmd/obsidian-releases <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Open and edit the <code className="text-white bg-white/5 py-0.5 px-1 rounded font-mono">community-plugins.json</code> file.
                  </li>
                  <li>
                    Insert your plugin metadata in alphabetical order using this exact schema:
                    <div className="bg-[#181818] p-3 rounded-xl border border-white/5 text-[11px] font-mono mt-1.5 relative overflow-x-auto text-gray-300">
                      <pre>{`{
  "id": "visual-covers",
  "name": "Visual Covers",
  "author": "Your GitHub Username",
  "description": "Transform text lists or folders into a highly aesthetic, responsive CD cover wall.",
  "repo": "your-github-username/obsidian-visual-covers"
}`}</pre>
                    </div>
                  </li>
                  <li>Create a PR from your fork's branch. Name the pull request title: <code className="text-purple-300">Plugin: Visual Covers</code></li>
                </ol>
              </div>

              {/* Step 4: Alpha & Beta user testing */}
              <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 space-y-3 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">4</span>
                  <h3 className="text-sm font-semibold text-white">How to let Alpha/Beta Users Test Your Plugin?</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-xl border border-white/5">
                    <h4 className="text-white font-semibold mb-1 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      Option A: Manual Installation
                    </h4>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Instruct users to download your release asset files (<code>main.js</code>, <code>manifest.json</code>, <code>styles.css</code>) and save them inside their vault's sub-folder pathway:
                      <code className="block mt-1 font-mono text-[10px] bg-black/40 p-1.5 rounded text-purple-300">
                        {"<vault-root>/.obsidian/plugins/visual-covers/"}
                      </code>
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-xl border border-white/5">
                    <h4 className="text-white font-semibold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Option B: Obsidian BRAT Plugin
                    </h4>
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Beta Reviewer's Auto-update Tool (BRAT) is the standard tool. Beta testers install BRAT from the community library, then simply input your GitHub repo link:
                      <code className="block mt-1 font-mono text-[10px] bg-black/40 p-1.5 rounded text-purple-300">
                        {"your-username/obsidian-visual-covers"}
                      </code>
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hand: Asset Copier panel representing exact production values */}
            <div className="lg:col-span-5 bg-[#111] border border-[#222] rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase font-mono">PLUGIN COMPILATION PRODUCTS</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  These 3 absolute key files must be created in your Obsidian plugin folder for your plugin to load successfully. Select a tab below and copy its contents!
                </p>
              </div>

              {/* Sub-tab Selection */}
              <div className="flex border-b border-white/5">
                {(["manifest.json", "styles.css", "main.ts"] as const).map((tab) => {
                  const isTabActive = activeCodeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      className={`flex-1 py-2 text-xs font-semibold border-b-2 text-center transition-all cursor-pointer ${
                        isTabActive 
                          ? "border-purple-500 text-white bg-purple-500/5" 
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Display Code Editor with instant clipboard copy */}
              <div className="flex-1 flex flex-col bg-[#080808] border border-white/5 rounded-xl p-3 min-h-[380px] relative">
                
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      const codeStr = activeCodeTab === "manifest.json" 
                        ? manifestJSONContent 
                        : activeCodeTab === "styles.css" 
                        ? stylesCSSContent 
                        : mainTSCodeContent;
                      triggerCopyCode(activeCodeTab, codeStr);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold text-xs rounded-lg transition-all"
                  >
                    {copiedFile === activeCodeTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-mono pb-2 border-b border-white/5 mb-2 select-none">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Interactive file: {activeCodeTab}</span>
                </div>

                <div className="flex-1 overflow-auto max-h-[460px] text-[11px] font-mono text-purple-300 leading-relaxed text-left whitespace-pre">
                  {activeCodeTab === "manifest.json" && manifestJSONContent}
                  {activeCodeTab === "styles.css" && stylesCSSContent}
                  {activeCodeTab === "main.ts" && mainTSCodeContent}
                </div>
              </div>

              {/* Extra checklist */}
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-xs text-gray-400 space-y-1">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">✓ Code Review Best Practices</span>
                <p>✓ Avoid heavy global intervals</p>
                <p>✓ Explicitly release DOM on plugin shutdown (<code>onunload</code>)</p>
                <p>✓ Use <code>this.registerMarkdownCodeBlockProcessor</code> for embedding MOC covers</p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Simulator Footer Credit and branding */}
      <footer className="border-t border-[#1e1e1e] bg-[#0d0d0d] px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-purple-500/80" />
            <span className="font-mono">VISUAL COVERS • PORT 3000 DEV</span>
          </div>
          <div>
            <span>Conforms precisely to community store standards. Craft-designed for Obsidian lovers.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
