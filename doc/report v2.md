CHAPTER 1: INTRODUCTION
1.1 Introduction
In today’s rapidly evolving digital and industrial landscape, higher education institutions are expected to produce graduates who possess not only academic knowledge but also strong practical skills, interpersonal abilities, and professional readiness. However, many Malaysian universities continue to rely primarily on CGPA as the dominant indicator of student performance. Recent research demonstrates that CGPA alone does not sufficiently predict graduate employability, job performance, or workplace adaptability (Osman et al., 2025; Yan and Nurfaradilla Mohamad Nasri, 2025). Employers are increasingly valuing soft skills, communication, leadership, digital competencies, and evidence of real-world projects often demonstrated through online platforms such as GitHub, LinkedIn, and personal portfolios.
The Malaysian Qualifications Framework (MQF 2.0) further emphasizes 11 learning outcome domains, including communication, leadership, digital literacy, problem-solving, and professionalism (Malaysian Qualifications Agency, 2024). These outcomes extend far beyond academic grades and highlight the need for institutions to evaluate students in a more holistic manner. Yet, existing university systems often do not integrate co-curricular involvement, lecturer feedback, online professional engagement, or behavioral indicators into assessment processes.
To address this gap, the Student Performance Analysis and Career Prediction System aims to integrate multiple data sources like academic performance, co-curricular activities, lecturer feedback, and digital footprints to generate a multi-dimensional competency profile for students. Through machine learning (Random Forest regression) and AI-driven text analysis, the system produces six competency scores that reflect academic strength, technical proficiency, soft skills, and professional readiness. These outputs support lecturers, academic staff, and students in identifying strengths, weaknesses, and suitable career pathways.
Table 1: Comparison of Traditional vs Proposed Assessment Methods
Metric Traditional System Proposed System
CGPA only true true
Co-curricular analysis false true (AI scoring)
Lecturer feedback false true (sentiment analysis)
Professional engagement false true (GitHub / LinkedIn analysis)
Predictive analytics false true (ML prediction)

1.2 Problem Statement
Despite increasing expectations placed on graduates in the digital era, many Malaysian higher learning institutions still rely heavily on CGPA and structured academic scores as the primary indicator of student capability. However, recent studies consistently show that academic scores alone fail to capture essential career-related attributes such as teamwork, communication, creativity, adaptability, leadership, and digital professionalism skills that employers now consider fundamental for employability (Osman et al., 2025; Yan & Nasri, 2025; Tino & Fedeli, 2024). As a result, traditional evaluation frameworks often present an incomplete picture of a student’s overall readiness for modern computing careers.
At the same time, higher education institutions accumulate large volumes of unstructured data such as lecturer feedback, online portfolio descriptions, GitHub project documentation, and public LinkedIn information. These sources contain rich behavioural, professional, and contextual signals that reflect a student’s initiative, engagement, self-learning behaviour, and technical depth. Research in multimodal machine learning demonstrates that combining structured and unstructured inputs significantly improves predictive accuracy and interpretability in complex tasks such as academic performance modeling, behavioural analytics, and skill assessment (Zhang et al., 2020; Ebrahimi & Dong, 2024; Chango, Cerezo & Romero, 2024).
Within the education domain, systematic reviews show that Random Forest, SVM, and neural networks are widely used for student performance prediction and career recommendation, yet the majority of these models depend only on academic variables (Trujillo, Pozo & Suntaxi, 2025). Recent experimental results further confirm that models combining academic scores with unstructured sources such as resumes, behavioral text, or project descriptions achieve significantly higher accuracy often exceeding 90% when predicting job suitability and employability traits (Ramesh et al., 2025). However, multimodal approaches remain underexplored within Malaysian computing programs, where evaluation still centers around CGPA and static academic transcripts.
Therefore, a significant gap exists in current student evaluation systems: the lack of a multimodal, AI-supported career prediction model that integrates structured academic performance with unstructured behavioural and professional data. This project addresses that gap by developing an AI-driven system that analyzes academic results, co-curricular activities, lecturer feedback, and public professional profiles (GitHub, LinkedIn, and portfolio sites) to generate holistic predictions of suitable career pathways. The system aligns with the Malaysian Qualifications Framework (MQF 2.0), which emphasizes the development of diverse learning outcome domains beyond academic achievement (Malaysian Qualifications Agency, 2024).
1.3 Objectives
• To develop a career prediction system using both structured and unstructured data
This objective is to develop a career prediction system that integrates both structured and unstructured student data to generate personalized and explainable recommendations for undergraduate students in computing-related disciplines. The system combines structured inputs such as CGPA, subject-specific grades, and co-curricular involvement with unstructured information including lecturer feedback, public professional profiles, and online competition or portfolio records. By processing these mixed data sources through machine learning and natural language analysis, the system aims to produce meaningful insights into student strengths and career suitability.
• To evaluate the performance of the proposed multimodal system in comparison with traditional CGPA-only models.
This objective examines how the proposed system performs relative to models that rely solely on CGPA and other structured academic metrics. The evaluation includes comparing prediction accuracy, relevance, and diagnostic capability in identifying competencies such as programming proficiency, design aptitude, teamwork, and leadership potential. By incorporating unstructured behavioural data (e.g., lecturer feedback, co-curricular descriptions) and external professional indicators (e.g., GitHub activity), the study will assess the extent to which multimodal integration improves predictive insight over conventional academic-only approaches.
1.4 Scope
This project focuses on developing a web-based student performance analysis and career prediction system designed specifically for undergraduate students enrolled in computing-related programmes. The system integrates structured academic data such as cumulative grade point average (CGPA), individual course grades, and domain-based subject clusters with unstructured information including lecturer feedback, co-curricular activity descriptions, and publicly accessible digital profiles. In its current form, the system supports web scraping for portfolio websites and GitHub repositories, while LinkedIn data is limited to publicly viewable information due to existing anti-scraping protections. The scope remains strictly aligned with computing careers, including roles such as software development, UI/UX design, cybersecurity, IT support, and data analytics, ensuring that recommendations stay relevant to the target cohort.
Structured data is used to evaluate technical competencies, with programming courses indicating logical and problem-solving abilities, design modules reflecting conceptual and creative skills, and infrastructure subjects representing system administration and networking proficiency. Unstructured data supplements these insights by capturing behavioural and professional attributes that are not visible through grades alone. Co-curricular involvement may reveal teamwork, leadership, or initiative, while lecturer feedback provides qualitative evidence of communication ability, consistency, or growth. Public portfolio or competition websites offer additional signals related to real-world exposure, project experience, and self-directed learning. These diverse inputs are processed using natural language processing techniques and large language models to extract relevant indicators for career prediction.
The system evaluates only students who have both structured and unstructured data available, thereby maintaining fairness and reducing prediction bias. Strict ethical boundaries are observed; the system does not access private or sensitive social media information and relies solely on publicly available content. The career recommendations produced are intended as supportive guidance rather than prescriptive decisions, with the final choice remaining in the hands of students and academic advisors. While the current implementation focuses on portfolio, GitHub, and partial LinkedIn data, the system architecture allows for future enhancement, including more advanced and compliant scraping strategies for broader professional and social media platforms.

CHAPTER 2: LITERATURE REVIEW
2.1 Introduction
In recent years, educational research has increasingly turned to multimodal data fusion to improve student outcome prediction. Traditional models for forecasting academic performance tend to rely heavily on structured data, such as CGPA, course grades, and attendance. However, these alone may fail to capture more subtle yet critical dimensions of student behavior and engagement, such as motivation, communication, and experiential learning (Salim and Al-Abdulqader, 2024).
To address this, scholars have begun to integrate unstructured data such as open-text feedback, reflective writing, and digital behavioral traces into predictive frameworks. For example, a study of intelligent tutoring systems demonstrated that combining log data, eye-tracking, and emotional signals significantly improves performance prediction when attribute selection and ensemble classification are used (Chango et al., 2021)
Beyond in-class behavior, digital professional footprints are proving to be strong indicators of students’ future employability. Research has found that active usage of LinkedIn correlates with higher career outcome expectations, suggesting that the quality of a student’s online network and presence can meaningfully inform career prediction (Pena, Curado and Oliveira, 2022).
Meanwhile, in the field of predictive modeling, advanced multimodal fusion techniques such as BERT-based NLP models combined with graph convolutional neural networks (GCN) have recently been proposed for more precise academic performance forecasting. One study reported a prediction accuracy of 92.5% using BERT-GCN fusion on student text feedback and behavioral data. (Wu, 2025)
At the same time, the attention-driven neural network MultIFAR demonstrates how virtual learning environment (VLE) interaction data (such as LMS clicks or behavioral logs) can strongly predict students at risk of poor performance or dropout, outperforming previous models by capturing engagement in real time. (Fazil and Albahlal, 2025)
Aligning with the Malaysian Qualifications Framework (MQF 2.0) which emphasizes cognitive, personal, interpersonal, communication, and digital literacies (Malaysian Qualifications Agency, 2024) a multimodal, career-focused predictive system offers an opportunity to create a holistic profile of each student. Instead of viewing employability as a function of grades alone, combining structured academic metrics with unstructured behavioral and professional signals can yield a far richer representation of student strengths and potential career trajectories.
CHAPTER 3: RESEARCH METHODOLOGY
3.1 Introduction
This chapter defines the experimental methodology used to evaluate the proposed Hybrid Student Performance and Career Prediction System against a structured-only (CGPA-centric) baseline. The focus is on how the study measures predictive improvement, interpretability enhancement, and diagnostic capability—not on software implementation details. The chapter establishes design choices, data generation (where real data are unavailable), evaluation metrics, statistical tests, bias mitigation procedures, and reproducibility controls aligned with the research objectives stated in Chapter 1.

3.2 Research Design
The study adopts a within-subject comparative, quantitative design. Each synthetic (or future real) student instance is evaluated under two modelling conditions:

1. Baseline Model (Structured Only): Academic + derived domain grades and credit-related indicators.
2. Multimodal Model (Structured + Unstructured + External): Baseline features augmented with sentiment, co-curricular rubric scores, and professional digital footprint indicators.
   Primary hypothesis: H1 – Multimodal integration reduces prediction error (MAE, RMSE) and increases explained variance (R²) across competency dimensions compared to the baseline. Secondary hypothesis: H2 – Added features improve detection of "latent strengths" (students with moderate CGPA but high domain-specific competency).

**Figure 3.1: Overall Methodology Workflow**

_[Placeholder for system flowchart]_

**Description:** This figure illustrates the complete experimental workflow from data acquisition to model evaluation. The diagram shows: (1) Data Input stage with three parallel streams (Structured Academic Records, Unstructured Text Sources, External Digital Footprints); (2) Feature Engineering stage where raw inputs are transformed into baseline features (CGPA, domain GPAs, credit load) and multimodal features (sentiment scores, rubric scores, GitHub metrics, LinkedIn indicators); (3) Model Training stage showing the dual-path architecture with baseline model (structured-only) and multimodal model (structured + unstructured + external) both using Random Forest Regressor (n=200 trees) with 5-fold stratified cross-validation; (4) Prediction & Explanation stage where RF outputs six competency scores (Y1-Y6) and Gemini 2.0 generates MQF-aligned narrative explanations; (5) Evaluation stage performing statistical comparison (paired t-test/Wilcoxon, Holm-Bonferroni correction, Cohen's d/r effect sizes, bootstrap 95% CI) and computing primary metrics (MAE, RMSE, R²) and secondary metrics (latent strength detection rate, feature importance stability); (6) Ablation Analysis stage showing four parallel branches removing sentiment, co-curricular, GitHub, and LinkedIn feature groups independently to quantify incremental contributions. Arrows indicate data flow direction; dashed lines represent optional explanatory pathways not fed back into training.

3.3 Data Sources and Synthetic Generation
Because access to full institutional records is restricted by privacy regulation, a synthetic dataset (N = 200) simulating plausible distributions was generated. Feature distributions (CGPA, domain GPA clusters, co-curricular intensity, GitHub activity ranges) were parameterized using published Malaysian higher-education summaries and employability literature where available. To avoid trivial learnability, Gaussian noise and mild non-linear perturbations were injected into generated competency targets.
Categories:
• Structured Academic: Overall CGPA, domain GPA cluster means (Programming, Design/UI, Infrastructure/Systems), credit load.
• Co-Curricular Text: Short activity descriptions (leadership, teamwork, competition participation) -> rubric-derived numeric scores (Impact, Leadership, Relevance).
• Lecturer Feedback Text: Simulated comments with varying polarity, specificity, length -> sentiment score + length factor.
• External Footprint: Simulated GitHub repo count, commit frequency (log-transformed), language diversity index, LinkedIn completeness score, portfolio presence flag.
Ground Truth Competency Targets (0–100) formed from weighted combinations of academic domains + external indicators + rubric scores + injected noise ε ~ N(0, σ²) to prevent perfect deterministic mapping.
Limitations: Synthetic data lack latent institutional nuances; external validity requires future replication on real cohorts.

3.4 Feature Engineering and Baseline Definition
Baseline Feature Set:
• CGPA
• Programming GPA cluster mean
• Design/UI GPA cluster mean
• Infrastructure/System GPA cluster mean
• Credit load (standardized)
Multimodal Additional Features:
• Sentiment polarity score
• Co-curricular Impact, Leadership, Relevance numeric rubric scores
• GitHub repo count (sqrt transformed), commit frequency (log1p), language diversity index
• LinkedIn completeness (0–1 composite), portfolio presence (binary)
Excluded From Predictive Input (Explanatory Only): Full raw text, generated narrative paragraph, uncompressed embeddings (LLM context used post-hoc only).
Scaling: Random Forest is scale-robust; Min-Max scaling retained only for interpretability consistency when exporting intermediate feature tables. This is documented rather than assumed beneficial for model performance.

3.5 Model Specifications
Predictive Engine: Multi-output Random Forest Regressor.
• n_estimators = 200
• max_depth = None (with monitoring of overfitting via out-of-fold performance variance)
• min_samples_split = 2, min_samples_leaf = 1
• random_state fixed for reproducibility
• multi-output predicting six competency axes (Programming, Design, Infrastructure, Co-Curricular, Feedback Sentiment Influence, Professional Engagement)
Explanatory Engine: Gemini 2.0 (temperature = 0; top_p = 1) applied after numeric prediction to produce narrative summaries and highlight top contributing feature groups (mapped to MQF domains). No generative outputs are fed back into training to avoid leakage.

3.6 Experimental Protocol and Ablation Plan
Data Split: 5-fold stratified cross-validation (stratification by synthetic program category or CGPA band). Identical fold partitions used for baseline and multimodal conditions to enable paired statistical comparison.
Runs:

1. Baseline model (structured only)
2. Full multimodal model
3. Ablations:
   a. – Sentiment removed
   b. – Co-curricular rubric removed
   c. – GitHub footprint removed
   d. – LinkedIn/portfolio removed
   Each ablation isolates incremental contribution of a feature group. Performance deltas logged per fold.
   Outputs Logged Per Fold: MAE, RMSE, R² per competency; aggregate macro-average; feature importance vector; prediction residuals.

3.7 Evaluation Metrics
Primary Metrics:
• MAE (per competency + macro-average)
• RMSE (sensitive to larger errors)
• R² (variance explained)
Secondary/Diagnostic:
• Latent Strength Detection Rate: Percentage of students where multimodal model elevates a domain competency ≥10 points vs baseline for students with CGPA in mid-band (e.g., 2.5–3.0).
• Feature Importance Stability: Rank correlation (Spearman) of top-10 features across folds.
• Ablation Impact: ΔMAE and ΔR² relative to full multimodal.

3.8 Statistical Analysis Plan
For each competency axis, paired differences ΔMAE = MAE_baseline – MAE_multimodal collected across all folds × instances.

1. Normality Check: Shapiro–Wilk on ΔMAE and ΔR² distributions (α = 0.05).
2. Significance Tests: If normal → paired t-test; else → Wilcoxon signed-rank.
3. Multiple Comparisons: Holm–Bonferroni correction across six competencies.
4. Effect Sizes: Cohen’s d (paired) if t-test; r = Z / √N for Wilcoxon.
5. Confidence Intervals: 95% bootstrap (1000 resamples) for mean ΔMAE and mean ΔR².
6. Ablation Analysis: One-way repeated-measures approach (non-parametric Friedman test if assumptions unmet) on feature group removal impacts; post-hoc Wilcoxon with Holm adjustment.
   Reporting: Table of baseline vs multimodal per metric, Δ, p-value, effect size, CI, significance flag.

3.9 Error, Bias, and Risk Mitigation
• Synthetic Determinism: Injected noise and non-linear modifiers reduce trivial fit risk.
• MNAR Co-curricular Sparsity: Represent absence explicitly (binary flag) rather than mean imputation.
• Feature Leakage: Generative narrative not passed into predictive features; external indicators appear only once (no target duplication).
• Overfitting: Monitor fold variance; limit tree depth if variance inflation > threshold (e.g., SD of MAE > 1.25× baseline).
• LLM Variability: Deterministic parameters; prompt template versioned.
• Class/Score Imbalance: Report distribution skew; optionally apply balanced sampling if extreme outliers appear in future real data.
• Data Drift (Future Real Deployment): Document baseline distribution; schedule periodic KS-tests.

3.10 Reproducibility and Environment
Artifacts Logged:
• Git commit hash
• Dataset version tag (synthetic seed & generation script checksum)
• Random Forest model hash (SHA256 of serialized joblib)
• Prompt template ID & Gemini model version
• Python package versions (scikit-learn, pandas, joblib, requests, etc.)
Execution Environment: Local CPU environment sufficient (RF + API calls). No GPU dependency.

3.11 Ethical & Governance Reference
Full ethical and privacy considerations detailed in Section 2.6–2.7. This experiment limits itself to synthetic or public data; future real deployment will require formal institutional approval, consent procedures, pseudonymization audit, and role-based access enforcement.

3.12 Limitations and External Validity
• Synthetic data may not capture latent correlation structures present in authentic institutional datasets.
• External footprint simulation cannot perfectly model commit semantics or LinkedIn network quality.
• Absence of longitudinal outcomes (employment results) restricts career pathway validation.
• LLM explanatory layer not benchmarked against human qualitative feedback in this phase.
Future Work: Transition to pilot real cohort, integrate longitudinal tracking (internship placement), compare narrative usefulness via user study.

3.13 Summary and Forward Reference
This methodology establishes a controlled, reproducible comparative framework for evaluating structured-only versus multimodal competency prediction, including ablation, statistical rigor, and bias mitigation. Execution results (performance tables, significance outcomes, effect sizes, and interpretability analysis) will be presented and interpreted in Chapter 5.

4. Over-reliance on uni-modal academic data
   Most predictive systems rely predominantly on grades, attendance, or exam scores. Such models overlook co-curricular engagement, digital behaviour, soft-skill development, and professional presence factors increasingly linked to employability and long-term performance.
5. Minimal integration between institutional and external datasets
   Although studies highlight the predictive value of GitHub activity and LinkedIn engagement, there is limited research on automated pipelines that combine these data with internal academic records. This absence limits the creation of holistic, industry-relevant student profiles.
6. Weak connection between predictive and explanatory components
   Current systems commonly produce either numerical predictions or narrative explanations, but rarely both. Hybrid architectures that integrate machine learning for scoring and Generative AI for explanation remain underdeveloped in the educational domain.
7. Limited alignment with competency frameworks
   Few existing models map their outputs to competency standards such as MQF domains or institutional learning outcomes. As a result, predictive insights may lack pedagogical coherence and relevance for academic advising or curriculum design.

2.7.2 Contribution of the Proposed System
The proposed system responds directly to these gaps by introducing a hybrid, multimodal predictive architecture that synthesizes structured academic records, unstructured textual evidence, and external digital footprint data into a unified analytical pipeline.
The system employs Random Forest Regression to process structured academic and co-curricular features, generating quantitative competency estimates with high robustness and interpretability. Complementing this, Generative AI (Gemini 2.0) is used to interpret unstructured text including lecturer feedback and extracted external-profile summaries producing qualitative narrative explanations. This dual-layer design integrates predictive precision with contextual explanation, addressing both numerical and interpretive dimensions of performance modelling.
Additionally, the system incorporates external indicators from GitHub and LinkedIn, enabling a more comprehensive representation of technical skills, collaborative behaviour, and professional engagement. These multimodal signals are merged with academic metrics to construct a holistic student profile aligned with real-world employability expectations.
Finally, the system visualizes its outputs through MQF-aligned radar charts, ensuring that competency predictions correspond to recognized national learning domains. This alignment enhances pedagogical validity and supports practical use in academic advising, curriculum mapping, and career development.
Table 6: Summary of Research Gaps and Proposed Solutions
Study / Approach Primary Data Source Methodology Limitation (Research Gap) Proposed System Solution
Yağcı (2022) Academic grades only (internal) Random Forest, SVM Excludes soft skills, co-curricular behavior, and professional engagement Integrates academic data with co-curricular records and GitHub/LinkedIn signals
Pena et al. (2022) LinkedIn data only (external) Statistical correlation Not connected with university academic records Merges external professional data with internal CGPA and course performance
Qian et al. (2025) Assignment text GenAI / LLM Generates feedback but does not support employability prediction Applies LLMs to map co-curricular and academic text to MQF domains and career pathways
Traditional LMS Structured logs (LMS clicks) Descriptive analytics Lacks predictive scoring and does not explain performance Hybrid model: Predictive (RF regression) + Explanatory (Gemini 2.0) architecture

CHAPTER 3: RESEARCH METHODOLOGY (APPROPRIATE TITLE RELATED TO RESEARCH)
3.1 Introduction
This chapter presents the methodological framework used to evaluate the Hybrid Student Performance and Career Prediction System. The research focuses on determining whether integrating multimodal evidence structured academic records, unstructured textual descriptions, and external digital footprints produces more accurate and meaningful competency predictions than a traditional CGPA-only model. The methodology outlines the research design, data generation strategy, modelling techniques, evaluation metrics, statistical analysis procedures, and reproducibility controls. The chapter concludes with ethical considerations and limitations relevant to the use of synthetic and institutional data.
3.2 Research Design
The study employs a within-subject quantitative comparative design, in which each student profile is evaluated under two modelling conditions:
Baseline Model - Structured Only
Uses CGPA, domain GPA clusters, and credit-related indicators.
Multimodal Model - Structured + Unstructured + External
Extends the baseline with sentiment scores from lecturer feedback, co-curricular rubric scores, and digital footprint indicators such as GitHub and LinkedIn attributes.
Two hypotheses are tested:
• H1: Multimodal integration reduces prediction error (MAE, RMSE) and increases explained variance (R²) across competency domains.
• H2: Multimodal features improve identification of latent strengths students whose CGPA does not fully reflect domain-specific abilities.
This design supports controlled, paired comparison and isolates the true impact of multimodal signals.
3.3 Data Acquisition and Synthetic Generation
To evaluate the performance of the proposed system, a controlled dataset is required. Due to strict data privacy regulations (PDPA) protecting real student records, this research employs a Synthetic Data Generation strategy grounded in real-world academic rubrics to train and test the machine learning models.
3.3.1 Motivation for Synthetic Data
Due to PDPA restrictions and limited access to real student datasets, a synthetic dataset of N = 200 profiles was generated. This dataset simulates realistic distributions of academic performance, co-curricular involvement, and technical activity, ensuring that the system can be evaluated without compromising privacy.
3.3.2 Dataset Composition
The dataset includes:
• Structured Academic Features:
CGPA, domain-specific GPA clusters (Programming, Design/UI, Infrastructure/Systems), and standardized credit load.
• Co-curricular Textual Descriptions:
Simulated activity statements processed into numeric Impact, Leadership, and Relevance rubric scores.
• Lecturer Feedback:
Short feedback comments of varying tone, converted into sentiment polarity and length metrics using NLP.
• External Footprint Indicators:
GitHub repository count, commit frequency, language diversity index, and a LinkedIn completeness score.
3.3.3 Ground-Truth Competency Targets
To train the supervised learning model, Ground Truth target scores (Y) were calculated using deterministic domain-specific formulas derived from the literature review. These formulas serve as the objective functions for the Random Forest model. The scoring logic for the six target variables is defined as follows (all scores clipped to [0,100]):
Programming Score (Y1):
Y1 = (GPA_prog × 25) + (Count_prog × 2.5) + (Repo_count_sqrt × 3) + ε
• GPA_prog: mean GPA for programming-intensive courses (scaled 0–4 → 0–100 via ×25)
• Count_prog: number of programming courses completed
• Repo_count_sqrt: √(GitHub repo count) to reduce skew
Design Score (Y2):
Y2 = (GPA_design × 25) + (GPA_soft × 15) + (Count_HCI × 5) + ε
• GPA_design: mean GPA for design/UI/HCI courses (0–4 → ×25)
• GPA_soft: mean GPA for soft-skill/communication courses (0–4 → ×15)
• Count_HCI: number of HCI/UI subjects completed
IT Infrastructure Score (Y3):
Y3 = (GPA_infra × 30) + (Credit_infra_ratio × 20) + (Sys_projects_flag × 10) + ε
• GPA_infra: mean GPA for networking/OS/cloud courses (0–4 → ×30)
• Credit_infra_ratio: infra credits / total credits (0–1 → ×20)
• Sys_projects_flag: binary indicator for system/admin project evidence (0 or 10)
Co-curricular Strength (Y4):
Y4 = (Impact × 30) + (Leadership × 30) + (Relevance × 25) + (Participation_count × 2) + ε
• Impact, Leadership, Relevance: rubric-derived (0–100)
• Participation_count: number of activities/events participated
Feedback Sentiment Influence (Y5):
Y5 = (Sentiment_polarity × 40) + (Comment_length_norm × 10) + (Specificity_flag × 10) + ε
• Sentiment_polarity: normalized polarity score (0–100)
• Comment_length_norm: normalized length percentile (0–100 → ×0.1 then ×100 gives ×10)
• Specificity_flag: binary indicator if feedback contains skill-specific mentions (0 or 10)
Professional Engagement (Y6):
Y6 = (Portfolio_flag × 15) + (GitHub_activity × 20) + (LinkedIn_completeness × 15) + (GPA_scaled) + ε
• Portfolio_flag: 1 if public portfolio exists else 0 (×15)
• GitHub_activity: composite index (commits_log1p × 10 + language_diversity × 10)
• LinkedIn_completeness: 0–1 composite ×15
• GPA_scaled: CGPA scaled to 0–100 (CGPA × 25)
Noise Term: A Gaussian noise term ε ~ N(0, 2.5) is added to all calculated targets to simulate natural human variability and prevent the model from overfitting to a perfect linear equation.

**Figure 3.2: Synthetic Data Generation Process**

_[Placeholder for data generation flowchart]_

**Description:** This figure depicts the systematic process for generating the N=200 synthetic student profiles used in the experiment. The flowchart shows: (1) Parameter Initialization block defining distribution ranges for CGPA ~ N(2.8, 0.5), domain GPAs ~ N(2.7, 0.6), credit load ~ Uniform(90, 140), co-curricular intensity ~ Poisson(λ=3), GitHub repo count ~ Poisson(λ=5), commit frequency ~ Exponential(λ=0.2), LinkedIn completeness ~ Beta(α=2, β=5); (2) Academic Feature Generation block computing structured features (overall CGPA, GPA_prog, GPA_design, GPA_infra, credit load, domain course counts) with realistic correlations (ρ_CGPA_domain ≈ 0.7–0.85); (3) Text Simulation Engine block generating co-curricular descriptions (leadership, teamwork, competition participation templates) and lecturer feedback comments (varying polarity, length, specificity) using template libraries with controlled linguistic diversity; (4) NLP Processing Pipeline block converting text to numeric features via sentiment analysis (VADER polarity), rubric scoring (Impact, Leadership, Relevance based on keyword matching and semantic similarity), and comment metrics (length normalization, specificity detection); (5) External Footprint Simulation block creating GitHub metrics (repo_count_sqrt = √repo_count, commits_log1p = log(1+commits), language_diversity_index = unique_languages/total_commits), LinkedIn indicators (completeness = weighted sum of profile sections/total_sections), and portfolio presence flag (Bernoulli p=0.4); (6) Ground-Truth Target Calculation block applying the six formulas (Y1–Y6 as defined in Section 3.3.3) with feature-specific weights and transformations; (7) Noise Injection block adding Gaussian noise ε ~ N(0, 2.5) independently to each target Y1–Y6 and clipping all scores to [0, 100]; (8) Quality Control block performing distribution checks (Shapiro-Wilk for normality, KS-test for uniformity where expected), correlation validation (ensuring CGPA vs targets ρ = 0.5–0.7, avoiding multicollinearity VIF < 5), and completeness verification (no missing values, all text fields non-empty); (9) Dataset Export block saving final dataframe (200 rows × ~35 columns) as CSV with versioned filename (synthetic_student_data_v1_seed42.csv) and logging generation metadata (timestamp, random seed, parameter config JSON, generation script hash SHA256). Decision diamonds indicate validation checkpoints; failed checks trigger regeneration with adjusted parameters.

3.3.4 Limitations
While synthetic datasets enable controlled experimentation, they cannot fully capture the underlying behavioural complexities of real institutional records. Future validation on authentic cohorts is recommended.
3.4 Feature Engineering and Baseline Definition
3.4.1 Baseline (CGPA-Only) Feature Set
• CGPA
• Programming GPA cluster
• Design/UI GPA cluster
• Infrastructure GPA cluster
• Standardized credit load
3.4.2 Multimodal Feature Set
Additional features include:
• Sentiment polarity of lecturer feedback
• Co-curricular rubric scores (Impact, Leadership, Relevance)
• GitHub metrics (repo count, commit frequency, language diversity)
• LinkedIn completeness index and portfolio presence flag
3.4.3 Preprocessing
Random Forest models are scale-invariant, but Min–Max scaling was applied to structured variables to maintain comparability and support visualisation. Raw text, uncompressed embeddings, and generative outputs were excluded from predictive input to avoid leakage.
Table 7: Comparison of Features Used in Baseline vs. Multimodal Model
Feature Category Baseline Model (Standard) Multimodal Model (Proposed)
Academic CGPA, Credit Load, Domain GPAs CGPA, Credit Load, Domain GPAs
Co-curricular Excluded Impact Score, Leadership Score, Relevance Score
Behavioral Excluded Feedback Sentiment Polarity, Comment Length Indicators
Professional / External Excluded GitHub Repository Count, GitHub Activity Frequency, LinkedIn Profile Completeness

**Figure 3.3: Baseline vs. Multimodal Feature Architecture Comparison**

_[Placeholder for side-by-side feature comparison diagram]_

**Description:** This figure presents a side-by-side visual comparison of the Baseline (Structured-Only) and Multimodal (Integrated) feature architectures. The diagram uses a dual-column layout with consistent visual encoding for feature types. **Left Column (Baseline Model):** Shows five feature inputs represented as labeled rectangles: (1) CGPA (overall academic performance, 0–4 scale); (2) Programming GPA Cluster (mean GPA of programming-intensive courses: data structures, algorithms, OOP, etc.); (3) Design/UI GPA Cluster (mean GPA of design and HCI courses: interface design, UX principles, graphics); (4) Infrastructure GPA Cluster (mean GPA of networking, OS, cloud, and system administration courses); (5) Credit Load (total credits completed, standardized 0–1). All five features feed into a single pipeline represented by a downward arrow labeled "Feature Vector (Dimension: 5)" leading to the Random Forest model icon. **Right Column (Multimodal Model):** Shows the same five baseline features at the top (grouped with a dashed border labeled "Structured Academic Core"), plus three additional feature groups stacked below: (6) Co-curricular Features block containing three sub-features (Impact Score, Leadership Score, Relevance Score) derived from AI rubric analysis of activity descriptions; (7) Behavioral Features block containing three sub-features (Sentiment Polarity from VADER analysis of lecturer feedback, Comment Length Normalized percentile, Specificity Flag binary indicator); (8) External Footprint Features block containing five sub-features (GitHub Repo Count sqrt-transformed, Commit Frequency log1p-transformed, Language Diversity Index ratio, LinkedIn Completeness weighted 0–1 composite, Portfolio Presence binary flag). All 14 features (5 baseline + 9 additional) converge into a thicker downward arrow labeled "Feature Vector (Dimension: 14)" leading to the same Random Forest model icon. **Visual Encoding:** Use color-coding to distinguish feature categories (blue for academic, green for co-curricular, orange for behavioral, purple for external); use dashed borders to indicate optional/augmented feature groups; use icon symbols (📚 for academic, 🏆 for co-curricular, 💬 for behavioral, 🌐 for external) for quick recognition. Include a legend at the bottom mapping colors and icons to feature types. Add annotation callouts highlighting key differences: "Baseline relies solely on grade-based proxies" pointing to left column, "Multimodal captures latent strengths beyond grades" pointing to right column's additional blocks.

3.5 Model Specifications
3.5.1 Predictive Engine: Multi-Output Random Forest Regressor
Configuration:
• n_estimators = 200
• max_depth = None
• multi-output prediction enabled
• fixed random_state for reproducibility
This model predicts six competency dimensions simultaneously and is chosen for its robustness on tabular educational datasets and interpretability.
3.5.2 Explanatory Engine: Gemini 2.0
Gemini 2.0 (temperature = 0, top_p = 1) is used post-prediction to generate:
• Narrative explanations
• Feature-driven insights
• MQF-aligned competency mapping
Generative outputs are never fed back into model training.

**Figure 3.4: Hybrid Random Forest + Gemini 2.0 Architecture**

_[Placeholder for dual-stream model architecture diagram]_

**Description:** This figure illustrates the hybrid two-stage architecture integrating supervised machine learning (Random Forest) for quantitative prediction with generative AI (Gemini 2.0) for qualitative explanation. The diagram flows left-to-right in three major stages: **Stage 1 (Input Layer):** Three parallel input streams represented as colored blocks: (1) Structured Academic Data (blue block: CGPA, domain GPAs, credit load, course counts); (2) Unstructured Text Data (green block: co-curricular activity descriptions, lecturer feedback comments); (3) External Digital Footprint (purple block: GitHub repository metadata, LinkedIn profile data, portfolio URLs). Each stream has an associated preprocessing module shown as a rounded rectangle: Structured → Min-Max Scaling; Unstructured → NLP Pipeline (VADER sentiment, rubric scoring, text feature extraction); External → API Extraction + Feature Engineering (sqrt/log transformations, composite indices). All preprocessing outputs converge into a unified feature matrix represented as a table icon labeled "Feature Matrix (N=200 × 14 features)". **Stage 2 (Prediction Engine):** The feature matrix feeds into a Random Forest Regressor icon (illustrated as a forest of decision trees) with configuration annotations: n_estimators=200, max_depth=None, multi_output=True, random_state=42. The RF model produces six parallel output branches (represented as arrows) leading to six competency score nodes: Y1 (Programming 0–100), Y2 (Design 0–100), Y3 (IT Infrastructure 0–100), Y4 (Co-curricular 0–100), Y5 (Feedback Sentiment 0–100), Y6 (Professional Engagement 0–100). Each competency node is color-coded and labeled with its domain. The RF also outputs a Feature Importance Vector (side branch) showing the top contributing features for interpretability, visualized as a horizontal bar chart icon. **Stage 3 (Explanation Engine):** The six competency scores (Y1–Y6) plus the original unstructured text inputs (co-curricular descriptions and lecturer feedback) are passed to a Gemini 2.0 LLM module represented as a brain/AI icon with configuration annotations: temperature=0, top_p=1, deterministic=True. A prompt template box is shown feeding into Gemini with the instruction structure: "Given competency scores [Y1–Y6] and supporting evidence [text excerpts], generate a narrative explanation aligned with MQF 2.0 domains highlighting strengths, gaps, and career pathway recommendations." Gemini outputs two products shown as document icons: (1) Narrative Explanation (multi-paragraph text summarizing student profile, competency analysis, and career suitability); (2) MQF Domain Mapping (radar chart visualization mapping Y1–Y6 to 11 MQF learning outcome domains: knowledge, practical skills, social skills, ethics, communication, leadership, problem-solving, digital literacy, numeracy, lifelong learning, entrepreneurship). **Key Annotations:** Add a feedback isolation barrier (red dashed line with X symbol) between Gemini output and RF input labeled "No feedback loop – generative outputs excluded from training to prevent leakage." Include a legend explaining icon types (blue = data, green = process, purple = model, orange = output) and data flow arrows (solid = forward pass, dashed = interpretability-only path). Add a callout box noting "Hybrid design ensures both quantitative rigor (RF for prediction) and qualitative richness (Gemini for explanation)." Optionally include small sample outputs (mock radar chart, snippet of narrative text) in the output stage for concreteness.

3.6 Experimental Protocol and Ablation Study
3.6.1 Data Split
A 5-fold stratified cross-validation approach is used, applying identical splits to baseline and multimodal models for paired evaluation.
3.6.2 Experiment Runs
Baseline (structured only)
Full multimodal model
Four ablation models removing each major feature group:
o Without sentiment
o Without co-curricular rubric
o Without GitHub footprint
o Without LinkedIn/portfolio indicators
Deltas (ΔMAE, ΔR²) are assessed to quantify each feature group's contribution.

**Figure 3.5: 5-Fold Cross-Validation and Ablation Study Design**

_[Placeholder for cross-validation and ablation flowchart]_

**Description:** This figure visualizes the experimental protocol for model evaluation, showing both the cross-validation structure and the ablation study design. The diagram is divided into two interconnected sections: **Section A (5-Fold Stratified Cross-Validation):** Shows the dataset (N=200 profiles represented as a large rectangle) being partitioned into five equal folds (Fold 1, Fold 2, Fold 3, Fold 4, Fold 5) using stratified sampling based on CGPA quartiles or program category to ensure balanced distribution. Each fold is color-coded and labeled with its sample size (n=40). The diagram shows five iteration cycles arranged vertically, where in each iteration k (k=1 to 5): one fold serves as the test set (highlighted in orange) while the remaining four folds form the training set (highlighted in blue). Arrows indicate the train/test split for each iteration. Within each iteration, two parallel model pipelines are shown: (1) Baseline Model (left branch) trained on 5 structured features; (2) Multimodal Model (right branch) trained on 14 features (5 structured + 9 additional). Both models output predictions Ŷ_baseline and Ŷ_multimodal for the test fold. A metrics calculation box shows computation of MAE, RMSE, R² per competency (Y1–Y6) plus macro-averaged metrics for both models. Results from all five folds are aggregated into a results matrix shown at the bottom, containing 30 rows (5 folds × 6 competencies) × 7 columns (Fold ID, Competency, MAE_baseline, MAE_multimodal, RMSE_baseline, RMSE_multimodal, R²_baseline, R²_multimodal, ΔMAE, ΔR²). **Section B (Ablation Study Design):** Positioned to the right of Section A, this section shows a tree-like structure branching from the full multimodal model (root node). The full model (14 features) branches into four ablation variants: (1) Ablation-1: Remove Sentiment (13 features, excluding sentiment polarity and comment length indicators); (2) Ablation-2: Remove Co-curricular (11 features, excluding Impact, Leadership, Relevance scores); (3) Ablation-3: Remove GitHub (11 features, excluding repo count, commit frequency, language diversity); (4) Ablation-4: Remove LinkedIn/Portfolio (12 features, excluding LinkedIn completeness and portfolio presence). Each ablation node is labeled with its feature count and the specific excluded feature group (shown in strikethrough text or red X icon). All ablation models undergo the same 5-fold CV procedure (indicated by a curved arrow looping back to Section A). A comparison table at the bottom-right shows ablation results: Ablation ID | Removed Features | Avg ΔMAE vs Full | Avg ΔR² vs Full | Friedman p-value | Holm-adjusted p-value. **Visual Encoding:** Use consistent color scheme (blue for training, orange for testing, green for full model, red for ablation variants); use dashed lines to indicate ablation relationships; use arrows to show data flow and model training/testing sequences; include small bar charts or box plots within the results matrix to visualize metric distributions across folds. Add annotations explaining key concepts: "Stratified split ensures balanced CGPA distribution in each fold" (callout on Section A), "Ablations isolate incremental contribution of each feature group" (callout on Section B). Optionally include a timeline at the bottom showing the sequential execution order: Data Prep → Fold 1 → Fold 2 → ... → Fold 5 → Ablation-1 → ... → Ablation-4 → Statistical Analysis.

3.6.3 Logged Outputs
• MAE, RMSE, R² per competency
• Macro-averaged metrics
• Feature importance vectors
• Prediction residual distributions

3.7 Evaluation Metrics
3.7.1 Primary Metrics
• MAE: Mean absolute error
• RMSE: Root mean squared error (penalises large deviations)
• R²: Proportion of variance explained
3.7.2 Secondary Metrics
• Latent Strength Detection Rate:
Cases where multimodal model identifies high domain talent among mid-CGPA students.
• Feature Importance Stability:
Spearman rank correlation across folds.
• Ablation Impact:
Performance change when feature groups are removed.
3.8 Statistical Analysis Plan
3.8.1 Significance Testing
For each competency:

1. Shapiro–Wilk normality test
2. Paired t-test (if normal) or Wilcoxon signed-rank test
3. Holm–Bonferroni correction for six comparisons
   3.8.2 Effect Sizes
   • Cohen’s d for t-tests
   • r = Z / √N for Wilcoxon tests
   3.8.3 Confidence Intervals
   Bootstrapped 95% CIs computed using 1000 resamples.
   3.8.4 Ablation Analysis
   Friedman test for repeated measures; Holm-adjusted Wilcoxon post-hoc comparisons.

3.9 Risk and Bias Mitigation
Key strategies include:
• Injecting noise to avoid deterministic synthetic samples
• Explicit representation of missing co-curricular data
• Preventing leakage from generative models
• Monitoring cross-fold variance to detect overfitting
• Fixing LLM parameters for deterministic behaviour
• Documenting bias and drift for future real-data deployment
3.10 Reproducibility and Environment
All experimental artifacts are logged, including:
• Git commit hashes
• Dataset generation seed
• Model hashes (SHA256)
• Gemini prompt template versions
• Python package list
Execution is CPU-friendly; no GPU is required.
3.11 Ethical and Governance Considerations
Ethical safeguards follow principles discussed in Chapter 2 (GDPR, PDPA, RBAC).
This study uses synthetic data; real deployment would require institutional approval, consent procedures, and pseudonymization audits.
3.12 Limitations and External Validity
• Synthetic data may not reflect real institutional patterns
• Technical footprints cannot fully replicate authentic project complexity
• No longitudinal employment outcomes available at this stage
• LLM-generated explanations have not yet been benchmarked against human evaluators
Future work involves transition to real student cohorts and longitudinal tracking.
3.13 Summary
This chapter outlined the methodological framework used to evaluate the proposed Hybrid Student Performance and Career Prediction System. The research adopted a controlled, within-subject comparative design to assess whether incorporating multimodal evidence—structured academic records, co-curricular indicators, textual feedback, and external digital footprints—offers measurable advantages over a traditional CGPA-only baseline.
The chapter detailed the synthetic dataset construction, feature engineering strategies, modelling architecture, and ablation protocols applied to isolate the contribution of each feature group. It also established the performance metrics, statistical tests, bias-mitigation procedures, and reproducibility controls required to ensure methodological rigour.

CHAPTER 4: PROJECT METHODOLOGY & IMPLEMENTATION

4.1 Introduction
This chapter documents the Software Development Life Cycle (SDLC) used to engineer the Hybrid Student Performance Analysis and Career Prediction System. Whereas Chapter 3 established the experimental methodology (data generation, evaluation metrics, statistical validation), Chapter 4 focuses on the practical realization: how the web application, machine learning pipeline, and AI explanation layer were architected, implemented, and validated. An Agile / iterative approach was adopted instead of a linear waterfall model because (a) predictive model tuning (error tracking, feature adjustments) and (b) UI / data flow refinements (CSV ingestion, profile visualization) required frequent short feedback loops. Each sprint delivered incremental improvements in four streams: data ingestion, model reliability, explanation quality, and user experience responsiveness.

Figure 4.1: Agile Development Cycle (Sprint Planning → Design → Develop → Test → Review → Next Sprint) [Placeholder]

4.2 Requirement Analysis
This phase defines what the system must do (functional scope) and how well it must perform (non-functional quality attributes). Requirements are grouped for clarity and traceability. All functional items trace back to objectives stated in Sections 1.3 and 3.2; non-functional criteria support reliability, security, and usability for academic stakeholders.

4.2.1 Functional Requirements
A. Data Ingestion & Management

- FR1: System shall allow authorized admin users to create, read, update, and delete student profiles (CRUD operations).
- FR2: System shall validate and ingest academic CSV files containing columns: student_id, course_code, grade, credit_hours (reject malformed rows, report line numbers).
- FR3: System shall permit bulk upload (≥50 rows per file) with progress feedback.

B. External Profile & Footprint Capture

- FR4: System shall allow entry of public GitHub profile URL and parse repository metadata (repo count, primary languages, recent commit frequency) via API or cached scrape.
- FR5: System shall allow entry of LinkedIn profile URL and record completeness index (presence of headline, summary, experience, skills) without scraping private data.
- FR6: System shall accept optional portfolio URL (flag used in Professional Engagement score).

C. Feature Assembly & Predictive Analytics

- FR7: System shall compute a unified feature vector (structured academic + derived co-curricular + external footprint) for each student on demand.
- FR8: Random Forest Regressor shall output six competency scores in the range [0,100]: Programming, Design, Infrastructure, Co-curricular, Feedback Sentiment Influence, Professional Engagement.
- FR9: Authorized user shall be able to trigger model retraining ("Retrain Model" action) which regenerates synthetic or updated dataset, retrains RF, stores new artifact, and logs model_version.
- FR10: System shall log each prediction event (timestamp, student_id, model_version, latency_ms) for audit and reproducibility.

D. Generative Explanation & Prompt Layer

- FR11: System shall construct a structured prompt (JSON) including selected academic indicators, co-curricular highlights, external footprint summary, and predicted scores.
- FR12: Gemini 2.0 API (temperature=0) shall return a deterministic narrative summary grounded in supplied facts (no fabrication of unprovided achievements).
- FR13: System shall filter generated text to remove placeholder tokens or unsafe content before display.

E. Visualization & User Interaction

- FR14: System shall render a six-axis radar chart (hexagonal overlay) displaying competency distribution per student.
- FR15: Dashboard shall show delta highlights (e.g., competencies >10 points above CGPA-scaled expectation) to surface latent strengths.
- FR16: System shall provide search/filter by program, CGPA band, or presence of external footprint.

F. Security & Access Control

- FR17: Supabase Row Level Security (RLS) shall restrict student record access: student role → own record; lecturer role → cohort view; admin role → full management & retrain.
- FR18: All secret keys (Gemini, service APIs) shall reside server-side in environment variables and never be exposed in client bundles.

  4.2.2 Non-Functional Requirements
  A. Performance

- NFR1: Prediction endpoint P95 latency ≤ 2000 ms; average ≤ 1000 ms under nominal load (≤10 concurrent users).
- NFR2: Gemini narrative generation P95 latency ≤ 8000 ms; timeouts (>10 s) trigger cached last summary fallback.

B. Scalability & Capacity

- NFR3: System shall support at least 200 active student records with no >15% degradation in average prediction latency.
- NFR4: Retraining process shall complete within 120 s locally (CPU) for N=200 synthetic profiles.

C. Reliability & Availability

- NFR5: Model artifact load failure rate <1% of prediction requests (auto-retry once before error response).
- NFR6: Uptime target for core prediction operations ≥99% during evaluation/demonstration window.

D. Security & Privacy

- NFR7: No storage of private LinkedIn or GitHub credentials; only publicly accessible metadata retained.
- NFR8: All database access enforced by RLS + role claims; unauthorized modification attempts logged.
- NFR9: Prompt construction excludes personally sensitive identifiers beyond student_id.

E. Reproducibility & Traceability

- NFR10: Each model artifact stored with SHA256 hash, training seed, feature schema version.
- NFR11: Prediction logs enable reconstruction of feature vector given data_version + model_version.

F. Usability & Accessibility

- NFR12: Dashboard responsive for widths ≥768px; radar chart legible on tablet and desktop.
- NFR13: Color palette meets WCAG 2.1 AA contrast for text and chart labels.

G. Maintainability

- NFR14: Core ML code (training + prediction) ≤ 500 LOC; functions follow single-responsibility.
- NFR15: Configuration (.env, model paths) centralized to reduce change surface.

H. Error Handling

- NFR16: CSV validation errors return structured JSON {row, error_type, message}; no silent discards.
- NFR17: External API failures (Gemini timeout) return HTTP 502 with retry-suggest header.

  4.2.3 Hardware and Software Requirements
  Tables below summarize the implementation stack and recommended development environment.

Table 4.1: Software / Technology Stack
Category | Technology / Tool | Purpose
Frontend Framework | Next.js (React) | Interactive dashboard & routing
Charting | react-chartjs-2 / Chart.js | Radar competency visualization
Backend / ML Runtime | Python 3.11 scripts (extensible to FastAPI) | Training & prediction services
Database | Supabase (PostgreSQL + Auth + RLS) | Persist profiles, scores, access control
ML Libraries | scikit-learn, pandas, joblib | Model training, preprocessing, artifact persistence
AI Service | Google Gemini 2.0 (temperature=0) | Deterministic narrative explanation
Deployment | Vercel (frontend), Railway (Python service) | Hosting & separation of concerns
Version Control | Git (commit hash tracking) | Reproducibility and change trace
Logging / Monitoring | (Planned) Console + structured JSON | Latency & error auditing

Table 4.2: Development / Client Hardware Requirements
Component | Minimum | Recommended
CPU | Intel i5 / Ryzen 5 | Intel i7 / Apple M1
RAM | 8 GB | 16 GB (faster retrain cycles)
Storage | 256 GB SSD | 512 GB SSD
Network | 5 Mbps broadband | ≥50 Mbps (stable API interactions)
GPU | Not required | Not required (RF is CPU-based)

Figure 4.2: High-Level System Architecture (Browser → Next.js → Supabase / Python ML Service → External APIs) [Placeholder]
Figure 4.3: Entity Relationship Diagram (Students, Courses, Activities, Scores) [Placeholder]

4.3 System Design
The system design phase translates the requirements identified in Section 4.2 into a technical architectural blueprint. This project adopts a Service-Oriented Architecture (SOA), separating the User Interface, Data Management, and Artificial Intelligence services into distinct, decoupled modules. This separation ensures scalability and maintainability.

4.3.1 High-Level System Architecture
The system architecture follows a modern Serverless and Microservice pattern. The application logic is centralized within the Next.js framework, which acts as the API Gateway orchestrating communication between the database and external AI services.

The architecture consists of four primary layers:

**Presentation Layer (Client)**: Built with Next.js (React), providing a responsive dashboard for students and administrators.

**Application Logic Layer (Middleware)**: Next.js API Routes handle authentication checks, data validation, and request routing.

**Note**: External AI services (Google Gemini, GitHub API) are invoked directly via HTTPS from Next.js API routes, bypassing the Python microservice to reduce latency.

**Intelligence Layer (Microservices)**:

- **Generative AI**: Direct integration with Google Gemini 2.5 Flash for text analysis and narrative generation.
- **Predictive ML**: A dedicated Python FastAPI service (hosted on Railway) runs the Random Forest model for numerical score prediction.

**Data Layer**: Supabase provides the PostgreSQL database and authentication services.

[Insert Figure 4.2: High-Level System Architecture Here]

Figure 4.2: High-Level System Architecture showing the data flow between Next.js, Supabase, and External APIs.

4.3.2 Database Design
The database is designed using a Relational Model hosted on PostgreSQL. The schema focuses on maintaining referential integrity between the student entities and their respective academic or behavioral records.

**Key Entities**:

**students**: The central entity containing biodata and calculated competency scores. To support the multimodal analysis, this table includes specific fields for digital footprints: `linkedin_url`, `portfolio_url`, `career_path`, and a JSONB column `github_profile_analysis` to store metadata scraped from repositories.

**courses**: Stores academic history. A One-to-Many relationship exists between Students and Courses.

**co_curricular**: Stores unstructured activity data. This table includes fields for `ai_impact_score` and `ai_leadership_score`, which are populated by the Gemini API upon data entry.

**admin_users**: Manages Role-Based Access Control (RBAC) to differentiate between Lecturers and System Admins.

[Insert Figure 4.3: Entity Relationship Diagram (ERD) Here]

Figure 4.3: Entity Relationship Diagram illustrating the schema and relationships between Students, Courses, and Activities.

4.3.3 User Interface (UI) Design
The User Interface is designed based on Dashboard Design Principles, prioritizing information density and clarity. The design ensures that complex multidimensional data can be understood at a glance.

**Key Interface Components**:

**The Student Grid**: A filterable table view allowing lecturers to sort students by Program, CGPA, or specific competency scores.

**The Competency Radar**: A six-axis radar chart located prominently on the student profile. This visualizes the balance between technical skills (Programming, IT) and soft skills (Co-curricular, Feedback).

**The AI Insight Panel**: A dedicated text area displaying the Gemini-generated narrative. It includes visual highlighting for key strengths and specific career recommendations.

**Administrative Tools**: Dedicated interfaces for CSV Bulk Import of course data and a manual Model Retraining trigger to update ML predictions.

[Insert Figure 4.4: UI Mockup or Wireframe of the Student Profile Dashboard Here]

Figure 4.4: User Interface design for the Student Profile Dashboard featuring the Radar Chart and AI Summary.

4.3.4 AI Prompt Engineering Design
A critical component of the system design is the Prompt Engineering Strategy used to communicate with the Large Language Model (Google Gemini 2.5 Flash). Unlike standard API calls, the prompt uses a text-based template with embedded student data to ensure the AI acts as an objective academic advisor.

**Design of the System Prompt**:

The system constructs a dynamic prompt using natural language instructions combined with structured data injection. The prompt enforces specific constraints to ensure pedagogical validity:

```
Role: You are an expert Academic Career Counselor.
Task: Analyze the following student profile and generate a narrative summary.

Student Data:
- Name: {student_name}
- GitHub Projects: {github_data}
- Co-curriculars: {activities_list}

Constraints:
1. Never mention specific numeric scores (e.g., instead of "Scored 85", say "Excels at").
2. Integrate GitHub project names and languages naturally into the narrative.
3. Handle portfolios diplomatically; if missing, focus on academic strengths.
4. Embed co-curricular achievements into the story, highlighting leadership roles.
5. Provide 3 specific job titles based on the MQF framework.
```

This design ensures that the Generative AI output is consistent, pedagogically valid, and directly usable within the application UI without requiring manual editing.

REFERENCES
Brown, M.A., Gruen, A., Gabe Maldoff, Messing, S. and Zimmer, M. (2024). Web Scraping for Research: Legal, Ethical, Institutional, and Scientific Considerations. [online] doi: https://doi.org/10.48550/arXiv.2410.23432.
Chango, W., Cerezo, R. & Romero, C., 2024. Multi-source and multimodal data fusion for predicting academic performance in blended learning university courses [online]. Available at: https://arxiv.org/abs/2403.05552.
Chango, W., Cerezo, R., Sanchez-Santillan, M., Azevedo, R. and Romero, C. (2021). Improving prediction of students’ performance in intelligent tutoring systems using attribute selection and ensembles of different multimodal data sources. Journal of Computing in Higher Education, 33(3), pp.614–634. doi: https://doi.org/10.1007/s12528-021-09298-8.
Daqiqil ID, I., Saputra, H., Syamsudhuha, S., Kurniawan, R. and Andriyani, Y. (2024). Sentiment analysis of student evaluation feedback using transformer-based language models. Indonesian Journal of Electrical Engineering and Computer Science, 36(2), p.1127. doi: https://doi.org/10.11591/ijeecs.v36.i2.pp1127-1139.
Duan, R., Tong, J., Sutton, A.J., Asch, D.A., Chu, H., Schmid, C.H. and Chen, Y. (2023). Origami plot: a novel multivariate data visualization tool that improves radar chart. Journal of Clinical Epidemiology, [online] 156, pp.85–94. doi: https://doi.org/10.1016/j.jclinepi.2023.02.020.
Ebrahimi, S. & Dong, Y., 2024. LANISTR: Multimodal learning from structured and unstructured data [online]. Available at: https://research.google/blog/lanistr-multimodal-learning-from-structured-and-unstructured-data/.
Ersozlu, Z., Taheri, S. and Koch, I. (2024). A review of machine learning methods used for educational data. Education and information technologies. doi: https://doi.org/10.1007/s10639-024-12704-0.
Fazil, M. and Albahlal, B.M. (2025). MultiFAR: Multidimensional information fusion with attention-driven representation learning for student performance prediction. PLOS One, [online] 20(10), p.e0333099. doi: https://doi.org/10.1371/journal.pone.0333099.
Kasneci, E., Sessler, K., Küchemann, S., Bannert, M., Dementieva, D., Fischer, F., Gasser, U., Groh, G., Günnemann, S., Hüllermeier, E., Krusche, S., Kutyniok, G., Michaeli, T., Nerdel, C., Pfeffer, J., Poquet, O., Sailer, M., Schmidt, A., Seidel, T. and Stadler, M. (2023). ChatGPT for good? on Opportunities and Challenges of Large Language Models for Education. Learning and Individual Differences, [online] 103(102274). doi: https://doi.org/10.1016/j.lindif.2023.102274.
Lee, H.-J., Ihm, S.-Y., Park, S.-H. and Park, Y.-H. (2021). An Analytic Method for Improving the Reliability of Models Based on a Histogram for Prediction of Companion Dogs’ Behaviors. Applied Sciences, 11(22), pp.11050–11050. doi: https://doi.org/10.3390/app112211050.
Lehman, K.J., Stormes, K.N., Smith, K.N. and Lapan, J.C. (2024). Sealing the Deal: Factors that Promote Computing Interns’ Interest in Computing Careers. Proceedings of the 55th ACM Technical Symposium on Computer Science Education V. 1, pp.715–721. doi: https://doi.org/10.1145/3626252.3630921.
Lemay, D.J., Baek, C. and Doleck, T. (2021). Comparison of learning analytics and educational data mining: A topic modeling approach. Computers and Education: Artificial Intelligence, 2, p.100016. doi: https://doi.org/10.1016/j.caeai.2021.100016.
Lo, C.K. (2023). What Is the Impact of ChatGPT on Education? A Rapid Review of the Literature. Education Sciences, [online] 13(4), pp.1–15. doi: https://doi.org/10.3390/educsci13040410.
Luo, Z., Mai, J., Feng, C., Kong, D., Liu, J., Ding, Y., Qi, B. and Zhu, Z. (2024). A Method for Prediction and Analysis of Student Performance That Combines Multi-Dimensional Features of Time and Space. Mathematics, [online] 12(22), pp.3597–3597. doi: https://doi.org/10.3390/math12223597.
Malaysian Qualifications Agency (2024) Malaysian Qualifications Framework (MQF) 2nd Edition, Available at: https://office.iium.edu.my/kca/wp-content/uploads/2024/10/MQF-V2-2024.pdf
Marfazila, W., Mahmud, W., Kamaruzuki, S., Juliana, Z., Yusoff, M., Hajar, S., Pusat, Y., Pendidikan, P., Pengajian, F., Islam, K., Usuluddin, P., Sultan, U., Abidin, Z. and Corresponding Author, M. (n.d.). The Impact of Soft Skills Development Strategies on the Employability of Graduates of Higher Education Institutions: Analysis of Past Studies.: https://hrmars.com/papers_submitted/19997/the-impact-of-soft-skills-development-strategies-on-the-employability-of-graduates-of-higher-education-institutions-analysis-of-past-studies.pdf
Namoun, A. and Alshanqiti, A. (2020). Predicting Student Performance Using Data Mining and Learning Analytics Techniques: A Systematic Literature Review. Applied Sciences, 11(1), p.237. doi: https://doi.org/10.3390/app11010237.
Osman, I., Ibrahim, A.A., Mohd Hashim, M.J., et al. (2025) ‘Graduate Soft Skills and Employability in Malaysia’, Social and Management Research Journal, 22(1), pp. 1–18. : https://journal.uitm.edu.my/ojs/index.php/SMRJ/article/view/6539
Parfenov, Oleg E, Averyanov, Dmitry V, Sokolov, I.S., Mihalyuk, Alexey N, Kondratev, Oleg A, Taldenkov, A.N., Tokmachev, Andrey M and Storchak, Vyacheslav G (2024). Pushing an Altermagnet to the Ultimate 2D Limit: Evidence of Symmetry Breaking in Monolayers of GdAlSi. arXiv (Cornell University). doi: https://doi.org/10.48550/arxiv.2406.07172.
Pei, B., Cheng, Y., Ambrose, A., Dziadula, E., Xing, W. and Lu, J. (2024). LearningViz: a dashboard for visualizing, analyzing and closing learning performance gaps a case study approach. Smart Learning Environments, 11(1). doi: https://doi.org/10.1186/s40561-024-00346-1.
Pena, L., Curado, C. and Oliveira, M. (2022). The contribution of LinkedIn use to career outcome expectations. Journal of Business Research, 144, pp.788–796. doi: https://doi.org/10.1016/j.jbusres.2021.09.047.
Qian, K., Yang, K., Dai, W., Jin, F., Cheng, Y., Guan, R., Nawaz, S., Swiecki, Z., Chen, G., Yan, L. and Gašević, D. (2025). SCALEFeedback: A Large-Scale Dataset of Synthetic Computer Science Assignments for LLM-generated Educational Feedback Research. arXiv (Cornell University). doi:https://doi.org/10.48550/arxiv.2508.05953.
Ramesh et al., 2025. An Improved Prediction Model for the Placement of the Students [online]. Available at: https://www.jisem-journal.com/index.php/journal/article/download/2508/991/4086.
Salim, M. and Al, A. (2024). Students’ Academic Performance Prediction Using Educational Data Mining and Machine Learning: A Systematic Review. International Journal of Research and Innovation in Social Science, VIII(VIII), pp.1264–1291. doi: https://doi.org/10.47772/ijriss.2024.808095.
Segbenya, M., Brandford Bervell, Evans Frimpong-Manso, Isaac Christopher Otoo, Tahir Ahmed Andzie and Sampson Achina (2023). AI in higher education: Modelling the antecedents of AI usage and effects on 21st century employability skills among postgraduate students in Ghana. Computers & Education: Artificial Intelligence, 5, pp.100188–100188. doi: https://doi.org/10.1016/j.caeai.2023.100188.
Syed, D. (2023). Predictive Analysis of Students’ Learning Performance Using Data Mining Techniques: A Comparative Study of Feature Selection Methods. Applied system innovation, 6(5), pp.86–86. doi: https://doi.org/10.3390/asi6050086.
Tino, C. and Fedeli, M. (2024). L’importanza delle soft skill per l’employability e il ruolo dell’Istruzione Superiore: percezioni di studenti/esse. ITALIAN JOURNAL OF EDUCATIONAL RESEARCH, [online] (33), pp.205–218. doi: https://doi.org/10.7346/sird-022024-p205.
Trujillo, F., Pozo, M. & Suntaxi, G., 2025. Artificial intelligence in education: A systematic literature review of machine learning approaches in student career prediction. Journal of Technology and Science Education, 15(1), pp.162–185 [online]. Available at: https://www.jotse.org/index.php/jotse/article/view/3124/937.
Weerasinghe, M. (2024). Enhancing Web Scraping with Artificial Intelligence: A Review. 4th Research Symposium of Faculty of Computing 2024. [online] Available at: https://www.researchgate.net/publication/379024314_Enhancing_Web_Scraping_with_Artificial_Intelligence_A_Review.
Wu, Y. (2025). Research on prediction algorithm of college students’ academic performance based on Bert-GCN multi-modal data fusion. Systems and Soft Computing, 7, p.200327. doi: https://doi.org/10.1016/j.sasc.2025.200327.
Yağcı, M. (2022). Educational data mining: prediction of students’ academic performance using machine learning algorithms. Smart Learning Environments, [online] 9(1). doi: https://doi.org/10.1186/s40561-022-00192-z.
Yan, X. & Nasri, N.M. (2025) ‘Soft Skills Development in Higher Education: Impact on Graduate Employment Success’, Advances in Curriculum Design & Education, 1(2), pp. 205–221. DOI: 10.63808/acde.v1i2.205.Yan, X. and Nurfaradilla Mohamad Nasri (2025). Soft Skills Development in Higher Education: Impact on Graduate Employment Success. Advances in Curriculum Design&Education, 1(2), pp.1–11. doi: https://doi.org/10.63808/acde.v1i2.205.
Yaqoob, S., Noor, A., Noor, T.H., Khan, M.Z., Ejaz, A., Alam, M.I., Rana, N. and Ejaz, K. (2025). Enhancing student career guidance and sentimental analysis: A performance-driven hybrid learning approach with feature ranking. PLoS ONE, 20(5), pp.e0321108–e0321108. doi: https://doi.org/10.1371/journal.pone.0321108.
Zhang, D., Yin, C., Zeng, J., Yuan, X. and Zhang, P. (2020). Combining structured and unstructured data for predictive models: a deep learning approach. BMC Medical Informatics and Decision Making, [online] 20(1). doi: https://doi.org/10.1186/s12911-020-01297-6.
Zohra Zerdoumi, Abdou, L. and Elkhanssa Bdirina (2023). An Improved Recursive Least Square Algorithm For Adapting Fuzzy Channel Equalizer. Engineering Technology & Applied Science Research, 13(4), pp.11124–11129. doi: https://doi.org/10.48084/etasr.5906.
Zohra Zerdoumi, Abdou, L. and Elkhanssa Bdirina (2023). An Improved Recursive Least Square Algorithm For Adapting Fuzzy Channel Equalizer. Engineering Technology & Applied Science Research, 13(4), pp.11124–11129. doi: https://doi.org/10.48084/etasr.5906.
