// data/skills.ts
import type { SkillCategory, SkillItem } from '../types';

// Define color themes for categories based on screenshots
const categoryColorThemes: Record<string, { activeClass: string; inactiveClass: string; textClass?: string;}> = {
  'Technical Skills': { activeClass: 'bg-purple-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-purple-500 dark:text-purple-400' },
  'Soft Skills': { activeClass: 'bg-yellow-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-yellow-500 dark:text-yellow-400' },
  'Business & Management Skills': { activeClass: 'bg-sky-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-sky-500 dark:text-sky-400' },
  'Creative & Design Skills': { activeClass: 'bg-green-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-green-500 dark:text-green-400' },
  'Languages': { activeClass: 'bg-pink-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-pink-500 dark:text-pink-400' },
  'Scientific & Academic Skills': { activeClass: 'bg-orange-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-orange-500 dark:text-orange-400' },
  'User Defined': { activeClass: 'bg-slate-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-slate-500 dark:text-slate-400' },
   // Default for categories not explicitly themed (though all primary ones should be)
  'Default': { activeClass: 'bg-indigo-500 text-white', inactiveClass: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600', textClass: 'text-indigo-500 dark:text-indigo-400'}
};


const allSkills: SkillItem[] = [
  // Foundational & Core Tech Skills (Remain relevant across many fields)
  { id: 's_prog_logic', name: 'Programming Logic & Problem Solving', category: 'Foundational Tech & Digital Literacy' },
  { id: 's_data_analysis_basic', name: 'Basic Data Analysis & Interpretation', category: 'Foundational Tech & Digital Literacy' },
  { id: 's_git', name: 'Version Control (e.g., Git)', category: 'Foundational Tech & Digital Literacy' },
  { id: 's_cli', name: 'Command Line Interface (CLI/Terminal)', category: 'Foundational Tech & Digital Literacy' },
  { id: 's_agile', name: 'Agile/Lean Methodologies', category: 'Project Management & Operational Excellence' },
  { id: 's_comm_technical', name: 'Technical Communication & Documentation', category: 'Communication & Interpersonal Skills' },
  { id: 's_crit_think', name: 'Critical Thinking & Analytical Reasoning', category: 'Cognitive Skills' },
  { id: 's_collab', name: 'Teamwork & Collaboration', category: 'Communication & Interpersonal Skills' },
  { id: 's_project_mgmt_basics', name: 'Project Management Fundamentals', category: 'Project Management & Operational Excellence' },
  { id: 's_digital_literacy', name: 'Digital Literacy (Office Suites, Online Tools)', category: 'Foundational Tech & Digital Literacy' },
  { id: 's_research_skills', name: 'Research & Information Gathering', category: 'Cognitive Skills' },

  // Technical Skills (as per screenshot) - this will be the new name for the "Software & Web Development" and related tech categories.
  // We'll map existing skills to these broader display categories.
  { id: 's_python', name: 'Python', category: 'Technical Skills' },
  { id: 's_javascript', name: 'JavaScript', category: 'Technical Skills' },
  { id: 's_typescript', name: 'TypeScript', category: 'Technical Skills' },
  { id: 's_java', name: 'Java', category: 'Technical Skills' },
  { id: 's_csharp', name: 'C# (.NET)', category: 'Technical Skills' },
  { id: 's_go', name: 'Go (Golang)', category: 'Technical Skills' },
  { id: 's_rust', name: 'Rust', category: 'Technical Skills' },
  { id: 's_kotlin', name: 'Kotlin', category: 'Technical Skills' },
  { id: 's_swift', name: 'Swift', category: 'Technical Skills' },
  { id: 's_php', name: 'PHP', category: 'Technical Skills' },
  { id: 's_ruby', name: 'Ruby', category: 'Technical Skills' },
  { id: 's_c_cpp', name: 'C/C++', category: 'Technical Skills' },
  { id: 's_sql', name: 'SQL (PostgreSQL, MySQL, SQL Server)', category: 'Technical Skills' }, // Making it specific
  { id: 's_html_css', name: 'HTML & CSS', category: 'Technical Skills' }, // Combining
  { id: 's_frontend_frameworks', name: 'React.js / React Native', category: 'Technical Skills' }, // Specific example
  { id: 's_angular', name: 'Angular', category: 'Technical Skills' },
  { id: 's_vuejs', name: 'Vue.js', category: 'Technical Skills' },
  { id: 's_backend_nodejs', name: 'Node.js (Express.js, NestJS)', category: 'Technical Skills' },
  { id: 's_backend_django', name: 'Django', category: 'Technical Skills' },
  { id: 's_backend_flask', name: 'Flask', category: 'Technical Skills' },
  { id: 's_backend_spring', name: 'Spring Framework (Java)', category: 'Technical Skills' },
  { id: 's_backend_dotnet_core', name: '.NET Framework / .NET Core (C#)', category: 'Technical Skills' },
  { id: 's_backend_laravel', name: 'Laravel (PHP)', category: 'Technical Skills' },
  { id: 's_nosql_db', name: 'NoSQL Databases (MongoDB, Cassandra, Redis)', category: 'Technical Skills' },
  { id: 's_cloud_aws', name: 'AWS (EC2, S3, Lambda, RDS, etc.)', category: 'Technical Skills' },
  { id: 's_cloud_azure', name: 'Microsoft Azure (VMs, Blob Storage, Functions)', category: 'Technical Skills' },
  { id: 's_cloud_gcp', name: 'Google Cloud Platform (Compute Engine, Cloud Storage)', category: 'Technical Skills' },
  { id: 's_docker_kubernetes', name: 'Docker', category: 'Technical Skills' }, // Separating for screenshot
  { id: 's_kubernetes', name: 'Kubernetes', category: 'Technical Skills' },
  { id: 's_linux_unix_admin', name: 'Linux/Unix System Administration', category: 'Technical Skills' },
  { id: 's_powershell', name: 'PowerShell Scripting', category: 'Technical Skills' },
  { id: 's_bash_shell', name: 'Bash/Shell Scripting', category: 'Technical Skills' },
  { id: 's_api_design', name: 'API Design (REST, GraphQL)', category: 'Technical Skills' },
  { id: 's_ci_cd', name: 'CI/CD & DevOps Practices', category: 'Technical Skills' },
  { id: 's_iac', name: 'Infrastructure as Code (Terraform, Ansible)', category: 'Technical Skills' },
  { id: 's_serverless', name: 'Serverless Computing', category: 'Technical Skills' },
  { id: 's_monitoring_observability', name: 'System Monitoring & Observability', category: 'Technical Skills' },
   // Make sure all Technical Skills from screenshot are covered, add if missing, and assign to 'Technical Skills' category
  { id: 's_scala', name: 'Scala', category: 'Technical Skills' }, // Added from screenshot
  
  // Soft Skills
  { id: 's_communication_verbal_written_listening', name: 'Communication (Verbal, Written, Listening)', category: 'Soft Skills' },
  { id: 's_teamwork_collaboration', name: 'Teamwork & Collaboration', category: 'Soft Skills' },
  { id: 's_problem_solving_analytical_thinking', name: 'Problem Solving & Analytical Thinking', category: 'Soft Skills' },
  { id: 's_critical_thinking', name: 'Critical Thinking', category: 'Soft Skills' },
  { id: 's_creativity_innovation_soft', name: 'Creativity & Innovation', category: 'Soft Skills' }, // Renamed to avoid clash
  { id: 's_adaptability_flexibility', name: 'Adaptability & Flexibility', category: 'Soft Skills' },
  { id: 's_time_management_organization_soft', name: 'Time Management & Organization', category: 'Soft Skills' }, // Renamed
  { id: 's_leadership_mentoring_soft', name: 'Leadership & Mentoring', category: 'Soft Skills' }, // Renamed
  { id: 's_emotional_intelligence_soft', name: 'Emotional Intelligence', category: 'Soft Skills' }, // Renamed
  { id: 's_decision_making', name: 'Decision Making', category: 'Soft Skills' },
  { id: 's_conflict_resolution_negotiation', name: 'Conflict Resolution & Negotiation', category: 'Soft Skills' },


  // Business & Management Skills
  { id: 's_business_analysis_requirements', name: 'Business Analysis & Requirements Gathering', category: 'Business & Management Skills' },
  { id: 's_financial_analysis_modeling_biz', name: 'Financial Analysis & Modeling', category: 'Business & Management Skills' }, // Renamed
  { id: 's_accounting_principles_gaap_ifrs', name: 'Accounting Principles (GAAP/IFRS)', category: 'Business & Management Skills' },
  { id: 's_marketing_strategy_planning', name: 'Marketing Strategy & Planning', category: 'Business & Management Skills' },
  { id: 's_digital_marketing_seo_sem_social', name: 'Digital Marketing (SEO, SEM, Social Media, Content Marketing)', category: 'Business & Management Skills' },
  { id: 's_sales_business_development', name: 'Sales & Business Development', category: 'Business & Management Skills' },
  { id: 's_project_management_agile_waterfall', name: 'Project Management (Agile, Waterfall)', category: 'Business & Management Skills' }, // Making specific
  { id: 's_operations_management_logistics', name: 'Operations Management & Logistics', category: 'Business & Management Skills' },
  { id: 's_supply_chain_management_biz', name: 'Supply Chain Management', category: 'Business & Management Skills' }, // Renamed
  { id: 's_hr_management_talent_acquisition', name: 'HR Management & Talent Acquisition', category: 'Business & Management Skills' },
  { id: 's_business_strategy_biz', name: 'Business Strategy & Development', category: 'Business & Management Skills' }, // Renamed
  { id: 's_product_management_lifecycle_biz', name: 'Product Management Lifecycle', category: 'Business & Management Skills' }, // Renamed

  // Creative & Design Skills
  { id: 's_content_creation_writing_video_audio', name: 'Content Creation (Writing, Video, Audio)', category: 'Creative & Design Skills' },
  { id: 's_copywriting_editing_creative', name: 'Copywriting & Editing', category: 'Creative & Design Skills' }, // Renamed
  { id: 's_storytelling_creative', name: 'Storytelling', category: 'Creative & Design Skills' }, // Renamed
  { id: 's_graphic_design_illustrator_photoshop', name: 'Graphic Design (Illustrator, Photoshop)', category: 'Creative & Design Skills' }, // Making specific
  { id: 's_ui_ux_design_figma_xd_sketch', name: 'UI/UX Design (Figma, Adobe XD, Sketch)', category: 'Creative & Design Skills' }, // Making specific
  { id: 's_video_editing_premiere_final_cut', name: 'Video Editing (Adobe Premiere Pro, Final Cut Pro)', category: 'Creative & Design Skills' },
  { id: 's_photography_photo_editing_lightroom', name: 'Photography & Photo Editing (Lightroom, Photoshop)', category: 'Creative & Design Skills' },
  { id: 's_illustration_digital_traditional', name: 'Illustration (Digital & Traditional)', category: 'Creative & Design Skills' },
  { id: 's_2d_animation', name: '2D Animation', category: 'Creative & Design Skills' },
  { id: 's_3d_modeling_animation_blender_maya', name: '3D Modeling & Animation (Blender, Maya)', category: 'Creative & Design Skills' },
  { id: 's_music_production_sound_design_daws', name: 'Music Production & Sound Design (DAWs like Ableton, Logic Pro)', category: 'Creative & Design Skills' },
  
  // Languages (as per screenshot)
  { id: 's_english_fluent_native', name: 'English (Fluent/Native)', category: 'Languages' },
  { id: 's_spanish', name: 'Spanish', category: 'Languages' },
  { id: 's_french', name: 'French', category: 'Languages' },
  { id: 's_german', name: 'German', category: 'Languages' },
  { id: 's_mandarin_chinese', name: 'Mandarin Chinese', category: 'Languages' },
  { id: 's_japanese', name: 'Japanese', category: 'Languages' },
  { id: 's_korean', name: 'Korean', category: 'Languages' },
  { id: 's_arabic', name: 'Arabic', category: 'Languages' },
  { id: 's_portuguese', name: 'Portuguese', category: 'Languages' },
  { id: 's_russian', name: 'Russian', category: 'Languages' },
  { id: 's_hindi', name: 'Hindi', category: 'Languages' },
  { id: 's_italian', name: 'Italian', category: 'Languages' },
  { id: 's_dutch', name: 'Dutch', category: 'Languages' },
  { id: 's_american_sign_language', name: 'American Sign Language (ASL)', category: 'Languages' },
  { id: 's_other_language_proficiency', name: 'Other Language Proficiency', category: 'Languages' },

  // Scientific & Academic Skills
  { id: 's_laboratory_techniques_pcr_microscopy', name: 'Laboratory Techniques (e.g., PCR, Western Blot, Microscopy)', category: 'Scientific & Academic Skills' },
  { id: 's_scientific_writing_publishing', name: 'Scientific Writing & Publishing', category: 'Scientific & Academic Skills' },
  { id: 's_grant_writing', name: 'Grant Writing', category: 'Scientific & Academic Skills' },
  { id: 's_statistical_modeling_academic', name: 'Statistical Modeling (e.g., R, SPSS, SAS)', category: 'Scientific & Academic Skills' }, // Renamed
  { id: 's_experimental_design_academic', name: 'Experimental Design', category: 'Scientific & Academic Skills' }, // Renamed
  { id: 's_bioinformatics_genomics_proteomics', name: 'Bioinformatics (Genomics, Proteomics)', category: 'Scientific & Academic Skills' },
  { id: 's_organic_chemistry_synthesis', name: 'Organic Chemistry Synthesis & Characterization', category: 'Scientific & Academic Skills' },
  { id: 's_optics_photonics', name: 'Optics & Photonics', category: 'Scientific & Academic Skills' },
  { id: 's_mathematical_proofs_logic', name: 'Mathematical Proofs & Logic', category: 'Scientific & Academic Skills' },
  { id: 's_teaching_pedagogy_academic', name: 'Teaching & Pedagogy (Higher Education)', category: 'Scientific & Academic Skills' }, // Renamed
  { id: 's_systematic_literature_review', name: 'Systematic Literature Review & Meta-analysis', category: 'Scientific & Academic Skills' },
];

const categoryOrderFromScreenshot = [
    'Technical Skills',
    'Soft Skills',
    'Business & Management Skills',
    'Creative & Design Skills',
    'Languages',
    'Scientific & Academic Skills',
    // These are general categories, will only show if skills are mapped to them or user adds custom skills
    'Foundational Tech & Digital Literacy',
    'Cognitive Skills',
    'Communication & Interpersonal Skills',
    'Project Management & Operational Excellence',
    'Data Management & Analysis',
    'Data Science & Artificial Intelligence',
    'IT Infrastructure & Cloud',
    'Cybersecurity & Information Protection',
    'Medicine & Healthcare',
    'Science, Engineering & Research', 
    'Architecture & Construction',
    'Fitness, Sports & Wellness',
    'Hospitality, Tourism & Events',
    'Legal Services',
    'Arts, Culture & Heritage',
    'Skilled Trades & Manufacturing',
    'Education & Training',
    'Agriculture, Food & Environment',
    'Transportation & Logistics', 
    'Public Service, Governance & Social Impact',
    'User Defined' // Will be added dynamically if custom items are created
];


const uniqueSkillCategories = Array.from(new Set(allSkills.map(skill => skill.category)));

// Ensure categoryOrderFromScreenshot contains all uniqueSkillCategories
uniqueSkillCategories.forEach(catName => {
    if (!categoryOrderFromScreenshot.includes(catName)) {
        categoryOrderFromScreenshot.push(catName);
    }
});


export const SKILL_CATEGORIES: SkillCategory[] = categoryOrderFromScreenshot
  .filter(categoryName => uniqueSkillCategories.includes(categoryName) || categoryName === 'User Defined') 
  .map((categoryName, index) => ({
    id: `scat${index + 1}_${categoryName.toLowerCase().replace(/\s+/g, '_')}`,
    name: categoryName,
    items: allSkills.filter(skill => skill.category === categoryName),
    colorTheme: categoryColorThemes[categoryName] || categoryColorThemes['Default']
  }));

export { allSkills as ALL_SKILLS_DATA_VL }; // Export for App.tsx if needed, maybe with a different name
