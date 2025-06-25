// data/interests.ts
import type { InterestCategory, InterestItem } from '../types';

const allInterests: InterestItem[] = [
  // Technology & Computing
  { id: 'i_tech_general', name: 'Technology (General)', category: 'Technology & Digital Innovation' },
  { id: 'i_ai_ml', name: 'Artificial Intelligence & Machine Learning', category: 'Technology & Digital Innovation' },
  { id: 'i_software_dev_eng', name: 'Software Development & Engineering', category: 'Technology & Digital Innovation' },
  { id: 'i_web_dev_fullstack', name: 'Web Development (Frontend & Backend)', category: 'Technology & Digital Innovation' },
  { id: 'i_data_science_analytics', name: 'Data Science, Analytics & Big Data', category: 'Technology & Digital Innovation' },
  { id: 'i_cloud_devops', name: 'Cloud Computing & DevOps', category: 'Technology & Digital Innovation' },
  { id: 'i_cybersecurity_privacy', name: 'Cybersecurity, Privacy & Ethical Hacking', category: 'Technology & Digital Innovation' },
  { id: 'i_mobile_app_dev', name: 'Mobile Application Development', category: 'Technology & Digital Innovation' },
  { id: 'i_game_dev_design', name: 'Game Development & Interactive Design', category: 'Technology & Digital Innovation' },
  { id: 'i_iot_embedded', name: 'Internet of Things (IoT) & Embedded Systems', category: 'Technology & Digital Innovation' },
  { id: 'i_robotics_automation', name: 'Robotics & Automation', category: 'Technology & Digital Innovation' },
  { id: 'i_blockchain_web3', name: 'Blockchain, Crypto & Web3', category: 'Technology & Digital Innovation' },
  { id: 'i_ar_vr_xr', name: 'AR/VR/XR & Metaverse Technologies', category: 'Technology & Digital Innovation' },
  { id: 'i_open_source_contribution', name: 'Open Source Software & Contribution', category: 'Technology & Digital Innovation' },
  { id: 'i_tech_ethics_governance', name: 'Technology Ethics & Digital Governance', category: 'Technology & Digital Innovation' },
  { id: 'i_quantum_computing_future_tech', name: 'Quantum Computing & Future Technologies', category: 'Technology & Digital Innovation' },
  { id: 'i_human_computer_interaction', name: 'Human-Computer Interaction (HCI)', category: 'Technology & Digital Innovation'},

  // Creative Arts & Design
  { id: 'i_design_visual_communication', name: 'Visual Communication & Design (General)', category: 'Arts, Design & Culture' },
  { id: 'i_graphic_design_illustration', name: 'Graphic Design & Illustration', category: 'Arts, Design & Culture' },
  { id: 'i_ui_ux_product_design', name: 'UI/UX & Product Design', category: 'Arts, Design & Culture' },
  { id: 'i_photography_videography', name: 'Photography & Videography', category: 'Arts, Design & Culture' },
  { id: 'i_animation_motion_graphics_vfx', name: 'Animation, Motion Graphics & VFX', category: 'Arts, Design & Culture' },
  { id: 'i_creative_writing_storytelling_lit', name: 'Creative Writing, Storytelling & Literature', category: 'Arts, Design & Culture' },
  { id: 'i_music_performance_production', name: 'Music Performance, Production & Composition', category: 'Arts, Design & Culture' },
  { id: 'i_performing_arts_theatre_dance', name: 'Performing Arts (Theatre, Dance, Opera)', category: 'Arts, Design & Culture' },
  { id: 'i_fashion_textile_design', name: 'Fashion & Textile Design', category: 'Arts, Design & Culture' },
  { id: 'i_architecture_interior_design', name: 'Architecture & Interior Design', category: 'Arts, Design & Culture' },
  { id: 'i_fine_arts_painting_sculpture', name: 'Fine Arts (Painting, Sculpture, Ceramics)', category: 'Arts, Design & Culture' },
  { id: 'i_film_making_cinema', name: 'Film Making & Cinema Studies', category: 'Arts, Design & Culture' },
  { id: 'i_industrial_object_design', name: 'Industrial & Object Design', category: 'Arts, Design & Culture' },
  { id: 'i_museum_gallery_curation', name: 'Museum, Gallery Curation & Cultural Heritage', category: 'Arts, Design & Culture' },
  { id: 'i_digital_art_nft', name: 'Digital Art & NFTs', category: 'Arts, Design & Culture' },

  // Business & Entrepreneurship
  { id: 'i_biz_mgmt_strategy', name: 'Business Management & Strategy', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_entrepreneurship_startups_innovation', name: 'Entrepreneurship, Startups & Innovation', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_marketing_advertising_pr', name: 'Marketing, Advertising & Public Relations', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_finance_investment_economics', name: 'Finance, Investment & Economics', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_product_project_mgmt', name: 'Product & Project Management', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_ecommerce_digital_biz', name: 'E-commerce & Digital Business', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_consulting_advisory', name: 'Business Consulting & Advisory', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_hr_talent_development', name: 'Human Resources & Talent Development', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_real_estate_property_mgmt', name: 'Real Estate & Property Management', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_non_profit_social_enterprise', name: 'Non-Profit Management & Social Enterprise', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_international_global_biz', name: 'International Business & Global Trade', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_supply_chain_logistics', name: 'Supply Chain Management & Logistics', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_sales_biz_dev', name: 'Sales & Business Development', category: 'Business, Finance & Entrepreneurship' },
  { id: 'i_accounting_auditing', name: 'Accounting & Auditing', category: 'Business, Finance & Entrepreneurship'},

  // Science & Research
  { id: 'i_science_research_general', name: 'Scientific Research (General)', category: 'Science, Research & Academia' },
  { id: 'i_physics_astronomy_cosmology', name: 'Physics, Astronomy & Cosmology', category: 'Science, Research & Academia' },
  { id: 'i_chemistry_material_science', name: 'Chemistry & Material Science', category: 'Science, Research & Academia' },
  { id: 'i_biology_genetics_biotech', name: 'Biology, Genetics & Biotechnology', category: 'Science, Research & Academia' },
  { id: 'i_neuroscience_cognitive_psychology', name: 'Neuroscience & Cognitive Psychology', category: 'Science, Research & Academia' },
  { id: 'i_environmental_science_sustainability_climate', name: 'Environmental Science, Sustainability & Climate Change', category: 'Science, Research & Academia' },
  { id: 'i_mathematics_statistics_modeling', name: 'Mathematics, Statistics & Mathematical Modeling', category: 'Science, Research & Academia' },
  { id: 'i_medical_health_research', name: 'Medical & Health Sciences Research', category: 'Science, Research & Academia' },
  { id: 'i_space_exploration_aerospace_eng', name: 'Space Exploration & Aerospace Engineering', category: 'Science, Research & Academia' },
  { id: 'i_geology_earth_ocean_sciences', name: 'Geology, Earth & Ocean Sciences', category: 'Science, Research & Academia' },
  { id: 'i_archaeology_paleontology', name: 'Archaeology & Paleontology', category: 'Science, Research & Academia' },
  { id: 'i_pharmaceutical_research', name: 'Pharmaceutical Research & Development', category: 'Science, Research & Academia'},

  // Health, Wellness & Sports
  { id: 'i_health_wellness_lifestyle', name: 'Health & Wellness Lifestyle (General)', category: 'Health, Wellness & Fitness' },
  { id: 'i_fitness_personal_training_sports_sci', name: 'Fitness, Personal Training & Sports Science', category: 'Health, Wellness & Fitness' },
  { id: 'i_nutrition_dietetics_culinary_health', name: 'Nutrition, Dietetics & Culinary Health', category: 'Health, Wellness & Fitness' },
  { id: 'i_mental_health_psychology_counseling', name: 'Mental Health, Psychology & Counseling', category: 'Health, Wellness & Fitness' },
  { id: 'i_sports_coaching_athletics', name: 'Sports Coaching & Athletics', category: 'Health, Wellness & Fitness' },
  { id: 'i_medicine_healthcare_practice', name: 'Medicine & Healthcare Practice (Clinical)', category: 'Health, Wellness & Fitness' },
  { id: 'i_physical_therapy_rehabilitation', name: 'Physical Therapy & Rehabilitation', category: 'Health, Wellness & Fitness' },
  { id: 'i_alternative_complementary_medicine', name: 'Alternative & Complementary Medicine', category: 'Health, Wellness & Fitness' },
  { id: 'i_public_health_epidemiology', name: 'Public Health & Epidemiology', category: 'Health, Wellness & Fitness' },
  { id: 'i_yoga_meditation_mindfulness', name: 'Yoga, Meditation & Mindfulness Practices', category: 'Health, Wellness & Fitness' },
  { id: 'i_veterinary_medicine_animal_welfare', name: 'Veterinary Medicine & Animal Welfare', category: 'Health, Wellness & Fitness'},
  { id: 'i_dental_hygiene_oral_health', name: 'Dental Hygiene & Oral Health', category: 'Health, Wellness & Fitness'},


  // Education & Academia
  { id: 'i_education_teaching_pedagogy', name: 'Education, Teaching & Pedagogy', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_academic_research_higher_ed', name: 'Academic Research & Higher Education', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_elearning_instructional_design_edtech', name: 'E-learning, Instructional Design & EdTech', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_linguistics_languages_translation', name: 'Linguistics, Languages & Translation', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_history_anthropology_sociology', name: 'History, Anthropology & Sociology', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_philosophy_ethics_critical_thinking', name: 'Philosophy, Ethics & Critical Thinking', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_library_information_science', name: 'Library & Information Science', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_early_childhood_education', name: 'Early Childhood Education', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_special_education', name: 'Special Education & Inclusive Learning', category: 'Education, Social Sciences & Humanities' },
  { id: 'i_political_science_governance', name: 'Political Science & Governance', category: 'Education, Social Sciences & Humanities'},
  { id: 'i_geography_cultural_studies', name: 'Geography & Cultural Studies', category: 'Education, Social Sciences & Humanities'},


  // Communication, Media & Writing
  { id: 'i_journalism_investigative_reporting', name: 'Journalism & Investigative Reporting', category: 'Communication, Media & Writing' },
  { id: 'i_social_media_digital_communication', name: 'Social Media & Digital Communication', category: 'Communication, Media & Writing' },
  { id: 'i_content_creation_blogging_vlogging', name: 'Content Creation (Blogging, Vlogging, Podcasting)', category: 'Communication, Media & Writing' },
  { id: 'i_public_relations_corporate_comm', name: 'Public Relations & Corporate Communications', category: 'Communication, Media & Writing' },
  { id: 'i_publishing_editing_technical_writing', name: 'Publishing, Editing & Technical Writing', category: 'Communication, Media & Writing' },
  { id: 'i_broadcasting_radio_tv_film', name: 'Broadcasting (Radio, TV, Film Production)', category: 'Communication, Media & Writing' },
  { id: 'i_scriptwriting_screenwriting_media', name: 'Scriptwriting & Screenwriting', category: 'Communication, Media & Writing' },

  // Lifestyle, Hobbies & Culture
  { id: 'i_travel_exploration_adventure', name: 'Travel, Exploration & Adventure', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_food_culinary_arts_gastronomy', name: 'Food, Cooking & Gastronomy', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_gaming_esports_tabletop', name: 'Gaming (Video, eSports, Tabletop)', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_reading_books_literature_genres', name: 'Reading (Books, Literature, Specific Genres)', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_movies_tv_series_cinema_history', name: 'Movies, TV Series & Cinema History', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_music_genres_concerts_festivals', name: 'Music (Various Genres, Concerts, Festivals)', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_collecting_antiques_memorabilia', name: 'Collecting (Antiques, Memorabilia, etc.)', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_diy_crafts_home_improvement', name: 'DIY, Crafts & Home Improvement', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_gardening_horticulture_botany', name: 'Gardening, Horticulture & Botany', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_volunteering_community_service_activism', name: 'Volunteering, Community Service & Activism', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_current_events_politics_social_issues', name: 'Current Events, Politics & Social Issues', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_automotive_cars_motorcycles_mechanics', name: 'Automotive (Cars, Motorcycles, Mechanics)', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_animals_pets_wildlife_conservation', name: 'Animals, Pets & Wildlife Conservation', category: 'Lifestyle, Hobbies & Recreation' },
  { id: 'i_astrology_spirituality_mythology', name: 'Astrology, Spirituality & Mythology', category: 'Lifestyle, Hobbies & Recreation'},

  // Trades, Manufacturing & Logistics
  { id: 'i_construction_carpentry_woodworking', name: 'Construction, Carpentry & Woodworking', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_electrical_work_electronics_repair', name: 'Electrical Work & Electronics Repair', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_plumbing_hvac_refrigeration', name: 'Plumbing, HVAC & Refrigeration', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_automotive_repair_customization', name: 'Automotive Repair & Customization', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_welding_metal_fabrication_machining', name: 'Welding, Metal Fabrication & Machining', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_culinary_arts_professional_cooking_baking', name: 'Culinary Arts (Professional Cooking & Baking)', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_aviation_piloting_aircraft_maintenance', name: 'Aviation, Piloting & Aircraft Maintenance', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_maritime_shipping_sailing_boating', name: 'Maritime, Shipping, Sailing & Boating', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_heavy_equipment_operation_logistics', name: 'Heavy Equipment Operation & Logistics', category: 'Trades, Manufacturing & Logistics' },
  { id: 'i_manufacturing_process_improvement', name: 'Manufacturing Processes & Improvement', category: 'Trades, Manufacturing & Logistics'},

  // Public Service & Law
  { id: 'i_public_service_administration', name: 'Public Service & Administration', category: 'Public Service, Law & Governance' },
  { id: 'i_law_legal_practice_justice', name: 'Law, Legal Practice & Justice System', category: 'Public Service, Law & Governance' },
  { id: 'i_public_safety_emergency_services_firefighting_law_enforcement', name: 'Public Safety & Emergency Services (Firefighting, Law Enforcement)', category: 'Public Service, Law & Governance' },
  { id: 'i_urban_planning_community_dev', name: 'Urban Planning & Community Development', category: 'Public Service, Law & Governance' },
  { id: 'i_international_relations_diplomacy_policy', name: 'International Relations, Diplomacy & Policy Making', category: 'Public Service, Law & Governance' },
];

const interestCategoryOrder = [
    'Technology & Digital Innovation',
    'Arts, Design & Culture',
    'Business, Finance & Entrepreneurship',
    'Science, Research & Academia',
    'Health, Wellness & Fitness',
    'Education, Social Sciences & Humanities',
    'Communication, Media & Writing',
    'Lifestyle, Hobbies & Recreation',
    'Trades, Manufacturing & Logistics',
    'Public Service, Law & Governance',
];

const uniqueInterestCategories = Array.from(new Set(allInterests.map(interest => interest.category)));

interestCategoryOrder.forEach(catName => {
    if(!uniqueInterestCategories.includes(catName)){
        // This case should ideally not happen if allInterests is comprehensive
    }
});
uniqueInterestCategories.forEach(catName => {
    if(!interestCategoryOrder.includes(catName)){
        interestCategoryOrder.push(catName); 
    }
});

export const INTEREST_CATEGORIES: InterestCategory[] = interestCategoryOrder
  .filter(categoryName => uniqueInterestCategories.includes(categoryName))
  .map((categoryName, index) => ({
    id: `icat${index + 1}`,
    name: categoryName,
    items: allInterests.filter(interest => interest.category === categoryName)
}));