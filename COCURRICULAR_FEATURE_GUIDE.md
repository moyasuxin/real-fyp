# Co-curricular Activities Feature - AI-Analyzed System 🤖

## ✅ What's Been Implemented

### 1. Database Schema (AI-Enhanced)

**File**: `supabase_cocurricular_schema.sql`

**Fields**:

- `organization_name` - Name of club/organization
- `organization_type` - Type (Computing Club, School Club, NGO, etc.)
- `position` - Role held (President, Member, Volunteer, etc.)
- `responsibilities` - Detailed description of duties and achievements
- `activity_period` - Duration (e.g., "Jan 2023 - Dec 2023")
- `ai_impact_score` (0-100) - AI-analyzed overall impact
- `ai_leadership_score` (0-100) - AI-analyzed leadership level
- `ai_relevance_score` (0-100) - AI-analyzed computing relevance
- `ai_summary` - AI-generated natural language summary

### 2. AI Analysis API

**File**: `src/app/api/analyze-cocurricular/route.ts`

**Powered by**: Gemini 2.0 Flash

**Analyzes**:

- **Impact**: Scope, achievements, people impacted, scale
- **Leadership**: Position, initiative, team management, mentoring
- **Relevance**: Technical skills, computing activities, IT projects

### 3. Updated Components

- `CocurricularSection.tsx` - Shows AI scores, allows add/delete
- `StudentCreate.tsx` - AI analysis during creation
- `StudentEdit.tsx` - Real-time AI analysis on edit
- `cocurricular.ts` - Updated types for AI scores

### 4. ML Integration

**File**: `ml/predict_student.py`

**Formula**:

```
Co-curricular Score =
  (Avg_Impact × 30%) +
  (Avg_Leadership × 25%) +
  (Avg_Relevance × 20%) +
  (Activity_Count × 10 × 10%) +
  ((Soft_Skills × 8 + MPU_GPA × 15) × 15%)
```

## 📋 Setup Instructions

### Step 1: Create Database Table

```sql
-- Open Supabase Dashboard → SQL Editor
-- Run the content from supabase_cocurricular_schema.sql
```

### Step 2: Retrain ML Model

```powershell
cd ml
.venv\Scripts\activate
python train_and_upload.py
```

### Step 3: Test the System

1. Go to Student Manager → Create/Edit Student
2. Add co-curricular activity with:
   - Organization name
   - Type
   - Position
   - Period
   - **Detailed responsibilities** (be specific!)
3. Click "🚀 Add & Analyze Activity"
4. View AI-generated scores

## 🎯 How AI Scoring Works

### Impact Score (0-100)

**What It Measures**: Overall significance and achievements

**Scoring Guide**:

- **20-40**: Basic participation (attended events, regular member)
- **40-60**: Active contribution (organized small events, helped projects)
- **60-80**: Major projects/events (led initiatives, significant impact)
- **80-100**: Award-winning, exceptional achievements

**Example - Low Impact (25)**:

```
"Attended weekly club meetings"
```

**Example - High Impact (90)**:

```
"Organized 8 technical workshops with 300+ participants.
Secured RM5000 in sponsorships. Grew club from 10 to 50 members.
Won 2nd place at TechHack 2024."
```

### Leadership Score (0-100)

**What It Measures**: Leadership and initiative

**Scoring Guide**:

- **10-30**: Regular member, participant
- **30-50**: Committee member, coordinator
- **50-70**: Team leader, department head
- **70-100**: President, founder, executive

**Example - Low Leadership (20)**:

```
Position: Member
"Participated in club activities"
```

**Example - High Leadership (95)**:

```
Position: President & Founder
"Founded the society, led 10 committee members.
Mentored 15 junior students. Made key strategic decisions.
Managed RM5000 budget."
```

### Relevance Score (0-100)

**What It Measures**: Computing/IT field relevance

**Scoring Guide**:

- **10-30**: Non-technical (sports, general volunteering)
- **30-60**: Partially technical (IT support, tech events)
- **60-90**: Technical activities (programming, web dev, apps)
- **90-100**: Advanced computing (hackathons, research, publications)

**Example - Low Relevance (25)**:

```
Organization: Basketball Team
"Played in inter-school tournaments"
```

**Example - High Relevance (95)**:

```
Organization: Computing Club
"Developed club website using React and Next.js.
Conducted Python and AI workshops. Built 3 web applications.
Won hackathon with machine learning project."
```

## 💡 Tips for Maximum Scores

### Use Numbers & Metrics

❌ "Organized some workshops"
✅ "Organized 8 workshops with 300+ participants"

### Mention Achievements

❌ "Participated in competition"
✅ "Won 1st place in inter-university hackathon"

### List Technologies

❌ "Built a website"
✅ "Built website using React, Next.js, TypeScript, and deployed on Vercel"

### Show Impact

❌ "Was a member"
✅ "Grew membership from 10 to 50 students in 1 year"

### Demonstrate Leadership

❌ "Helped with events"
✅ "Led team of 10, managed RM5000 budget, mentored 5 juniors"

## 📊 Expected Score Ranges

| Level           | Activities              | Avg Impact | Avg Leadership | Avg Relevance | Final Score |
| --------------- | ----------------------- | ---------- | -------------- | ------------- | ----------- |
| **Basic**       | 2-3, member roles       | 35         | 25             | 30            | 35-50       |
| **Active**      | 4-6, some leadership    | 60         | 50             | 55            | 55-70       |
| **Strong**      | 7+, multiple leadership | 80         | 75             | 85            | 75-90       |
| **Exceptional** | 10+, founder/awards     | 95         | 95             | 95            | 85-100      |

## 🔄 Workflow

### During Student Creation:

1. Fill student details
2. Add courses
3. Add co-curricular activities
4. AI analyzes each activity (2-3 seconds)
5. System saves with AI scores
6. ML calculates final co-curricular score

### During Student Editing:

1. View existing activities with AI scores
2. Add new activity → AI analyzes → ML retrains
3. Delete activity → ML retrains
4. Scores update in real-time

## 🎓 Academic Basis

- **Malaysian Qualifications Agency (2017)**: Holistic development framework
- **Kuh, G. D. (2008)**: Student engagement research
- **AI-driven evaluation**: Objective, consistent, scalable analysis of unstructured data

## ⚠️ Important Notes

1. **Be Specific**: More details = higher scores
2. **Include Context**: Numbers, technologies, outcomes
3. **Real-time**: Analysis happens on each add (2-3 seconds)
4. **Retrain ML**: Required after schema changes
5. **Gemini API**: Requires valid API key in .env

## 🐛 Troubleshooting

**Q**: AI scores seem low?
**A**: Add more details - numbers, achievements, specific technologies

**Q**: "AI analysis failed"?
**A**: Check Gemini API key, internet connection, API quota

**Q**: Co-curricular score not updating?
**A**: Retrain ML model: `cd ml && python train_and_upload.py`

**Q**: Activities not saving?
**A**: Verify database table exists, check Supabase connection

## 🚀 Complete Example

**Poor Description** (Expected: 30-40 total):

```
Organization: Programming Club
Position: Member
Period: 2023
Responsibilities: Attended meetings and helped with events
```

**Excellent Description** (Expected: 85-95 total):

```
Organization: Computing Society
Position: President & Founder
Period: January 2023 - December 2024
Responsibilities:

Founded the Computing Society in January 2023 starting with 5 members,
successfully grew to 50+ active members within one year through strategic
recruitment and engaging events.

Leadership & Management:
- Led a 10-person executive committee
- Mentored 15 junior students in web development
- Managed annual budget of RM5,000
- Made strategic decisions on event planning and partnerships

Technical Contributions:
- Developed society website using Next.js, TypeScript, and Tailwind CSS
- Deployed on Vercel with custom domain
- Implemented member management system with Supabase
- Maintained 99% uptime and 500+ monthly visitors

Events & Workshops:
- Organized 8 technical workshops (Python, React, AI, Cybersecurity)
- Total attendance: 300+ participants
- 95% positive feedback rating
- Secured 3 industry speakers from Microsoft, Google, and local startups

Achievements:
- Secured RM5,000 in sponsorships from tech companies
- Won 2nd place at Inter-University TechHack 2024
- Published 5 technical articles on society blog (1000+ total views)
- Represented university at 3 external hackathons

Impact:
- Increased CS student engagement by 40%
- Helped 12 members secure internships through networking events
- Established partnerships with 5 tech companies for future collaborations
```

**Expected AI Scores**:

- Impact: 92 (massive scale, quantified results, lasting impact)
- Leadership: 95 (founder, team management, strategic decisions, mentoring)
- Relevance: 96 (heavy technical work, computing focus, real projects)

**Final Co-curricular Score**: ~88/100 🎉

## 🎯 Key Takeaways

1. **Detail Matters**: Specific numbers and achievements boost scores
2. **Show Leadership**: Even small leadership roles count
3. **Technical Focus**: Computing-related activities score higher for relevance
4. **Impact & Scale**: Show how many people/students you affected
5. **AI is Smart**: It understands context, achievements, and technical terms
