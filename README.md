# 🐾 HuskyKennel

**HuskyKennel** is a housing matchmaker built for UW students, interns, and young professionals living around Seattle’s U District. Instead of endlessly scrolling through Facebook groups or Craigslist, just answer a few questions — and we’ll show you apartments and subleases that actually match your life.

---

## 🛠️ What it does

- Asks about your preferences: room type, budget, gender, smoking/pet status, furniture, flooring, location, lifestyle, etc.
- Searches listings from:
  - Reddit (e.g. r/udistrict, r/uw)
  - Facebook housing groups
  - Local apartments like Trailside, Strata, Tripalink, Muriel’s Landing, Here, Bridge11, and more
- Scores and ranks listings based on compatibility
- Generates short, human-style descriptions like:  
  _“Great for a quiet student who likes hardwood floors and natural light.”_
- Lets you filter by distance to campus, rent, pets allowed, and more

---

## 🎯 Who it’s for

- UW students looking for housing near campus  
- Interns and visiting researchers staying in Seattle  
- Subleasers and roommates who want to match with the right person faster  

---

## 🧰 Tech Stack

- **Frontend**: TypeScript + TailwindCSS  
- **Backend**: tRPC API routes  
- **Database**: Supabase (PostgreSQL)  
- **Auth**: Supabase Auth (email-based, UW NetID planned)  
- **Matching**: Questionnaire + scoring logic with descriptive output  
- **Scraping**: Reddit, Facebook, Craigslist (in progress)  

---

## 🚀 How to run it locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/Jason-lab1126/HuskyKennel.git
   cd HuskyKennel
   
2. Install dependencies
npm install

3. Create a .env file
cp .env.example .env

4. Fill in your environment variables
ini
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-key (optional for summaries)

5. Start the development server
npm run dev
App should now be running at:
http://localhost:3000](https://wondrous-tulumba-551596.netlify.app

🧪 What’s coming next
 Auto-sync housing posts from Facebook, Reddit, Craigslist

 Swipe UI for mobile-friendly browsing

 UW NetID login via OAuth

 Admin dashboard to edit/remove listings

 Map view with distance filters

 Sublet submission flow for individuals

🐶 Why it's called HuskyKennel
Because every Husky deserves a good home 🛋️
And yeah, it's a pun — that’s kind of the vibe.

👨‍💻 Author
Created by **Zhijian Xu** - A passionate developer building tools to help UW students find their perfect home.

📄 License
MIT License
Copyright © 2025 Zhijian Xu
