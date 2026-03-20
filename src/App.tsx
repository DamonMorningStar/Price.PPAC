/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Globe, 
  ChevronRight, 
  MapPin, 
  GraduationCap, 
  Search, 
  Filter,
  ArrowRight,
  CheckCircle2,
  Info,
  Mail,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  Home,
  Menu,
  Copy
} from 'lucide-react';

// --- Data Definition ---

interface Major {
  name: string;
  enName: string;
  link?: string;
}

interface PriceItem {
  name: string;
  enName?: string;
  price: string;
  note?: string;
  undergradMajors?: Major[];
  masterMajors?: Major[];
}

interface CountryData {
  id: string;
  name: string;
  enName: string;
  flag: string;
  categories: {
    title: string;
    items: PriceItem[];
  }[];
}

const SAMPLE_MAJORS: { undergrad: Major[]; master: Major[] } = {
  undergrad: [
    { name: '计算机科学', enName: 'BSc Computer Science' },
    { name: '数据科学', enName: 'BSc Data Science' },
    { name: '商业分析', enName: 'BBA Business Analytics' },
    { name: '金融学', enName: 'BBA Finance' },
    { name: '经济学', enName: 'BSc Economics' },
    { name: '会计学', enName: 'BBA Accountancy' },
    { name: '市场营销', enName: 'BBA Marketing' },
    { name: '管理学', enName: 'BBA Management' },
    { name: '心理学', enName: 'BSocSc Psychology' },
    { name: '电子工程', enName: 'BEng Electrical Engineering' },
    { name: '机械工程', enName: 'BEng Mechanical Engineering' },
    { name: '土木工程', enName: 'BEng Civil Engineering' },
    { name: '生物医学', enName: 'BSc Biomedical Science' },
    { name: '传媒学', enName: 'BA Media and Communications' },
    { name: '艺术设计', enName: 'BA Art and Design' },
    { name: '法律学', enName: 'Bachelor of Laws (LLB)' },
    { name: '建筑学', enName: 'BA Architecture' },
    { name: '数学', enName: 'BSc Mathematics' },
    { name: '物理学', enName: 'BSc Physics' },
    { name: '化学', enName: 'BSc Chemistry' },
  ],
  master: [
    { name: '人工智能', enName: 'MSc Artificial Intelligence' },
    { name: '数据科学', enName: 'MSc Data Science' },
    { name: '金融工程', enName: 'MSc Financial Engineering' },
    { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)' },
    { name: '商业分析', enName: 'MSc Business Analytics' },
    { name: '金融学', enName: 'MSc Finance' },
    { name: '会计学', enName: 'MSc Accounting' },
    { name: '市场营销', enName: 'MSc Marketing' },
    { name: '经济学', enName: 'MSc Economics' },
    { name: '公共政策', enName: 'Master of Public Policy' },
    { name: '教育学', enName: 'Master of Education' },
    { name: '法律', enName: 'Master of Laws (LLM)' },
    { name: '生物医学', enName: 'MSc Biomedical Science' },
    { name: '建筑学', enName: 'Master of Architecture' },
    { name: '计算机科学', enName: 'MSc Computer Science' },
    { name: '电子工程', enName: 'MSc Electrical Engineering' },
    { name: '机械工程', enName: 'MSc Mechanical Engineering' },
    { name: '土木工程', enName: 'MSc Civil Engineering' },
    { name: '心理学', enName: 'MSocSc Psychology' },
    { name: '社会工作', enName: 'Master of Social Work' },
  ]
};

const PRICE_DATA: CountryData[] = [
  {
    id: 'uk',
    name: '英国',
    enName: 'United Kingdom',
    flag: '🇬🇧',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '牛津大学', 
            enName: 'University of Oxford', 
            price: '¥80,000', 
            undergradMajors: [
              { name: '哲学、政治与经济', enName: 'BA Philosophy, Politics and Economics (PPE)', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/philosophy-politics-and-economics' },
              { name: '历史学', enName: 'BA History', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/history' },
              { name: '英语语言文学', enName: 'BA English Language and Literature', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/english-language-and-literature' },
              { name: '法学', enName: 'BA Law (Jurisprudence)', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/law-jurisprudence' },
              { name: '经济与管理', enName: 'BA Economics and Management', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/economics-and-management' },
              { name: '医学', enName: 'BA Medicine', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/medicine' },
              { name: '计算机科学', enName: 'BA Computer Science', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/computer-science' },
              { name: '数学', enName: 'BA Mathematics', link: 'https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/mathematics' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.sbs.ox.ac.uk/oxford-mba' },
              { name: '计算机科学硕士', enName: 'MSc in Computer Science', link: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-computer-science' },
              { name: '数学金融', enName: 'MSc in Mathematical Finance', link: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-mathematical-finance' },
              { name: '发展经济学', enName: 'MSc in Economics for Development', link: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-economics-development' },
              { name: '全球健康与流行病学', enName: 'MSc in Global Health Science and Epidemiology', link: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-global-health-science-and-epidemiology' },
              { name: '民法学士', enName: 'Bachelor of Civil Law (BCL)', link: 'https://www.ox.ac.uk/admissions/graduate/courses/bachelor-civil-law' },
            ] 
          },
          { 
            name: '剑桥大学', 
            enName: 'University of Cambridge', 
            price: '¥80,000', 
            undergradMajors: [
              { name: '经济学', enName: 'BA Economics', link: 'https://www.undergraduate.study.cam.ac.uk/courses/economics' },
              { name: '工程学', enName: 'BA Engineering', link: 'https://www.undergraduate.study.cam.ac.uk/courses/engineering' },
              { name: '法学', enName: 'BA Law', link: 'https://www.undergraduate.study.cam.ac.uk/courses/law' },
              { name: '医学', enName: 'BA Medicine', link: 'https://www.undergraduate.study.cam.ac.uk/courses/medicine' },
              { name: '自然科学', enName: 'BA Natural Sciences', link: 'https://www.undergraduate.study.cam.ac.uk/courses/natural-sciences' },
              { name: '计算机科学', enName: 'BA Computer Science', link: 'https://www.undergraduate.study.cam.ac.uk/courses/computer-science' },
              { name: '数学', enName: 'BA Mathematics', link: 'https://www.undergraduate.study.cam.ac.uk/courses/mathematics' },
              { name: '建筑学', enName: 'BA Architecture', link: 'https://www.undergraduate.study.cam.ac.uk/courses/architecture' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.jbs.cam.ac.uk/programs/mba/' },
              { name: '经济学硕士', enName: 'MPhil in Economics', link: 'https://www.postgraduate.study.cam.ac.uk/courses/directory/ecepmpmpe' },
              { name: '金融学硕士', enName: 'MPhil in Finance', link: 'https://www.jbs.cam.ac.uk/programs/mphil-finance/' },
              { name: '高级计算机科学', enName: 'MPhil in Advanced Computer Science', link: 'https://www.postgraduate.study.cam.ac.uk/courses/directory/cscsmpacs' },
              { name: '可持续发展工程', enName: 'MPhil in Engineering for Sustainable Development', link: 'https://www.postgraduate.study.cam.ac.uk/courses/directory/egengmpsd' },
              { name: '法学硕士', enName: 'Master of Law (LLM)', link: 'https://www.postgraduate.study.cam.ac.uk/courses/directory/lwlwmlaw' },
            ] 
          },
          { 
            name: '帝国理工学院', 
            enName: 'Imperial College London', 
            price: '¥60,000', 
            undergradMajors: [
              { name: '计算机', enName: 'BEng Computing', link: 'https://www.imperial.ac.uk/study/ug/courses/computing-department/computing-beng/' },
              { name: '电子电气工程', enName: 'BEng Electrical and Electronic Engineering', link: 'https://www.imperial.ac.uk/study/ug/courses/eee-department/electrical-electronic-engineering-beng/' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://www.imperial.ac.uk/study/ug/courses/mechanical-engineering-department/mechanical-engineering-beng/' },
              { name: '土木工程', enName: 'BEng Civil Engineering', link: 'https://www.imperial.ac.uk/study/ug/courses/civil-engineering-department/civil-engineering-beng/' },
              { name: '数学', enName: 'BSc Mathematics', link: 'https://www.imperial.ac.uk/study/ug/courses/mathematics-department/mathematics-bsc/' },
              { name: '物理学', enName: 'BSc Physics', link: 'https://www.imperial.ac.uk/study/ug/courses/physics-department/physics-bsc/' },
              { name: '化学', enName: 'BSc Chemistry', link: 'https://www.imperial.ac.uk/study/ug/courses/chemistry-department/chemistry-bsc/' },
              { name: '医学', enName: 'MBBS Medicine', link: 'https://www.imperial.ac.uk/study/ug/courses/school-of-medicine/medicine/' },
            ], 
            masterMajors: [
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.imperial.ac.uk/business-school/programmes/msc-business-analytics/' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.imperial.ac.uk/business-school/programmes/msc-finance/' },
              { name: '计算机科学', enName: 'MSc Computing', link: 'https://www.imperial.ac.uk/study/pg/computing/computing-msc/' },
              { name: '高级计算', enName: 'MSc Advanced Computing', link: 'https://www.imperial.ac.uk/study/pg/computing/advanced-computing/' },
              { name: '战略营销', enName: 'MSc Strategic Marketing', link: 'https://www.imperial.ac.uk/business-school/programmes/msc-strategic-marketing/' },
              { name: '管理学', enName: 'MSc Management', link: 'https://www.imperial.ac.uk/business-school/programmes/msc-management/' },
              { name: '投资与财富管理', enName: 'MSc Investment and Wealth Management', link: 'https://www.imperial.ac.uk/business-school/programmes/msc-investment-wealth-management/' },
            ] 
          },
          { 
            name: '伦敦政治经济学院', 
            enName: 'London School of Economics (LSE)', 
            price: '¥60,000', 
            undergradMajors: [
              { name: '经济学', enName: 'BSc Economics', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Economics' },
              { name: '金融学', enName: 'BSc Finance', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Finance' },
              { name: '会计与金融', enName: 'BSc Accounting and Finance', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Accounting-and-Finance' },
              { name: '管理学', enName: 'BSc Management', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Management' },
              { name: '国际关系', enName: 'BSc International Relations', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-International-Relations' },
              { name: '政治与经济', enName: 'BSc Politics and Economics', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Politics-and-Economics' },
              { name: '数据科学', enName: 'BSc Data Science', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/BSc-Data-Science' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.lse.ac.uk/study-at-lse/Undergraduate/degree-programmes-2024/Bachelor-of-Laws' },
            ], 
            masterMajors: [
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Finance-Full-time' },
              { name: '经济学', enName: 'MSc Economics', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Economics' },
              { name: '管理学', enName: 'MSc Management', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Management' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Data-Science' },
              { name: '会计与金融', enName: 'MSc Accounting and Finance', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Accounting-and-Finance' },
              { name: '国际关系', enName: 'MSc International Relations', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-International-Relations' },
              { name: '公共政策', enName: 'MSc Public Policy', link: 'https://www.lse.ac.uk/study-at-lse/Graduate/Degree-programmes-2024/MSc-Public-Policy' },
            ] 
          },
          { 
            name: '伦敦大学学院', 
            enName: 'University College London (UCL)', 
            price: '¥50,000', 
            undergradMajors: [
              { name: '建筑学', enName: 'BSc Architecture', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/architecture-bsc' },
              { name: '生物医学', enName: 'BSc Biomedical Sciences', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/biomedical-sciences-bsc' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/computer-science-bsc' },
              { name: '经济学', enName: 'BSc Economics', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/economics-bsc' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/law-llb' },
              { name: '医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/medicine-mbbs' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/psychology-bsc' },
              { name: '统计学', enName: 'BSc Statistics', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/statistics-bsc' },
              { name: '管理学', enName: 'BSc Management Science', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/management-science-bsc' },
              { name: '电子电气工程', enName: 'BEng Electronic and Electrical Engineering', link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/electronic-and-electrical-engineering-beng' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/business-administration-mba' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/business-analytics-msc' },
              { name: '计算机科学', enName: 'MSc Computer Science', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/computer-science-msc' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/data-science-msc' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/finance-msc' },
              { name: '项目与企业管理', enName: 'MSc Project and Enterprise Management', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/project-and-enterprise-management-msc' },
              { name: '教育学', enName: 'MA Education', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/education-ma' },
              { name: '数字媒体', enName: 'MA Digital Media', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/digital-media-ma' },
              { name: '公共政策', enName: 'MSc Public Policy', link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/public-policy-msc' },
            ] 
          },
          { 
            name: '伦敦国王学院', 
            enName: 'King\'s College London (KCL)', 
            price: '¥30,000', 
            undergradMajors: [
              { name: '生物医学', enName: 'BSc Biomedical Science', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/biomedical-science-bsc' },
              { name: '工商管理', enName: 'BSc Business Management', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/business-management-bsc' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/computer-science-bsc' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/law-llb' },
              { name: '医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/medicine-mbbs' },
              { name: '护理学', enName: 'BSc Nursing', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/nursing-with-registration-as-an-adult-nurse-bsc' },
              { name: '哲学、政治与经济', enName: 'BA Philosophy, Politics and Economics (PPE)', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/philosophy-politics-and-economics-ba-bsc' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/psychology-bsc' },
              { name: '数字媒体与文化', enName: 'BA Digital Media and Culture', link: 'https://www.kcl.ac.uk/study/undergraduate/courses/digital-media-and-culture-ba' },
            ], 
            masterMajors: [
              { name: '银行与金融', enName: 'MSc Banking and Finance', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/banking-and-finance-msc' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/data-science-msc' },
              { name: '数字营销', enName: 'MSc Digital Marketing', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/digital-marketing-msc' },
              { name: '国际管理', enName: 'MSc International Management', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/international-management-msc' },
              { name: '法学硕士', enName: 'Master of Laws (LLM)', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/master-of-laws-llm' },
              { name: '公共政策', enName: 'MSc Public Policy', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/public-policy-msc' },
              { name: '战略传播', enName: 'MA Strategic Communications', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/strategic-communications-ma' },
              { name: '人力资源管理', enName: 'MSc Human Resource Management', link: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/human-resource-management-msc' },
            ] 
          },
          { 
            name: '华威大学', 
            enName: 'University of Warwick', 
            price: '¥30,000', 
            undergradMajors: [
              { name: '会计与金融', enName: 'BSc Accounting and Finance', link: 'https://www.wbs.ac.uk/courses/undergraduate/accounting-and-finance/' },
              { name: '管理学', enName: 'BSc Management', link: 'https://www.wbs.ac.uk/courses/undergraduate/management/' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://warwick.ac.uk/fac/sci/dcs/teaching/courses/bsc-cs/' },
              { name: '经济学', enName: 'BSc Economics', link: 'https://warwick.ac.uk/fac/soc/economics/prospective/ug/courses/l100/' },
              { name: '工程学', enName: 'BEng Engineering', link: 'https://warwick.ac.uk/fac/sci/eng/study/undergraduate/degrees/beng/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://warwick.ac.uk/fac/soc/law/applying/undergraduate/' },
              { name: '数学', enName: 'BSc Mathematics', link: 'https://warwick.ac.uk/fac/sci/maths/admissions/ug/courses/' },
              { name: '哲学、政治与经济', enName: 'BA Philosophy, Politics and Economics (PPE)', link: 'https://warwick.ac.uk/fac/soc/ppe/prospective/study/ba-ppe/' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://warwick.ac.uk/fac/sci/psych/study/ug/bscpsych/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.wbs.ac.uk/courses/mba/full-time/' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.wbs.ac.uk/courses/masters/business-analytics/' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.wbs.ac.uk/courses/masters/finance/' },
              { name: '管理学', enName: 'MSc Management', link: 'https://www.wbs.ac.uk/courses/masters/management/' },
              { name: '营销与战略', enName: 'MSc Marketing and Strategy', link: 'https://www.wbs.ac.uk/courses/masters/marketing-and-strategy/' },
              { name: '商业与金融', enName: 'MSc Business and Finance', link: 'https://www.wbs.ac.uk/courses/masters/business-and-finance/' },
              { name: '电子商务管理', enName: 'MSc e-Business Management', link: 'https://warwick.ac.uk/fac/sci/wmg/education/postgraduate/msc-courses/ebm/' },
              { name: '国际贸易、战略与运营', enName: 'MSc International Trade, Strategy and Operations', link: 'https://warwick.ac.uk/fac/sci/wmg/education/postgraduate/msc-courses/itso/' },
            ] 
          },
          { 
            name: '曼彻斯特大学', 
            enName: 'University of Manchester', 
            price: '¥30,000', 
            undergradMajors: [
              { name: '会计与金融', enName: 'BSc Accounting and Finance', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00001/bsc-accounting-and-finance/' },
              { name: '建筑学', enName: 'BA Architecture', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00028/ba-architecture/' },
              { name: '生物科学', enName: 'BSc Biological Sciences', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00438/bsc-biological-sciences/' },
              { name: '商业管理', enName: 'BSc Business Management', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00021/bsc-business-management/' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00560/bsc-computer-science/' },
              { name: '工程学', enName: 'BEng Engineering', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00165/beng-engineering/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00191/llb-law/' },
              { name: '物理学', enName: 'BSc Physics', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00645/bsc-physics/' },
              { name: '经济学', enName: 'BA/BSc Economics', link: 'https://www.manchester.ac.uk/study/undergraduate/courses/2024/00045/ba-econ-economics/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.allianceambs.manchester.ac.uk/study/mba/full-time-mba/' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.allianceambs.manchester.ac.uk/study/masters/msc-business-analytics/' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.allianceambs.manchester.ac.uk/study/masters/msc-finance/' },
              { name: '国际商务与管理', enName: 'MSc International Business and Management', link: 'https://www.allianceambs.manchester.ac.uk/study/masters/msc-international-business-and-management/' },
              { name: '市场营销', enName: 'MSc Marketing', link: 'https://www.allianceambs.manchester.ac.uk/study/masters/msc-marketing/' },
              { name: '人力资源管理', enName: 'MSc Human Resource Management', link: 'https://www.allianceambs.manchester.ac.uk/study/masters/msc-human-resource-management-and-industrial-relations/' },
              { name: '项目管理', enName: 'MSc Project Management', link: 'https://www.manchester.ac.uk/study/masters/courses/list/01004/msc-management-of-projects/' },
              { name: '计算机科学', enName: 'MSc Computer Science', link: 'https://www.manchester.ac.uk/study/masters/courses/list/01016/msc-computer-science/' },
            ] 
          },
          { 
            name: '爱丁堡大学', 
            enName: 'University of Edinburgh', 
            price: '¥30,000', 
            undergradMajors: [
              { name: '建筑学', enName: 'MA Architecture', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=K100' },
              { name: '生物科学', enName: 'BSc Biological Sciences', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=C100' },
              { name: '商业管理', enName: 'MA Business Management', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=N100' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=G400' },
              { name: '经济学', enName: 'MA Economics', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=L100' },
              { name: '工程学', enName: 'BEng Engineering', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=H100' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=M114' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=C800' },
              { name: '艺术', enName: 'MA Art', link: 'https://www.ed.ac.uk/studying/undergraduate/degrees/index.php?action=view&code=W100' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.business-school.ed.ac.uk/mba/full-time' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.business-school.ed.ac.uk/msc/business-analytics' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.business-school.ed.ac.uk/msc/finance' },
              { name: '管理学', enName: 'MSc Management', link: 'https://www.business-school.ed.ac.uk/msc/management' },
              { name: '市场营销', enName: 'MSc Marketing', link: 'https://www.business-school.ed.ac.uk/msc/marketing' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/view&edition=2024&id=902' },
              { name: '人工智能', enName: 'MSc Artificial Intelligence', link: 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/view&edition=2024&id=107' },
              { name: '教育学', enName: 'MSc Education', link: 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/view&edition=2024&id=160' },
            ] 
          },
          { 
            name: '伯明翰大学', 
            enName: 'University of Birmingham', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商业管理', enName: 'BSc Business Management', link: 'https://www.birmingham.ac.uk/undergraduate/courses/business/business-management.aspx' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.birmingham.ac.uk/undergraduate/courses/computer-science/computer-science.aspx' },
              { name: '经济学', enName: 'BSc Economics', link: 'https://www.birmingham.ac.uk/undergraduate/courses/economics/economics.aspx' },
              { name: '电子电气工程', enName: 'BEng Electronic and Electrical Engineering', link: 'https://www.birmingham.ac.uk/undergraduate/courses/eece/electronic-electrical-engineering.aspx' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://www.birmingham.ac.uk/undergraduate/courses/mechanical-engineering/mechanical-engineering.aspx' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.birmingham.ac.uk/undergraduate/courses/law/law.aspx' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.birmingham.ac.uk/undergraduate/courses/psychology/psychology.aspx' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/business/mba.aspx' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/business/business-analytics.aspx' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/business/finance.aspx' },
              { name: '国际商务', enName: 'MSc International Business', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/business/international-business.aspx' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/computer-science/data-science.aspx' },
              { name: '市场营销', enName: 'MSc Marketing', link: 'https://www.birmingham.ac.uk/postgraduate/courses/taught/business/marketing.aspx' },
            ] 
          },
          { 
            name: '格拉斯哥大学', 
            enName: 'University of Glasgow', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商业管理', enName: 'BSc Business Management', link: 'https://www.gla.ac.uk/undergraduate/degrees/businessmanagement/' },
              { name: '计算机科学', enName: 'BSc Computing Science', link: 'https://www.gla.ac.uk/undergraduate/degrees/computingscience/' },
              { name: '经济学', enName: 'MA Economics', link: 'https://www.gla.ac.uk/undergraduate/degrees/economics/' },
              { name: '工程学', enName: 'BEng Engineering', link: 'https://www.gla.ac.uk/undergraduate/degrees/engineering/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.gla.ac.uk/undergraduate/degrees/law/' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.gla.ac.uk/undergraduate/degrees/psychology/' },
              { name: '会计与金融', enName: 'BAcc Accounting and Finance', link: 'https://www.gla.ac.uk/undergraduate/degrees/accountingfinance/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.gla.ac.uk/postgraduate/taught/businessadministrationmba/' },
              { name: '商业分析', enName: 'MSc Business Analytics', link: 'https://www.gla.ac.uk/postgraduate/taught/businessanalytics/' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.gla.ac.uk/postgraduate/taught/financeandmanagement/' },
              { name: '国际商务', enName: 'MSc International Business', link: 'https://www.gla.ac.uk/postgraduate/taught/internationalbusiness/' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.gla.ac.uk/postgraduate/taught/datascience/' },
              { name: '市场营销', enName: 'MSc Marketing', link: 'https://www.gla.ac.uk/postgraduate/taught/marketing/' },
            ] 
          },
          { 
            name: '布里斯托大学', 
            enName: 'University of Bristol', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.bristol.ac.uk/study/undergraduate/2024/computer-science/bsc-computer-science/' },
              { name: '工程学', enName: 'BEng Engineering', link: 'https://www.bristol.ac.uk/engineering/study/undergraduate/' },
              { name: '经济学', enName: 'BSc Economics', link: 'https://www.bristol.ac.uk/study/undergraduate/2024/economics/bsc-economics/' },
              { name: '法学', enName: 'LLB Law', link: 'https://www.bristol.ac.uk/study/undergraduate/2024/law/llb-law/' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://www.bristol.ac.uk/study/undergraduate/2024/psychology/bsc-psychology/' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.bristol.ac.uk/study/postgraduate/2024/eng/msc-data-science/' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://www.bristol.ac.uk/business-school/study/postgraduate/mba/' },
              { name: '金融与投资', enName: 'MSc Finance and Investment', link: 'https://www.bristol.ac.uk/study/postgraduate/2024/ssl/msc-finance-and-investment/' },
            ] 
          },
          { 
            name: '南安普顿大学', 
            enName: 'University of Southampton', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.southampton.ac.uk/courses/computer-science-degree-bsc' },
              { name: '电子工程', enName: 'BEng Electrical Engineering', link: 'https://www.southampton.ac.uk/courses/electrical-electronic-engineering-degree-beng' },
              { name: '海洋学', enName: 'BSc Oceanography', link: 'https://www.southampton.ac.uk/courses/oceanography-degree-bsc' },
              { name: '商业管理', enName: 'BSc Business Management', link: 'https://www.southampton.ac.uk/courses/business-management-degree-bsc' },
            ], 
            masterMajors: [
              { name: '人工智能', enName: 'MSc Artificial Intelligence', link: 'https://www.southampton.ac.uk/courses/artificial-intelligence-masters-msc' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.southampton.ac.uk/courses/data-science-masters-msc' },
              { name: '会计与金融', enName: 'MSc Accounting and Finance', link: 'https://www.southampton.ac.uk/courses/accounting-finance-masters-msc' },
            ] 
          },
          { 
            name: '利兹大学', 
            enName: 'University of Leeds', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商业管理', enName: 'BA Business Management', link: 'https://courses.leeds.ac.uk/g165/business-management-ba' },
              { name: '计算机科学', enName: 'BSc Computing', link: 'https://courses.leeds.ac.uk/i101/computing-bsc' },
              { name: '传媒学', enName: 'BA Media and Communication', link: 'https://courses.leeds.ac.uk/g251/media-and-communication-ba' },
              { name: '法律', enName: 'LLB Law', link: 'https://courses.leeds.ac.uk/g650/law-llb' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'MSc Data Science and Analytics', link: 'https://courses.leeds.ac.uk/g896/data-science-and-analytics-msc' },
              { name: '国际商务', enName: 'MSc International Business', link: 'https://courses.leeds.ac.uk/g183/international-business-msc' },
              { name: '广告与营销', enName: 'MSc Advertising and Marketing', link: 'https://courses.leeds.ac.uk/g180/advertising-and-marketing-msc' },
            ] 
          },
          { 
            name: '杜伦大学', 
            enName: 'Durham University', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '法律', enName: 'LLB Law', link: 'https://www.durham.ac.uk/study/undergraduate/courses/m101/' },
              { name: '商业与管理', enName: 'BA Business and Management', link: 'https://www.durham.ac.uk/study/undergraduate/courses/n102/' },
              { name: '经济学', enName: 'BA Economics', link: 'https://www.durham.ac.uk/study/undergraduate/courses/l100/' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.durham.ac.uk/study/undergraduate/courses/g400/' },
            ], 
            masterMajors: [
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.durham.ac.uk/study/postgraduate/courses/n3k209/' },
              { name: '管理学', enName: 'MSc Management', link: 'https://www.durham.ac.uk/study/postgraduate/courses/n2k109/' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.durham.ac.uk/study/postgraduate/courses/g5k609/' },
            ] 
          },
          { name: '英国其他', enName: 'Other UK Universities', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
        ]
      }
    ]
  },
  {
    id: 'australia',
    name: '澳大利亚',
    enName: 'Australia',
    flag: '🇦🇺',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '墨尔本大学', 
            enName: 'University of Melbourne', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-arts' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-commerce' },
              { name: '设计学', enName: 'Bachelor of Design', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-design' },
              { name: '生物医学', enName: 'Bachelor of Biomedicine', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-biomedicine' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-science' },
              { name: '美术', enName: 'Bachelor of Fine Arts', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-fine-arts' },
              { name: '音乐', enName: 'Bachelor of Music', link: 'https://study.unimelb.edu.au/find-a-course/undergraduate/bachelor-of-music' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-business-administration' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-data-science' },
              { name: '信息系统', enName: 'Master of Information Systems', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-information-systems' },
              { name: '金融学', enName: 'Master of Finance', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-finance' },
              { name: '工程学', enName: 'Master of Engineering', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-engineering-mechanical' },
              { name: '建筑学', enName: 'Master of Architecture', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-architecture' },
              { name: '管理学', enName: 'Master of Management', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-management' },
              { name: '教育学', enName: 'Master of Education', link: 'https://study.unimelb.edu.au/find-a-course/graduate/master-of-education' },
            ] 
          },
          { 
            name: '悉尼大学', 
            enName: 'University of Sydney', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学与社会科学', enName: 'Bachelor of Arts and Social Sciences', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-arts-and-bachelor-of-advanced-studies.html' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-commerce.html' },
              { name: '设计计算', enName: 'Bachelor of Design Computing', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-design-computing.html' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-engineering-honours.html' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-laws.html' },
              { name: '医学士', enName: 'Bachelor of Medicine', link: 'https://www.sydney.edu.au/courses/courses/pc/doctor-of-medicine0.html' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-nursing-advanced-studies.html' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-science.html' },
              { name: '视觉艺术', enName: 'Bachelor of Visual Arts', link: 'https://www.sydney.edu.au/courses/courses/uc/bachelor-of-visual-arts.html' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-business-administration.html' },
              { name: '商学硕士', enName: 'Master of Commerce', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-commerce.html' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-data-science.html' },
              { name: '数字传播与文化', enName: 'Master of Digital Communication and Culture', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-digital-communication-and-culture.html' },
              { name: '项目管理', enName: 'Master of Project Management', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-project-management.html' },
              { name: '物流与供应链管理', enName: 'Master of Logistics and Supply Chain Management', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-logistics-and-supply-chain-management.html' },
              { name: '国际贸易', enName: 'Master of International Business', link: 'https://www.sydney.edu.au/courses/courses/pc/master-of-international-business.html' },
            ] 
          },
          { 
            name: '新南威尔士大学', 
            enName: 'University of New South Wales (UNSW)', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学、设计与建筑', enName: 'Bachelor of Arts, Design & Architecture', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-arts' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-commerce' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-engineering-honours' },
              { name: '法律与司法', enName: 'Bachelor of Law & Justice', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-laws' },
              { name: '医学与健康', enName: 'Bachelor of Medicine & Health', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-medical-studies-doctor-of-medicine' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-science' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-computer-science' },
              { name: '精算学', enName: 'Bachelor of Actuarial Studies', link: 'https://www.unsw.edu.au/study/undergraduate/bachelor-of-actuarial-studies' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-business-administration' },
              { name: '商学硕士', enName: 'Master of Commerce', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-commerce' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-data-science-online' },
              { name: '工程学硕士', enName: 'Master of Engineering', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-engineering' },
              { name: '金融学硕士', enName: 'Master of Finance', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-finance' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-information-technology' },
              { name: '公共关系与广告', enName: 'Master of Public Relations and Advertising', link: 'https://www.unsw.edu.au/study/postgraduate/master-of-public-relations-and-advertising' },
            ] 
          },
          { 
            name: '澳国立大学（普通｜直录）', 
            enName: 'Australian National University (ANU)', 
            price: '¥3000｜¥9.8万', 
            undergradMajors: [
              { name: '文学与社会科学', enName: 'Bachelor of Arts and Social Sciences', link: 'https://programsandcourses.anu.edu.au/program/BARTS' },
              { name: '商业与商务', enName: 'Bachelor of Business and Commerce', link: 'https://programsandcourses.anu.edu.au/program/BBUSS' },
              { name: '工程与计算机科学', enName: 'Bachelor of Engineering and Computer Science', link: 'https://programsandcourses.anu.edu.au/program/AENGC' },
              { name: '法学', enName: 'Bachelor of Laws', link: 'https://programsandcourses.anu.edu.au/program/ALLLB' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://programsandcourses.anu.edu.au/program/BSCI' },
              { name: '国际关系', enName: 'Bachelor of International Relations', link: 'https://programsandcourses.anu.edu.au/program/BINTR' },
              { name: '金融、经济与统计', enName: 'Bachelor of Finance, Economics and Statistics', link: 'https://programsandcourses.anu.edu.au/program/AFEST' },
            ], 
            masterMajors: [
              { name: '计算机硕士', enName: 'Master of Computing', link: 'https://programsandcourses.anu.edu.au/program/MCOMP' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://programsandcourses.anu.edu.au/program/MDASC' },
              { name: '金融学', enName: 'Master of Finance', link: 'https://programsandcourses.anu.edu.au/program/MFIN' },
              { name: '经济学', enName: 'Master of Economics', link: 'https://programsandcourses.anu.edu.au/program/MECON' },
              { name: '公共政策', enName: 'Master of Public Policy', link: 'https://programsandcourses.anu.edu.au/program/MPUPOL' },
              { name: '国际关系', enName: 'Master of International Relations', link: 'https://programsandcourses.anu.edu.au/program/MINTR' },
              { name: '商业信息系统', enName: 'Master of Business Information Systems', link: 'https://programsandcourses.anu.edu.au/program/MBINF' },
            ] 
          },
          { 
            name: '昆士兰大学', 
            enName: 'University of Queensland (UQ)', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://study.uq.edu.au/study-options/programs/bachelor-arts-2000' },
              { name: '商业与商务', enName: 'Bachelor of Business and Commerce', link: 'https://study.uq.edu.au/study-options/programs/bachelor-business-management-2059' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://study.uq.edu.au/study-options/programs/bachelor-engineering-honours-2355' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://study.uq.edu.au/study-options/programs/bachelor-computer-science-2451' },
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://study.uq.edu.au/study-options/programs/bachelor-health-sciences-2252' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://study.uq.edu.au/study-options/programs/bachelor-science-2461' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://study.uq.edu.au/study-options/programs/bachelor-information-technology-2453' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://study.uq.edu.au/study-options/programs/master-business-administration-5001' },
              { name: '计算机科学', enName: 'Master of Computer Science', link: 'https://study.uq.edu.au/study-options/programs/master-computer-science-5522' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://study.uq.edu.au/study-options/programs/master-data-science-5660' },
              { name: '商业分析', enName: 'Master of Business Analytics', link: 'https://study.uq.edu.au/study-options/programs/master-business-analytics-5714' },
              { name: '金融学', enName: 'Master of Finance', link: 'https://study.uq.edu.au/study-options/programs/master-commerce-5161' },
              { name: '管理学', enName: 'Master of Management', link: 'https://study.uq.edu.au/study-options/programs/master-business-5250' },
              { name: '传播学', enName: 'Master of Communication', link: 'https://study.uq.edu.au/study-options/programs/master-communication-5412' },
            ] 
          },
          { 
            name: '莫那什大学', 
            enName: 'Monash University', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.monash.edu/study/courses/find-a-course/arts-a2000' },
              { name: '商业', enName: 'Bachelor of Business', link: 'https://www.monash.edu/study/courses/find-a-course/business-b2000' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.monash.edu/study/courses/find-a-course/commerce-b2001' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.monash.edu/study/courses/find-a-course/computer-science-c2001' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.monash.edu/study/courses/find-a-course/engineering-e3001' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://www.monash.edu/study/courses/find-a-course/information-technology-c2000' },
              { name: '法学', enName: 'Bachelor of Laws', link: 'https://www.monash.edu/study/courses/find-a-course/laws-l3001' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.monash.edu/study/courses/find-a-course/science-s2000' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.monash.edu/study/courses/find-a-course/business-administration-b6016' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.monash.edu/study/courses/find-a-course/data-science-c6004' },
              { name: '商业硕士', enName: 'Master of Business', link: 'https://www.monash.edu/study/courses/find-a-course/business-b6005' },
              { name: '银行与金融', enName: 'Master of Banking and Finance', link: 'https://www.monash.edu/study/courses/find-a-course/banking-and-finance-b6004' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.monash.edu/study/courses/find-a-course/information-technology-c6001' },
              { name: '专业会计', enName: 'Master of Professional Accounting', link: 'https://www.monash.edu/study/courses/find-a-course/professional-accounting-b6011' },
              { name: '教育学', enName: 'Master of Education', link: 'https://www.monash.edu/study/courses/find-a-course/education-d6002' },
            ] 
          },
          { 
            name: '西澳大学', 
            enName: 'University of Western Australia (UWA)', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.uwa.edu.au/study/courses/bachelor-of-arts' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.uwa.edu.au/study/courses/bachelor-of-commerce' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.uwa.edu.au/study/courses/bachelor-of-science' },
              { name: '生物医学', enName: 'Bachelor of Biomedical Science', link: 'https://www.uwa.edu.au/study/courses/bachelor-of-biomedical-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.uwa.edu.au/study/courses/master-of-business-administration' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.uwa.edu.au/study/courses/master-of-data-science' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.uwa.edu.au/study/courses/master-of-information-technology' },
              { name: '工程学', enName: 'Master of Engineering', link: 'https://www.uwa.edu.au/study/courses/master-of-professional-engineering' },
            ] 
          },
          { 
            name: '阿德莱德大学', 
            enName: 'University of Adelaide', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.adelaide.edu.au/degree-finder/bart_ba.html' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.adelaide.edu.au/degree-finder/bcom_bcomm.html' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.adelaide.edu.au/degree-finder/bcomps_bcompsci.html' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.adelaide.edu.au/degree-finder/beng_beng.html' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.adelaide.edu.au/degree-finder/mdasc_mdatasci.html' },
              { name: '计算机科学', enName: 'Master of Computer Science', link: 'https://www.adelaide.edu.au/degree-finder/mcomps_mcompsci.html' },
              { name: '会计与金融', enName: 'Master of Accounting and Finance', link: 'https://www.adelaide.edu.au/degree-finder/macf_maccfin.html' },
            ] 
          },
          { 
            name: '悉尼科技大学', 
            enName: 'University of Technology Sydney', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.uts.edu.au/study/business/undergraduate/bachelor-business' },
              { name: '设计学', enName: 'Bachelor of Design', link: 'https://www.uts.edu.au/study/design-architecture-and-building/undergraduate/bachelor-design' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.uts.edu.au/study/engineering/undergraduate/bachelor-engineering-honours' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://www.uts.edu.au/study/it/undergraduate/bachelor-information-technology' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.uts.edu.au/study/health/undergraduate/bachelor-nursing' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.uts.edu.au/study/business/postgraduate/master-business-administration' },
              { name: '数据科学与创新', enName: 'Master of Data Science and Innovation', link: 'https://www.uts.edu.au/study/it/postgraduate/master-data-science-and-innovation' },
              { name: '商业分析', enName: 'Master of Business Analytics', link: 'https://www.uts.edu.au/study/business/postgraduate/master-business-analytics' },
              { name: '工程管理', enName: 'Master of Engineering Management', link: 'https://www.uts.edu.au/study/engineering/postgraduate/master-engineering-management' },
            ] 
          },
          { 
            name: '麦考瑞大学', 
            enName: 'Macquarie University', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-commerce' },
              { name: '精算学', enName: 'Bachelor of Actuarial Studies', link: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-actuarial-studies' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-information-technology' },
              { name: '媒体与传播', enName: 'Bachelor of Media and Communications', link: 'https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-media-and-communications' },
            ], 
            masterMajors: [
              { name: '应用金融', enName: 'Master of Applied Finance', link: 'https://www.mq.edu.au/study/find-a-course/courses/master-of-applied-finance' },
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.mq.edu.au/study/find-a-course/courses/master-of-business-administration' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.mq.edu.au/study/find-a-course/courses/master-of-data-science' },
              { name: '专业会计', enName: 'Master of Professional Accounting', link: 'https://www.mq.edu.au/study/find-a-course/courses/master-of-professional-accounting' },
            ] 
          },
          { 
            name: '皇家墨尔本理工大学', 
            enName: 'RMIT University', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-business-bp343' },
              { name: '设计（传播设计）', enName: 'Bachelor of Design (Communication Design)', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-communication-design-bp115' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-computer-science-bp094' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-engineering-honours-bp121' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/master-of-business-administration-mc199' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/master-of-data-science-mc267' },
              { name: '设计硕士', enName: 'Master of Design', link: 'https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/master-of-design-mc212' },
            ] 
          },
          { 
            name: '迪肯大学', 
            enName: 'Deakin University', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.deakin.edu.au/course/bachelor-commerce' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.deakin.edu.au/course/bachelor-science' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.deakin.edu.au/course/bachelor-nursing' },
              { name: '运动科学', enName: 'Bachelor of Exercise and Sport Science', link: 'https://www.deakin.edu.au/course/bachelor-exercise-and-sport-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.deakin.edu.au/course/master-business-administration' },
              { name: '商业分析', enName: 'Master of Business Analytics', link: 'https://www.deakin.edu.au/course/master-business-analytics' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.deakin.edu.au/course/master-information-technology' },
            ] 
          },
          { 
            name: '科廷大学', 
            enName: 'Curtin University', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-commerce--b-comm/' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-engineering-honours--b-enghon/' },
              { name: '计算机科学', enName: 'Bachelor of Computing', link: 'https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-computing--b-comp/' },
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://www.curtin.edu.au/study/offering/course-ug-bachelor-of-health-sciences--b-hlthsc/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.curtin.edu.au/study/offering/course-pg-master-of-business-administration--mc-busadm/' },
              { name: '预测分析', enName: 'Master of Predictive Analytics', link: 'https://www.curtin.edu.au/study/offering/course-pg-master-of-predictive-analytics--mc-predan/' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.curtin.edu.au/study/offering/course-pg-master-of-information-technology--mc-inftec/' },
            ] 
          },
          { 
            name: '纽卡斯尔大学', 
            enName: 'University of Newcastle', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.newcastle.edu.au/study/undergraduate/degree-courses/bachelor-of-commerce' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.newcastle.edu.au/study/undergraduate/degree-courses/bachelor-of-engineering-honours' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.newcastle.edu.au/study/undergraduate/degree-courses/bachelor-of-computer-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.newcastle.edu.au/study/postgraduate/degree-courses/master-of-business-administration' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.newcastle.edu.au/study/postgraduate/degree-courses/master-of-information-technology' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.newcastle.edu.au/study/postgraduate/degree-courses/master-of-data-science' },
            ] 
          },
          { 
            name: '昆士兰科技大学', 
            enName: 'Queensland University of Technology', 
            price: '¥3000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.qut.edu.au/courses/bachelor-of-business' },
              { name: '设计', enName: 'Bachelor of Design', link: 'https://www.qut.edu.au/courses/bachelor-of-design' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.qut.edu.au/courses/bachelor-of-engineering-honours' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://www.qut.edu.au/courses/bachelor-of-information-technology' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.qut.edu.au/courses/master-of-business-administration-mba' },
              { name: '数据分析', enName: 'Master of Data Analytics', link: 'https://www.qut.edu.au/courses/master-of-data-analytics' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://www.qut.edu.au/courses/master-of-information-technology' },
            ] 
          },
          { name: '澳洲其他', enName: 'Other Australian Universities', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '咨询定价' },
        ]
      }
    ]
  },
  {
    id: 'singapore',
    name: '新加坡',
    enName: 'Singapore',
    flag: '🇸🇬',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '新加坡国立大学', 
            enName: 'National University of Singapore (NUS)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.comp.nus.edu.sg/programmes/ug/cs/' },
              { name: '数据科学与分析', enName: 'BSc Data Science and Analytics', link: 'https://www.stat.nus.edu.sg/prospective-students/undergraduate-programmes/data-science-and-analytics/' },
              { name: '工商管理', enName: 'BBA Business Administration', link: 'https://bba.nus.edu.sg/' },
              { name: '经济学', enName: 'BSocSc Economics', link: 'https://fass.nus.edu.sg/ecs/undergraduate/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://law.nus.edu.sg/admissions/llb_prog.html' },
              { name: '内外全科医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', link: 'https://medicine.nus.edu.sg/education/mbbs/' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://cde.nus.edu.sg/me/undergraduate/b-eng-me/' },
              { name: '电子工程', enName: 'BEng Electrical Engineering', link: 'https://cde.nus.edu.sg/ece/undergraduate/b-eng-ee/' },
              { name: '化学工程', enName: 'BEng Chemical Engineering', link: 'https://cde.nus.edu.sg/chbe/undergraduate/b-eng-chbe/' },
              { name: '建筑学', enName: 'BA Architecture', link: 'https://cde.nus.edu.sg/arch/undergraduate/bachelor-of-arts-in-architecture/' },
              { name: '心理学', enName: 'BSocSc Psychology', link: 'https://fass.nus.edu.sg/psy/undergraduate/' },
              { name: '传播与新媒体', enName: 'BA Communications and New Media', link: 'https://fass.nus.edu.sg/cnm/undergraduate/' },
              { name: '药剂学', enName: 'BSc Pharmacy', link: 'https://pharmacy.nus.edu.sg/study/undergraduate/bachelor-of-pharmacy/' },
              { name: '房地产', enName: 'BSc Real Estate', link: 'https://cde.nus.edu.sg/re/undergraduate/b-sc-re/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://mba.nus.edu.sg/' },
              { name: '商业分析硕士', enName: 'MSc Business Analytics', link: 'https://msba.nus.edu.sg/' },
              { name: '数据科学与机器学习', enName: 'MSc Data Science and Machine Learning', link: 'https://www.stat.nus.edu.sg/prospective-students/graduate-programmes/msc-dsml/' },
              { name: '计算机科学', enName: 'MSc Computer Science', link: 'https://www.comp.nus.edu.sg/programmes/pg/mcomp-cs/' },
              { name: '法学硕士', enName: 'Master of Laws (LLM)', link: 'https://law.nus.edu.sg/admissions/llm_prog.html' },
              { name: '公共政策', enName: 'Master of Public Policy', link: 'https://lkyspp.nus.edu.sg/graduate-admissions/graduate-programmes/master-of-public-policy' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://mscfinance.nus.edu.sg/' },
              { name: '量化金融', enName: 'MSc Quantitative Finance', link: 'https://www.stat.nus.edu.sg/prospective-students/graduate-programmes/msc-qf/' },
              { name: '经济学', enName: 'MSc Economics', link: 'https://fass.nus.edu.sg/ecs/msc-economics/' },
              { name: '数字金融科技', enName: 'MSc Digital Financial Technology', link: 'https://nusit.nus.edu.sg/msc-dft/' },
              { name: '供应链管理', enName: 'MSc Supply Chain Management', link: 'https://tliap.nus.edu.sg/msc-scm/' },
            ] 
          },
          { 
            name: '南洋理工大学', 
            enName: 'Nanyang Technological University (NTU)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.ntu.edu.sg/scse/admissions/undergraduate/computer-science' },
              { name: '数据科学与人工智能', enName: 'BSc Data Science and AI', link: 'https://www.ntu.edu.sg/scse/admissions/undergraduate/data-science-artificial-intelligence' },
              { name: '商业', enName: 'Bachelor of Business', link: 'https://www.ntu.edu.sg/business/admissions/undergraduate/bachelor-of-business' },
              { name: '会计学', enName: 'Bachelor of Accountancy', link: 'https://www.ntu.edu.sg/business/admissions/undergraduate/bachelor-of-accountancy' },
              { name: '航空航天工程', enName: 'BEng Aerospace Engineering', link: 'https://www.ntu.edu.sg/mae/admissions/undergraduate/aerospace-engineering' },
              { name: '生物工程', enName: 'BEng Bioengineering', link: 'https://www.ntu.edu.sg/scbe/admissions/undergraduate/bioengineering' },
              { name: '电子电气工程', enName: 'BEng Electrical and Electronic Engineering', link: 'https://www.ntu.edu.sg/eee/admissions/undergraduate/electrical-electronic-engineering' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://www.ntu.edu.sg/mae/admissions/undergraduate/mechanical-engineering' },
              { name: '艺术、设计与媒体', enName: 'BFA Art, Design and Media', link: 'https://www.ntu.edu.sg/adm/admissions/undergraduate' },
              { name: '传播学', enName: 'Bachelor of Communication Studies', link: 'https://www.ntu.edu.sg/wkwsci/admissions/undergraduate/communication-studies' },
              { name: '生物科学', enName: 'BSc Biological Sciences', link: 'https://www.ntu.edu.sg/sbs/admissions/undergraduate/biological-sciences' },
              { name: '物理与数学', enName: 'BSc Physics and Applied Physics', link: 'https://www.ntu.edu.sg/spms/admissions/undergraduate/physics-applied-physics' },
              { name: '心理学', enName: 'BA Psychology', link: 'https://www.ntu.edu.sg/soh/admissions/undergraduate/psychology' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.ntu.edu.sg/business/admissions/graduate/nanyang-mba' },
              { name: '分析学硕士', enName: 'MSc Analytics', link: 'https://www.ntu.edu.sg/spms/admissions/graduate/msc-analytics' },
              { name: '人工智能硕士', enName: 'MSc Artificial Intelligence', link: 'https://www.ntu.edu.sg/scse/admissions/graduate/msc-artificial-intelligence' },
              { name: '金融工程硕士', enName: 'MSc Financial Engineering', link: 'https://www.ntu.edu.sg/business/admissions/graduate/msc-financial-engineering' },
              { name: '知识管理硕士', enName: 'MSc Knowledge Management', link: 'https://www.ntu.edu.sg/wkwsci/admissions/graduate/msc-knowledge-management' },
              { name: '创业与创新硕士', enName: 'MSc Technopreneurship and Innovation', link: 'https://www.ntu.edu.sg/ntuitive/admissions/graduate/msc-technopreneurship-innovation' },
              { name: '计算机科学', enName: 'MSc Computer Science', link: 'https://www.ntu.edu.sg/scse/admissions/graduate/msc-computer-science' },
              { name: '通信工程', enName: 'MSc Communications Engineering', link: 'https://www.ntu.edu.sg/eee/admissions/graduate/msc-communications-engineering' },
              { name: '国际关系', enName: 'MSc International Relations', link: 'https://www.ntu.edu.sg/rsis/admissions/graduate/msc-international-relations' },
              { name: '教育学', enName: 'Master of Education', link: 'https://www.ntu.edu.sg/nie/admissions/graduate/master-of-education' },
            ] 
          },
          { 
            name: '新加坡管理大学', 
            enName: 'Singapore Management University (SMU)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '会计学', enName: 'Bachelor of Accountancy', link: 'https://admissions.smu.edu.sg/programmes/bachelor-accountancy' },
              { name: '商业管理', enName: 'Bachelor of Business Management', link: 'https://admissions.smu.edu.sg/programmes/bachelor-business-management' },
              { name: '经济学', enName: 'BSc Economics', link: 'https://admissions.smu.edu.sg/programmes/bachelor-science-economics' },
              { name: '信息系统学', enName: 'BSc Information Systems', link: 'https://admissions.smu.edu.sg/programmes/bachelor-science-information-systems' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://admissions.smu.edu.sg/programmes/bachelor-science-computer-science' },
              { name: '计算机与法律', enName: 'BSc Computing and Law', link: 'https://admissions.smu.edu.sg/programmes/bachelor-science-computing-and-law' },
              { name: '软件工程', enName: 'BSc Software Engineering', link: 'https://admissions.smu.edu.sg/programmes/bachelor-science-software-engineering' },
              { name: '社会科学', enName: 'Bachelor of Social Science', link: 'https://admissions.smu.edu.sg/programmes/bachelor-social-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://graduatestudies.smu.edu.sg/mba' },
              { name: '商业信息技术硕士', enName: 'Master of IT in Business (MITB)', link: 'https://scis.smu.edu.sg/master-it-business' },
              { name: '金融经济学硕士', enName: 'MSc Financial Economics', link: 'https://economics.smu.edu.sg/msfe' },
              { name: '财富管理硕士', enName: 'MSc Wealth Management', link: 'https://business.smu.edu.sg/mwm' },
              { name: '应用金融硕士', enName: 'MSc Applied Finance', link: 'https://business.smu.edu.sg/maf' },
              { name: '专业会计硕士', enName: 'Master of Professional Accounting', link: 'https://accountancy.smu.edu.sg/mpa' },
              { name: '管理学硕士', enName: 'MSc Management', link: 'https://business.smu.edu.sg/mim' },
              { name: '定量金融硕士', enName: 'MSc Quantitative Finance', link: 'https://business.smu.edu.sg/mqf' },
            ] 
          },
          { 
            name: '新加坡科技与设计大学', 
            enName: 'Singapore University of Technology and Design (SUTD)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '建筑与可持续设计', enName: 'Architecture and Sustainable Design', link: 'https://www.sutd.edu.sg/Admissions/Undergraduate/Courses/Architecture-and-Sustainable-Design-(ASD)' },
              { name: '工程产品开发', enName: 'Engineering Product Development', link: 'https://www.sutd.edu.sg/Admissions/Undergraduate/Courses/Engineering-Product-Development-(EPD)' },
              { name: '工程系统与设计', enName: 'Engineering Systems and Design', link: 'https://www.sutd.edu.sg/Admissions/Undergraduate/Courses/Engineering-Systems-and-Design-(ESD)' },
              { name: '信息系统技术与设计', enName: 'Information Systems Technology and Design', link: 'https://www.sutd.edu.sg/Admissions/Undergraduate/Courses/Information-Systems-Technology-and-Design-(ISTD)' },
              { name: '设计与人工智能', enName: 'Design and Artificial Intelligence', link: 'https://www.sutd.edu.sg/Admissions/Undergraduate/Courses/Design-and-Artificial-Intelligence-(DAI)' },
            ], 
            masterMajors: [
              { name: '创新设计硕士', enName: 'Master of Innovation by Design', link: 'https://www.sutd.edu.sg/Admissions/Postgraduate/Masters/Master-of-Innovation-by-Design' },
              { name: '建筑学硕士', enName: 'Master of Architecture', link: 'https://www.sutd.edu.sg/Admissions/Postgraduate/Masters/Master-of-Architecture' },
              { name: '城市科学、政策与规划', enName: 'MSc Urban Science, Policy and Planning', link: 'https://www.sutd.edu.sg/Admissions/Postgraduate/Masters/MSc-Urban-Science-Policy-and-Planning' },
              { name: '安全系统设计', enName: 'MSc Security by Design', link: 'https://www.sutd.edu.sg/Admissions/Postgraduate/Masters/MSc-Security-by-Design' },
              { name: '双硕士学位项目', enName: 'SUTD-MIT Dual Master\'s Program', link: 'https://www.sutd.edu.sg/Admissions/Postgraduate/Masters/SUTD-MIT-Dual-Masters-Program' },
            ] 
          },
          { 
            name: '新加坡理工大学', 
            enName: 'Singapore Institute of Technology (SIT)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/computer-science-real-time-interactive-simulation' },
              { name: '软件工程', enName: 'BEng Software Engineering', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/software-engineering' },
              { name: '信息安全', enName: 'BEng Information Security', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/information-security' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/mechanical-engineering' },
              { name: '可持续基础设施工程', enName: 'BEng Sustainable Infrastructure Engineering', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/sustainable-infrastructure-engineering-land' },
              { name: '航空航天工程', enName: 'BEng Aerospace Engineering', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/aerospace-engineering' },
              { name: '护理学', enName: 'BSc Nursing', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/nursing' },
              { name: '物理治疗', enName: 'BSc Physiotherapy', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/physiotherapy' },
              { name: '职业治疗', enName: 'BSc Occupational Therapy', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/occupational-therapy' },
              { name: '食品技术', enName: 'BSc Food Technology', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/food-technology' },
              { name: '酒店管理', enName: 'Bachelor of Hospitality Business', link: 'https://www.singaporetech.edu.sg/undergraduate-programmes/hospitality-business' },
            ], 
            masterMajors: [
              { name: '技术硕士', enName: 'Master of Technology', link: 'https://www.singaporetech.edu.sg/postgraduate/master-technology' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://www.singaporetech.edu.sg/postgraduate/master-engineering' },
              { name: '健康科学硕士', enName: 'Master of Health Sciences', link: 'https://www.singaporetech.edu.sg/postgraduate/master-health-sciences' },
            ] 
          },
          { name: '本科直升大二PPAC(3个月｜9个月)', enName: 'premium planning academic curriculum', price: '13.8万｜19.8万' },
          { name: 'Kaplan 高等教育学院', enName: 'Kaplan Higher Education Academy', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: 'PSB 学院', enName: 'PSB Academy', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '科廷大学新加坡分校', enName: 'Curtin Singapore', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '詹姆斯库克大学新加坡分校', enName: 'James Cook University Singapore', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '伦敦商业与金融学院新加坡校区', enName: 'LSBF Singapore', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '莱佛士设计学院', enName: 'Raffles Design Institute', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '南洋艺术学院 & 拉萨尔艺术学院', enName: 'NAFA & LASALLE College of the Arts', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '新加坡国际高中', enName: 'Singapore International High Schools', price: '¥35,000' },
          { name: '新加坡政府中小学入学培训', enName: 'AEIS Training', price: '¥20,000' },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '询价定制' },
        ]
      }
    ]
  },
  {
    id: 'hongkong',
    name: '香港',
    enName: 'Hong Kong',
    flag: '🇭🇰',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '香港大学（普通｜多元卓越计划）', 
            enName: 'The University of Hong Kong (HKU)', 
            price: '2.5万｜18万', 
            undergradMajors: [
              { name: '内外全科医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-medicine-and-bachelor-surgery' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-laws' },
              { name: '牙医学士', enName: 'Bachelor of Dental Surgery (BDS)', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-dental-surgery' },
              { name: '建筑学士', enName: 'Bachelor of Arts in Architectural Studies', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-arts-architectural-studies' },
              { name: '工商管理学学士(法学)', enName: 'BBA (Law) & LLB', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-business-administration-law-and-bachelor-laws' },
              { name: '资产管理及私人银行', enName: 'BSc (Finance) in Asset Management and Private Banking', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-science-finance-asset-management-and-private-banking' },
              { name: '定量金融', enName: 'BSc (Quantitative Finance)', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-science-quantitative-finance' },
              { name: '计算机科学', enName: 'BEng in Computer Science', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-engineering-computer-science' },
              { name: '生物医学', enName: 'Bachelor of Biomedical Sciences', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-biomedical-sciences' },
              { name: '心理学', enName: 'Bachelor of Social Sciences (Psychology)', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-social-sciences' },
              { name: '经济及金融', enName: 'Bachelor of Economics and Finance', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-economics-and-finance' },
              { name: '新闻学', enName: 'Bachelor of Journalism', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-journalism' },
              { name: '教育学', enName: 'Bachelor of Education', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-education' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-nursing' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'https://admissions.hku.hk/programmes/undergraduate/bachelor-pharmacy' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-business-administration' },
              { name: '法学硕士', enName: 'Master of Laws (LLM)', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-laws' },
              { name: '金融学硕士', enName: 'Master of Finance', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-finance' },
              { name: '商业分析硕士', enName: 'Master of Science in Business Analytics', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-business-analytics' },
              { name: '计算机科学硕士', enName: 'Master of Science in Computer Science', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-computer-science' },
              { name: '数据科学硕士', enName: 'Master of Science in Data Science', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-data-science' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-education' },
              { name: '公共卫生硕士', enName: 'Master of Public Health', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-public-health' },
              { name: '建筑学硕士', enName: 'Master of Architecture', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-architecture' },
              { name: '社会工作硕士', enName: 'Master of Social Work', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-social-work' },
              { name: '应用地球科学', enName: 'MSc in Applied Geosciences', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-applied-geosciences' },
              { name: '房地产学', enName: 'MSc in Real Estate', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-real-estate' },
              { name: '城市规划', enName: 'MSc in Urban Planning', link: 'https://admissions.hku.hk/programmes/taught-postgraduate/master-science-urban-planning' },
            ] 
          },
          { 
            name: '香港中文大学', 
            enName: 'The Chinese University of Hong Kong (CUHK)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '内外全科医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)', link: 'http://admission.cuhk.edu.hk/programme/medicine-mbchb/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'http://admission.cuhk.edu.hk/programme/bachelor-of-laws/' },
              { name: '环球商业学', enName: 'Global Business Studies', link: 'http://admission.cuhk.edu.hk/programme/global-business-studies/' },
              { name: '计量金融学', enName: 'Quantitative Finance', link: 'http://admission.cuhk.edu.hk/programme/quantitative-finance/' },
              { name: '计算机科学', enName: 'BEng in Computer Science', link: 'http://admission.cuhk.edu.hk/programme/computer-science/' },
              { name: '人工智能：系统与技术', enName: 'BEng in Artificial Intelligence: Systems and Technologies', link: 'http://admission.cuhk.edu.hk/programme/artificial-intelligence-systems-and-technologies/' },
              { name: '生物医学工程', enName: 'BEng in Biomedical Engineering', link: 'http://admission.cuhk.edu.hk/programme/biomedical-engineering/' },
              { name: '新闻与传播学', enName: 'BSocSc in Journalism and Communication', link: 'http://admission.cuhk.edu.hk/programme/journalism-and-communication/' },
              { name: '心理学', enName: 'BSocSc in Psychology', link: 'http://admission.cuhk.edu.hk/programme/psychology/' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'http://admission.cuhk.edu.hk/programme/pharmacy/' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'http://admission.cuhk.edu.hk/programme/nursing/' },
              { name: '建筑学', enName: 'BSocSc in Architectural Studies', link: 'http://admission.cuhk.edu.hk/programme/architectural-studies/' },
              { name: '翻译学', enName: 'BA in Translation', link: 'http://admission.cuhk.edu.hk/programme/translation/' },
              { name: '中国语言及文学', enName: 'BA in Chinese Language and Literature', link: 'http://admission.cuhk.edu.hk/programme/chinese-language-and-literature/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/business-administration' },
              { name: '法学硕士', enName: 'Master of Laws (LLM)', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/laws' },
              { name: '金融学硕士', enName: 'MSc in Finance', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/finance' },
              { name: '商业分析硕士', enName: 'MSc in Business Analytics', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/business-analytics' },
              { name: '计算机科学硕士', enName: 'MSc in Computer Science', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/computer-science' },
              { name: '数据科学与商业统计', enName: 'MSc in Data Science and Business Statistics', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/data-science-and-business-statistics' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/education' },
              { name: '新闻学硕士', enName: 'MA in Journalism', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/journalism' },
              { name: '新媒体硕士', enName: 'MSc in New Media', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/new-media' },
              { name: '社会工作硕士', enName: 'Master of Social Work', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/social-work' },
              { name: '公共卫生硕士', enName: 'Master of Public Health', link: 'https://www.gs.cuhk.edu.hk/admissions/programme/public-health' },
            ] 
          },
          { 
            name: '香港科技大学', 
            enName: 'The Hong Kong University of Science and Technology (HKUST)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'BEng in Computer Science', link: 'https://join.hkust.edu.hk/programmes/computer-science' },
              { name: '定量金融学', enName: 'BSc in Quantitative Finance', link: 'https://join.hkust.edu.hk/programmes/quantitative-finance' },
              { name: '环球商业管理', enName: 'BBA in Global Business', link: 'https://join.hkust.edu.hk/programmes/global-business' },
              { name: '人工智能', enName: 'BSc in Artificial Intelligence', link: 'https://join.hkust.edu.hk/programmes/artificial-intelligence' },
              { name: '生物科技', enName: 'BSc in Biotechnology', link: 'https://join.hkust.edu.hk/programmes/biotechnology' },
              { name: '电子工程', enName: 'BEng in Electronic Engineering', link: 'https://join.hkust.edu.hk/programmes/electronic-engineering' },
              { name: '机械工程', enName: 'BEng in Mechanical Engineering', link: 'https://join.hkust.edu.hk/programmes/mechanical-engineering' },
              { name: '航空航天工程', enName: 'BEng in Aerospace Engineering', link: 'https://join.hkust.edu.hk/programmes/aerospace-engineering' },
              { name: '经济及金融', enName: 'BSc in Economics and Finance', link: 'https://join.hkust.edu.hk/programmes/economics-and-finance' },
              { name: '风险管理及商业智能', enName: 'BSc in Risk Management and Business Intelligence', link: 'https://join.hkust.edu.hk/programmes/risk-management-and-business-intelligence' },
              { name: '环境管理及科技', enName: 'BSc in Environmental Management and Technology', link: 'https://join.hkust.edu.hk/programmes/environmental-management-and-technology' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://fytgs.hkust.edu.hk/programs/business-administration' },
              { name: '金融学硕士', enName: 'MSc in Finance', link: 'https://fytgs.hkust.edu.hk/programs/finance' },
              { name: '商业分析硕士', enName: 'MSc in Business Analytics', link: 'https://fytgs.hkust.edu.hk/programs/business-analytics' },
              { name: '计算机科学与工程', enName: 'MSc in Computer Science and Engineering', link: 'https://fytgs.hkust.edu.hk/programs/computer-science-and-engineering' },
              { name: '大数据科技', enName: 'MSc in Big Data Technology', link: 'https://fytgs.hkust.edu.hk/programs/big-data-technology' },
              { name: '金融科技', enName: 'MSc in Financial Technology', link: 'https://fytgs.hkust.edu.hk/programs/financial-technology' },
              { name: '电子工程', enName: 'MSc in Electronic Engineering', link: 'https://fytgs.hkust.edu.hk/programs/electronic-engineering' },
              { name: '机械工程', enName: 'MSc in Mechanical Engineering', link: 'https://fytgs.hkust.edu.hk/programs/mechanical-engineering' },
              { name: '环境工程及管理', enName: 'MSc in Environmental Engineering and Management', link: 'https://fytgs.hkust.edu.hk/programs/environmental-engineering-and-management' },
              { name: '公共政策', enName: 'Master of Public Policy', link: 'https://fytgs.hkust.edu.hk/programs/public-policy' },
            ] 
          },
          { 
            name: '香港理工大学', 
            enName: 'The Hong Kong Polytechnic University (PolyU)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '设计学', enName: 'BA (Hons) in Design', link: 'https://www.polyu.edu.hk/study/ug/prospectus/design' },
              { name: '酒店管理', enName: 'BSc (Hons) in Hotel Management', link: 'https://www.polyu.edu.hk/study/ug/prospectus/hotel-management' },
              { name: '物理治疗', enName: 'BSc (Hons) in Physiotherapy', link: 'https://www.polyu.edu.hk/study/ug/prospectus/physiotherapy' },
              { name: '职业治疗', enName: 'BSc (Hons) in Occupational Therapy', link: 'https://www.polyu.edu.hk/study/ug/prospectus/occupational-therapy' },
              { name: '护理学', enName: 'BSc (Hons) in Nursing', link: 'https://www.polyu.edu.hk/study/ug/prospectus/nursing' },
              { name: '会计及金融', enName: 'BBA (Hons) in Accounting and Finance', link: 'https://www.polyu.edu.hk/study/ug/prospectus/accounting-and-finance' },
              { name: '计算机科学', enName: 'BSc (Hons) in Computing', link: 'https://www.polyu.edu.hk/study/ug/prospectus/computing' },
              { name: '土木工程', enName: 'BEng (Hons) in Civil Engineering', link: 'https://www.polyu.edu.hk/study/ug/prospectus/civil-engineering' },
              { name: '机械工程', enName: 'BEng (Hons) in Mechanical Engineering', link: 'https://www.polyu.edu.hk/study/ug/prospectus/mechanical-engineering' },
              { name: '服装及纺织', enName: 'BA (Hons) in Fashion and Textiles', link: 'https://www.polyu.edu.hk/study/ug/prospectus/fashion-and-textiles' },
              { name: '测绘及地理资讯', enName: 'BSc (Hons) in Geomatics', link: 'https://www.polyu.edu.hk/study/ug/prospectus/geomatics' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.polyu.edu.hk/study/pg/prospectus/master-of-business-administration' },
              { name: '酒店及旅游管理', enName: 'MSc in Hotel and Tourism Management', link: 'https://www.polyu.edu.hk/study/pg/prospectus/hotel-and-tourism-management' },
              { name: '设计学', enName: 'Master of Design', link: 'https://www.polyu.edu.hk/study/pg/prospectus/design' },
              { name: '会计学', enName: 'MSc in Accounting', link: 'https://www.polyu.edu.hk/study/pg/prospectus/accounting' },
              { name: '金融学', enName: 'MSc in Finance', link: 'https://www.polyu.edu.hk/study/pg/prospectus/finance' },
              { name: '商业分析', enName: 'MSc in Business Analytics', link: 'https://www.polyu.edu.hk/study/pg/prospectus/business-analytics' },
              { name: '资讯科技', enName: 'MSc in Information Technology', link: 'https://www.polyu.edu.hk/study/pg/prospectus/information-technology' },
              { name: '软件科技', enName: 'MSc in Software Technology', link: 'https://www.polyu.edu.hk/study/pg/prospectus/software-technology' },
              { name: '土木工程', enName: 'MSc in Civil Engineering', link: 'https://www.polyu.edu.hk/study/pg/prospectus/civil-engineering' },
              { name: '机械工程', enName: 'MSc in Mechanical Engineering', link: 'https://www.polyu.edu.hk/study/pg/prospectus/mechanical-engineering' },
              { name: '护理学', enName: 'MSc in Nursing', link: 'https://www.polyu.edu.hk/study/pg/prospectus/nursing' },
            ] 
          },
          { 
            name: '香港城市大学', 
            enName: 'City University of Hong Kong (CityU)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算金融及金融科技', enName: 'BSc Computational Finance and Financial Technology', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-computational-finance-and-financial-technology' },
              { name: '环球商业', enName: 'BBA Global Business', link: 'https://www.cityu.edu.hk/admo/programmes/bba-global-business' },
              { name: '会计学', enName: 'BBA Accountancy', link: 'https://www.cityu.edu.hk/admo/programmes/bba-accountancy' },
              { name: '管理学', enName: 'BBA Management', link: 'https://www.cityu.edu.hk/admo/programmes/bba-management' },
              { name: '市场营销', enName: 'BBA Marketing', link: 'https://www.cityu.edu.hk/admo/programmes/bba-marketing' },
              { name: '经济及金融', enName: 'Economics and Finance', link: 'https://www.cityu.edu.hk/admo/programmes/economics-and-finance' },
              { name: '商业经济', enName: 'BBA Business Economics', link: 'https://www.cityu.edu.hk/admo/programmes/bba-business-economics' },
              { name: '金融学', enName: 'BBA Finance', link: 'https://www.cityu.edu.hk/admo/programmes/bba-finance' },
              { name: '资讯系统学', enName: 'Information Systems', link: 'https://www.cityu.edu.hk/admo/programmes/information-systems' },
              { name: '环球商业系统管理', enName: 'BBA Global Business Systems Management', link: 'https://www.cityu.edu.hk/admo/programmes/bba-global-business-systems-management' },
              { name: '商业决策分析', enName: 'BBA Business Decision Analytics', link: 'https://www.cityu.edu.hk/admo/programmes/bba-business-decision-analytics' },
              { name: '环球营运管理', enName: 'BBA Global Operations Management', link: 'https://www.cityu.edu.hk/admo/programmes/bba-global-operations-management' },
              { name: '生物医学工程', enName: 'BEng Biomedical Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/beng-biomedical-engineering' },
              { name: '生物科学', enName: 'BSc Biological Sciences', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-biological-sciences' },
              { name: '生物医学', enName: 'BSc Biomedical Sciences', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-biomedical-sciences' },
              { name: '计算机科学', enName: 'BSc Computer Science', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-computer-science' },
              { name: '数据科学', enName: 'BSc Data Science', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-data-science' },
              { name: '数据与系统工程', enName: 'BSc Data and Systems Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-data-and-systems-engineering' },
              { name: '网络安全', enName: 'BSc Cybersecurity', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-cybersecurity' },
              { name: '人工智能', enName: 'BSc Artificial Intelligence', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-artificial-intelligence' },
              { name: '建筑学及土木工程', enName: 'Architecture and Civil Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/architecture-and-civil-engineering' },
              { name: '电机工程学', enName: 'Electrical Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/electrical-engineering' },
              { name: '机械工程学', enName: 'Mechanical Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/mechanical-engineering' },
              { name: '材料科学及工程', enName: 'BEng Materials Science and Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/beng-materials-science-and-engineering' },
              { name: '智能制造工程', enName: 'BEng Intelligent Manufacturing Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/beng-intelligent-manufacturing-engineering' },
              { name: '创新与企业工程', enName: 'BEng Innovation and Enterprise Engineering', link: 'https://www.cityu.edu.hk/admo/programmes/beng-innovation-and-enterprise-engineering' },
              { name: '中文及历史', enName: 'BA Chinese and History', link: 'https://www.cityu.edu.hk/admo/programmes/ba-chinese-and-history' },
              { name: '媒体与传播', enName: 'Media and Communication', link: 'https://www.cityu.edu.hk/admo/programmes/media-and-communication' },
              { name: '英语语言', enName: 'BA English Language', link: 'https://www.cityu.edu.hk/admo/programmes/ba-english-language' },
              { name: '语言学及语言应用', enName: 'BA Linguistics and Language Applications', link: 'https://www.cityu.edu.hk/admo/programmes/ba-linguistics-and-language-applications' },
              { name: '国际关系及全球事务', enName: 'BSocSc International Relations and Global Affairs', link: 'https://www.cityu.edu.hk/admo/programmes/bsocsc-international-relations-and-global-affairs' },
              { name: '公共事务与管理', enName: 'BSocSc Public Affairs and Management', link: 'https://www.cityu.edu.hk/admo/programmes/bsocsc-public-affairs-and-management' },
              { name: '心理学', enName: 'BSocSc Psychology', link: 'https://www.cityu.edu.hk/admo/programmes/bsocsc-psychology' },
              { name: '社会工作', enName: 'BSocSc Social Work', link: 'https://www.cityu.edu.hk/admo/programmes/bsocsc-social-work' },
              { name: '社会学与犯罪学', enName: 'BSocSc Sociology and Criminology', link: 'https://www.cityu.edu.hk/admo/programmes/bsocsc-sociology-and-criminology' },
              { name: '化学', enName: 'BSc Chemistry', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-chemistry' },
              { name: '计算数学', enName: 'BSc Computing Mathematics', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-computing-mathematics' },
              { name: '物理学', enName: 'BSc Physics', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-physics' },
              { name: '环境科学', enName: 'BSc Environmental Science', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-environmental-science' },
              { name: '兽医学', enName: 'Bachelor of Veterinary Medicine', link: 'https://www.cityu.edu.hk/admo/programmes/bachelor-of-veterinary-medicine' },
              { name: '兽医生物科学', enName: 'BSc Veterinary Biosciences', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-veterinary-biosciences' },
              { name: '创意媒体', enName: 'BA Creative Media', link: 'https://www.cityu.edu.hk/admo/programmes/ba-creative-media' },
              { name: '创意媒体(理学)', enName: 'BSc Creative Media', link: 'https://www.cityu.edu.hk/admo/programmes/bsc-creative-media' },
              { name: '新媒体', enName: 'BAS New Media', link: 'https://www.cityu.edu.hk/admo/programmes/bas-new-media' },
              { name: '能源及环境', enName: 'Energy and Environment', link: 'https://www.cityu.edu.hk/admo/programmes/energy-and-environment' },
              { name: '法学学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.cityu.edu.hk/admo/programmes/bachelor-of-laws' },
              { name: '法律与商业', enName: 'BBA Law and Business', link: 'https://www.cityu.edu.hk/admo/programmes/bba-law-and-business' },
            ], 
            masterMajors: [
              { name: '创新创业', enName: 'MSc Venture Creation', link: 'https://www.cityu.edu.hk/pg/programme/p88' },
              { name: '生物医学工程', enName: 'MSc Biomedical Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p69' },
              { name: '健康科学与生物医学', enName: 'MSc Health Sciences and Biomedicine', link: 'https://www.cityu.edu.hk/pg/programme/p95' },
              { name: '神经科学', enName: 'MSc Neuroscience', link: 'https://www.cityu.edu.hk/pg/programme/p98' },
              { name: '行政人员工商管理硕士', enName: 'Executive Master of Business Administration', link: 'https://www.cityu.edu.hk/pg/programme/p01a' },
              { name: '工商管理硕士', enName: 'Master of Business Administration', link: 'https://www.cityu.edu.hk/pg/programme/p11' },
              { name: '商业及数据分析', enName: 'MSc Business and Data Analytics', link: 'https://www.cityu.edu.hk/pg/programme/p84' },
              { name: '国际会计学', enName: 'MA International Accounting', link: 'https://www.cityu.edu.hk/pg/programme/p02' },
              { name: '专业会计与企业管治', enName: 'MSc Professional Accounting and Corporate Governance', link: 'https://www.cityu.edu.hk/pg/programme/p10' },
              { name: '智能会计与金融科技应用', enName: 'MSc Accounting and Finance with AI and Fintech Applications', link: 'https://www.cityu.edu.hk/pg/programme/p83' },
              { name: '营运与供应链管理', enName: 'MSc Operations and Supply Chain Management', link: 'https://www.cityu.edu.hk/pg/programme/p09' },
              { name: '金融学', enName: 'MSc Finance', link: 'https://www.cityu.edu.hk/pg/programme/p04' },
              { name: '应用经济学', enName: 'MSc Applied Economics', link: 'https://www.cityu.edu.hk/pg/programme/p13' },
              { name: '金融工程学', enName: 'MSc Financial Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p15' },
              { name: '商务资讯系统(智能系统管理)', enName: 'MSc Business Information Systems (Management of Intelligent Systems)', link: 'https://www.cityu.edu.hk/pg/programme/p05a' },
              { name: '商务资讯系统(金融与智能科技)', enName: 'MSc Business Information Systems (Financial and Intelligent Technology)', link: 'https://www.cityu.edu.hk/pg/programme/p05b' },
              { name: '数码化转型及科技创新', enName: 'MSc Digital Transformation and Technological Innovation', link: 'https://www.cityu.edu.hk/pg/programme/p16' },
              { name: '电子商贸', enName: 'MSc Electronic Commerce', link: 'https://www.cityu.edu.hk/pg/programme/p17' },
              { name: '商业人工智能', enName: 'MSc Artificial Intelligence in Business', link: 'https://www.cityu.edu.hk/pg/programme/p85' },
              { name: '环球企业管理', enName: 'MA Global Business Management', link: 'https://www.cityu.edu.hk/pg/programme/p07' },
              { name: '管理及创新', enName: 'MSc Management and Innovation', link: 'https://www.cityu.edu.hk/pg/programme/p19' },
              { name: '市场营销学', enName: 'MSc Marketing', link: 'https://www.cityu.edu.hk/pg/programme/p18' },
              { name: '生物统计学', enName: 'MSc Biostatistics', link: 'https://www.cityu.edu.hk/pg/programme/p97' },
              { name: '计算机科学', enName: 'MSc Computer Science', link: 'https://www.cityu.edu.hk/pg/programme/p53' },
              { name: '人工智能', enName: 'MSc Artificial Intelligence', link: 'https://www.cityu.edu.hk/pg/programme/p75' },
              { name: '网络安全', enName: 'MSc Cybersecurity', link: 'https://www.cityu.edu.hk/pg/programme/p91' },
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://www.cityu.edu.hk/pg/programme/p70' },
              { name: '工程管理学', enName: 'MSc Engineering Management', link: 'https://www.cityu.edu.hk/pg/programme/p56' },
              { name: '智能半导体制造', enName: 'MSc Intelligent Semiconductor Manufacturing', link: 'https://www.cityu.edu.hk/pg/programme/p86' },
              { name: '人工智能驱动创新', enName: 'MSc AI-Driven Innovation', link: 'https://www.cityu.edu.hk/pg/programme/p89' },
              { name: '建造管理', enName: 'MSc Construction Management', link: 'https://www.cityu.edu.hk/pg/programme/p52' },
              { name: '土木及建筑工程', enName: 'MSc Civil and Architectural Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p60' },
              { name: '城市设计与规划学', enName: 'Master of Urban Design and Regional Planning', link: 'https://www.cityu.edu.hk/pg/programme/p64' },
              { name: '建筑学硕士', enName: 'Master of Architecture', link: 'https://www.cityu.edu.hk/pg/programme/p82' },
              { name: '电机与电子工程学', enName: 'MSc Electrical and Electronic Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p54' },
              { name: '电子计算机与资讯工程', enName: 'MSc Computer and Information Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p59' },
              { name: '材料工程及纳米科技', enName: 'MSc Materials Engineering and Nanotechnology', link: 'https://www.cityu.edu.hk/pg/programme/p58' },
              { name: '机械工程学', enName: 'MSc Mechanical Engineering', link: 'https://www.cityu.edu.hk/pg/programme/p66' },
              { name: '中国语言文学与历史', enName: 'MA Chinese and History', link: 'https://www.cityu.edu.hk/pg/programme/p34' },
              { name: '英语语言', enName: 'MA English Studies', link: 'https://www.cityu.edu.hk/pg/programme/p40' },
              { name: '语言研究', enName: 'MA Language Studies', link: 'https://www.cityu.edu.hk/pg/programme/p30' },
              { name: '传播与新媒体', enName: 'MA Communication and New Media', link: 'https://www.cityu.edu.hk/pg/programme/p25' },
              { name: '整合营销传播', enName: 'MA Integrated Marketing Communication', link: 'https://www.cityu.edu.hk/pg/programme/p39' },
              { name: '公共政策及管理', enName: 'MA Public Policy and Management', link: 'https://www.cityu.edu.hk/pg/programme/p27' },
              { name: '可持续及发展研究', enName: 'MSocSc Sustainability and Development Studies', link: 'https://www.cityu.edu.hk/pg/programme/p37' },
              { name: '国际研究', enName: 'MA International Studies', link: 'https://www.cityu.edu.hk/pg/programme/p38' },
              { name: '房屋及都市管理', enName: 'MA Housing and Urban Management', link: 'https://www.cityu.edu.hk/pg/programme/p78' },
              { name: '辅导学', enName: 'MSocSc Counselling', link: 'https://www.cityu.edu.hk/pg/programme/p20' },
              { name: '社会工作硕士', enName: 'Master of Social Work', link: 'https://www.cityu.edu.hk/pg/programme/p71' },
              { name: '心理学', enName: 'MSocSc Psychology', link: 'https://www.cityu.edu.hk/pg/programme/p76' },
              { name: '应用社会科学', enName: 'MA Applied Social Sciences', link: 'https://www.cityu.edu.hk/pg/programme/p77' },
              { name: '化学', enName: 'MSc Chemistry', link: 'https://www.cityu.edu.hk/pg/programme/p67' },
              { name: '金融数学与统计', enName: 'MSc Financial Mathematics and Statistics', link: 'https://www.cityu.edu.hk/pg/programme/p68' },
              { name: '物理学数据建模与量子技术', enName: 'MSc Physics with Data Modelling and Quantum Technologies', link: 'https://www.cityu.edu.hk/pg/programme/p50' },
              { name: '公共卫生硕士', enName: 'Master of Public Health', link: 'https://www.cityu.edu.hk/pg/programme/p96' },
              { name: '兽医学硕士', enName: 'Master of Veterinary Medicine', link: 'https://www.cityu.edu.hk/pg/programme/p99' },
              { name: '创意媒体艺术硕士', enName: 'MFA Creative Media', link: 'https://www.cityu.edu.hk/pg/programme/p80' },
              { name: '创意媒体文学硕士', enName: 'MA Creative Media', link: 'https://www.cityu.edu.hk/pg/programme/p81' },
              { name: '能源及环境', enName: 'MSc Energy and Environment', link: 'https://www.cityu.edu.hk/pg/programme/p63' },
              { name: '仲裁及争议解决学法学硕士', enName: 'Master of Laws in Arbitration and Dispute Resolution', link: 'https://www.cityu.edu.hk/pg/programme/p41' },
              { name: '法律博士', enName: 'Juris Doctor', link: 'https://www.cityu.edu.hk/pg/programme/p43' },
              { name: '法学硕士', enName: 'Master of Laws', link: 'https://www.cityu.edu.hk/pg/programme/p46' },
            ] 
          },
          { name: '香港浸会大学', enName: 'Hong Kong Baptist University (HKBU)', price: '¥25,000', undergradMajors: [
              { name: '工商管理', enName: 'BBA (Hons)', link: 'https://admissions.hkbu.edu.hk/en/programme-detail.html?id=JS2120' },
              { name: '传理学', enName: 'Bachelor of Communication', link: 'https://admissions.hkbu.edu.hk/en/programme-detail.html?id=JS2310' },
              { name: '理学', enName: 'BSc (Hons)', link: 'https://admissions.hkbu.edu.hk/en/programme-detail.html?id=JS2510' },
              { name: '文学', enName: 'BA (Hons)', link: 'https://admissions.hkbu.edu.hk/en/programme-detail.html?id=JS2020' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '香港岭南大学', enName: 'Lingnan University', price: '¥25,000', undergradMajors: [
              { name: '文学', enName: 'BA (Hons)', link: 'https://www.ln.edu.hk/admissions/ug/programmes/arts' },
              { name: '工商管理', enName: 'BBA (Hons)', link: 'https://www.ln.edu.hk/admissions/ug/programmes/business-administration' },
              { name: '社会科学', enName: 'BSocSc (Hons)', link: 'https://www.ln.edu.hk/admissions/ug/programmes/social-sciences' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '香港都会大学', enName: 'Hong Kong Metropolitan University (HKMU)', price: '¥25,000', undergradMajors: [
              { name: '工商管理', enName: 'BBA (Hons) in Business Administration', link: 'https://www.hkmu.edu.hk/ba/undergraduate/bba-hons-business-administration/' },
              { name: '护理学', enName: 'Bachelor of Nursing with Honours', link: 'https://www.hkmu.edu.hk/nursing/undergraduate/bachelor-of-nursing-with-honours-in-general-health-care/' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '香港高科院（普通｜直录）', enName: 'THEI', price: '¥2.5万｜¥18万', undergradMajors: [
              { name: '时装设计', enName: 'BA (Hons) in Fashion Design', link: 'https://www.thei.edu.hk/programme/design/bachelor-of-arts-honours-in-fashion-design' },
              { name: '土木工程', enName: 'BEng (Hons) in Civil Engineering', link: 'https://www.thei.edu.hk/programme/science-and-technology/bachelor-of-engineering-honours-in-civil-engineering' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '香港树仁大学', enName: 'Hong Kong Shue Yan University (HKSYU)', price: '¥20,000', undergradMajors: [
              { name: '新闻及传理', enName: 'BA (Hons) in Journalism and Communication', link: 'https://jc.hksyu.edu/en/programmes/undergraduate/bachelor-of-arts-honours-in-journalism-and-communication' },
              { name: '心理学', enName: 'BSocSc (Hons) in Psychology', link: 'https://psychology.hksyu.edu/en/programmes/undergraduate/bachelor-of-social-sciences-honours-in-psychology' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '香港恒生大学', enName: 'The Hang Seng University of Hong Kong (HSUHK)', price: '¥20,000', undergradMajors: [
              { name: '工商管理', enName: 'BBA (Hons)', link: 'https://sbus.hsu.edu.hk/en/programmes/undergraduate-programmes/bachelor-of-business-administration-honours/' },
              { name: '供应链管理', enName: 'BMSIM (Hons)', link: 'https://scm.hsu.edu.hk/en/programmes/undergraduate-programmes/bachelor-of-management-science-and-information-management-honours/' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '珠海学院', enName: 'Chu Hai College of Higher Education', price: '¥20,000', undergradMajors: [
              { name: '中国文学', enName: 'BA (Hons) in Chinese Literature', link: 'https://chlit.chuhai.edu.hk/en/programmes/undergraduate/bachelor-of-arts-honours-in-chinese-literature/' },
              { name: '土木工程', enName: 'BEng (Hons) in Civil Engineering', link: 'https://ce.chuhai.edu.hk/en/programmes/undergraduate/bachelor-of-engineering-honours-in-civil-engineering/' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '东华学院', enName: 'Tung Wah College', price: '¥20,000', undergradMajors: [
              { name: '护理学', enName: 'Bachelor of Nursing (Hons)', link: 'https://www.twc.edu.hk/en/Programmes/bn' },
              { name: '医疗化验科学', enName: 'BSc (Hons) in Medical Laboratory Science', link: 'https://www.twc.edu.hk/en/Programmes/bmls' },
            ], masterMajors: SAMPLE_MAJORS.master },
          { name: '大陆分校（港中深、港科广、港城东莞）', enName: 'Mainland Campuses (CUHK-SZ, HKUST-GZ, etc.)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '询价定制' },
        ]
      }
    ]
  },
  {
    id: 'malaysia',
    name: '马来西亚',
    enName: 'Malaysia',
    flag: '🇲🇾',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '马来亚大学', 
            enName: 'University of Malaya (UM)', 
            price: '¥40,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://fsktm.um.edu.my/bachelor-of-computer-science' },
              { name: '信息技术', enName: 'Bachelor of Information Technology', link: 'https://fsktm.um.edu.my/bachelor-of-information-technology' },
              { name: '工商管理', enName: 'Bachelor of Business Administration', link: 'https://fba.um.edu.my/bachelor-of-business-administration' },
              { name: '会计学', enName: 'Bachelor of Accounting', link: 'https://fba.um.edu.my/bachelor-of-accounting' },
              { name: '经济学', enName: 'Bachelor of Economics', link: 'https://feba.um.edu.my/bachelor-of-economics' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://law.um.edu.my/bachelor-of-laws' },
              { name: '内外全科医学士', enName: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', link: 'https://medicine.um.edu.my/bachelor-of-medicine-and-bachelor-of-surgery' },
              { name: '土木工程', enName: 'BEng Civil Engineering', link: 'https://engineering.um.edu.my/bachelor-of-civil-engineering' },
              { name: '电子工程', enName: 'BEng Electrical Engineering', link: 'https://engineering.um.edu.my/bachelor-of-electrical-engineering' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://engineering.um.edu.my/bachelor-of-mechanical-engineering' },
              { name: '生物医学', enName: 'BSc Biomedical Science', link: 'https://medicine.um.edu.my/bachelor-of-biomedical-science' },
              { name: '心理学', enName: 'Bachelor of Psychology', link: 'https://fass.um.edu.my/bachelor-of-psychology' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://fba.um.edu.my/master-of-business-administration' },
              { name: '计算机科学硕士', enName: 'Master of Computer Science', link: 'https://fsktm.um.edu.my/master-of-computer-science' },
              { name: '数据科学硕士', enName: 'Master of Data Science', link: 'https://fsktm.um.edu.my/master-of-data-science' },
              { name: '经济学硕士', enName: 'Master of Economics', link: 'https://feba.um.edu.my/master-of-economics' },
              { name: '公共政策硕士', enName: 'Master of Public Policy', link: 'https://feba.um.edu.my/master-of-public-policy' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://engineering.um.edu.my/master-of-engineering' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://education.um.edu.my/master-of-education' },
              { name: '法律硕士', enName: 'Master of Laws (LLM)', link: 'https://law.um.edu.my/master-of-laws' },
            ] 
          },
          { 
            name: '马来西亚理科大学', 
            enName: 'Universiti Sains Malaysia (USM)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://cs.usm.my/index.php/undergraduate/bachelor-of-computer-science' },
              { name: '管理学', enName: 'Bachelor of Management', link: 'https://som.usm.my/index.php/undergraduate/bachelor-of-management' },
              { name: '会计学', enName: 'Bachelor of Accounting', link: 'https://som.usm.my/index.php/undergraduate/bachelor-of-accounting' },
              { name: '经济学', enName: 'Bachelor of Economics', link: 'https://socsci.usm.my/index.php/undergraduate/bachelor-of-economics' },
              { name: '传播学', enName: 'Bachelor of Communication', link: 'https://comm.usm.my/index.php/undergraduate/bachelor-of-communication' },
              { name: '化学工程', enName: 'BEng Chemical Engineering', link: 'https://chemical.eng.usm.my/index.php/undergraduate/beng-chemical-engineering' },
              { name: '土木工程', enName: 'BEng Civil Engineering', link: 'https://civil.eng.usm.my/index.php/undergraduate/beng-civil-engineering' },
              { name: '电子工程', enName: 'BEng Electronic Engineering', link: 'https://ee.eng.usm.my/index.php/undergraduate/beng-electronic-engineering' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://mechanical.eng.usm.my/index.php/undergraduate/beng-mechanical-engineering' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'https://pha.usm.my/index.php/undergraduate/bachelor-of-pharmacy' },
              { name: '应用科学', enName: 'Bachelor of Applied Sciences', link: 'https://physics.usm.my/index.php/undergraduate/bachelor-of-applied-sciences' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://gsb.usm.my/index.php/programmes/mba' },
              { name: '计算机科学硕士', enName: 'MSc Computer Science', link: 'https://cs.usm.my/index.php/postgraduate/msc-computer-science' },
              { name: '数据科学与分析', enName: 'MSc Data Science and Analytics', link: 'https://cs.usm.my/index.php/postgraduate/msc-data-science-and-analytics' },
              { name: '传播学硕士', enName: 'MA Communication', link: 'https://comm.usm.my/index.php/postgraduate/ma-communication' },
              { name: '经济学硕士', enName: 'Master of Economics', link: 'https://socsci.usm.my/index.php/postgraduate/master-of-economics' },
              { name: '环境管理', enName: 'MSc Environmental Management', link: 'https://hbp.usm.my/index.php/postgraduate/msc-environmental-management' },
            ] 
          },
          { 
            name: '马来西亚国立大学', 
            enName: 'Universiti Kebangsaan Malaysia (UKM)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.ukm.my/ftsm/undergraduate/bachelor-of-computer-science/' },
              { name: '软件工程', enName: 'Bachelor of Software Engineering', link: 'https://www.ukm.my/ftsm/undergraduate/bachelor-of-software-engineering/' },
              { name: '工商管理', enName: 'Bachelor of Business Administration', link: 'https://www.ukm.my/fep/undergraduate/bachelor-of-business-administration/' },
              { name: '会计学', enName: 'Bachelor of Accounting', link: 'https://www.ukm.my/fep/undergraduate/bachelor-of-accounting/' },
              { name: '经济学', enName: 'Bachelor of Economics', link: 'https://www.ukm.my/fep/undergraduate/bachelor-of-economics/' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://www.ukm.my/fuu/undergraduate/bachelor-of-laws/' },
              { name: '医学士', enName: 'Doctor of Medicine (MD)', link: 'https://www.ukm.my/fper/undergraduate/doctor-of-medicine/' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.ukm.my/fkab/undergraduate/bachelor-of-engineering/' },
              { name: '社会科学', enName: 'Bachelor of Social Sciences', link: 'https://www.ukm.my/fssk/undergraduate/bachelor-of-social-sciences/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.ukm.my/gsbukm/mba/' },
              { name: '计算机科学硕士', enName: 'Master of Computer Science', link: 'https://www.ukm.my/ftsm/postgraduate/master-of-computer-science/' },
              { name: '经济学硕士', enName: 'Master of Economics', link: 'https://www.ukm.my/fep/postgraduate/master-of-economics/' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://www.ukm.my/ftsm/postgraduate/master-of-information-technology/' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://www.ukm.my/fpendidikan/postgraduate/master-of-education/' },
            ] 
          },
          { 
            name: '博特拉大学', 
            enName: 'Universiti Putra Malaysia (UPM)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://fsktm.upm.edu.my/undergraduate/bachelor-of-computer-science' },
              { name: '软件工程', enName: 'Bachelor of Software Engineering', link: 'https://fsktm.upm.edu.my/undergraduate/bachelor-of-software-engineering' },
              { name: '工商管理', enName: 'Bachelor of Business Administration', link: 'https://spe.upm.edu.my/undergraduate/bachelor-of-business-administration' },
              { name: '会计学', enName: 'Bachelor of Accounting', link: 'https://spe.upm.edu.my/undergraduate/bachelor-of-accounting' },
              { name: '经济学', enName: 'Bachelor of Economics', link: 'https://spe.upm.edu.my/undergraduate/bachelor-of-economics' },
              { name: '农业科学', enName: 'Bachelor of Agricultural Science', link: 'https://agri.upm.edu.my/undergraduate/bachelor-of-agricultural-science' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://eng.upm.edu.my/undergraduate/bachelor-of-engineering' },
              { name: '兽医学', enName: 'Doctor of Veterinary Medicine', link: 'https://vet.upm.edu.my/undergraduate/doctor-of-veterinary-medicine' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://putrabusinessschool.edu.my/mba/' },
              { name: '计算机科学硕士', enName: 'Master of Computer Science', link: 'https://fsktm.upm.edu.my/postgraduate/master-of-computer-science' },
              { name: '经济学硕士', enName: 'Master of Economics', link: 'https://spe.upm.edu.my/postgraduate/master-of-economics' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://fsktm.upm.edu.my/postgraduate/master-of-information-technology' },
              { name: '农业科学硕士', enName: 'Master of Agricultural Science', link: 'https://agri.upm.edu.my/postgraduate/master-of-agricultural-science' },
            ] 
          },
          { 
            name: '马来西亚理工大学', 
            enName: 'Universiti Teknologi Malaysia (UTM)', 
            price: '¥25,000', 
            undergradMajors: [
              { name: '软件工程', enName: 'Bachelor of Computer Science (Software Engineering)', link: 'https://computing.utm.my/undergraduate/bachelor-of-computer-science-software-engineering/' },
              { name: '网络与安全', enName: 'Bachelor of Computer Science (Network & Security)', link: 'https://computing.utm.my/undergraduate/bachelor-of-computer-science-network-security/' },
              { name: '图形与多媒体', enName: 'Bachelor of Computer Science (Graphics & Multimedia)', link: 'https://computing.utm.my/undergraduate/bachelor-of-computer-science-graphics-multimedia/' },
              { name: '土木工程', enName: 'BEng Civil Engineering', link: 'https://civil.utm.my/undergraduate/bachelor-of-civil-engineering/' },
              { name: '电子工程', enName: 'BEng Electrical Engineering', link: 'https://electrical.utm.my/undergraduate/bachelor-of-electrical-engineering/' },
              { name: '机械工程', enName: 'BEng Mechanical Engineering', link: 'https://mechanical.utm.my/undergraduate/bachelor-of-mechanical-engineering/' },
              { name: '化学工程', enName: 'BEng Chemical Engineering', link: 'https://chemical.utm.my/undergraduate/bachelor-of-chemical-engineering/' },
              { name: '建筑学', enName: 'Bachelor of Architecture', link: 'https://builtsurvey.utm.my/undergraduate/bachelor-of-architecture/' },
              { name: '管理学', enName: 'Bachelor of Management', link: 'https://management.utm.my/undergraduate/bachelor-of-management/' },
            ], 
            masterMajors: [
              { name: '计算机科学硕士', enName: 'MSc Computer Science', link: 'https://computing.utm.my/postgraduate/master-of-computer-science/' },
              { name: '信息安全硕士', enName: 'MSc Information Security', link: 'https://computing.utm.my/postgraduate/master-of-science-information-security/' },
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://business.utm.my/mba/' },
              { name: '工程硕士', enName: 'MSc Engineering', link: 'https://engineering.utm.my/postgraduate/' },
              { name: '城市与区域规划', enName: 'MSc Urban and Regional Planning', link: 'https://builtsurvey.utm.my/postgraduate/master-of-science-urban-and-regional-planning/' },
            ] 
          },
          { 
            name: '思特雅大学', 
            enName: 'UCSI University', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '工商管理', enName: 'Bachelor of Business Administration', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-business-administration-hons' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-computer-science-hons' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-pharmacy-hons' },
              { name: '古典音乐', enName: 'Bachelor of Classical Music', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-classical-music-hons' },
              { name: '现代音乐', enName: 'Bachelor of Contemporary Music', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-contemporary-music-hons' },
              { name: '建筑学', enName: 'Bachelor of Science in Architecture', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-science-hons-architecture' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-nursing-hons' },
              { name: '电子工程', enName: 'BEng Electrical and Electronic Engineering', link: 'https://www.ucsiuniversity.edu.my/programmes/bachelor-electrical-and-electronic-engineering-with-honours' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'MBA', link: 'https://www.ucsiuniversity.edu.my/programmes/master-business-administration' },
              { name: '药剂科学', enName: 'MSc Pharmaceutical Sciences', link: 'https://www.ucsiuniversity.edu.my/programmes/msc-pharmaceutical-sciences' },
              { name: '音乐性能', enName: 'Master of Music in Performance Studies', link: 'https://www.ucsiuniversity.edu.my/programmes/master-music-performance-studies' },
            ] 
          },
          { 
            name: '英迪大学', 
            enName: 'INTI International University', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '商业', enName: 'Bachelor of Business', link: 'https://newinti.edu.my/academic-programmes/business/' },
              { name: '计算机', enName: 'Bachelor of Computing', link: 'https://newinti.edu.my/academic-programmes/computing-it/' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://newinti.edu.my/academic-programmes/engineering/' },
              { name: '大众传播', enName: 'Bachelor of Mass Communication', link: 'https://newinti.edu.my/academic-programmes/mass-communication/' },
              { name: '理疗学', enName: 'Bachelor of Physiotherapy', link: 'https://newinti.edu.my/academic-programmes/health-sciences/bachelor-of-physiotherapy-hons/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'MBA', link: 'https://newinti.edu.my/academic-programmes/postgraduate/master-of-business-administration-learning-simplified/' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://newinti.edu.my/academic-programmes/postgraduate/master-of-information-technology/' },
            ] 
          },
          { 
            name: '泰勒大学', 
            enName: 'Taylor\'s University', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '商业', enName: 'Bachelor of Business', link: 'https://university.taylors.edu.my/en/study/undergraduate/business.html' },
              { name: '计算机', enName: 'Bachelor of Computing', link: 'https://university.taylors.edu.my/en/study/undergraduate/computing.html' },
              { name: '酒店管理', enName: 'Bachelor of Hospitality Management', link: 'https://university.taylors.edu.my/en/study/undergraduate/hospitality-tourism-events.html' },
              { name: '建筑学', enName: 'Bachelor of Science in Architecture', link: 'https://university.taylors.edu.my/en/study/undergraduate/architecture-building-design.html' },
              { name: '设计学', enName: 'Bachelor of Design', link: 'https://university.taylors.edu.my/en/study/undergraduate/design.html' },
              { name: '法学士', enName: 'Bachelor of Laws (LLB)', link: 'https://university.taylors.edu.my/en/study/undergraduate/law.html' },
              { name: '医学士', enName: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', link: 'https://university.taylors.edu.my/en/study/undergraduate/medicine.html' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'https://university.taylors.edu.my/en/study/undergraduate/pharmacy.html' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'MBA', link: 'https://university.taylors.edu.my/en/study/postgraduate/business/master-of-business-administration.html' },
              { name: '应用计算', enName: 'Master of Applied Computing', link: 'https://university.taylors.edu.my/en/study/postgraduate/computing/master-of-applied-computing.html' },
              { name: '国际酒店管理', enName: 'Master of International Hospitality Management', link: 'https://university.taylors.edu.my/en/study/postgraduate/hospitality-tourism-events/master-of-international-hospitality-management.html' },
            ] 
          },
          { 
            name: '双威大学', 
            enName: 'Sunway University', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '商业', enName: 'Bachelor of Business', link: 'https://university.sunway.edu.my/sunway-university-business-school/undergraduate' },
              { name: '计算机', enName: 'Bachelor of Computing', link: 'https://university.sunway.edu.my/school-of-engineering-and-technology/undergraduate' },
              { name: '心理学', enName: 'BSc Psychology', link: 'https://university.sunway.edu.my/school-of-medical-and-life-sciences/undergraduate/bsc-hons-psychology' },
              { name: '传播学', enName: 'BA Communications', link: 'https://university.sunway.edu.my/school-of-arts/undergraduate/ba-hons-communication' },
              { name: '精算学', enName: 'BSc Actuarial Studies', link: 'https://university.sunway.edu.my/sunway-university-business-school/undergraduate/bsc-hons-actuarial-studies' },
              { name: '数字媒体制作', enName: 'BA Digital Media Production', link: 'https://university.sunway.edu.my/school-of-arts/undergraduate/ba-hons-digital-media-production' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'MSc Data Science', link: 'https://university.sunway.edu.my/school-of-engineering-and-technology/postgraduate/msc-data-science-analysis' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://university.sunway.edu.my/sunway-university-business-school/postgraduate/master-business-administration' },
              { name: '心理学硕士', enName: 'MSc Psychology', link: 'https://university.sunway.edu.my/school-of-medical-and-life-sciences/postgraduate/msc-psychology' },
            ] 
          },
          { 
            name: '世纪大学', 
            enName: 'SEGi University', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '商业与会计', enName: 'Business and Accounting', link: 'https://segi.edu.my/study-with-us/business-accounting/' },
              { name: '视光学', enName: 'Bachelor of Optometry', link: 'https://segi.edu.my/course/bachelor-of-optometry-honours/' },
              { name: '牙医学', enName: 'Bachelor of Dental Surgery', link: 'https://segi.edu.my/course/bachelor-of-dental-surgery/' },
              { name: '药剂学', enName: 'Bachelor of Pharmacy', link: 'https://segi.edu.my/course/bachelor-of-pharmacy-honours/' },
              { name: '心理学', enName: 'Bachelor of Psychology', link: 'https://segi.edu.my/course/bachelor-of-psychology-honours/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'MBA', link: 'https://segi.edu.my/course/master-of-business-administration-general-management/' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://segi.edu.my/course/master-of-education/' },
            ] 
          },
          { 
            name: '马来西亚城市大学', 
            enName: 'City University Malaysia', 
            price: '¥8,000', 
            undergradMajors: [
              { name: '商业', enName: 'Bachelor of Business', link: 'https://www.city.edu.my/Undergraduate/Bachelor-of-Business-Administration-Hons' },
              { name: '计算机', enName: 'Bachelor of Computing', link: 'https://www.city.edu.my/Undergraduate/Bachelor-of-Information-Technology-Hons' },
              { name: '平面设计', enName: 'Bachelor of Graphic Design', link: 'https://www.city.edu.my/Undergraduate/Bachelor-of-Graphic-Design-Hons' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.city.edu.my/Undergraduate/Bachelor-of-Nursing-Hons' },
              { name: '大众传播', enName: 'Bachelor of Mass Communication', link: 'https://www.city.edu.my/Undergraduate/Bachelor-of-Mass-Communication-Hons' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'MBA', link: 'https://www.city.edu.my/Postgraduate/Master-of-Business-Administration' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://www.city.edu.my/Postgraduate/Master-of-Information-Technology' },
            ] 
          },
          { name: '马来西亚其他', enName: 'Other Malaysian Universities', price: '¥8,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '马来西亚博士（公立｜私立）', enName: 'PhD Programs (Public | Private)', price: '3.5万｜2.5万' },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '询价定制' },
        ]
      }
    ]
  },
  {
    id: 'usa',
    name: '美国',
    enName: 'United States',
    flag: '🇺🇸',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { name: 'US News Top 30 大学', enName: 'US News Top 30 Universities', price: '¥150,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: 'US News Top 30-60 大学', enName: 'US News Top 30-60 Universities', price: '¥120,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: 'US News Top 100 大学', enName: 'US News Top 100 Universities', price: '¥100,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { 
            name: '约翰霍普金斯大学（夏校）', 
            enName: 'Johns Hopkins University (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '生物医学工程导论', enName: 'Introduction to Biomedical Engineering', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
              { name: '心理学导论', enName: 'Introduction to Psychology', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
              { name: '国际研究', enName: 'International Studies', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
              { name: '神经科学', enName: 'Neuroscience', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
              { name: '天体物理学', enName: 'Astrophysics', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
              { name: '数据科学导论', enName: 'Introduction to Data Science', link: 'https://summer.jhu.edu/programs-courses/pre-college-programs/courses/' },
            ], 
            masterMajors: [
              { name: '公共卫生硕士', enName: 'Master of Public Health', link: 'https://publichealth.jhu.edu/academics/mph' },
              { name: '金融学硕士', enName: 'Master of Science in Finance', link: 'https://carey.jhu.edu/programs/master-science-programs/ms-finance' },
              { name: '商业分析与风险管理', enName: 'MSc Business Analytics and Risk Management', link: 'https://carey.jhu.edu/programs/master-science-programs/ms-business-analytics-and-risk-management' },
            ] 
          },
          { 
            name: '华盛顿大学（夏校）', 
            enName: 'University of Washington (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '计算机编程', enName: 'Computer Programming', link: 'https://www.summer.uw.edu/courses-programs/' },
              { name: '数字营销', enName: 'Digital Marketing', link: 'https://www.summer.uw.edu/courses-programs/' },
              { name: '环境科学', enName: 'Environmental Science', link: 'https://www.summer.uw.edu/courses-programs/' },
              { name: '建筑设计', enName: 'Architectural Design', link: 'https://www.summer.uw.edu/courses-programs/' },
              { name: '生物学导论', enName: 'Introduction to Biology', link: 'https://www.summer.uw.edu/courses-programs/' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'Master of Science in Data Science', link: 'https://www.pce.uw.edu/degrees/masters/data-science' },
              { name: '应用数学', enName: 'Master of Science in Applied Mathematics', link: 'https://www.pce.uw.edu/degrees/masters/applied-mathematics' },
            ] 
          },
          { 
            name: '康奈尔大学（夏校）', 
            enName: 'Cornell University (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '建筑学导论', enName: 'Introduction to Architecture', link: 'https://sce.cornell.edu/precollege/program/architecture' },
              { name: '商业管理', enName: 'Business Management', link: 'https://sce.cornell.edu/precollege/courses' },
              { name: '辩论与沟通', enName: 'Debate and Communication', link: 'https://sce.cornell.edu/precollege/courses' },
              { name: '经济学', enName: 'Economics', link: 'https://sce.cornell.edu/sce/courses' },
              { name: '计算机科学', enName: 'Computer Science', link: 'https://sce.cornell.edu/sce/courses' },
              { name: '心理学导论', enName: 'Introduction to Psychology', link: 'https://sce.cornell.edu/sce/courses' },
            ], 
            masterMajors: [
              { name: '专业研究硕士', enName: 'Master of Professional Studies', link: 'https://gradschool.cornell.edu/academics/degrees-offered/master-of-professional-studies-mps/' },
              { name: '应用统计学', enName: 'Master of Professional Studies in Applied Statistics', link: 'https://stat.cornell.edu/academics/mps' },
            ] 
          },
          { 
            name: '哈佛大学（夏校）', 
            enName: 'Harvard University (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '经济学原理', enName: 'Principles of Economics', link: 'https://summer.harvard.edu/course/principles-of-economics/' },
              { name: '计算机科学导论', enName: 'Introduction to Computer Science', link: 'https://summer.harvard.edu/course/introduction-to-computer-science/' },
              { name: '创意写作', enName: 'Creative Writing', link: 'https://summer.harvard.edu/course/creative-writing/' },
              { name: '国际关系', enName: 'International Relations', link: 'https://summer.harvard.edu/course/international-relations/' },
              { name: '神经生物学', enName: 'Neurobiology', link: 'https://summer.harvard.edu/course/neurobiology/' },
              { name: '心理学导论', enName: 'Introduction to Psychology', link: 'https://summer.harvard.edu/course/introduction-to-psychology/' },
              { name: '政府学', enName: 'Government', link: 'https://summer.harvard.edu/courses/' },
              { name: '历史学', enName: 'History', link: 'https://summer.harvard.edu/courses/' },
            ], 
            masterMajors: [
              { name: '高级管理课程', enName: 'Advanced Management Program', link: 'https://www.exed.hbs.edu/advanced-management-program/' },
              { name: '公共领导力', enName: 'Public Leadership', link: 'https://www.hks.harvard.edu/educational-programs/executive-education/public-leadership-credential' },
              { name: '数据科学应用', enName: 'Applied Data Science', link: 'https://extension.harvard.edu/programs/data-science-graduate-certificate/' },
              { name: '教育学硕士', enName: 'Master of Education', link: 'https://www.gse.harvard.edu/academics/masters' },
            ] 
          },
          { 
            name: '斯坦福大学（夏校）', 
            enName: 'Stanford University (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '编程方法学', enName: 'Programming Methodology', link: 'https://summer.stanford.edu/courses' },
              { name: '公众演讲', enName: 'Public Speaking', link: 'https://summer.stanford.edu/courses' },
              { name: '微积分', enName: 'Calculus', link: 'https://summer.stanford.edu/courses' },
              { name: '变态心理学', enName: 'Abnormal Psychology', link: 'https://summer.stanford.edu/courses' },
              { name: '数字营销', enName: 'Digital Marketing', link: 'https://summer.stanford.edu/courses' },
              { name: '人工智能导论', enName: 'Introduction to AI', link: 'https://summer.stanford.edu/courses' },
              { name: '工程学', enName: 'Engineering', link: 'https://summer.stanford.edu/courses' },
              { name: '管理科学与工程', enName: 'Management Science and Engineering', link: 'https://summer.stanford.edu/courses' },
            ], 
            masterMajors: [
              { name: '创新与创业', enName: 'Innovation and Entrepreneurship', link: 'https://online.stanford.edu/programs/innovation-and-entrepreneurship-certificate' },
              { name: '战略管理', enName: 'Strategic Management', link: 'https://online.stanford.edu/courses/mgmttre103-strategic-management' },
              { name: '计算机科学硕士', enName: 'MS in Computer Science', link: 'https://cs.stanford.edu/academics/master-of-science' },
            ] 
          },
          { 
            name: '宾夕法尼亚大学（夏校）', 
            enName: 'University of Pennsylvania (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '沃顿商业课程', enName: 'Wharton Global Youth Program', link: 'https://globalyouth.wharton.upenn.edu/' },
              { name: '社会公正', enName: 'Social Justice', link: 'https://www.sas.upenn.edu/summer/programs/high-school/social-justice' },
              { name: '生物医学研究', enName: 'Biomedical Research', link: 'https://www.sas.upenn.edu/summer/programs/high-school/biomedical' },
              { name: '经济学', enName: 'Economics', link: 'https://global.upenn.edu/summer/programs' },
              { name: '政治科学', enName: 'Political Science', link: 'https://global.upenn.edu/summer/programs' },
            ], 
            masterMajors: [
              { name: '组织动力学', enName: 'Organizational Dynamics', link: 'https://www.sas.upenn.edu/lps/graduate/dynamics' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://mba.wharton.upenn.edu/' },
              { name: '教育学硕士', enName: 'Master of Science in Education', link: 'https://www.gse.upenn.edu/academics/programs' },
            ] 
          },
          { 
            name: '芝加哥大学（夏校）', 
            enName: 'University of Chicago (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '经济学沉浸', enName: 'Economics Immersion', link: 'https://summer.uchicago.edu/programs/pre-college' },
              { name: '生物科学', enName: 'Biological Sciences', link: 'https://summer.uchicago.edu/programs/pre-college' },
              { name: '物理科学', enName: 'Physical Sciences', link: 'https://summer.uchicago.edu/programs/pre-college' },
              { name: '数学', enName: 'Mathematics', link: 'https://summer.uchicago.edu/programs/pre-college' },
              { name: '政治科学', enName: 'Political Science', link: 'https://summer.uchicago.edu/programs/pre-college' },
            ], 
            masterMajors: [
              { name: '金融数学', enName: 'Financial Mathematics', link: 'https://finmath.uchicago.edu/' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://www.chicagobooth.edu/programs/full-time-mba' },
              { name: '计算机科学硕士', enName: 'Masters Program in Computer Science', link: 'https://masters.cs.uchicago.edu/' },
            ] 
          },
          { 
            name: '加州大学伯克利分校（夏校）', 
            enName: 'UC Berkeley (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '商业导论', enName: 'Introduction to Business', link: 'https://summer.berkeley.edu/courses' },
              { name: '计算机体系结构', enName: 'Computer Architecture', link: 'https://summer.berkeley.edu/courses' },
              { name: '社会学导论', enName: 'Introduction to Sociology', link: 'https://summer.berkeley.edu/courses' },
              { name: '环境科学', enName: 'Environmental Science', link: 'https://summer.berkeley.edu/courses' },
              { name: '多媒体新闻', enName: 'Multimedia Journalism', link: 'https://summer.berkeley.edu/courses' },
              { name: '经济学', enName: 'Economics', link: 'https://summer.berkeley.edu/courses' },
              { name: '心理学', enName: 'Psychology', link: 'https://summer.berkeley.edu/courses' },
            ], 
            masterMajors: [
              { name: '暑期专业发展', enName: 'Summer Professional Development', link: 'https://summer.berkeley.edu/courses/professional-development' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://mba.haas.berkeley.edu/' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://funginstitute.berkeley.edu/programs-centers/full-time-program/' },
            ] 
          },
          { 
            name: '加州大学洛杉矶分校（夏校）', 
            enName: 'UCLA (Summer School)', 
            price: '¥5万～¥6.5万', 
            undergradMajors: [
              { name: '电影制作导论', enName: 'Introduction to Filmmaking', link: 'https://summer.ucla.edu/program/film-and-television-summer-institute/' },
              { name: '大众传播', enName: 'Mass Communication', link: 'https://summer.ucla.edu/courses/' },
              { name: '解剖学', enName: 'Anatomy', link: 'https://summer.ucla.edu/courses/' },
              { name: '天文学', enName: 'Astronomy', link: 'https://summer.ucla.edu/courses/' },
              { name: '全球研究', enName: 'Global Studies', link: 'https://summer.ucla.edu/courses/' },
              { name: '心理学', enName: 'Psychology', link: 'https://summer.ucla.edu/courses/' },
              { name: '经济学', enName: 'Economics', link: 'https://summer.ucla.edu/courses/' },
            ], 
            masterMajors: [
              { name: '艺术管理', enName: 'Arts Management', link: 'https://www.anderson.ucla.edu/degrees/mba-program/curriculum/specializations/arts-management' },
              { name: '工商管理硕士', enName: 'MBA', link: 'https://www.anderson.ucla.edu/degrees/full-time-mba' },
              { name: '计算机科学硕士', enName: 'MS in Computer Science', link: 'https://www.cs.ucla.edu/graduate-program/' },
            ] 
          },
          { name: '美国其他', enName: 'Other US Universities', price: '¥40,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '美国高中 2-4 年（可验）', enName: 'US High School (2-4 Years)', price: '¥98,000' },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '询价定制' },
        ]
      }
    ]
  },
  {
    id: 'canada',
    name: '加拿大',
    enName: 'Canada',
    flag: '🇨🇦',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '多伦多大学', 
            enName: 'University of Toronto', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Computer Science', link: 'https://web.cs.toronto.edu/undergraduate/programs' },
              { name: '商学', enName: 'Commerce (Rotman Commerce)', link: 'https://rotmancommerce.utoronto.ca/' },
              { name: '工程学', enName: 'Engineering', link: 'https://undergrad.engineering.utoronto.ca/' },
              { name: '人文科学', enName: 'Humanities', link: 'https://www.artsci.utoronto.ca/future/academic-programs/humanities' },
              { name: '生命科学', enName: 'Life Sciences', link: 'https://www.artsci.utoronto.ca/future/academic-programs/life-sciences' },
              { name: '社会科学', enName: 'Social Sciences', link: 'https://www.artsci.utoronto.ca/future/academic-programs/social-sciences' },
              { name: '数学与物理科学', enName: 'Mathematical and Physical Sciences', link: 'https://www.artsci.utoronto.ca/future/academic-programs/mathematical-and-physical-sciences' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.rotman.utoronto.ca/Degrees/MastersPrograms/MBAPrograms' },
              { name: '数据科学', enName: 'Master of Science in Applied Computing', link: 'https://mscac.utoronto.ca/' },
              { name: '工程学硕士', enName: 'Master of Engineering', link: 'https://gradstudies.engineering.utoronto.ca/professional-degrees/master-of-engineering/' },
              { name: '信息学硕士', enName: 'Master of Information', link: 'https://ischool.utoronto.ca/areas-of-study/master-of-information/' },
              { name: '金融经济学', enName: 'Master of Financial Economics', link: 'https://economics.utoronto.ca/index.php/index/mfe/overview' },
              { name: '管理与专业会计', enName: 'Master of Management & Professional Accounting', link: 'https://mmpa.utoronto.ca/' },
            ] 
          },
          { 
            name: '不列颠哥伦比亚大学', 
            enName: 'University of British Columbia (UBC)', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.arts.ubc.ca/undergraduate/programs/' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.sauder.ubc.edu/programs/bachelor-commerce' },
              { name: '工程学', enName: 'Bachelor of Applied Science (Engineering)', link: 'https://engineering.ubc.ca/admissions/undergraduate' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://science.ubc.ca/students/degree' },
              { name: '林学', enName: 'Bachelor of Science in Forestry', link: 'https://forestry.ubc.ca/programs/undergraduate/' },
              { name: '运动机能学', enName: 'Bachelor of Kinesiology', link: 'https://kin.educ.ubc.edu/undergraduate/bkin/' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.cs.ubc.edu/students/undergrad/programs' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.sauder.ubc.edu/programs/masters-degrees/ubc-mba' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://masterdatascience.ubc.ca/' },
              { name: '工程学硕士', enName: 'Master of Engineering', link: 'https://apsc.ubc.ca/graduate-programs' },
              { name: '管理学硕士', enName: 'Master of Management', link: 'https://www.sauder.ubc.edu/programs/masters-degrees/ubc-master-management' },
              { name: '商业分析硕士', enName: 'Master of Business Analytics', link: 'https://www.sauder.ubc.edu/programs/masters-degrees/ubc-master-business-analytics' },
              { name: '计算机科学硕士', enName: 'Master of Science in Computer Science', link: 'https://www.cs.ubc.edu/students/grad/prospective/programs/msc' },
            ] 
          },
          { 
            name: '麦吉尔大学', 
            enName: 'McGill University', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.mcgill.ca/arts/undergraduate' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.mcgill.ca/desautels/programs/bcom' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.mcgill.ca/engineering/students/undergraduate' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.mcgill.ca/science/undergraduate' },
              { name: '护理学', enName: 'Bachelor of Nursing', link: 'https://www.mcgill.ca/nursing/prospective/programs' },
              { name: '音乐', enName: 'Bachelor of Music', link: 'https://www.mcgill.ca/music/programs' },
              { name: '教育学', enName: 'Bachelor of Education', link: 'https://www.mcgill.ca/edu-dise/programs' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.mcgill.ca/desautels/programs/mba' },
              { name: '金融管理硕士', enName: 'Master of Management in Finance', link: 'https://www.mcgill.ca/desautels/programs/mmf' },
              { name: '计算机科学硕士', enName: 'Master of Science in Computer Science', link: 'https://www.cs.mcgill.ca/academic/graduate/msc/' },
              { name: '分析管理硕士', enName: 'Master of Management in Analytics', link: 'https://www.mcgill.ca/desautels/programs/mma' },
              { name: '法学硕士', enName: 'Master of Laws (LLM)', link: 'https://www.mcgill.ca/law/grad-studies/masters-programs' },
            ] 
          },
          { 
            name: '滑铁卢大学', 
            enName: 'University of Waterloo', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '计算机科学', enName: 'Computer Science', link: 'https://uwaterloo.ca/future-students/programs/computer-science' },
              { name: '软件工程', enName: 'Software Engineering', link: 'https://uwaterloo.ca/future-students/programs/software-engineering' },
              { name: '数学', enName: 'Mathematics', link: 'https://uwaterloo.ca/future-students/programs/mathematics' },
              { name: '会计与金融管理', enName: 'Accounting and Financial Management', link: 'https://uwaterloo.ca/future-students/programs/accounting-and-financial-management' },
              { name: '土木工程', enName: 'Civil Engineering', link: 'https://uwaterloo.ca/future-students/programs/civil-engineering' },
              { name: '机械工程', enName: 'Mechanical Engineering', link: 'https://uwaterloo.ca/future-students/programs/mechanical-engineering' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'Master of Data Science and Artificial Intelligence', link: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs/data-science-and-artificial-intelligence-mdsai-co-op' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs/engineering-meng' },
              { name: '计算机科学硕士', enName: 'Master of Mathematics in Computer Science', link: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs/computer-science-mmath' },
              { name: '精算科学', enName: 'Master of Actuarial Science', link: 'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs/actuarial-science-mactsc' },
            ] 
          },
          { 
            name: '阿尔伯塔大学', 
            enName: 'University of Alberta', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.ualberta.ca/arts/programs/undergraduate-programs/index.html' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.ualberta.ca/business/programs/bachelor-of-commerce/index.html' },
              { name: '工程学', enName: 'Bachelor of Science in Engineering', link: 'https://www.ualberta.ca/engineering/programs/undergraduate-admissions/index.html' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.ualberta.ca/science/programs/undergraduate/index.html' },
              { name: '教育学', enName: 'Bachelor of Education', link: 'https://www.ualberta.ca/education/programs/undergraduate-programs/index.html' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.ualberta.ca/business/programs/mba/index.html' },
              { name: '计算机科学硕士', enName: 'Master of Science in Computer Science', link: 'https://www.ualberta.ca/computing-science/graduate-programs/index.html' },
              { name: '工程学硕士', enName: 'Master of Engineering', link: 'https://www.ualberta.ca/engineering/graduate-studies/index.html' },
            ] 
          },
          { 
            name: '麦克马斯特大学', 
            enName: 'McMaster University', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://bhsc.mcmaster.ca/' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.eng.mcmaster.ca/programs/undergraduate-programs/' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://ug.degroote.mcmaster.ca/' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.science.mcmaster.ca/future-students/undergraduate-programs.html' },
              { name: '人文科学', enName: 'Bachelor of Arts', link: 'https://www.humanities.mcmaster.ca/undergraduate/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://mba.degroote.mcmaster.ca/' },
              { name: '金融学硕士', enName: 'Master of Finance', link: 'https://mfin.degroote.mcmaster.ca/' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://www.eng.mcmaster.ca/programs/graduate-programs/' },
            ] 
          },
          { 
            name: '西安大略大学', 
            enName: 'Western University', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Arts (Ivey HBA)', link: 'https://www.ivey.uwo.ca/hba/' },
              { name: '工程学', enName: 'Bachelor of Engineering Science', link: 'https://www.eng.uwo.ca/undergraduate/' },
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://www.uwo.ca/fhs/shs/undergrad/' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.uwo.ca/sci/undergraduate/' },
              { name: '社会科学', enName: 'Bachelor of Social Science', link: 'https://socialscience.uwo.ca/undergraduate/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.ivey.uwo.ca/mba/' },
              { name: '管理学硕士', enName: 'Master of Science in Management', link: 'https://www.ivey.uwo.ca/msc/' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://www.eng.uwo.ca/graduate/' },
            ] 
          },
          { 
            name: '渥太华大学', 
            enName: 'University of Ottawa', 
            price: '¥45,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.uottawa.ca/faculty-arts/undergraduate-studies' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://telfer.uottawa.ca/en/bcom/' },
              { name: '工程学', enName: 'Bachelor of Applied Science', link: 'https://www.uottawa.ca/faculty-engineering/undergraduate-studies' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.uottawa.ca/faculty-science/undergraduate-studies' },
              { name: '社会科学', enName: 'Bachelor of Social Sciences', link: 'https://socialsciences.uottawa.ca/undergraduate' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://telfer.uottawa.ca/en/mba/' },
              { name: '计算机科学硕士', enName: 'Master of Computer Science', link: 'https://www.uottawa.ca/faculty-engineering/graduate-studies/computer-science' },
              { name: '工程硕士', enName: 'Master of Engineering', link: 'https://www.uottawa.ca/faculty-engineering/graduate-studies' },
            ] 
          },
          { name: '加拿大其他', enName: 'Other Canadian Universities', price: '¥45,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: 'OSSD 加拿大高中 1-4 年（可验）', enName: 'OSSD Canadian High School (1-4 Years)', price: '¥86,000' },
          { name: '学术背景低于录取标准', enName: 'Customized Background Enhancement', price: '询价定制' },
        ]
      }
    ]
  },
  {
    id: 'newzealand',
    name: '新西兰',
    enName: 'New Zealand',
    flag: '🇳🇿',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { 
            name: '奥克兰大学', 
            enName: 'University of Auckland', 
            price: '¥6,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-arts-ba.html' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-commerce-bcom.html' },
              { name: '工程学', enName: 'Bachelor of Engineering', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-engineering-honours-be-hons.html' },
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-health-sciences-bhsc.html' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-science-bsc.html' },
              { name: '法学', enName: 'Bachelor of Laws', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-laws-llb.html' },
              { name: '设计', enName: 'Bachelor of Design', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-design-bdes.html' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-business-administration-mba.html' },
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-data-science-mdatasci.html' },
              { name: '工程学', enName: 'Master of Engineering', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-engineering-me.html' },
              { name: '管理学', enName: 'Master of Management', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-management-mmgt.html' },
              { name: '专业会计', enName: 'Master of Professional Accounting', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-professional-accounting-mprofacctg.html' },
              { name: '信息技术', enName: 'Master of Information Technology', link: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/master-of-information-technology-minfotech.html' },
            ] 
          },
          { 
            name: '奥塔哥大学', 
            enName: 'University of Otago', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.otago.ac.nz/subjects/arts' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.otago.ac.nz/subjects/business' },
              { name: '健康科学', enName: 'Bachelor of Health Sciences', link: 'https://www.otago.ac.nz/subjects/health-sciences' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.otago.ac.nz/subjects/sciences' },
              { name: '法学', enName: 'Bachelor of Laws', link: 'https://www.otago.ac.nz/subjects/law' },
              { name: '生物医学', enName: 'Bachelor of Biomedical Sciences', link: 'https://www.otago.ac.nz/subjects/biomedical-sciences' },
            ], 
            masterMajors: [
              { name: '商业数据科学', enName: 'Master of Business Data Science', link: 'https://www.otago.ac.nz/courses/qualifications/mbusdatasc' },
              { name: '金融学', enName: 'Master of Finance', link: 'https://www.otago.ac.nz/courses/qualifications/mfin' },
              { name: '理学硕士', enName: 'Master of Science', link: 'https://www.otago.ac.nz/courses/qualifications/msc' },
              { name: '应用科学', enName: 'Master of Applied Science', link: 'https://www.otago.ac.nz/courses/qualifications/mappsc' },
              { name: '国际贸易', enName: 'Master of International Business', link: 'https://www.otago.ac.nz/courses/qualifications/mintbus' },
            ] 
          },
          { 
            name: '惠灵顿大学', 
            enName: 'Victoria University of Wellington', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/arts' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/commerce' },
              { name: '设计', enName: 'Bachelor of Design', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/design' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/science' },
              { name: '法学', enName: 'Bachelor of Laws', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/law' },
              { name: '建筑学', enName: 'Bachelor of Architectural Studies', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/architecture' },
            ], 
            masterMajors: [
              { name: '数据科学', enName: 'Master of Data Science', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/data-science' },
              { name: '专业会计', enName: 'Master of Professional Accounting', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/professional-accounting' },
              { name: '用户体验设计', enName: 'Master of User Experience Design', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/user-experience-design' },
              { name: '国际贸易', enName: 'Master of International Business', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/international-business' },
              { name: '软件开发', enName: 'Master of Software Development', link: 'https://www.wgtn.ac.nz/study/programmes-subjects/subjects/software-development' },
            ] 
          },
          { 
            name: '奥克兰理工大学', 
            enName: 'Auckland University of Technology (AUT)', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.aut.ac.nz/study/study-options/business/courses/bachelor-of-business' },
              { name: '计算机与信息科学', enName: 'Bachelor of Computer and Information Sciences', link: 'https://www.aut.ac.nz/study/study-options/engineering-computer-and-mathematical-sciences/courses/bachelor-of-computer-and-information-sciences' },
              { name: '设计', enName: 'Bachelor of Design', link: 'https://www.aut.ac.nz/study/study-options/art-and-design/courses/bachelor-of-design' },
              { name: '健康科学', enName: 'Bachelor of Health Science', link: 'https://www.aut.ac.nz/study/study-options/health-sciences/courses/bachelor-of-health-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.aut.ac.nz/study/study-options/business/courses/master-of-business-administration' },
              { name: '分析学', enName: 'Master of Analytics', link: 'https://www.aut.ac.nz/study/study-options/engineering-computer-and-mathematical-sciences/courses/master-of-analytics' },
              { name: '计算机与信息科学', enName: 'Master of Computer and Information Sciences', link: 'https://www.aut.ac.nz/study/study-options/engineering-computer-and-mathematical-sciences/courses/master-of-computer-and-information-sciences' },
            ] 
          },
          { 
            name: '梅西大学', 
            enName: 'Massey University', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-business-BBS/' },
              { name: '航空学', enName: 'Bachelor of Aviation', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-aviation-BAV/' },
              { name: '创意媒体生产', enName: 'Bachelor of Creative Media Production', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-creative-media-production-BCMP/' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/bachelor-of-science-BSC/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/master-of-business-administration-MBA/' },
              { name: '管理学', enName: 'Master of Management', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/master-of-management-MMGT/' },
              { name: '金融学', enName: 'Master of Finance', link: 'https://www.massey.ac.nz/study/all-qualifications-and-degrees/master-of-finance-MFIN/' },
            ] 
          },
          { 
            name: '怀卡托大学', 
            enName: 'University of Waikato', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Business', link: 'https://www.waikato.ac.nz/study/qualifications/bachelor-of-business' },
              { name: '计算机科学', enName: 'Bachelor of Computer Science', link: 'https://www.waikato.ac.nz/study/qualifications/bachelor-of-computer-science' },
              { name: '设计', enName: 'Bachelor of Design', link: 'https://www.waikato.ac.nz/study/qualifications/bachelor-of-design' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.waikato.ac.nz/study/qualifications/bachelor-of-science' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.waikato.ac.nz/study/qualifications/master-of-business-administration' },
              { name: '管理学', enName: 'Master of Management', link: 'https://www.waikato.ac.nz/study/qualifications/master-of-management' },
              { name: '信息技术硕士', enName: 'Master of Information Technology', link: 'https://www.waikato.ac.nz/study/qualifications/master-of-information-technology' },
            ] 
          },
          { 
            name: '林肯大学', 
            enName: 'Lincoln University', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.lincoln.ac.nz/study/study-search/bachelor-of-commerce/' },
              { name: '农业', enName: 'Bachelor of Agricultural Science', link: 'https://www.lincoln.ac.nz/study/study-search/bachelor-of-agricultural-science/' },
              { name: '景观建筑', enName: 'Bachelor of Landscape Architecture', link: 'https://www.lincoln.ac.nz/study/study-search/bachelor-of-landscape-architecture/' },
              { name: '旅游管理', enName: 'Bachelor of Tourism Management', link: 'https://www.lincoln.ac.nz/study/study-search/bachelor-of-tourism-management/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (Global)', link: 'https://www.lincoln.ac.nz/study/study-search/master-of-business-administration-global/' },
              { name: '商业（金融）', enName: 'Master of Business (Finance)', link: 'https://www.lincoln.ac.nz/study/study-search/master-of-business-finance/' },
              { name: '农业商业', enName: 'Master of Management in Agribusiness', link: 'https://www.lincoln.ac.nz/study/study-search/master-of-management-in-agribusiness/' },
            ] 
          },
          { 
            name: '坎特伯雷大学', 
            enName: 'University of Canterbury', 
            price: '¥3,000', 
            undergradMajors: [
              { name: '文学', enName: 'Bachelor of Arts', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/bachelors-degrees/bachelor-of-arts/' },
              { name: '商学', enName: 'Bachelor of Commerce', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/bachelors-degrees/bachelor-of-commerce/' },
              { name: '工程学', enName: 'Bachelor of Engineering (Honours)', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/bachelors-degrees/bachelor-of-engineering-with-honours/' },
              { name: '理学', enName: 'Bachelor of Science', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/bachelors-degrees/bachelor-of-science/' },
            ], 
            masterMajors: [
              { name: '工商管理硕士', enName: 'Master of Business Administration (MBA)', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/masters-degrees/master-of-business-administration/' },
              { name: '商业信息系统', enName: 'Master of Business Information Systems', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/masters-degrees/master-of-business-information-systems/' },
              { name: '应用数据科学', enName: 'Master of Applied Data Science', link: 'https://www.canterbury.ac.nz/study/qualifications-and-courses/masters-degrees/master-of-applied-data-science/' },
            ] 
          },
          { name: '新西兰其他', enName: 'Other New Zealand Universities', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
        ]
      }
    ]
  }
];

// --- Components ---

const Header = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <header className="relative h-[25vh] md:h-[35vh] min-h-[240px] md:min-h-[320px] flex items-center justify-center overflow-hidden bg-[#010101]">
      {/* Deep Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* Dynamic Background with Multi-layered Premium Glows */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] rounded-full bg-brand-blue/40 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-25%] right-[-15%] w-[80%] h-[80%] rounded-full bg-hermes-orange/30 blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gold/20 blur-[160px]" />
        
        {/* Grid Texture */}
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </motion.div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center space-x-3 mb-8 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl shadow-[0_0_40px_rgba(212,175,55,0.3)]">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-gold text-[10px] md:text-[12px] font-black tracking-[0.6em] uppercase whitespace-nowrap drop-shadow-sm">
              Premium Planning Global Service
            </span>
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-serif font-black mb-10 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-gold to-[#D4AF37] drop-shadow-[0_15px_40px_rgba(212,175,55,0.4)] filter brightness-110"
              style={{ textShadow: '0 1px 0 #B38728, 0 2px 0 #AA771C, 0 3px 0 #996611, 0 4px 0 #885500, 0 5px 0 #774400, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25)' }}>
            服务价格
          </h1>
          
          <div className="flex flex-nowrap items-center justify-center gap-4 md:gap-12">
            <div className="flex items-center space-x-2 text-white/80 text-[10px] md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-gold/90" />
              <span>官方服务</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80 text-[10px] md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              <Zap className="w-4 h-4 text-gold/90" />
              <span>极速通道</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80 text-[10px] md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-gold/90" />
              <span>精英品质</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Shadow Projection */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
    </header>
  );
};

const Footer = () => (
  <footer className="bg-[#020202] border-t border-white/10 py-20 px-4 mt-1 relative overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.6)]">
    {/* Deep Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    
    {/* Intense Footer Glow */}
    <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-full h-[300px] bg-gold/20 blur-[120px] pointer-events-none" />
    
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10">
      <div className="space-y-8">
        <h3 className="text-3xl font-serif font-black text-white tracking-tight drop-shadow-2xl">TopUni Global Education<span className="text-gold">.</span></h3>
        <p className="text-slate-500 text-base leading-relaxed max-w-xs">
          Providing premium global education planning services with elite quality and official standards.
        </p>
      </div>
      
      <div className="space-y-8">
        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold/90 drop-shadow-sm">Contact Us</h4>
        <div className="space-y-6">
          <a href="mailto:admission@topuni.com.cn" className="flex items-center space-x-5 text-slate-400 hover:text-gold transition-all group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/30 transition-all border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-base font-medium tracking-wider">admission@topuni.com.cn</span>
          </a>
          <a href="https://topuni.com.cn" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-5 text-slate-400 hover:text-gold transition-all group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/30 transition-all border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-base font-medium tracking-wider">topuni.com.cn</span>
          </a>
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-gold/90 drop-shadow-sm">Global Presence</h4>
        <div className="flex flex-wrap gap-4">
          {['UK', 'USA', 'AU', 'CA', 'HK', 'SG', 'MY', 'NZ'].map(c => (
            <span key={c} className="px-4 py-2 bg-white/5 text-slate-500 text-[11px] font-black rounded-xl border border-white/10 hover:border-gold/60 hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-default shadow-sm">{c}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 text-center text-slate-600 text-[11px] font-black uppercase tracking-[0.6em]">
      © 2026 TopUni Global Education. All Rights Reserved.
    </div>
  </footer>
);

const COUNTRY_COLORS: Record<string, string> = {
  uk: 'text-blue-600',
  australia: 'text-emerald-600',
  singapore: 'text-red-600',
  hongkong: 'text-purple-600',
  malaysia: 'text-orange-600',
  usa: 'text-indigo-600',
  canada: 'text-rose-600',
  newzealand: 'text-teal-600',
};

export default function App() {
  const [droppedCountry, setDroppedCountry] = useState<CountryData | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [droppedUniversity, setDroppedUniversity] = useState<PriceItem | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeMajorTab, setActiveMajorTab] = useState<'undergrad' | 'master' | null>(null);
  const [selectedMajorIndex, setSelectedMajorIndex] = useState<number | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const majorsSectionRef = useRef<HTMLDivElement>(null);

  // Reset major tab and selection when university changes
  useEffect(() => {
    setActiveMajorTab(null);
    setSelectedMajorIndex(null);
  }, [droppedUniversity]);

  const toggleMajorTab = (tab: 'undergrad' | 'master') => {
    if (activeMajorTab === tab) {
      setActiveMajorTab(null);
      setSelectedMajorIndex(null);
    } else {
      setActiveMajorTab(tab);
      setSelectedMajorIndex(null);
      // Scroll to the section
      setTimeout(() => {
        if (majorsSectionRef.current) {
          const yOffset = 0; // Align perfectly with the top
          const y = majorsSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast('已复制到剪贴板');
    setTimeout(() => setCopyToast(null), 2000);
  };

  const handleDragStart = (e: React.DragEvent, type: 'country' | 'university' | 'all', data: any) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('data', JSON.stringify(data));
  };

  const handleDropLeft = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const data = JSON.parse(e.dataTransfer.getData('data'));

    if (type === 'country') {
      setDroppedCountry(data);
      setIsAllSelected(false);
      setDroppedUniversity(null);
    } else if (type === 'all') {
      setIsAllSelected(true);
      setDroppedCountry(null);
      setDroppedUniversity(null);
    }
  };

  const handleDropRight = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const data = JSON.parse(e.dataTransfer.getData('data'));

    if (type === 'university') {
      setDroppedUniversity(data);
    }
  };

  const clearLeft = () => {
    setDroppedCountry(null);
    setIsAllSelected(false);
    setDroppedUniversity(null);
  };

  const clearRight = () => {
    setDroppedUniversity(null);
  };

  const groupedAllUniversities = useMemo(() => {
    const leftIds = ['singapore', 'hongkong', 'malaysia'];
    const rightIds = ['uk', 'australia', 'usa', 'canada', 'newzealand'];
    
    const left = PRICE_DATA.filter(c => leftIds.includes(c.id));
    const right = PRICE_DATA.filter(c => rightIds.includes(c.id));
    
    return { left, right };
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-blue selection:text-white bg-[#fcfcfd]">
      {/* Copy Toast */}
      <AnimatePresence>
        {copyToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 border border-white/10"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold tracking-wider">{copyToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 pt-4 pb-3 relative z-20">
        {/* Price Display Area (Moved to top) */}
        {droppedUniversity && !isAllSelected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 md:p-10 bg-white rounded-[2rem] shadow-2xl border border-brand-blue/10 text-center relative"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue via-hermes-orange to-gold rounded-t-[2rem]" />
            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-1 md:mb-2">Official Service Price</p>
            <div className={`font-black text-brand-blue flex items-center justify-center mb-1 md:mb-2 whitespace-nowrap font-aptos ${
              droppedUniversity.price.includes('｜') ? 'text-2xl md:text-5xl' : 'text-4xl md:text-7xl'
            }`}>
              {droppedUniversity.price.includes('¥') ? (
                <>
                  <span className={`${droppedUniversity.price.includes('｜') ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'} mr-1 md:mr-2 opacity-30`}>¥</span>
                  {droppedUniversity.price.replace(/¥/g, '')}
                </>
              ) : (
                <span className="text-hermes-orange italic">{droppedUniversity.price}</span>
              )}
            </div>
            <div className="h-[1px] w-12 md:w-20 bg-slate-100 mx-auto mb-1 md:mb-2" />
            <div className="flex flex-col items-center">
              <p className="text-base md:text-xl text-slate-900 font-bold">{droppedUniversity.name}</p>
              <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 italic font-aptos">{droppedUniversity.enName}</p>
              <p className="mt-2 text-[9px] md:text-[11px] text-slate-400 font-medium">以上费用均不含学费、官方申请费等第三方费用。</p>
            </div>

            {/* Majors Section */}
            {(droppedUniversity.undergradMajors || droppedUniversity.masterMajors) && (
              <div ref={majorsSectionRef} className="mt-3 pt-0 relative">
                <div className={`transition-all duration-500 ${activeMajorTab ? 'sticky top-0 z-[100] bg-white/98 backdrop-blur-2xl py-4 -mx-6 md:-mx-10 px-6 md:px-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border-b border-slate-100' : ''}`}>
                  <div className="flex items-center justify-center space-x-4 md:space-x-8 text-sm md:text-base font-bold">
                    {droppedUniversity.undergradMajors && (
                      <button 
                        onClick={() => toggleMajorTab('undergrad')}
                        className={`transition-colors flex items-center space-x-2 ${activeMajorTab === 'undergrad' ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>本科专业 ({droppedUniversity.undergradMajors.length})</span>
                      </button>
                    )}
                    <span className="text-slate-200">|</span>
                    {droppedUniversity.masterMajors && (
                      <button 
                        onClick={() => toggleMajorTab('master')}
                        className={`transition-colors flex items-center space-x-2 ${activeMajorTab === 'master' ? 'text-brand-blue' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>硕士专业 ({droppedUniversity.masterMajors.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeMajorTab && (
                    <motion.div
                      key={activeMajorTab}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 mt-6 text-left">
                        {(activeMajorTab === 'undergrad' ? droppedUniversity.undergradMajors : droppedUniversity.masterMajors)?.map((major, idx) => {
                          const isSelected = selectedMajorIndex === idx;
                          return (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              onClick={() => setSelectedMajorIndex(isSelected ? null : idx)}
                              className={`p-1.5 md:p-2 rounded-lg border transition-all group relative cursor-pointer ${
                                isSelected 
                                  ? 'bg-brand-blue/5 border-brand-blue/40 shadow-sm' 
                                  : 'bg-slate-50 border-slate-100 hover:border-brand-blue/20 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                <div className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 transition-colors ${
                                  isSelected ? 'bg-brand-blue' : 'bg-brand-blue/40 group-hover:bg-brand-blue'
                                }`} />
                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className={`text-[11px] md:text-xs italic font-aptos leading-tight pr-2 transition-colors ${
                                      isSelected ? 'text-brand-blue font-medium' : 'text-slate-500'
                                    } ${isSelected ? '' : 'truncate'}`}>
                                      {major.enName}
                                    </p>
                                    <div className={`flex items-center space-x-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(major.enName);
                                        }}
                                        className="p-1 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-md transition-all"
                                        title="复制英文名"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                      <a 
                                        href={major.link || `https://www.google.com/search?q=${droppedUniversity.name}+${major.enName}+official+program+page`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-md transition-all"
                                        title={major.link ? "查看详情" : "搜索专业详情"}
                                      >
                                        <ExternalLink className={`w-3 h-3 ${major.link ? '' : 'opacity-40'}`} />
                                      </a>
                                    </div>
                                  </div>
                                  <p className={`text-xs md:text-sm font-bold leading-tight transition-colors ${
                                    isSelected ? 'text-brand-blue' : 'text-slate-800'
                                  }`}>
                                    {major.name}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* Drop Zones */}
        <div className="flex flex-row gap-3 md:gap-6 mb-8">
          {/* Left Zone (30%) */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropLeft}
            className={`flex-[3] h-12 md:h-14 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center relative group overflow-hidden cursor-pointer ${
              droppedCountry || isAllSelected 
                ? 'bg-white border-brand-blue shadow-xl border-solid' 
                : 'bg-white border-brand-blue/20 border-dashed hover:border-brand-blue/40 shadow-inner'
            }`}
          >
            {!droppedCountry && !isAllSelected && (
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0052D4 2px, transparent 0)', backgroundSize: '12px 12px' }} />
            )}
            {droppedCountry ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={clearLeft}
                className="w-full h-full bg-white text-slate-900 flex items-center justify-center px-4"
              >
                <div className="flex items-center">
                  <span className="font-bold text-sm md:text-lg leading-tight text-slate-900">{droppedCountry.name}</span>
                </div>
              </motion.div>
            ) : isAllSelected ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={clearLeft}
                className="w-full h-full bg-white text-slate-900 flex items-center justify-center px-4"
              >
                <div className="flex items-center">
                  <span className="font-bold text-sm md:text-lg leading-tight text-slate-900">全部</span>
                </div>
              </motion.div>
            ) : (
              <div className="text-brand-blue/40 flex items-center space-x-2 pointer-events-none z-10">
                <MapPin className="w-3 h-3" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">选择国家</span>
              </div>
            )}
          </div>

          {/* Right Zone (70%) */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropRight}
            className={`flex-[7] h-12 md:h-14 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center relative group overflow-hidden cursor-pointer ${
              droppedUniversity 
                ? 'bg-white border-hermes-orange shadow-xl border-solid' 
                : 'bg-white border-hermes-orange/20 border-dashed hover:border-hermes-orange/40 shadow-inner'
            }`}
          >
            {!droppedUniversity && (
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F27D26 2px, transparent 0)', backgroundSize: '12px 12px' }} />
            )}
            {droppedUniversity ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={clearRight}
                className="w-full h-full bg-white text-slate-900 flex items-center justify-center px-4"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className={`w-5 h-5 md:w-6 md:h-6 ${droppedCountry ? COUNTRY_COLORS[droppedCountry.id] : 'text-hermes-orange'}`} />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs md:text-sm leading-tight text-slate-900 line-clamp-1">{droppedUniversity.name}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">{droppedUniversity.enName}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-hermes-orange/40 flex items-center space-x-2 pointer-events-none z-10">
                <GraduationCap className="w-3 h-3" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">选择大学</span>
              </div>
            )}
          </div>
        </div>

        {/* Source Area: Countries */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center shadow-md">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">选择国家</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Drag to start your search</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {!isAllSelected && (
              <motion.div
                onClick={() => {
                  if (isAllSelected) {
                    setIsAllSelected(false);
                  } else {
                    setIsAllSelected(true);
                    setDroppedCountry(null);
                    setDroppedUniversity(null);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${(droppedCountry || isAllSelected) ? 'w-8 h-8 md:w-10 md:h-10 rounded-full' : 'h-10 md:h-12 px-4 md:px-6 rounded-xl'} flex items-center justify-center bg-white border shadow-sm cursor-pointer transition-all ${
                  isAllSelected ? 'border-brand-blue ring-2 ring-brand-blue/20 text-brand-blue' : 'border-slate-200 text-slate-800 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                <span className={`${(droppedCountry || isAllSelected) ? 'text-lg' : 'text-xl mr-2'}`}>🌍</span>
                {!(droppedCountry || isAllSelected) && (
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs md:text-sm leading-tight">全部</span>
                    <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider">All</span>
                  </div>
                )}
              </motion.div>
            )}
            {PRICE_DATA.filter(country => country.id !== droppedCountry?.id).map((country) => (
              <motion.div
                key={country.id}
                onClick={() => {
                  if (droppedCountry?.id === country.id) {
                    setDroppedCountry(null);
                    setDroppedUniversity(null);
                  } else {
                    setDroppedCountry(country);
                    setIsAllSelected(false);
                    setDroppedUniversity(null);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${(droppedCountry || isAllSelected) ? 'w-8 h-8 md:w-10 md:h-10 rounded-full' : 'h-10 md:h-12 px-4 md:px-6 rounded-xl'} flex items-center justify-center bg-white border shadow-sm cursor-pointer transition-all group ${
                  droppedCountry?.id === country.id ? 'border-brand-blue ring-2 ring-brand-blue/20 text-brand-blue' : 'border-slate-200 hover:border-brand-blue'
                }`}
              >
                <span className={`${(droppedCountry || isAllSelected) ? 'text-lg' : 'text-xl mr-2'}`}>{country.flag}</span>
                {!(droppedCountry || isAllSelected) && (
                    <div className="flex flex-col text-left">
                      <span className={`font-bold text-xs md:text-sm leading-tight ${droppedCountry?.id === country.id ? 'text-brand-blue' : 'text-slate-700 group-hover:text-brand-blue'}`}>{country.name}</span>
                      <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider font-aptos">{country.enName}</span>
                    </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* University List / Price Display Area */}
        <div className="mb-8">
          {isAllSelected ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column: Singapore, HK, Malaysia */}
              <div className="space-y-4">
                {groupedAllUniversities.left.map(country => (
                  <div key={country.id} id={`section-${country.id}`} className="glass-card rounded-2xl overflow-hidden scroll-mt-32">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{country.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">服务价格</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {country.categories.flatMap(cat => cat.items).map((uni, idx) => (
                        <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <GraduationCap className={`w-4 h-4 ${COUNTRY_COLORS[country.id] || 'text-slate-400'}`} />
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-bold text-sm">{uni.name}</span>
                              <span className="text-slate-400 text-[10px] font-aptos">{uni.enName}</span>
                            </div>
                          </div>
                          <span className={`text-brand-blue font-black font-aptos ${uni.price.includes('｜') ? 'text-[10px] md:text-xs' : 'text-sm'}`}>{uni.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: UK, Australia, USA, Canada */}
              <div className="space-y-4">
                {groupedAllUniversities.right.map(country => (
                  <div key={country.id} id={`section-${country.id}`} className="glass-card rounded-2xl overflow-hidden scroll-mt-32">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{country.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">服务价格</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {country.categories.flatMap(cat => cat.items).map((uni, idx) => (
                        <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <GraduationCap className={`w-4 h-4 ${COUNTRY_COLORS[country.id] || 'text-slate-400'}`} />
                            <div className="flex flex-col">
                              <span className="text-slate-900 font-bold text-sm">{uni.name}</span>
                              <span className="text-slate-400 text-[10px] font-aptos">{uni.enName}</span>
                            </div>
                          </div>
                          <span className={`text-brand-blue font-black font-aptos ${uni.price.includes('｜') ? 'text-[10px] md:text-xs' : 'text-sm'}`}>{uni.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : droppedCountry ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 md:gap-3">
                {droppedCountry.categories.flatMap(cat => cat.items).map((uni, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => {
                      if (droppedUniversity?.name === uni.name) {
                        setDroppedUniversity(null);
                      } else {
                        setDroppedUniversity(uni);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-10 md:h-12 px-4 md:px-6 flex items-center bg-white border rounded-xl shadow-sm cursor-pointer transition-all group ${
                      droppedUniversity?.name === uni.name ? 'border-hermes-orange ring-2 ring-hermes-orange/20' : 'border-slate-200 hover:border-hermes-orange'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className={`w-4 h-4 flex-shrink-0 ${COUNTRY_COLORS[droppedCountry.id] || 'text-slate-400'} ${droppedUniversity?.name === uni.name ? 'text-hermes-orange' : ''}`} />
                      <div className="flex flex-col text-left">
                        <span className={`font-bold text-xs md:text-sm line-clamp-1 ${droppedUniversity?.name === uni.name ? 'text-hermes-orange' : 'text-slate-700 group-hover:text-hermes-orange'}`}>{uni.name}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 line-clamp-1 font-aptos">{uni.enName}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* Floating Navigation Button */}
      {isAllSelected && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="bg-white/80 backdrop-blur-xl border border-slate-200 p-3 rounded-2xl shadow-2xl flex flex-col space-y-3"
              >
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsNavOpen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                >
                  <Home className="w-5 h-5" />
                </button>
                <div className="h-[1px] bg-slate-100 w-full" />
                {PRICE_DATA.map(country => (
                  <button
                    key={country.id}
                    onClick={() => {
                      document.getElementById(`section-${country.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setIsNavOpen(false);
                    }}
                    className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform shadow-sm text-xl"
                  >
                    {country.flag}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all ${
              isNavOpen ? 'bg-gold text-slate-950' : 'bg-slate-950 text-gold'
            }`}
          >
            <Menu className={`w-6 h-6 transition-transform ${isNavOpen ? 'rotate-90' : ''}`} />
          </motion.button>
        </div>
      )}

      <Footer />
    </div>
  );
}
