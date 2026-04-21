"""
Architecture diagram generator for RealEstate AI Platform.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np

# ── Canvas ────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(22, 16))
ax.set_xlim(0, 22)
ax.set_ylim(0, 16)
ax.axis("off")
fig.patch.set_facecolor("white")

# ── Colour palette ────────────────────────────────────────────────────────────
C = {
    "client":    "#E3F2FD",   # light blue
    "frontend":  "#1565C0",   # deep blue
    "backend":   "#2E7D32",   # deep green
    "ws":        "#00838F",   # teal
    "db":        "#6A1B9A",   # deep purple
    "ai":        "#C62828",   # deep red
    "cloud":     "#E65100",   # deep orange
    "ext":       "#F57F17",   # amber
    "auth":      "#4E342E",   # brown
    "lane_bg":   "#F8F9FA",
    "border":    "#DEE2E6",
    "arrow":     "#455A64",
    "text_dark": "#1A1A2E",
    "text_light":"#FFFFFF",
}

# ── Helper: rounded box ────────────────────────────────────────────────────────
def box(ax, x, y, w, h, label, sublabel=None,
        fc="#1565C0", tc="white", fs=9.5, subfs=7.5, radius=0.35, alpha=0.93, zorder=3):
    rect = FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        linewidth=1.6,
        edgecolor=fc,
        facecolor=fc,
        alpha=alpha,
        zorder=zorder,
    )
    # soft inner glow via a white outline rect
    glow = FancyBboxPatch(
        (x + 0.04, y + 0.04), w - 0.08, h - 0.08,
        boxstyle=f"round,pad=0,rounding_size={radius*0.8}",
        linewidth=0.6,
        edgecolor="white",
        facecolor="none",
        alpha=0.35,
        zorder=zorder + 1,
    )
    ax.add_patch(rect)
    ax.add_patch(glow)
    cy = y + h / 2 + (0.15 if sublabel else 0)
    ax.text(x + w / 2, cy, label,
            ha="center", va="center", fontsize=fs,
            fontweight="bold", color=tc, zorder=zorder + 2,
            wrap=False)
    if sublabel:
        ax.text(x + w / 2, y + h / 2 - 0.22, sublabel,
                ha="center", va="center", fontsize=subfs,
                color=tc, alpha=0.82, zorder=zorder + 2,
                style="italic")

# ── Helper: arrow ────────────────────────────────────────────────────────────
def arrow(ax, x1, y1, x2, y2, label="", color="#455A64",
          lw=1.5, ls="-", head=0.25, curved=None, label_offset=(0, 0)):
    style = "arc3,rad=0" if curved is None else f"arc3,rad={curved}"
    ax.annotate(
        "",
        xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(
            arrowstyle=f"->,head_width={head},head_length={head*0.7}",
            color=color, lw=lw, linestyle=ls,
            connectionstyle=style,
        ),
        zorder=4,
    )
    if label:
        mx, my = (x1 + x2) / 2 + label_offset[0], (y1 + y2) / 2 + label_offset[1]
        ax.text(mx, my, label,
                ha="center", va="center", fontsize=6.8,
                color=color, fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.18", fc="white", ec=color, lw=0.8, alpha=0.92),
                zorder=5)

# ── Helper: lane background ────────────────────────────────────────────────────
def lane(ax, x, y, w, h, title, tc="#555", fc="#F0F4F8", ec="#CDD3DA"):
    bg = FancyBboxPatch((x, y), w, h,
                        boxstyle="round,pad=0,rounding_size=0.5",
                        linewidth=1.2, edgecolor=ec, facecolor=fc,
                        alpha=0.55, zorder=1)
    ax.add_patch(bg)
    ax.text(x + 0.25, y + h - 0.28, title,
            ha="left", va="top", fontsize=8, color=tc,
            fontweight="bold", alpha=0.7, zorder=2)

# ══════════════════════════════════════════════════════════════════════════════
# TITLE
# ══════════════════════════════════════════════════════════════════════════════
ax.text(11, 15.55, "RealEstate AI Platform — System Architecture",
        ha="center", va="center", fontsize=17, fontweight="bold",
        color=C["text_dark"],
        path_effects=[pe.withStroke(linewidth=3, foreground="white")])
ax.text(11, 15.18, "High-level component overview · REST + WebSocket + AI Services",
        ha="center", va="center", fontsize=9, color="#607080")

# ══════════════════════════════════════════════════════════════════════════════
# LANES
# ══════════════════════════════════════════════════════════════════════════════
lane(ax,  0.3, 13.3, 21.4,  1.45, "CLIENT LAYER",    fc="#EBF5FB", ec="#AED6F1", tc="#1A5276")
lane(ax,  0.3, 10.6, 21.4,  2.45, "FRONTEND",        fc="#EBF8EE", ec="#A9DFBF", tc="#1E8449")
lane(ax,  0.3,  7.2, 10.5,  3.10, "BACKEND / API",   fc="#EAF0FB", ec="#A9C4E8", tc="#1A3A6A")
lane(ax, 11.2,  7.2, 10.5,  3.10, "REAL-TIME",       fc="#E8F8F5", ec="#A2D9CE", tc="#0E6655")
lane(ax,  0.3,  3.4, 10.5,  3.55, "DATA LAYER",      fc="#F5EEF8", ec="#D2B4DE", tc="#6C3483")
lane(ax, 11.2,  3.4, 10.5,  3.55, "AI SERVICES",     fc="#FDEDEC", ec="#F1948A", tc="#922B21")
lane(ax,  0.3,  0.4, 21.4,  2.75, "EXTERNAL / CLOUD",fc="#FEF9E7", ec="#F8C471", tc="#7D6608")

# ══════════════════════════════════════════════════════════════════════════════
# COMPONENTS
# ══════════════════════════════════════════════════════════════════════════════

# ── Client Layer ──────────────────────────────────────────────────────────────
box(ax, 3.5,  13.5, 3.6, 1.0,  "Web Browser",    "Chrome / Firefox / Safari",
    fc="#1565C0", alpha=0.85)
box(ax, 14.3, 13.5, 3.6, 1.0,  "Mobile Browser", "iOS / Android PWA",
    fc="#0D47A1", alpha=0.85)

# ── Frontend ──────────────────────────────────────────────────────────────────
box(ax, 7.7, 11.0, 6.6, 1.75, "Next.js 14", "React + Tailwind CSS · SSR / SSG",
    fc=C["frontend"])

# ── Backend ───────────────────────────────────────────────────────────────────
box(ax, 0.7,  8.0, 5.0, 1.65, "Express REST API", "Node.js · REST/JSON",
    fc=C["backend"])
box(ax, 5.9,  8.0, 4.6, 1.65, "JWT + bcrypt", "Authentication & Sessions",
    fc=C["auth"])

# ── WebSocket ─────────────────────────────────────────────────────────────────
box(ax, 11.5, 8.0, 9.8, 1.65, "Socket.io Server", "Real-time Chat & Notifications · WebSocket",
    fc=C["ws"])

# ── Data Layer ────────────────────────────────────────────────────────────────
box(ax, 0.6, 4.1, 9.9, 2.3, "PostgreSQL", "via Prisma ORM · Users · Listings · Chats",
    fc=C["db"])

# ── AI Services ───────────────────────────────────────────────────────────────
ai_boxes = [
    (11.4, 5.9, 4.7, 0.85, "Recommendation Engine",  "Collaborative Filtering"),
    (16.3, 5.9, 5.0, 0.85, "Smart Search",            "Vector Similarity"),
    (11.4, 4.8, 4.7, 0.85, "Price Prediction",        "ML Regression Model"),
    (16.3, 4.8, 5.0, 0.85, "Personalization",         "User Behaviour Engine"),
]
for (bx, by, bw, bh, bl, bsl) in ai_boxes:
    box(ax, bx, by, bw, bh, bl, bsl, fc=C["ai"], fs=8.5, subfs=7)

# ── External / Cloud ──────────────────────────────────────────────────────────
box(ax, 0.7,  0.75, 5.5, 1.75, "Cloudinary",     "Cloud Image Storage & CDN",
    fc=C["cloud"])
box(ax, 7.9,  0.75, 5.5, 1.75, "Google Maps API","Geolocation & Mapping",
    fc=C["ext"])
box(ax, 15.0, 0.75, 5.9, 1.75, "CI/CD & Hosting","Vercel · Railway · GitHub Actions",
    fc="#546E7A")

# ══════════════════════════════════════════════════════════════════════════════
# ARROWS
# ══════════════════════════════════════════════════════════════════════════════

# Browser → Next.js
arrow(ax, 5.3, 13.5, 9.8, 12.75, "HTTPS", color="#1565C0", label_offset=(0, 0.15))
arrow(ax, 16.1, 13.5, 13.0, 12.75, "HTTPS", color="#0D47A1", curved=0.08, label_offset=(1.0, 0.15))

# Next.js → Express API
arrow(ax, 9.0, 11.0, 3.5, 9.65, "REST / JSON", color=C["backend"], curved=-0.2, label_offset=(-0.4, 0.2))

# Next.js → Socket.io
arrow(ax, 13.0, 11.0, 16.5, 9.65, "WebSocket", color=C["ws"], curved=0.2, label_offset=(0.5, 0.25))

# Express → JWT
arrow(ax, 5.7, 8.82, 5.9, 8.82, "validates", color=C["auth"], lw=1.2, label_offset=(0, 0.2))

# Express → PostgreSQL
arrow(ax, 3.2, 8.0, 3.8, 6.4, "Prisma ORM", color=C["db"], curved=-0.15, label_offset=(-0.7, 0.1))

# Express → Cloudinary
arrow(ax, 2.0, 8.0, 2.5, 2.5, "Image Upload", color=C["cloud"], curved=-0.25, label_offset=(-1.2, 0.0))

# Express → AI Services
arrow(ax, 5.7, 8.82, 11.4, 6.4, "Internal API", color=C["ai"], curved=-0.2, label_offset=(0.3, 0.5))

# Next.js → Google Maps
arrow(ax, 10.5, 11.0, 10.6, 2.5, "Maps SDK", color=C["ext"], curved=0.18, label_offset=(0.9, 0.0))

# Auth cross-cutting: dashed lines to show it guards Express
ax.annotate("", xy=(5.9, 9.65), xytext=(5.9, 11.0),
            arrowprops=dict(arrowstyle="->,head_width=0.18,head_length=0.14",
                            color=C["auth"], lw=1.2, linestyle="dashed",
                            connectionstyle="arc3,rad=0"), zorder=4)
ax.text(6.55, 10.35, "Auth Guard", fontsize=6.5, color=C["auth"], fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.18", fc="white", ec=C["auth"], lw=0.8, alpha=0.9), zorder=5)

# PostgreSQL → AI (data feed)
arrow(ax, 10.5, 5.25, 11.4, 5.7, "Training Data", color="#880E4F", lw=1.2,
      label_offset=(0.6, 0.2))

# ══════════════════════════════════════════════════════════════════════════════
# LEGEND
# ══════════════════════════════════════════════════════════════════════════════
legend_x, legend_y = 17.8, 12.2
legend_w, legend_h = 3.8, 2.65
bg_legend = FancyBboxPatch((legend_x, legend_y), legend_w, legend_h,
                            boxstyle="round,pad=0,rounding_size=0.3",
                            linewidth=1, edgecolor="#CDD3DA", facecolor="white",
                            alpha=0.95, zorder=6)
ax.add_patch(bg_legend)
ax.text(legend_x + legend_w/2, legend_y + legend_h - 0.22,
        "Legend", ha="center", va="top", fontsize=8.5,
        fontweight="bold", color=C["text_dark"], zorder=7)

legend_items = [
    (C["frontend"], "Frontend (Next.js)"),
    (C["backend"],  "Backend (Node/Express)"),
    (C["ws"],       "Real-time (Socket.io)"),
    (C["db"],       "Database (PostgreSQL)"),
    (C["ai"],       "AI Services"),
    (C["cloud"],    "Cloud / External"),
    (C["auth"],     "Auth (JWT + bcrypt)"),
]
for i, (color, label) in enumerate(legend_items):
    iy = legend_y + legend_h - 0.55 - i * 0.29
    rect = FancyBboxPatch((legend_x + 0.2, iy - 0.08), 0.35, 0.22,
                          boxstyle="round,pad=0,rounding_size=0.05",
                          fc=color, ec=color, linewidth=0, zorder=7)
    ax.add_patch(rect)
    ax.text(legend_x + 0.68, iy + 0.03, label,
            va="center", fontsize=7.2, color=C["text_dark"], zorder=7)

# ══════════════════════════════════════════════════════════════════════════════
# FOOTER
# ══════════════════════════════════════════════════════════════════════════════
ax.text(11, 0.12, "© 2026 RealEstate AI Platform · Architecture Diagram v1.0",
        ha="center", va="bottom", fontsize=7.5, color="#999", style="italic")

# ══════════════════════════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════════════════════════
out_png = "/Users/macbook/Projects/realestate-ai-platform/docs/system-architecture.png"
out_pdf = "/Users/macbook/Projects/realestate-ai-platform/docs/system-architecture.pdf"

plt.tight_layout(pad=0)
fig.savefig(out_png, dpi=300, bbox_inches="tight", facecolor="white")
print(f"PNG saved → {out_png}")

try:
    fig.savefig(out_pdf, bbox_inches="tight", facecolor="white")
    print(f"PDF saved → {out_pdf}")
except Exception as e:
    print(f"PDF skipped: {e}")

plt.close(fig)
print("Done.")
