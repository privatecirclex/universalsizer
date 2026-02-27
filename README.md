# 💍 Universal Screen Measurer: The Ultimate Online Sizing Toolkit
### 1:1 Accurate Digital Tools for Rings, Jewelry, and Hardware

**Live Application:** [https://universalsizer.vercel.app/](https://universalsizer.vercel.app/)

---

## 🎯 The Problem This Project Solves
Most digital rulers and online sizers are inaccurate because they cannot detect your screen's physical dimensions. A "pixel" is not a standard unit of measurement. This project solves that by calculating your device's unique **Pixels-Per-Millimeter (PPM)** through user-driven calibration.

## 🛠️ The Measurement Suite

### 1. Online Ring Sizer (Live)
Our flagship tool for jewelry buyers. 
* **Calibration:** Supports credit cards, IDs, and global currency (coins).
* **Conversion:** Instantly converts measurements to **US, UK, EU, and Indian** ring size standards.
* **Accuracy:** Millimeter-perfect precision for inner diameter and circumference.

### 2. Bangle & Bracelet Sizer (Coming Soon)
A dedicated tool for rigid jewelry that requires measuring the widest part of the hand.

### 3. Watch Lug & Strap Measurer (Coming Soon)
Determine the exact width (18mm, 20mm, 22mm) for replacement watch bands without a physical ruler.

### 4. Hardware & Screw Gauge (Coming Soon)
Engineering-grade digital calipers for identifying M2, M3, and M4 screw threads and small electronic parts.

---

## 🔬 Technical Implementation

### Accuracy & Precision
* **Zero-Zoom Architecture:** Implements a multi-layered "Zoom Lock" using CSS `touch-action: manipulation` and JavaScript event interceptors to prevent scale distortion on iOS and Android.
* **Client-Side Math:** All calculations are performed in the browser. No data is sent to a server, ensuring 100% user privacy.

### SEO & Web Standards
* **JSON-LD Schema:** Optimized with `WebApplication` and `FAQPage` structured data to earn Google Rich Snippets.
* **Mobile-First Design:** Optimized for high-density Retina displays and mobile browsers.

## 📖 How to Calibrate
1. **Prepare:** Hold a standard credit card (85.60mm) against your screen.
2. **Align:** Use the on-screen slider to match the digital guide to the card's edges.
3. **Save:** Once saved, the tool is locked to your screen's specific DPI for that session.

## 🤝 Contributing & Feedback
This is an open-source utility designed to reduce the environmental and financial cost of e-commerce returns due to sizing errors. 

**Developed by:** [Your Name/GitHub Profile]
**Platform:** Hosted on Vercel
