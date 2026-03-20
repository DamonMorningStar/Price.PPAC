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
    { name: '待补充', enName: 'To be updated' },
  ],
  master: [
    { name: '待补充', enName: 'To be updated' },
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
          { name: '牛津大学', enName: 'University of Oxford', price: '¥80,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '剑桥大学', enName: 'University of Cambridge', price: '¥80,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '帝国理工学院', enName: 'Imperial College London', price: '¥60,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '伦敦政治经济学院', enName: 'London School of Economics (LSE)', price: '¥60,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '伦敦大学学院', enName: 'University College London (UCL)', price: '¥50,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '伦敦国王学院', enName: 'King\'s College London (KCL)', price: '¥30,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '华威大学', enName: 'University of Warwick', price: '¥30,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '曼彻斯特大学', enName: 'University of Manchester', price: '¥30,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '爱丁堡大学', enName: 'University of Edinburgh', price: '¥30,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '伯明翰大学', enName: 'University of Birmingham', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '格拉斯哥大学', enName: 'University of Glasgow', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '布里斯托大学', enName: 'University of Bristol', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '南安普顿大学', enName: 'University of Southampton', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '利兹大学', enName: 'University of Leeds', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '杜伦大学', enName: 'Durham University', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '英国其他', enName: 'Other UK Universities', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
        ]
      }
    ]
  },
  {
    id: 'australia',
    name: '澳洲',
    enName: 'Australia',
    flag: '🇦🇺',
    categories: [
      {
        title: 'Top Universities',
        items: [
          { name: '墨尔本大学', enName: 'University of Melbourne', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '悉尼大学', enName: 'University of Sydney', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '新南威尔士大学', enName: 'University of New South Wales (UNSW)', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '澳国立大学（普通｜直录）', enName: 'Australian National University (ANU)', price: '¥3000｜¥9.8万', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '昆士兰大学', enName: 'University of Queensland (UQ)', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '莫那什大学', enName: 'Monash University', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '西澳大学', enName: 'University of Western Australia (UWA)', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '阿德莱德大学', enName: 'University of Adelaide', price: '¥3,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '悉尼科技大学', enName: 'University of Technology Sydney', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '麦考瑞大学', enName: 'Macquarie University', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '皇家墨尔本理工大学', enName: 'RMIT University', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '迪肯大学', enName: 'Deakin University', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '科廷大学', enName: 'Curtin University', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '纽卡斯尔大学', enName: 'University of Newcastle', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '昆士兰科技大学', enName: 'Queensland University of Technology', price: '¥3000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
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
          { name: '新加坡国立大学', enName: 'National University of Singapore (NUS)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '南洋理工大学', enName: 'Nanyang Technological University (NTU)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '新加坡管理大学', enName: 'Singapore Management University (SMU)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '新加坡科技与设计大学', enName: 'Singapore University of Technology and Design (SUTD)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '新加坡理工大学', enName: 'Singapore Institute of Technology (SIT)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
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
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '香港中文大学', 
            enName: 'The Chinese University of Hong Kong (CUHK)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '香港科技大学', 
            enName: 'The Hong Kong University of Science and Technology (HKUST)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '香港理工大学', 
            enName: 'The Hong Kong Polytechnic University (PolyU)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '香港城市大学', 
            enName: 'City University of Hong Kong (CityU)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { name: '香港浸会大学', enName: 'Hong Kong Baptist University (HKBU)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '香港岭南大学', enName: 'Lingnan University', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '香港都会大学', enName: 'Hong Kong Metropolitan University (HKMU)', price: '¥25,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '香港高科院（普通｜直录）', enName: 'THEI', price: '¥2.5万｜¥18万', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '香港树仁大学', enName: 'Hong Kong Shue Yan University (HKSYU)', price: '¥20,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '香港恒生大学', enName: 'The Hang Seng University of Hong Kong (HSUHK)', price: '¥20,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '珠海学院', enName: 'Chu Hai College of Higher Education', price: '¥20,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
          { name: '东华学院', enName: 'Tung Wah College', price: '¥20,000', undergradMajors: SAMPLE_MAJORS.undergrad, masterMajors: SAMPLE_MAJORS.master },
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
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '马来西亚理科大学', 
            enName: 'Universiti Sains Malaysia (USM)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '马来西亚国立大学', 
            enName: 'Universiti Kebangsaan Malaysia (UKM)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '博特拉大学', 
            enName: 'Universiti Putra Malaysia (UPM)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '马来西亚理工大学', 
            enName: 'Universiti Teknologi Malaysia (UTM)', 
            price: '¥25,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '思特雅大学', 
            enName: 'UCSI University', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '英迪大学', 
            enName: 'INTI International University', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '泰勒大学', 
            enName: 'Taylor\'s University', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '双威大学', 
            enName: 'Sunway University', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '世纪大学', 
            enName: 'SEGi University', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '马来西亚城市大学', 
            enName: 'City University Malaysia', 
            price: '¥8,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
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
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
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
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '不列颠哥伦比亚大学', 
            enName: 'University of British Columbia (UBC)', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '麦吉尔大学', 
            enName: 'McGill University', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '滑铁卢大学', 
            enName: 'University of Waterloo', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '阿尔伯塔大学', 
            enName: 'University of Alberta', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '麦克马斯特大学', 
            enName: 'McMaster University', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '西安大略大学', 
            enName: 'Western University', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '渥太华大学', 
            enName: 'University of Ottawa', 
            price: '¥45,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
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
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '奥塔哥大学', 
            enName: 'University of Otago', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '惠灵顿大学', 
            enName: 'Victoria University of Wellington', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '奥克兰理工大学', 
            enName: 'Auckland University of Technology (AUT)', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '梅西大学', 
            enName: 'Massey University', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '怀卡托大学', 
            enName: 'University of Waikato', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '林肯大学', 
            enName: 'Lincoln University', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
          },
          { 
            name: '坎特伯雷大学', 
            enName: 'University of Canterbury', 
            price: '¥3,000', 
            undergradMajors: SAMPLE_MAJORS.undergrad, 
            masterMajors: SAMPLE_MAJORS.master 
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
  <footer className="bg-[#010101] border-t border-white/10 py-10 px-4 mt-1 relative overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
    {/* Deep Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    
    {/* Ultra-Vivid Background Glows */}
    <div className="absolute -bottom-20 left-1/4 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/30 blur-[140px] pointer-events-none" />
    <div className="absolute -bottom-20 right-1/4 translate-x-1/2 w-[800px] h-[400px] bg-hermes-orange/30 blur-[140px] pointer-events-none" />
    <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gold/40 blur-[160px] pointer-events-none opacity-70" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-emerald-500/10 blur-[80px] pointer-events-none" />
    
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Top Accent Line */}
        <div className="flex items-center space-x-4 w-full max-w-md">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Main Branding Section */}
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-[9px] font-black uppercase tracking-[0.3em] text-gold/80 mb-1">
            Elite Global Services
          </div>
          <h3 className="text-4xl md:text-6xl font-serif font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-gold to-hermes-orange drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
            TopUni Global Education<span className="text-hermes-orange">.</span>
          </h3>
        </div>

        {/* Divider with Glow */}
        <div className="relative w-full max-w-xl">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-0 h-[1px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent blur-sm" />
        </div>

        {/* Tagline Section */}
        <div className="max-w-3xl text-center">
          <p className="text-lg md:text-xl font-medium leading-relaxed tracking-wide text-slate-300">
            Providing <span className="text-white font-bold underline decoration-gold/50 underline-offset-8">premium</span> global education planning services with <span className="text-gold font-bold italic">elite quality</span> and official standards.
          </p>
        </div>
      </div>
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
