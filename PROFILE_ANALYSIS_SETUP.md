# Profile Analysis Feature Setup Guide

## ✅ What's Been Added

### 1. **API Endpoint: `/api/analyze-profile`**

- Analyzes GitHub, LinkedIn, and Portfolio URLs
- Extracts computing-related projects, skills, and activities
- Uses AI (Gemini) to generate summary and relevance score

### 2. **Updated Student Form**

- Added "🔍 Analyze Profiles" button
- Shows analysis results with:
  - Computing relevance score (0-100)
  - GitHub: Languages, repositories, projects
  - Portfolio: Skills, projects detected
  - LinkedIn: Basic validation
- Visual loading state with spinner

---

## 🚀 How to Use

### For Students/Admins:

1. Fill in the student form (at least name, program, etc.)
2. Add one or more URLs:
   - **GitHub URL**: `https://github.com/username`
   - **Portfolio URL**: `https://yourportfolio.com`
   - **LinkedIn URL**: `https://linkedin.com/in/username`
3. Click **"🔍 Analyze Profiles"** button
4. Wait for analysis (5-15 seconds)
5. View results showing:
   - AI-generated summary
   - Computing relevance score
   - Detected projects and skills
6. Submit the form normally

---

## 🔧 Technical Details

### GitHub Analysis

- Uses **GitHub REST API** (public access)
- Fetches user's repositories
- Filters for computing-related projects using keywords
- Extracts: languages, project descriptions, topics

**Keywords detected:**

- Programming languages: JavaScript, Python, Java, C++, etc.
- Frameworks: React, Node.js, Vue, Angular, etc.
- Domains: ML, AI, Web Dev, Mobile, Game Dev, etc.

### Portfolio Analysis

- Performs basic web scraping
- Extracts text content from HTML
- Detects technical skills using keyword matching
- Identifies project mentions

**Keywords detected:**

- 40+ tech keywords (JavaScript, Python, React, AWS, Docker, etc.)
- Project patterns: "built", "created", "developed"

### LinkedIn Analysis

- Basic URL validation (LinkedIn blocks scraping)
- Placeholder for future OAuth integration
- Could be enhanced with LinkedIn API access

### AI Summary (Gemini)

- Analyzes all collected data
- Generates human-readable summary
- Calculates computing relevance score (0-100)
- Identifies key strengths

---

## 🔑 Optional: GitHub API Token (Recommended)

To avoid GitHub API rate limits (60 requests/hour without token, 5000 with token):

1. Create a GitHub Personal Access Token:

   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: **public_repo** (read public repositories)
   - Generate and copy the token

2. Add to your `.env.local` file:

```env
GITHUB_TOKEN=ghp_your_token_here
GEMINI_API_KEY=your_existing_key
```

3. Restart your Next.js server

---

## 📊 What Gets Analyzed

### ✅ GitHub

- ✅ Public repositories
- ✅ Programming languages used
- ✅ Project descriptions
- ✅ Repository topics/tags
- ✅ Filters for computing-related content

### ✅ Portfolio

- ✅ Text content extraction
- ✅ Technical skills detection
- ✅ Project mentions
- ✅ Technology stack identification

### ⚠️ LinkedIn

- ⚠️ Limited (LinkedIn blocks scraping)
- ✅ URL validation only
- 💡 Future: Could integrate LinkedIn OAuth API

---

## 🎨 UI Features

### Analysis Results Card

- **Gradient background** (blue to purple)
- **Computing Relevance Score** (0-100)
- **AI Summary** (2-3 sentences)
- **GitHub Section**: Languages, projects with descriptions
- **Portfolio Section**: Skills, project count
- **Close button** to hide results

### Loading State

- **Spinning loader** while analyzing
- **Button disabled** during analysis
- **Button disabled** if no URLs provided

---

## 🧪 Testing the Feature

### Test Case 1: GitHub User

```
GitHub URL: https://github.com/torvalds
Expected: Shows Linux projects, C language, high relevance score
```

### Test Case 2: Portfolio Site

```
Portfolio URL: https://your-portfolio.com
Expected: Detects tech stack, lists projects
```

### Test Case 3: All URLs

```
GitHub: https://github.com/username
Portfolio: https://portfolio.com
LinkedIn: https://linkedin.com/in/username
Expected: Combined analysis with all sources
```

---

## 🐛 Troubleshooting

### "Failed to analyze profiles"

- **Check internet connection**
- **Verify URLs are publicly accessible**
- **Check if GitHub API rate limit exceeded** (add token)

### GitHub rate limit error

- Add `GITHUB_TOKEN` to `.env.local`
- Wait 1 hour for rate limit reset
- Or use different GitHub account

### Portfolio analysis returns no data

- **Ensure portfolio site is accessible**
- **Check if site blocks User-Agent headers**
- **Verify site has text content (not just images)**

### AI summary not generating

- **Check GEMINI_API_KEY is set**
- **Verify Gemini API quota**
- **Check API logs for errors**

---

## 🔮 Future Enhancements

1. **LinkedIn OAuth Integration**

   - Proper LinkedIn API access
   - Extract experience, skills, endorsements

2. **Enhanced Portfolio Analysis**

   - Use headless browser (Puppeteer) for JavaScript-heavy sites
   - Screenshot analysis with AI vision

3. **Automatic Score Boost**

   - Automatically increase Professional Engagement score
   - Add bonus points to relevant attributes

4. **Project Categorization**

   - Classify projects by domain (Web, Mobile, ML, etc.)
   - Map to the 6 score attributes

5. **GitHub Contribution Graph**
   - Analyze commit frequency
   - Detect active vs inactive accounts

---

## 📝 Notes

- Analysis happens **on-demand** (not automatic)
- Results are **not saved** to database (for privacy)
- Lecturer/admin can see results before submitting
- GitHub API works best with **public repositories**
- Portfolio analysis works best with **static HTML sites**

---

## 🎯 Next Steps

1. ✅ Test the feature with real GitHub/Portfolio URLs
2. ✅ Consider adding GITHUB_TOKEN for production
3. ✅ Possibly integrate analysis results into ML scoring
4. ✅ Add similar feature to "Edit Student" page
5. ✅ Consider storing analysis results in database for reference

---

**Created**: November 17, 2025  
**Version**: 1.0
