/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  Menu
} from 'lucide-react';

// --- Data Definition ---

interface PriceItem {
  name: string;
  enName?: string;
  price: string;
  note?: string;
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
          { name: '伦敦大学学院', enName: 'University College London (UCL)', price: '¥50,000' },
          { name: '伦敦国王学院', enName: 'King\'s College London (KCL)', price: '¥30,000' },
          { name: '华威大学', enName: 'University of Warwick', price: '¥30,000' },
          { name: '曼彻斯特大学', enName: 'University of Manchester', price: '¥30,000' },
          { name: '爱丁堡大学', enName: 'University of Edinburgh', price: '¥30,000' },
          { name: '伯明翰大学', enName: 'University of Birmingham', price: '¥3,000' },
          { name: '格拉斯哥大学', enName: 'University of Glasgow', price: '¥3,000' },
          { name: '布里斯托大学', enName: 'University of Bristol', price: '¥3,000' },
          { name: '南安普顿大学', enName: 'University of Southampton', price: '¥3,000' },
          { name: '利兹大学', enName: 'University of Leeds', price: '¥3,000' },
          { name: '杜伦大学', enName: 'Durham University', price: '¥3,000' },
          { name: '英国其他', enName: 'Other UK Universities', price: '¥3,000' },
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
          { name: '墨尔本大学', enName: 'University of Melbourne', price: '¥6,000' },
          { name: '悉尼大学', enName: 'University of Sydney', price: '¥3,000' },
          { name: '新南威尔士大学', enName: 'University of New South Wales (UNSW)', price: '¥3,000' },
          { name: '澳国立大学', enName: 'Australian National University (ANU)', price: '¥3,000' },
          { name: '昆士兰大学', enName: 'University of Queensland (UQ)', price: '¥3,000' },
          { name: '西澳大学', enName: 'University of Western Australia (UWA)', price: '¥3,000' },
          { name: '阿德莱德大学', enName: 'University of Adelaide', price: '¥3,000' },
          { name: '莫那什大学', enName: 'Monash University', price: '¥3,000' },
          { name: '澳洲其他', enName: 'Other Australian Universities', price: '¥3,000' },
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
          { name: '新加坡国立大学', enName: 'National University of Singapore (NUS)', price: '¥25,000' },
          { name: '南洋理工大学', enName: 'Nanyang Technological University (NTU)', price: '¥25,000' },
          { name: '新加坡管理大学', enName: 'Singapore Management University (SMU)', price: '¥25,000' },
          { name: '新加坡科技与设计大学', enName: 'Singapore University of Technology and Design (SUTD)', price: '¥25,000' },
          { name: '新加坡理工大学', enName: 'Singapore Institute of Technology (SIT)', price: '¥25,000' },
          { name: '本科直升大二PPAC(3个月｜9个月)', enName: 'premium planning academic curriculum', price: '13.8万｜19.8万' },
          { name: 'Kaplan 高等教育学院', enName: 'Kaplan Higher Education Academy', price: '¥3,000' },
          { name: 'PSB 学院', enName: 'PSB Academy', price: '¥3,000' },
          { name: '科廷大学新加坡分校', enName: 'Curtin Singapore', price: '¥3,000' },
          { name: '詹姆斯库克大学新加坡分校', enName: 'James Cook University Singapore', price: '¥3,000' },
          { name: '伦敦商业与金融学院新加坡校区', enName: 'LSBF Singapore', price: '¥3,000' },
          { name: '莱佛士设计学院', enName: 'Raffles Design Institute', price: '¥3,000' },
          { name: '南洋艺术学院 & 拉萨尔艺术学院', enName: 'NAFA & LASALLE College of the Arts', price: '¥25,000' },
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
          { name: '香港大学（普通｜多元卓越计划）', enName: 'The University of Hong Kong (HKU)', price: '2.5万｜18万' },
          { name: '香港中文大学', enName: 'The Chinese University of Hong Kong (CUHK)', price: '¥25,000' },
          { name: '香港科技大学', enName: 'The Hong Kong University of Science and Technology (HKUST)', price: '¥25,000' },
          { name: '香港理工大学', enName: 'The Hong Kong Polytechnic University (PolyU)', price: '¥25,000' },
          { name: '香港城市大学', enName: 'City University of Hong Kong (CityU)', price: '¥25,000' },
          { name: '香港浸会大学', enName: 'Hong Kong Baptist University (HKBU)', price: '¥25,000' },
          { name: '香港岭南大学', enName: 'Lingnan University', price: '¥25,000' },
          { name: '香港都会大学', enName: 'Hong Kong Metropolitan University (HKMU)', price: '¥25,000' },
          { name: '香港高等教育科技学院（VTC 训练局）', enName: 'THEi (VTC)', price: '¥25,000' },
          { name: '香港树仁大学', enName: 'Hong Kong Shue Yan University (HKSYU)', price: '¥20,000' },
          { name: '香港恒生大学', enName: 'The Hang Seng University of Hong Kong (HSUHK)', price: '¥20,000' },
          { name: '珠海学院', enName: 'Chu Hai College of Higher Education', price: '¥20,000' },
          { name: '东华学院', enName: 'Tung Wah College', price: '¥20,000' },
          { name: '大陆分校（港中深、港科广、港城东莞）', enName: 'Mainland Campuses (CUHK-SZ, HKUST-GZ, etc.)', price: '¥25,000' },
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
          { name: '马来亚大学', enName: 'University of Malaya (UM)', price: '¥40,000' },
          { name: '马来西亚理科大学', enName: 'Universiti Sains Malaysia (USM)', price: '¥25,000' },
          { name: '马来西亚国立大学', enName: 'Universiti Kebangsaan Malaysia (UKM)', price: '¥25,000' },
          { name: '博特拉大学', enName: 'Universiti Putra Malaysia (UPM)', price: '¥25,000' },
          { name: '马来西亚理工大学', enName: 'Universiti Teknologi Malaysia (UTM)', price: '¥25,000' },
          { name: '思特雅大学', enName: 'UCSI University', price: '¥8,000' },
          { name: '英迪大学', enName: 'INTI International University', price: '¥8,000' },
          { name: '泰勒大学', enName: 'Taylor\'s University', price: '¥8,000' },
          { name: '双威大学', enName: 'Sunway University', price: '¥8,000' },
          { name: '世纪大学', enName: 'SEGi University', price: '¥8,000' },
          { name: '马来西亚城市大学', enName: 'City University Malaysia', price: '¥8,000' },
          { name: '马来西亚其他', enName: 'Other Malaysian Universities', price: '¥8,000' },
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
          { name: 'US News Top 30 大学', enName: 'US News Top 30 Universities', price: '¥150,000' },
          { name: 'US News Top 30-60 大学', enName: 'US News Top 30-60 Universities', price: '¥120,000' },
          { name: 'US News Top 100 大学', enName: 'US News Top 100 Universities', price: '¥100,000' },
          { name: '美国其他', enName: 'Other US Universities', price: '¥40,000' },
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
          { name: '全部大学', enName: 'All Canadian Universities', price: '¥45,000' },
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
          { name: '奥克兰大学', enName: 'University of Auckland', price: '¥6,000' },
          { name: '奥塔哥大学', enName: 'University of Otago', price: '¥3,000' },
          { name: '惠灵顿大学', enName: 'Victoria University of Wellington', price: '¥3,000' },
          { name: '奥克兰理工大学', enName: 'Auckland University of Technology', price: '¥3,000' },
          { name: '梅西大学', enName: 'Massey University', price: '¥3,000' },
          { name: '怀卡托大学', enName: 'University of Waikato', price: '¥3,000' },
          { name: '林肯大学', enName: 'Lincoln University', price: '¥3,000' },
          { name: '坎特伯雷大学', enName: 'University of Canterbury', price: '¥3,000' },
          { name: '澳洲其他', enName: 'Other New Zealand Universities', price: '¥3,000' },
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
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 pt-4 pb-3 relative z-20">
        {/* Price Display Area (Moved to top) */}
        {droppedUniversity && !isAllSelected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 md:p-10 bg-white rounded-[2rem] shadow-2xl border border-brand-blue/10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue via-hermes-orange to-gold" />
            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-3 md:mb-4">Official Service Price</p>
            <div className={`font-black text-brand-blue flex items-center justify-center mb-3 md:mb-4 whitespace-nowrap font-aptos ${
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
            <div className="h-[1px] w-12 md:w-20 bg-slate-100 mx-auto mb-3 md:mb-4" />
            <div className="flex flex-col items-center">
              <p className="text-base md:text-xl text-slate-900 font-bold">{droppedUniversity.name}</p>
              <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 italic font-aptos">{droppedUniversity.enName}</p>
            </div>
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
