
// services/aiService.ts
import type { UserInput, CareerAdvisorResponse, StructuredTimetable } from '../types';
import { getUserDefinedItems } from './localStorageService'; // Import for dynamic RAG

const LLAMA_API_ENDPOINT = process.env.LLAMA_API_ENDPOINT;
const MODEL_NAME = "llama3.2"; // Corrected model name as per README

// --- Simulated RAG Knowledge Base ---
interface KBEntry {
  id: string;
  keywords: string[]; // For very simple simulated retrieval
  content: string; // Expert tip or relevant information
}

const CAREER_ADVICE_KB: KBEntry[] = [
  // Tech & Business (Expanded and Refined)
  { id: 'ca1', keywords: ['software', 'python', 'web', 'javascript', 'coding', 'developer', 'engineer', 'full-stack', 'front-end', 'back-end'], content: "Expert Tip for Software/Web Developers: Build a diverse portfolio on GitHub, showcasing various projects. Actively contribute to open-source or create your own projects to gain practical experience and demonstrate your skills to potential employers. Specialize in a niche like AI integration, cybersecurity, or a specific framework to stand out." },
  { id: 'ca2', keywords: ['data', 'analytics', 'machine learning', 'ai', 'scientist', 'analyst', 'big data'], content: "Expert Tip for Data Professionals: Master Python and R, along with SQL. Gain experience with cloud platforms (AWS, Azure, GCP) as many data roles are cloud-based. Participate in Kaggle competitions and build projects that showcase data cleaning, analysis, visualization, and model building." },
  { id: 'ca3', keywords: ['design', 'ux', 'ui', 'product', 'designer', 'user experience', 'user interface'], content: "Expert Tip for Designers (UX/UI/Product): Develop a strong portfolio with detailed case studies explaining your design process, user research, iteration, and the impact of your work. Master tools like Figma, Sketch, or Adobe XD. Understand user-centered design principles deeply." },
  { id: 'ca4', keywords: ['general', 'tech', 'career', 'professional', 'networking', 'job search'], content: "General Career Tip: Networking is crucial. Attend industry events (virtual or in-person), join relevant online communities (LinkedIn groups, Discord servers), and don't hesitate to reach out for informational interviews. A strong professional network can open doors." },
  { id: 'ca5', keywords: ['business', 'management', 'manager', 'leadership', 'strategy'], content: "Expert Tip for Management Roles: Focus on developing strong leadership, communication, and decision-making skills. Quantify your achievements in previous roles with specific metrics and impact. Continuous learning in areas like project management and strategic thinking is vital." },
  { id: 'ca6', keywords: ['marketing', 'digital marketing', 'seo', 'sem', 'content creation', 'social media'], content: "Expert Tip for Marketers: Stay updated with the latest digital marketing trends and tools. Develop skills in SEO, SEM, content marketing, social media strategy, and data analytics to measure campaign effectiveness. A portfolio of successful campaigns is key." },
  { id: 'ca7', keywords: ['sales', 'business development', 'account manager', 'negotiation'], content: "Expert Tip for Sales Professionals: Master the art of communication, negotiation, and relationship building. Understand your product/service deeply and be ableto articulate its value proposition clearly. Track record of meeting or exceeding targets is crucial." },
  { id: 'ca8', keywords: ['finance', 'analyst', 'investment', 'accounting', 'auditor', 'cfa', 'cpa'], content: "Expert Tip for Finance/Accounting: Pursue relevant certifications (CFA, CPA). Develop strong analytical skills and proficiency in financial modeling software (Excel, etc.). Attention to detail and ethical conduct are paramount." },
  { id: 'ca9', keywords: ['project manager', 'product manager', 'agile', 'scrum', 'pmp'], content: "Expert Tip for Project/Product Managers: Get certified (PMP, Agile certifications like CSPO or CSM). Develop excellent organizational, communication, and stakeholder management skills. Experience with project management tools (Jira, Asana, Trello) is essential." },
  { id: 'ca10', keywords: ['consultant', 'advisory', 'management consulting', 'it consulting'], content: "Expert Tip for Consultants: Develop strong problem-solving, analytical, and presentation skills. Specialize in a particular industry or service line. Build a network and showcase your expertise through white papers or speaking engagements." },

  // Healthcare (Expanded)
  { id: 'hc1', keywords: ['nurse', 'nursing', 'registered nurse', 'healthcare', 'medical', 'patient care'], content: "Expert Tip for Nursing: Specialize in an area like pediatrics, oncology, critical care, or psychiatric nursing to increase demand. Continuous education, certifications (e.g., CCRN, CPN), and strong patient advocacy skills are key." },
  { id: 'hc2', keywords: ['doctor', 'physician', 'medical doctor', 'surgeon', 'specialist'], content: "Expert Tip for Physicians: Consider a fellowship for sub-specialization after residency. Building strong patient communication skills, empathy, and keeping up with medical advancements are crucial for a successful practice." },
  { id: 'hc3', keywords: ['therapist', 'physical therapy', 'occupational therapy', 'speech therapist', 'rehabilitation'], content: "Expert Tip for Therapists: Stay updated on evidence-based practices and new therapeutic technologies. Specializing (e.g., sports therapy, neurorehabilitation, pediatrics) can create niche opportunities. Strong interpersonal skills are vital." },
  { id: 'hc4', keywords: ['pharmacist', 'pharmacy', 'medication management', 'clinical pharmacist'], content: "Expert Tip for Pharmacists: Develop strong patient counseling skills and knowledge of pharmacotherapy. Opportunities are expanding into clinical pharmacy, medication therapy management, and specialized areas like oncology or infectious diseases." },
  { id: 'hc5', keywords: ['medical assistant', 'healthcare support', 'clinical assistant', 'patient intake'], content: "Expert Tip for Medical Assistants: Certification (e.g., CMA, RMA) significantly boosts job prospects. Proficiency in Electronic Health Record (EHR) systems and excellent patient interaction skills are highly valued." },
  { id: 'hc6', keywords: ['dentist', 'dental surgeon', 'oral health'], content: "Expert Tip for Dentists: Stay updated with advancements in dental technology and procedures. Consider specialization (e.g., orthodontics, periodontics). Strong patient communication and business management skills (for private practice) are beneficial." },
  { id: 'hc7', keywords: ['psychologist', 'mental health', 'counselor', 'therapist'], content: "Expert Tip for Psychologists/Counselors: Obtain appropriate licensure. Specialize in areas like clinical psychology, counseling psychology, or neuropsychology. Continuous professional development and strong ethical grounding are essential." },
  { id: 'hc8', keywords: ['veterinarian', 'vet', 'animal health', 'animal doctor'], content: "Expert Tip for Veterinarians: Specialize in small animals, large animals, exotics, or a specific medical area like surgery or internal medicine. Strong empathy for animals and communication skills with pet owners are crucial." },

  // Education (Expanded)
  { id: 'edu1', keywords: ['teacher', 'k-12', 'educator', 'pedagogy', 'curriculum development', 'classroom management'], content: "Expert Tip for K-12 Teachers: Gain experience with modern classroom technology, inclusive education practices, and differentiated instruction. Consider a master's degree or certifications in specialized areas like special education or ESL." },
  { id: 'edu2', keywords: ['professor', 'lecturer', 'higher education', 'academic researcher', 'postdoctoral'], content: "Expert Tip for Academics/Professors: Focus on publishing in high-impact journals, securing research grants, and effective teaching. Strong presentation skills for conferences and mentoring abilities are also essential." },
  { id: 'edu3', keywords: ['librarian', 'library science', 'information management', 'archivist'], content: "Expert Tip for Librarians/Archivists: Develop digital literacy skills, knowledge of database management, and information retrieval techniques. Specializing (e.g., academic, public, digital, special collections) can be beneficial." },
  { id: 'edu4', keywords: ['instructional designer', 'e-learning developer', 'edtech', 'corporate trainer'], content: "Expert Tip for Instructional Designers: Master authoring tools (e.g., Articulate 360, Adobe Captivate, Camtasia) and understand adult learning theories (andragogy). A portfolio demonstrating diverse project types is crucial." },
  { id: 'edu5', keywords: ['school counselor', 'guidance counselor', 'academic advisor'], content: "Expert Tip for School Counselors: Stay current with college admission trends, career development resources, and mental health support for students. Strong empathy, active listening, and communication skills are paramount." },

  // Arts, Media & Entertainment (Expanded)
  { id: 'art1', keywords: ['graphic designer', 'visual communication', 'branding', 'adobe creative suite'], content: "Expert Tip for Graphic Designers: Build a diverse portfolio showcasing various styles (branding, web, print) and projects. Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign) is standard. Understanding typography and visual hierarchy is key." },
  { id: 'art2', keywords: ['writer', 'author', 'copywriter', 'content creator', 'editor', 'journalist', 'blogger'], content: "Expert Tip for Writers/Editors: Develop a niche or specialty (e.g., technical writing, fiction, marketing copy). Build a strong portfolio of published work or well-crafted samples. Master grammar, style, and storytelling techniques." },
  { id: 'art3', keywords: ['musician', 'instrumentalist', 'composer', 'singer', 'music producer', 'sound engineer'], content: "Expert Tip for Musicians/Producers: Practice consistently, collaborate, and network within the music community. Understanding music theory, production software (DAWs), and marketing yourself effectively are very helpful." },
  { id: 'art4', keywords: ['actor', 'actress', 'performing arts', 'theatre', 'film', 'voice actor'], content: "Expert Tip for Actors: Get formal training (acting classes, workshops) and build a diverse portfolio of roles (headshots, demo reel). Networking, persistence, and auditioning skills are key in this competitive field." },
  { id: 'art5', keywords: ['filmmaker', 'director', 'cinematographer', 'video editor', 'producer'], content: "Expert Tip for Filmmakers: Gain hands-on experience in various roles (writing, directing, editing, cinematography). Create short films to build a portfolio. Understand storytelling, visual composition, and project management." },
  { id: 'art6', keywords: ['animator', '3d artist', 'vfx artist', 'motion graphics designer'], content: "Expert Tip for Animators/VFX Artists: Master industry-standard software (e.g., Maya, Blender, Houdini, After Effects) and create a compelling demo reel showcasing your specific skills. Specialization (e.g., character animation, rigging, compositing) is often advantageous." },
  { id: 'art7', keywords: ['dancer', 'choreographer', 'dance instructor', 'dance therapist'], content: "Expert Tip for Dancers/Choreographers: Consistent training and versatility in multiple dance styles are crucial. Networking with companies and schools, creating a strong performance/choreography reel, and developing teaching skills can open diverse opportunities." },
  { id: 'art8', keywords: ['photographer', 'videographer', 'photojournalist'], content: "Expert Tip for Photographers/Videographers: Develop a unique style and a strong portfolio. Master technical aspects (lighting, composition, editing software). Specializing in a niche (e.g., portrait, wedding, commercial, documentary) can help build a client base." },
  { id: 'art9', keywords: ['fashion designer', 'textile designer', 'merchandiser'], content: "Expert Tip for Fashion Designers: Develop strong design skills, understand garment construction, and stay updated on trends. Create a portfolio showcasing your unique vision. Internships and industry connections are very valuable." },
  { id: 'art10', keywords: ['architect', 'interior designer', 'urban designer'], content: "Expert Tip for Architects/Interior Designers: Master CAD software (AutoCAD, Revit, SketchUp) and develop a strong portfolio. Understand building codes, materials, and sustainable design practices. Licensure is typically required for architects." },

  // Trades & Skilled Labor (Expanded)
  { id: 'trd1', keywords: ['electrician', 'electrical technician', 'wiring', 'journeyman electrician'], content: "Expert Tip for Electricians: Complete a formal apprenticeship and obtain state/local licensing. Specializing in areas like industrial automation, renewable energy systems, or smart home technology can increase opportunities." },
  { id: 'trd2', keywords: ['plumber', 'pipefitter', 'steamfitter'], content: "Expert Tip for Plumbers: Apprenticeships and licensing are essential. Knowledge of water conservation systems, backflow prevention, and new piping materials is a plus. Good problem-solving skills are crucial." },
  { id: 'trd3', keywords: ['hvac technician', 'heating ventilation air conditioning', 'refrigeration mechanic'], content: "Expert Tip for HVAC Techs: Certifications (e.g., EPA Section 608, NATE) are often required. Skills in system diagnostics, customer service, and knowledge of energy-efficient systems are important." },
  { id: 'trd4', keywords: ['carpenter', 'woodworker', 'framer', 'finish carpenter', 'cabinet maker'], content: "Expert Tip for Carpenters: Develop a strong understanding of blueprints, building codes, and various wood types. Precision and attention to detail are key. Specializing in areas like custom cabinetry, historical restoration, or framing can be beneficial." },
  { id: 'trd5', keywords: ['chef', 'cook', 'culinary artist', 'pastry chef', 'sous chef'], content: "Expert Tip for Chefs: Gain experience in various kitchen roles, starting from entry-level if necessary. Culinary school provides a strong foundation, but hands-on experience, creativity, and ability to work under pressure are paramount." },
  { id: 'trd6', keywords: ['automotive technician', 'mechanic', 'auto repair specialist', 'diesel mechanic'], content: "Expert Tip for Automotive Techs: ASE certifications are highly valued. Staying updated with new vehicle technologies (EVs, hybrids, ADAS) through continuous training is crucial for long-term success." },
  { id: 'trd7', keywords: ['welder', 'fabricator', 'pipe welder'], content: "Expert Tip for Welders: Obtain certifications from organizations like the AWS (American Welding Society). Develop proficiency in various welding processes (MIG, TIG, Stick). Strong attention to safety and blueprint reading are essential." },
  { id: 'trd8', keywords: ['machinist', 'cnc operator', 'tool and die maker'], content: "Expert Tip for Machinists: Develop precision measurement skills and proficiency in operating CNC machines and traditional machine tools. Ability to read complex blueprints and understand G-code is crucial." },

  // Public Service & Non-Profit (Expanded)
  { id: 'pub1', keywords: ['social worker', 'clinical social worker', 'case manager', 'community outreach'], content: "Expert Tip for Social Workers: Obtain the necessary licensure (e.g., LSW, LCSW). Specializing in a particular population (e.g., children, elderly, mental health, substance abuse) can be fulfilling. Strong empathy and advocacy skills are critical." },
  { id: 'pub2', keywords: ['urban planner', 'city planner', 'regional planner', 'transportation planner'], content: "Expert Tip for Urban Planners: Develop strong analytical, GIS (Geographic Information Systems) mapping, and public presentation skills. Understanding public policy, environmental regulations, and community engagement processes is essential." },
  { id: 'pub3', keywords: ['firefighter', 'emergency medical technician', 'paramedic', 'fire safety'], content: "Expert Tip for Firefighters/EMTs: Maintain peak physical condition and complete rigorous training programs. EMT/Paramedic certification is often required or highly beneficial for firefighters. Strong decision-making skills under pressure are vital." },
  { id: 'pub4', keywords: ['police officer', 'law enforcement officer', 'detective', 'criminal justice'], content: "Expert Tip for Police Officers: Focus on community policing principles, de-escalation techniques, and ethical conduct. A degree in criminal justice or related field can be advantageous. Physical fitness and strong moral character are essential." },
  { id: 'pub5', keywords: ['nonprofit manager', 'fundraising director', 'program director', 'grant writer'], content: "Expert Tip for Non-Profit Managers: Develop strong skills in grant writing, fundraising, donor relations, volunteer management, and program evaluation. Passion for the organization's mission and strong leadership are key to success." },
  { id: 'pub6', keywords: ['politician', 'public official', 'legislator', 'campaign manager'], content: "Expert Tip for Public Office/Politics: Develop strong public speaking, debate, and policy analysis skills. Build a strong community network and understand campaign finance and strategy. Resilience and dedication are crucial." },

  // Science & Research (Further Expansion)
  { id: 'sci1', keywords: ['biologist', 'ecologist', 'zoologist', 'botanist', 'marine biologist', 'conservation scientist'], content: "Expert Tip for Biologists/Ecologists: Gain extensive field research experience and proficiency in statistical analysis software (R, Python). Specializing in areas like molecular biology, conservation genetics, or population ecology can lead to unique research or applied roles." },
  { id: 'sci2', keywords: ['chemist', 'analytical chemist', 'organic chemist', 'materials scientist', 'lab researcher'], content: "Expert Tip for Chemists: Develop strong laboratory skills, including proficiency with analytical instrumentation (e.g., HPLC, GC-MS, NMR). A PhD is often required for independent research-intensive roles in academia or industry." },
  { id: 'sci3', keywords: ['physicist', 'astrophysicist', 'particle physicist', 'quantum physicist', 'research scientist'], content: "Expert Tip for Physicists: Strong mathematical, computational (Python, C++), and modeling skills are essential. Postdoctoral research is a common path for academic or advanced R&D roles. Clearly communicating complex ideas is also important." },
  { id: 'sci4', keywords: ['geologist', 'geoscientist', 'hydrogeologist', 'environmental geologist', 'seismologist'], content: "Expert Tip for Geologists: Field experience, GIS skills, and data interpretation are highly valued. Specializations can include hydrogeology, petroleum geology, volcanology, or environmental remediation." },
  { id: 'sci5', keywords: ['archaeologist', 'anthropologist', 'cultural heritage', 'museum curator'], content: "Expert Tip for Archaeologists/Anthropologists: Gain field school experience, develop meticulous recording and analytical skills. Understanding cultural heritage laws and ethical considerations is crucial. For curatorial roles, museum studies or relevant advanced degrees are beneficial." },
  { id: 'sci6', keywords: ['meteorologist', 'climatologist', 'atmospheric scientist'], content: "Expert Tip for Meteorologists/Climatologists: Strong background in physics, mathematics, and computer modeling. Proficiency in data analysis and weather forecasting software is essential. Communication skills are important for public-facing roles." },

  // Agriculture & Environment (Expanded)
  { id: 'agr1', keywords: ['agricultural scientist', 'agronomist', 'soil scientist', 'horticulturist', 'food scientist'], content: "Expert Tip for Agricultural/Food Scientists: Focus on sustainable practices, crop improvement, soil health, or food safety and processing. Laboratory and field research skills are important, as is understanding agricultural technology." },
  { id: 'env1', keywords: ['environmental consultant', 'sustainability manager', 'environmental policy analyst', 'conservation manager'], content: "Expert Tip for Environmental Professionals: Develop a strong understanding of environmental regulations, policy, and impact assessment methodologies. Skills in GIS, data analysis, report writing, and public communication are key." },
  { id: 'env2', keywords: ['forester', 'forestry technician', 'natural resource manager'], content: "Expert Tip for Foresters: Gain experience in forest inventory, management planning, and silviculture. Knowledge of GIS, sustainable forestry practices, and fire management is often required." },

  // Hospitality & Tourism (Expanded)
  { id: 'hos1', keywords: ['hotel manager', 'hospitality operations', 'guest services manager', 'front office manager'], content: "Expert Tip for Hotel Management: Gain diverse experience across hotel departments (front office, F&B, housekeeping). Strong leadership, problem-solving, customer service, and financial acumen are crucial for success." },
  { id: 'tou1', keywords: ['travel agent', 'tour operator', 'tourism consultant', 'destination manager'], content: "Expert Tip for Travel/Tourism Professionals: Develop in-depth knowledge of diverse destinations, travel products, and booking systems. Strong sales, communication, customer service, and organizational skills are important." },
  { id: 'evt1', keywords: ['event planner', 'event manager', 'meeting planner', 'wedding planner'], content: "Expert Tip for Event Planners: Exceptional organizational skills, attention to detail, and ability to multitask under pressure are key. Build a network of reliable vendors. Experience in budgeting, marketing, and logistics is essential." },

  // Legal (Expanded)
  { id: 'leg1', keywords: ['lawyer', 'attorney', 'solicitor', 'barrister', 'legal counsel'], content: "Expert Tip for Lawyers: Specialize in a field of law (e.g., corporate, criminal, family, intellectual property, environmental). Develop strong analytical, research, writing, and argumentation skills. Passing the bar exam in your jurisdiction is required." },
  { id: 'leg2', keywords: ['paralegal', 'legal assistant', 'law clerk'], content: "Expert Tip for Paralegals: Focus on meticulous legal research, document preparation, case management, and e-discovery. Proficiency in legal software and strong organizational skills are highly valued. Certification can be beneficial." },

  // Other Diverse Roles
  { id: 'oth1', keywords: ['librarian', 'archivist', 'information specialist'], content: "Expert Tip: Develop skills in digital resource management, cataloging, and user services. A Master's in Library Science (MLS) or Information Science is typically required." },
  { id: 'oth2', keywords: ['translator', 'interpreter', 'linguist'], content: "Expert Tip: Achieve native-level fluency in at least two languages. Specialize in a domain (e.g., medical, legal, technical). Certification and cultural competency are important." },
  { id: 'oth3', keywords: ['pilot', 'flight instructor', 'airline pilot', 'aviation'], content: "Expert Tip: Extensive flight training and certifications (e.g., PPL, CPL, ATPL) are required. Maintain excellent health and decision-making skills under pressure. Seniority and experience are key for airline careers." },
  { id: 'oth4', keywords: ['statistician', 'actuary', 'risk analyst'], content: "Expert Tip: Strong mathematical and analytical skills are essential. Master statistical software (R, SAS, Python). For actuaries, passing a series of rigorous professional exams is required." },
  { id: 'oth5', keywords: ['surveyor', 'land surveyor', 'geomatics'], content: "Expert Tip: Develop precision measurement skills using GPS, an array of software and other surveying equipment. Licensure is typically required. Knowledge of property law and land development processes is important." },
];

const TIMETABLE_RESOURCES_KB: KBEntry[] = [
  { id: 'tr1', keywords: ['programming', 'coding', 'software', 'web', 'developer', 'python', 'javascript', 'java', 'technical skills'], content: "Study Tip: Utilize interactive platforms like LeetCode, HackerRank, freeCodeCamp, or Codewars for consistent coding practice. Work on data structures and algorithms." },
  { id: 'tr2', keywords: ['concepts', 'theory', 'fundamentals', 'academic', 'research', 'science', 'math', 'scientific & academic skills'], content: "Study Tip: Supplement practical work with high-quality online courses from platforms like Coursera, edX, MIT OpenCourseware, or Khan Academy to build a strong theoretical foundation. Read textbooks and academic papers in your field." },
  { id: 'tr3', keywords: ['projects', 'portfolio', 'design', 'creative', 'build', 'develop', 'creative & design skills'], content: "Study Tip: Ensure your timetable includes dedicated blocks for hands-on personal projects or contributions to open-source. Applying learned concepts to build something tangible is crucial for skill consolidation and a strong portfolio." },
  { id: 'tr4', keywords: ['networking', 'community', 'career', 'job search', 'soft skills', 'business & management skills'], content: "Study Tip: Allocate time for professional networking, attending virtual meetups, or engaging in online communities related to your field. Practice your communication and presentation skills." },
  { id: 'tr5', keywords: ['review', 'study', 'memorization', 'test preparation', 'learning'], content: "Study Tip: Incorporate regular review sessions using techniques like spaced repetition (e.g., Anki for flashcards) to improve long-term retention of key concepts and facts." },
  { id: 'tr6', keywords: ['language learning', 'linguistics', 'translation', 'vocabulary', 'grammar', 'languages'], content: "Study Tip for Language Learning: Immerse yourself as much as possible. Use apps like Duolingo or Babbel for daily practice, watch media in the target language, and try to find conversation partners." },
  { id: 'tr7', keywords: ['arts', 'music', 'dance', 'acting', 'practice', 'technique', 'creative & design skills'], content: "Study Tip for Arts/Performance: Dedicate significant time to deliberate practice of your craft. Seek feedback from mentors or peers. Record yourself to identify areas for improvement." },
  { id: 'tr8', keywords: ['trades', 'hands-on', 'practical skills', 'apprenticeship'], content: "Study Tip for Trades: Focus on hands-on practice and understanding safety protocols. If in an apprenticeship, actively seek mentorship and diverse experiences on the job." },
  { id: 'tr9', keywords: ['health', 'medical', 'clinical skills', 'anatomy', 'physiology', 'medicine & healthcare'], content: "Study Tip for Health/Medical Fields: Combine book study with practical application or observation if possible. Use anatomical models, case studies, and practice clinical reasoning." }
];

// Helper to simulate context retrieval from a Knowledge Base
const retrieveRelevantContext = (
    userInput: UserInput | { title?: string; description?: string; roadmap?: string; timeframe?: string },
    kb: KBEntry[],
    maxContexts = 2
  ): string => {
    let combinedKeywords: string[] = [];
    let isCareerAdvice = false;
  
    if ('selectedSkills' in userInput && 'selectedInterests' in userInput) { // UserInput for career advice
      isCareerAdvice = true;
      combinedKeywords = [
        ...userInput.selectedSkills.flatMap(skill => skill.name.toLowerCase().split(/\s+/)),
        ...userInput.selectedInterests.flatMap(interest => interest.name.toLowerCase().split(/\s+/)),
        ...(userInput.fieldOfStudy?.toLowerCase().split(/\s+/) || []),
        ...(userInput.highestQualification?.toLowerCase().split(/\s+/) || []),
      ];
    } else if ('title' in userInput && 'timeframe' in userInput) { // Timetable input
      combinedKeywords = [
        ...(userInput.title?.toLowerCase().split(/\s+/) || []),
        // ...(userInput.description?.toLowerCase().split(/\s+/) || []), // Description can be too noisy
        // ...(userInput.roadmap?.toLowerCase().split(/\s+/) || []), // Roadmap can be too noisy
      ];
    }
    
    const uniqueInputKeywords = Array.from(new Set(combinedKeywords.map(kw => kw.replace(/[^a-z0-9]/gi, '').trim()).filter(kw => kw.length > 2)));
  
    let dynamicContext = "";
    if (isCareerAdvice) {
      const userDefinedItems = getUserDefinedItems();
      const matchedUserDefinedItems = new Set<string>();
      if(userDefinedItems.length > 0 && uniqueInputKeywords.length > 0){
        userDefinedItems.forEach(udItem => {
          const udItemKeywords = udItem.name.toLowerCase().split(/\s+/).map(kw => kw.replace(/[^a-z0-9]/gi, '').trim()).filter(kw => kw.length > 2);
          if (udItemKeywords.some(udk => uniqueInputKeywords.includes(udk))) {
            matchedUserDefinedItems.add(udItem.name);
          }
        });
      }
      if (matchedUserDefinedItems.size > 0) {
        dynamicContext = `\nPreviously user-defined relevant items: ${Array.from(matchedUserDefinedItems).join(', ')}.`;
      }
    }
  
    if (uniqueInputKeywords.length === 0 && !dynamicContext) return kb.length > 0 ? kb[0].content : "No specific expert tips available from the knowledge base for this query.";
  
    const scoredEntries = kb.map(entry => {
      const matchScore = entry.keywords.reduce((score, kbKeyword) => {
        if (uniqueInputKeywords.some(uk => kbKeyword.includes(uk) || uk.includes(kbKeyword))) {
          return score + 1;
        }
        return score;
      }, 0);
      return { ...entry, score: matchScore };
    });
  
    const relevantEntries = scoredEntries.filter(entry => entry.score > 0)
                                       .sort((a, b) => b.score - a.score)
                                       .slice(0, maxContexts);
    
    let staticContext = "";
    if (relevantEntries.length === 0 && kb.length > 0) {
      const genericTip = kb.find(e => e.keywords.includes('general') || e.keywords.includes('study') || e.keywords.includes('career'));
      staticContext = genericTip ? genericTip.content : "General advice: Continuous learning and adapting to new trends are key in any field.";
    } else {
      staticContext = relevantEntries.map(entry => entry.content).join('\n');
    }
    
    return (staticContext + dynamicContext).trim();
  };


// Function to construct the user message for Llama 3 for career advice
const generateLlamaCareerAdviceUserMessage = (userInput: UserInput): string => {
  const { highestQualification, fieldOfStudy, educationJourneyNotes, experience, selectedSkills, selectedInterests } = userInput;
  const skillsString = selectedSkills.map(s => s.name).join(', ') || 'Not specified';
  const interestsString = selectedInterests.map(i => i.name).join(', ') || 'Not specified';
  let educationInfo = `Highest Qualification: ${highestQualification || 'Not specified'}`;
  if (fieldOfStudy) educationInfo += `\nField of Study: ${fieldOfStudy}`;
  if (educationJourneyNotes) educationInfo += `\nEducation Journey Notes: ${educationJourneyNotes}`;

  const retrievedCareerContext = retrieveRelevantContext(userInput, CAREER_ADVICE_KB, 3);

  // IMPORTANT: Instruct Llama to ONLY output JSON.
  return `
    Based on the following user profile:
    ${educationInfo}
    - Skills: ${skillsString}
    - Interests: ${interestsString}
    - Experience/Journey: ${experience || 'Not specified'}

    Here is some potentially relevant expert context that has been retrieved, which you should consider ALONGSIDE the user's direct input:
    """
    ${retrievedCareerContext}
    """

    Considering ALL the information above (user profile AND retrieved context), please provide a JSON object with the following structure.
    Output ONLY the JSON object and nothing else. Do not add any explanatory text before or after the JSON.

    The JSON structure should be:
    {
      "suggestedRoles": [
        {
          "title": "string (e.g., Software Engineer, UX Designer, Marine Biologist)",
          "description": "string (A brief 2-3 sentence description of why this role might suit the user, considering their profile and the retrieved context)",
          "relevanceScore": "number (A score from 0.0 to 1.0 indicating how relevant this role is, based on skills, interests, and context. Higher is more relevant)",
          "roadmap": "string (A concise, actionable 3-5 step roadmap or key learning areas for this role. Each step should be a phrase or short sentence. Use newline characters '\\n' to separate steps if appropriate for clarity in plain text. Example: '1. Master Python and SQL.\\n2. Learn data visualization tools like Tableau.\\n3. Build portfolio projects with real datasets.')",
          "estimatedPayBracket": "string (Options: 'Entry-Level', 'Average', 'Above Average', 'High', 'Varies Widely')",
          "marketDemand": "string (Options: 'Niche', 'Stable', 'Medium', 'High', 'Very High')",
          "learningEffort": "string (Options: 'Low', 'Medium', 'High', 'Intensive')"
        }
      ],
      "keyConsiderations": "string (A paragraph of key considerations for the user based on their profile and suggested paths, incorporating insights from retrieved context if applicable. Max 200 words.)",
      "generalAdvice": "string (A paragraph of general career advice, potentially drawing from the broader themes in the retrieved context or user's general situation. Max 200 words.)"
    }

    Generate 3 to 5 diverse suggestedRoles. Ensure the roadmap is practical and high-level for each role.
    Focus on aligning suggestions with the user's skills, interests, and the provided expert context for enhanced relevance.
    Provide ONLY the JSON object.
  `;
};

// Function to construct the user message for Llama 3 for timetable generation
const generateLlamaTimetableUserMessage = (jobTitle: string, jobDescription: string, roadmap: string, userTimeframe: string): string => {
  const timetableInputContext = { title: jobTitle, description: jobDescription, roadmap, timeframe: userTimeframe };
  const retrievedTimetableContext = retrieveRelevantContext(timetableInputContext, TIMETABLE_RESOURCES_KB, 2);

  // IMPORTANT: Instruct Llama to ONLY output JSON.
  return `
    Job Title: ${jobTitle}
    Job Description: ${jobDescription}
    Roadmap: ${roadmap}
    User's Desired Timeframe for Learning: ${userTimeframe}

    Here is some potentially relevant expert context on learning and resources:
    """
    ${retrievedTimetableContext}
    """

    Based on this job information, roadmap, user's timeframe, AND the provided expert context, create a structured, personalized learning timetable.
    Output ONLY the JSON object and nothing else. Do not add any explanatory text before or after the JSON.

    ULTRA-CRITICAL INSTRUCTION: The TOTAL DURATION of the generated timetable (sum of all phase durations and week coverages) MUST STRICTLY AND EXACTLY match the user's timeframe conversion below. This is the MOST IMPORTANT rule.
    - "1 month" means the plan MUST cover EXACTLY 4 weeks in total.
    - "2 months" means the plan MUST cover EXACTLY 8 weeks in total.
    - "3 months" means the plan MUST cover EXACTLY 12 weeks in total.
    - "4 months" means the plan MUST cover EXACTLY 16-17 weeks in total (typically four 4-week phases, totaling 16 weeks).
    - "6 months" means the plan MUST cover approximately 24-26 weeks in total.
    - "1 year" means the plan MUST cover approximately 52 weeks in total.
    - For other durations (e.g., "dedicated", "few weeks"), make a reasonable interpretation aiming for conciseness unless a long duration is clearly implied by the user, and state the assumed total weeks in the introductoryNote.
    If the provided roadmap seems too extensive for the requested timeframe, you MUST simplify the roadmap, reduce tasks per week, or consolidate topics. DO NOT extend the total number of weeks beyond the user's explicit request based on these conversions.

    CONSISTENCY MANDATE: The 'title' (e.g., 'Personalized 8-Week Learning Plan...') and the 'introductoryNote' MUST accurately reflect the total number of weeks detailed in the 'phases' and 'weeks' structure. The textual descriptions MUST match the structured plan's actual, calculated total duration.

    The JSON structure should be:
    {
      "title": "string (e.g., 'Personalized 8-Week Learning Plan for Aspiring UX Designer' - MUST match total weeks)",
      "introductoryNote": "string (A brief motivational note, max 100 words. MUST state the user's timeframe and its equivalent in total weeks, e.g., 'Over the next 8 weeks (2 months)...' This total must match the plan's structure.)",
      "phases": [
        {
          "phaseTitle": "string (e.g., 'Phase 1: Foundations & Core Concepts')",
          "phaseDuration": "string (e.g., '4 Weeks', 'Weeks 5-8', 'Weeks 1-2' - sum of these across phases must lead to total plan duration)",
          "summary": "string (A brief summary of what this phase covers)",
          "weeks": [
            {
              "weekRange": "string (e.g., 'Week 1-2', 'Week 3', 'Week 1' - individual week ranges must sum up to phaseDuration, and all phaseDurations must sum to the TOTAL plan duration)",
              "focusArea": "string (e.g., 'Understanding UX Principles', 'Mastering Figma Basics')",
              "tasks": [
                {
                  "taskDescription": "string (A specific, actionable task, e.g., 'Complete online course on UX fundamentals')",
                  "skillsToFocus": ["string", "string"],
                  "suggestedResources": [
                    {
                      "type": "string (e.g., 'Online Course', 'Book', 'Tutorial', 'Project', 'Community')",
                      "details": "string (e.g., 'Coursera: Google UX Design Certificate - Course 1', 'Book: \\"Don't Make Me Think\\" by Steve Krug')"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "generalTips": ["string", "string"]
    }

    Strictly adapt the number of phases and the duration of weeks so that the total plan duration accurately reflects the user's specified timeframe (e.g., '2 months' means the entire plan covers 8 weeks, '4 months' means 16-17 weeks).
    The 'phaseDuration' and 'weekRange' fields MUST accurately reflect the breakdown within the total duration.
    For shorter timeframes (e.g., 1-2 months), keep the number of tasks per week concise. For longer timeframes, more detail can be provided.
    Ensure tasks are actionable and resources are practical.
    Provide ONLY the JSON object.
  `;
};

// Central API call function
async function callLlamaAPI<T>(
  prompt: string,
  onChunk?: (chunk: string, isDone: boolean) => void
): Promise<T> {
  if (!LLAMA_API_ENDPOINT) {
    throw new Error("LLAMA_API_ENDPOINT is not defined. Please set it in your .env file.");
  }

  let fullResponseAccumulator = "";

  try {
    const response = await fetch(LLAMA_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME, 
        prompt: prompt,
        format: "json", 
        stream: true,   
        options: {
            temperature: 0.15, // Slightly reduced for more deterministic output given strict constraints
            num_predict: -1, 
            top_k: 10,       
            top_p: 0.5,      
            // num_ctx: 4096, 
        }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Ollama API request failed with status ${response.status}: ${errorBody}`);
    }

    if (!response.body) {
      throw new Error("Response body is null.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let doneReadingStream = false;

    while (!doneReadingStream) {
      const { value, done } = await reader.read();
      doneReadingStream = done;
      if (value) {
        const chunkString = decoder.decode(value, { stream: !doneReadingStream });
        const lines = chunkString.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            try {
                const parsedChunk = JSON.parse(line);
                if (parsedChunk.response) {
                    fullResponseAccumulator += parsedChunk.response;
                    if (onChunk) {
                        onChunk(parsedChunk.response, parsedChunk.done || false); 
                    }
                }
                if (parsedChunk.done && doneReadingStream) {
                     // True end of Ollama's generation for this request.
                }
            } catch (e) {
                console.warn("Could not parse a streamed line as JSON, accumulating raw:", line);
                fullResponseAccumulator += line; 
                 if (onChunk) {
                    onChunk(line, false); 
                }
            }
        }
      }
    }
    
    if (onChunk) {
        onChunk("", true); 
    }

    let jsonStringToParse = fullResponseAccumulator.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStringToParse.match(fenceRegex);
    if (match && match[1]) {
        jsonStringToParse = match[1].trim();
    }
    
    try {
        return JSON.parse(jsonStringToParse) as T;
    } catch (e) {
        console.error("Failed to parse final accumulated JSON from Llama 3:", e);
        console.error("Accumulated response was:", fullResponseAccumulator); 
        throw new Error(`Failed to parse the final JSON response from the AI. The AI's response might not have been valid JSON. Accumulated response (first 500 chars): ${fullResponseAccumulator.substring(0,500)}...`);
    }

  } catch (error) {
    console.error("Error calling Llama API:", error);
    if (onChunk) onChunk("", true); 
    throw error;
  }
}

export const generateCareerAdvice = (
  userInput: UserInput,
  onChunk: (chunk: string, isDone: boolean) => void
): Promise<CareerAdvisorResponse> => {
  const prompt = generateLlamaCareerAdviceUserMessage(userInput);
  return callLlamaAPI<CareerAdvisorResponse>(prompt, onChunk);
};

export const generateTimetable = (
  jobTitle: string,
  jobDescription: string,
  roadmap: string,
  userTimeframe: string,
  onChunk: (chunk: string, isDone: boolean) => void
): Promise<StructuredTimetable> => {
  const prompt = generateLlamaTimetableUserMessage(jobTitle, jobDescription, roadmap, userTimeframe);
  return callLlamaAPI<StructuredTimetable>(prompt, onChunk);
};
