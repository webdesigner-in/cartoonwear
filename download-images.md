# 📸 Download Beautiful Crochet Images

## Quick Setup - Copy these images to your project:

### Step 1: Create the images directory
```bash
mkdir public/crochet-images
```

### Step 2: Download these beautiful crochet images

**Right-click → Save As** on each link below:

1. **Main Hero Image** → Save as `public/crochet-images/hero-main.jpg`
   - [Beautiful Crochet Blanket](https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&auto=format&q=80)

2. **Home Decor** → Save as `public/crochet-images/home-decor.jpg`
   - [Crochet Home Decor](https://images.unsplash.com/photo-1594736797933-d0900de11d8d?w=400&h=300&fit=crop&crop=center&auto=format&q=80)

3. **Baby Items** → Save as `public/crochet-images/baby-items.jpg`
   - [Baby Crochet Collection](https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&crop=center&auto=format&q=80)

### Step 3: Alternative Method - PowerShell Download Script

Run this in PowerShell from your project root:

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path "public/crochet-images"

# Download images
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center&auto=format&q=80" -OutFile "public/crochet-images/hero-main.jpg"

Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1594736797933-d0900de11d8d?w=400&h=300&fit=crop&crop=center&auto=format&q=80" -OutFile "public/crochet-images/home-decor.jpg"

Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop&crop=center&auto=format&q=80" -OutFile "public/crochet-images/baby-items.jpg"

Write-Host "✅ Images downloaded successfully!" -ForegroundColor Green
```

### Step 4: Verify Images
Your file structure should look like:
```
public/
└── crochet-images/
    ├── hero-main.jpg
    ├── home-decor.jpg
    └── baby-items.jpg
```

## 🎨 What You'll Get:

✅ **Beautiful Placeholders**: Even if images fail to load, you'll see elegant golden-themed placeholders
✅ **Professional Images**: High-quality crochet photos when loaded
✅ **Smooth Loading**: Fade-in effects and loading states
✅ **Hover Effects**: Interactive image overlays
✅ **Mobile Responsive**: Perfect on all devices

## 🚀 After Setup:

Your hero section will show:
- **Main Image**: Beautiful featured crochet blanket with "New Arrival" badge
- **Home Decor**: Cozy crochet home items
- **Baby Items**: Adorable baby crochet collection
- **Elegant Fallbacks**: If images don't load, beautiful themed placeholders appear

The placeholders match your golden/orange theme perfectly and include decorative patterns, icons, and animations!