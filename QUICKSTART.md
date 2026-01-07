# Quick Start Guide - DGT Exam Platform

## 🚀 Getting Started in 30 Seconds

### Option 1: Quick Start with Python (Recommended)

#### macOS/Linux:
```bash
cd /Users/haroonahmad/Desktop/web/exams-dgt
python3 server.py
```

#### Windows:
```bash
cd C:\Users\[YourUsername]\Desktop\web\exams-dgt
python server.py
```

Then open your browser and go to: **http://localhost:8000**

---

### Option 2: Use Node.js (if installed)

```bash
cd /Users/haroonahmad/Desktop/web/exams-dgt
npx http-server
```

Then open: **http://localhost:8080**

---

### Option 3: Manual File Opening

1. Navigate to `/Users/haroonahmad/Desktop/web/exams-dgt/`
2. Right-click on `index.html`
3. Select "Open with" → your web browser
4. Click on a language to start

⚠️ **Note**: Some features may not work when opening directly from the file system. Use Option 1 or 2 for best results.

---

## 📋 What You'll See

### Home Screen
- Select your language (English, Español, or Русский)
- View your exam statistics
- Click "Start Practice Exam"

### Exam Screen
- Read each question carefully
- Look at the image if available
- Select one of three answer options
- Click "Next" to continue
- Your progress bar shows your position

### Results Screen
- See your score and pass/fail status
- View detailed statistics
- Click "Review Answers" to see explanations

### Review Screen
- See each question with your answer
- View the correct answer
- Read detailed explanations
- See related images

---

## 🎯 Exam Rules

✅ **You PASS if:** You have **3 or fewer incorrect answers**

❌ **You FAIL if:** You have **4 or more incorrect answers**

---

## 📊 Features

- ✅ 30 random questions each exam
- ✅ 2,000+ questions available
- ✅ Trilingual support (English, Spanish, Russian)
- ✅ Image support for visual questions
- ✅ Detailed explanations and rules
- ✅ Exam history tracking
- ✅ Statistics dashboard
- ✅ Full responsive design

---

## 🔧 Troubleshooting

### Server won't start
- Make sure Python 3 is installed: `python3 --version`
- Try: `python server.py` instead of `python3 server.py`

### Can't see images
- Verify `images/` folder exists in the same directory
- Check that images are named `1.jpg`, `2.jpg`, etc.

### JSON not loading
- Make sure `pdd-v2.json` is in the same directory as `index.html`
- Open browser console (F12) to see errors

### Questions not appearing
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page (Ctrl+R)
- Try a different browser

---

## 📁 File Structure

```
exams-dgt/
├── index.html          ← Open this in browser
├── styles.css          ← Styling
├── script.js           ← Main logic
├── server.py           ← Run this to serve
├── pdd-v2.json         ← Question database
├── images/             ← Question images
├── README.md           ← Full documentation
└── QUICKSTART.md       ← This file
```

---

## 🌐 How to Access from Other Devices

Once the server is running:

1. Find your computer's IP address:
   - **macOS/Linux**: `ipconfig getifaddr en0` or `ifconfig`
   - **Windows**: `ipconfig` (look for "IPv4 Address")

2. On another device (phone, tablet, another computer), go to:
   ```
   http://[YOUR_IP]:8000
   ```
   Example: `http://192.168.1.100:8000`

---

## 🎓 Study Tips

1. **Read Carefully** - Take your time with each question
2. **Review Images** - Pay attention to road signs and scenarios
3. **Learn from Mistakes** - Use the review section
4. **Practice Multiple Times** - Different questions each time
5. **Focus on Weak Areas** - Review explanations

---

## ⌨️ Keyboard Shortcuts

- **Enter/Space**: Select answer (when focused on option)
- **Arrow Keys**: Navigate through questions (when implemented)

---

## 📝 Taking Notes

Use the browser's developer tools to take notes:
- Press F12 to open Developer Tools
- You can bookmark important questions or take screenshots

---

## 💾 Your Data

- Exam history is stored locally in your browser
- No data is sent to any server
- Clearing browser data will remove your history
- Export feature coming soon!

---

## 🆘 Need Help?

1. Check the full README.md for detailed information
2. Open browser console (F12 → Console) to see error messages
3. Make sure all files are in the same folder as index.html
4. Try using a different web browser

---

**Ready to start? Run `python3 server.py` and open http://localhost:8000! 🚗📖**
