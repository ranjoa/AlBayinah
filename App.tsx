
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisTab, GeminiAnalysisResponse, WordNode, WordLink, DiscoveryItem, StatCategory } from './types';
import { INITIAL_NETWORK_DATA, FEATURED_DISCOVERIES, QURAN_STATS, DETAILED_STATS_DATA } from './constants';
import { GeminiService } from './services/geminiService';
import NetworkGraph from './components/NetworkGraph';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis, CartesianGrid } from 'recharts';
import { 
  Search, Dna, BarChart3, Lightbulb, FlaskConical, Home, MessageSquare, Send, X, Zap, Sparkles, 
  ArrowLeft, Star, Type, Layers, Book, Activity, PieChart, Info, LogIn, Heart, Eye, Share2, Menu,
  Hash, LayoutGrid, Compass, ShieldCheck, Cpu, CheckCircle2, ChevronLeft, Target, TrendingUp, Boxes,
  Microscope, Globe, Award, Binary, GitMerge, Component, Camera, History, FileSearch, ArrowRightLeft,
  Quote
} from 'lucide-react';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>(AnalysisTab.HOME);
  const [selectedDiscovery, setSelectedDiscovery] = useState<DiscoveryItem | null>(null);
  const [selectedStatCategory, setSelectedStatCategory] = useState<StatCategory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{title: string, context: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearched, setLastSearched] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<GeminiAnalysisResponse | null>(null);
  const [networkData, setNetworkData] = useState<{ nodes: WordNode[], links: WordLink[] }>(INITIAL_NETWORK_DATA);
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model', text: string }>>([
    { role: 'model', text: 'مرحباً بك في مركز الاستشارات الحكيم. كيف يمكنني مساعدتك في رحلة البحث والتدبر اليوم؟' }
  ]);

  const handleSearch = useCallback(async (queryToUse?: string) => {
    const q = (queryToUse || searchQuery).trim();
    if (!q) return;
    
    setIsAnalyzing(true);
    setActiveTab(AnalysisTab.SEARCH);
    setLastSearched(q);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await gemini.analyzeQuery(q);
      setAnalysisData(result);
      if (result.visualData && result.visualData.nodes.length > 0) {
        setNetworkData(result.visualData);
      }
    } catch (error) {
      console.error("خطأ في البحث:", error);
    } finally { 
      setIsAnalyzing(false); 
    }
  }, [searchQuery]);

  const openTopicDetail = (topic: string) => {
    const topicData: Record<string, string> = {
      'الحديد': 'سورة الحديد هي السورة الوحيدة التي تحمل اسم عنصر كيميائي. يُظهر التحليل العددي أن القيمة الحسابية لكلمة "الحديد" مطابقة للوزن الذري للعنصر، مما يشير إلى أصل العنصر القادم من الفضاء.',
      'الحساب': 'يرتبط مفهوم الحساب في القرآن بالدقة الكونية والميزان المطلق. "والشمس والقمر بحسبان" تؤكد أن حركة الأجرام تتبع نظاماً رياضياً محكماً يسهل استنباطه رقمياً.',
      'الأرض': 'تشكل اليابسة والماء توازناً دقيقاً ورد في القرآن بنسب مئوية تطابق القياسات الجغرافية الحديثة، حيث وردت كلمة البحر 32 مرة والبر 13 مرة.',
      'التوازن': 'التوازن أو الميزان هو المبدأ الحاكم للخلق. من توازن الكلمات المتضادة إلى توازن القوى الفيزيائية، يضع القرآن خارطة طريق لفهم استقرار الكون.',
      'اليقين': 'اليقين هو الهدف الأسمى من البحث والتدبر. "البيّنة" تهدف لتحويل الإيمان الغيبي إلى يقين علمي وإحصائي عبر الأدلة الملموسة.'
    };
    setSelectedTopic({ title: topic, context: topicData[topic] || 'موضوع للبحث والتحليل في نسيج الوحي الشريف.' });
    setActiveTab(AnalysisTab.TOPIC_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDiscovery = (item: DiscoveryItem) => {
    setSelectedDiscovery(item);
    setActiveTab(AnalysisTab.DISCOVERY_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openStatDetail = (cat: StatCategory) => {
    setSelectedStatCategory(cat);
    setActiveTab(AnalysisTab.STATS_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!currentChatMessage.trim() || isChatLoading) return;
    
    const msg = currentChatMessage;
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setCurrentChatMessage('');
    setIsChatLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = gemini.createChatSession();
      }
      const response = await chatSessionRef.current.sendMessage({ message: msg });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text || "عذراً، لم أستطع المعالجة حالياً." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "حدث خطأ في الاتصال بالمحرّك الحكيم." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const IconMap: any = {
    'كتاب': <Book size={24} className="text-emerald-600" />,
    'شرارة': <Sparkles size={24} className="text-emerald-600" />,
    'نص': <Type size={24} className="text-emerald-600" />,
    'طبقات': <Layers size={24} className="text-emerald-600" />,
    'حمض_نووي': <Dna size={24} className="text-emerald-600" />,
    'نجمة': <Star size={24} className="text-emerald-600" />
  };

  const isLabSubTab = [AnalysisTab.LAB_CHARS, AnalysisTab.LAB_GEOMETRY, AnalysisTab.LAB_FREQUENCY, AnalysisTab.LAB_VISION, AnalysisTab.LAB_TIMELINE].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col relative z-10 selection:bg-emerald-50 selection:text-emerald-900 bg-white antialiased">
      
      <header className="h-16 bg-white border-b border-emerald-50 px-6 md:px-12 flex items-center justify-between sticky top-0 z-[100] shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab(AnalysisTab.HOME)}>
          <div className="p-2 bg-emerald-600 rounded-lg shadow-lg">
            <Dna size={20} className="text-white" />
          </div>
          <div className="flex flex-col text-right">
            <h1 className="text-lg font-black text-emerald-950 tracking-tighter leading-none">البيّنة</h1>
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">البصمة الوراثية للقرآن</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: AnalysisTab.HOME, label: 'الرئيسية', icon: <Home size={16} /> },
            { id: AnalysisTab.ANALYSIS, label: 'المختبر', icon: <Microscope size={16} /> },
            { id: AnalysisTab.DISCOVERIES, label: 'الاكتشافات', icon: <Globe size={16} /> },
            { id: AnalysisTab.STATS, label: 'الإحصائيات', icon: <BarChart3 size={16} /> }
          ].map(nav => (
            <button 
              key={nav.id}
              onClick={() => { setActiveTab(nav.id); window.scrollTo({top:0}); }} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-xs ${activeTab === nav.id || (nav.id === AnalysisTab.ANALYSIS && (activeTab === AnalysisTab.ANALYSIS || isLabSubTab)) || (nav.id === AnalysisTab.STATS && (activeTab === AnalysisTab.STATS || activeTab === AnalysisTab.STATS_DETAIL)) ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900/60 hover:text-emerald-700 hover:bg-emerald-50'}`}
            >
              {nav.icon}
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab(AnalysisTab.LOGIN)} className="bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md hover:bg-emerald-800 transition-all flex items-center gap-2">
            <LogIn size={14} /> <span>دخول</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 relative max-w-5xl mx-auto w-full">
        
        {activeTab === AnalysisTab.HOME && (
          <div className="page-transition space-y-20">
            <div className="text-center space-y-4 pt-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-emerald-950 quran-font leading-tight">
                بيانٌ <span className="text-emerald-600">يُبهر</span> العقول
              </h2>
              <p className="text-base md:text-lg text-emerald-900/60 font-medium leading-relaxed">استكشف البصمة الوراثية الرقمية والأنماط المعجزة من قلب الوحي الشريف باستخدام التحليل العددي المتقدم.</p>
              
              <div className="max-w-xl mx-auto relative group pt-4">
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ابحث عن سر رقمي، كلمة، أو آية..."
                  className="w-full h-12 bg-white border border-emerald-100 border-b-2 border-b-emerald-600 rounded-xl px-4 text-base outline-none shadow-sm transition-all text-emerald-900 text-right"
                />
                <button onClick={() => handleSearch()} className="absolute left-6 top-[calc(50%+8px)] -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-lg hover:scale-105 transition-all">
                  <Search size={18} />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['الحديد', 'الحساب', 'الأرض', 'التوازن', 'اليقين'].map(tag => (
                  <button key={tag} onClick={() => openTopicDetail(tag)} className="bg-white px-3 py-1 rounded-md text-emerald-900 font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all border border-emerald-50 shadow-sm">#{tag}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {QURAN_STATS.map((stat, i) => (
                <button 
                  key={i} 
                  onClick={() => openStatDetail(stat.id)} 
                  className="bg-white p-6 rounded-2xl border border-emerald-50 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all group flex flex-col items-center justify-center text-center relative overflow-hidden h-36"
                >
                  <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l ${stat.color}`}></div>
                  <div className="mb-3 group-hover:scale-110 transition-transform">{IconMap[stat.icon]}</div>
                  <div className="text-xl font-black text-emerald-950 leading-none">{stat.value}</div>
                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1.5">{stat.label}</div>
                </button>
              ))}
            </div>

            <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden mx-2">
               <div className="absolute top-0 right-0 p-4 opacity-5 animate-spin-slow pointer-events-none"><Dna size={200} /></div>
               <div className="space-y-4 relative z-10 text-right max-w-md">
                 <h3 className="text-2xl md:text-3xl font-black quran-font leading-tight">المنظومة الرقمية للقرآن</h3>
                 <p className="text-emerald-100/70 text-base font-medium leading-relaxed">نظام متطور يحلل التوازن المذهل بين الكلمات والأرقام، ليكشف عن بنية رياضية تحمي النص الشريف.</p>
                 <div className="flex gap-3 pt-2">
                   <button onClick={() => setActiveTab(AnalysisTab.DISCOVERIES)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-400 shadow-md">الاكتشافات</button>
                   <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="px-5 py-2 border border-emerald-400 text-emerald-400 rounded-lg font-bold text-sm hover:bg-emerald-400 hover:text-white">المختبر</button>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md text-center">
                    <Award className="text-emerald-400 mx-auto mb-2" size={32} />
                    <div className="text-2xl font-black">99.9%</div>
                    <div className="text-[10px] opacity-40 font-bold tracking-widest">دقة استدلال</div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md text-center">
                    <Cpu className="text-emerald-400 mx-auto mb-2 animate-pulse" size={32} />
                    <div className="text-2xl font-black">تحليل ذكي</div>
                    <div className="text-[10px] opacity-40 font-bold tracking-widest">معالجة فائقة</div>
                 </div>
               </div>
            </div>

            <div className="flex justify-center pb-8">
              <button 
                onClick={() => setActiveTab(AnalysisTab.CHAT_CENTER)}
                className="group flex items-center gap-4 px-8 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                <MessageSquare size={24} className="text-emerald-600 group-hover:text-white" />
                <div className="text-right">
                  <div className="font-black text-sm">استشارة المحرك الذكي</div>
                  <div className="text-xs opacity-60">احصل على إجابات تفصيلية من قاعدة بياناتنا الشاملة</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.TOPIC_DETAIL && selectedTopic && (
          <div className="page-transition space-y-10 py-6 text-right">
             <button onClick={() => setActiveTab(AnalysisTab.HOME)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                <ArrowLeft size={20} /> العودة للرئيسية
             </button>
             <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-xl space-y-8">
                <div className="space-y-2">
                  <span className="text-emerald-500 font-bold text-xs uppercase tracking-widest">سياق الموضوع</span>
                  <h2 className="text-3xl font-black text-emerald-950 quran-font leading-tight">دراسة حول مفهوم: {selectedTopic.title}</h2>
                </div>
                <p className="text-lg text-emerald-950/70 leading-relaxed quran-font bg-emerald-50/50 p-8 rounded-2xl">
                  {selectedTopic.context}
                </p>
                <div className="flex flex-col md:flex-row gap-6 items-center border-t border-emerald-50 pt-8">
                   <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-emerald-900 text-lg">هل ترغب في إجراء تحليل إحصائي كامل؟</h4>
                      <p className="text-sm opacity-60">سيقوم النظام برسم الخرائط الرقمية واستخراج كافة الأنماط المرتبطة بهذا المصطلح.</p>
                   </div>
                   <button 
                      onClick={() => handleSearch(selectedTopic.title)}
                      className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black text-lg hover:bg-emerald-700 shadow-md flex items-center gap-3 transition-all"
                   >
                      <Activity size={20} /> ابدأ التحليل الرقمي
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* المختبر (Master View) */}
        {activeTab === AnalysisTab.ANALYSIS && (
          <div className="page-transition py-6 px-4">
            <div className="bg-white p-10 md:p-14 rounded-3xl border border-emerald-50 shadow-lg text-center space-y-10 relative overflow-hidden">
               <div className="space-y-4">
                 <h2 className="text-2xl md:text-4xl font-black text-emerald-950 quran-font leading-tight">مختبر البيّنة الرقمي</h2>
                 <p className="text-base md:text-lg text-emerald-900/40 font-medium max-w-2xl mx-auto leading-relaxed">بوابة الأدوات الاستقصائية المتقدمة للبحث في أسرار الوحي.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 text-right">
                  {[
                    { tab: AnalysisTab.LAB_CHARS, icon: <Type size={28} />, title: "تحليل الحروف", desc: "أسرار الحروف المقطعة والنسق الحرفي." },
                    { tab: AnalysisTab.LAB_GEOMETRY, icon: <GitMerge size={28} />, title: "التناظر الهندسي", desc: "رسم الخرائط البصرية بين الآيات.", dark: true },
                    { tab: AnalysisTab.LAB_FREQUENCY, icon: <Component size={28} />, title: "محرك الترددات", desc: "تتبع التوازن الرقمي للكلمات." },
                    { tab: AnalysisTab.LAB_VISION, icon: <Camera size={28} />, title: "مختبر الرؤية", desc: "تحليل الذكاء الاصطناعي البصري.", dashed: true },
                    { tab: AnalysisTab.LAB_TIMELINE, icon: <History size={28} />, title: "رحلة التنزيل", desc: "تتبع الترتيب الزمني للسور.", dark: true },
                    { title: "المقارن الإحصائي", desc: "قريباً: مقارنة نصية إحصائية فكرية.", placeholder: true }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => !item.placeholder && setActiveTab(item.tab as AnalysisTab)}
                      className={`p-8 rounded-2xl space-y-4 transition-all border cursor-pointer group flex flex-col h-full ${
                        item.placeholder ? 'opacity-40 border-emerald-50 bg-emerald-50/20 cursor-default' : 
                        item.dark ? 'bg-emerald-900 text-emerald-400 border-transparent shadow-md' : 
                        item.dashed ? 'bg-white border-dashed border-emerald-100 hover:bg-emerald-50' :
                        'bg-emerald-50 border-emerald-50 hover:shadow-lg'
                      }`}
                    >
                      <div className={`p-4 rounded-xl w-fit ${item.dark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                        {item.icon ? React.cloneElement(item.icon as React.ReactElement<any>, { className: item.dark ? 'text-emerald-400' : 'text-emerald-600' }) : <Boxes size={28} />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className={`font-black text-lg ${item.dark ? 'text-white' : 'text-emerald-950'}`}>{item.title}</h4>
                        <p className={`text-xs font-bold leading-relaxed ${item.dark ? 'opacity-40' : 'opacity-60'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* تفاصيل المختبر */}
        {activeTab === AnalysisTab.LAB_CHARS && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4">
            <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمختبر
            </button>
            <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-xl space-y-10 text-right">
              <h2 className="text-3xl font-black text-emerald-950 quran-font">تحليل الحروف النورانية</h2>
              <p className="text-lg leading-relaxed text-emerald-950/70 quran-font bg-emerald-50/20 p-6 rounded-2xl">
                دراسة مصفوفة الحروف الـ 14 التي تفتتح 29 سورة، وتحليل توزيعها الإحصائي المذهل الذي يشكل بصمة رقمية فريدة.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {['الم', 'المص', 'الر', 'المر', 'كهيعص', 'طه', 'طسم', 'طس', 'يس', 'ص', 'حم', 'عسق', 'ق', 'ن'].map((code, idx) => (
                  <div key={idx} className="bg-white border border-emerald-100 p-4 rounded-xl text-emerald-900 font-black text-xl shadow-sm text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.LAB_GEOMETRY && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمختبر
            </button>
            <div className="bg-emerald-900 text-emerald-100 p-10 rounded-3xl shadow-xl space-y-8">
              <h2 className="text-3xl font-black quran-font text-emerald-400">البناء الهيكلي والحلقي</h2>
              <p className="text-lg leading-relaxed font-medium">
                يكشف هذا القسم عن نظام التناظر في السور، حيث ترتبط البدايات بالنهايات والمواضيع ببعضها البعض بنظام هندسي دقيق يركز على فكرة مركزية.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h4 className="font-black mb-2 text-white text-lg">تحليل التناظر</h4>
                  <p className="text-xs opacity-60">تحديد الآيات المتقابلة دلالياً في النسيج القرآني الشريف.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <h4 className="font-black mb-2 text-white text-lg">البؤرة المركزية</h4>
                  <p className="text-xs opacity-60">استخراج الآية التي تمثل قلب السورة من الناحية البنائية.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.LAB_FREQUENCY && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمختبر
            </button>
            <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-xl space-y-8">
              <h2 className="text-3xl font-black quran-font text-emerald-950">محرك الترددات الكمي</h2>
              <p className="text-lg leading-relaxed text-emerald-950/70">
                محرك متطور لمعالجة تكرار الكلمات والجمل. يركز على توازن الأضداد وتوافق الكلمات مع الحقائق الكونية الثابتة.
              </p>
              <div className="space-y-4">
                 <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="font-black text-emerald-700">115 مرة</span>
                    <span className="font-bold">تكرار كلمة "الدنيا"</span>
                 </div>
                 <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="font-black text-emerald-700">115 مرة</span>
                    <span className="font-bold">تكرار كلمة "الآخرة"</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.LAB_VISION && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمختبر
            </button>
            <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-xl space-y-8 text-center">
              <Camera size={64} className="mx-auto text-emerald-300" />
              <h2 className="text-3xl font-black quran-font text-emerald-950">مختبر الرؤية والذكاء الاصطناعي</h2>
              <p className="text-lg leading-relaxed text-emerald-950/70">
                أداة لتحليل المخطوطات والزخارف القرآنية رقمياً للكشف عن الأنماط الهندسية المختبئة في الصفحات.
              </p>
              <div className="p-12 border-4 border-dashed border-emerald-100 rounded-3xl text-emerald-900/40 font-bold">
                 قريباً: إمكانية رفع صورة لتحليلها مباشرة
              </div>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.LAB_TIMELINE && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.ANALYSIS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمختبر
            </button>
            <div className="bg-emerald-950 text-emerald-100 p-10 rounded-3xl shadow-xl space-y-8">
              <h2 className="text-3xl font-black quran-font text-emerald-400">الجدول الزمني لتنزيل الوحي</h2>
              <p className="text-lg leading-relaxed opacity-80">
                دراسة تتبع ترتيب نزول السور عبر سنوات البعثة، ومقارنة العهد المكي بالمدني من حيث الموضوعات والترددات العددية.
              </p>
              <div className="border-r-4 border-emerald-600 pr-6 space-y-8">
                 <div className="space-y-2">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold">العهد المكي</span>
                    <h4 className="font-black text-lg">بناء العقيدة والتوحيد</h4>
                    <p className="text-xs opacity-50">آيات تمتاز بالقصر والتركيز على الغيبيات والبعث والجزاء.</p>
                 </div>
                 <div className="space-y-2">
                    <span className="bg-emerald-400 text-emerald-950 px-3 py-1 rounded text-xs font-bold">العهد المدني</span>
                    <h4 className="font-black text-lg">التشريع وبناء الأمة</h4>
                    <p className="text-xs opacity-50">آيات تتناول أحكام العبادات والمعاملات وبناء المجتمع الإسلامي.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* الإحصائيات (Master View) */}
        {activeTab === AnalysisTab.STATS && (
          <div className="page-transition space-y-12 pt-4 px-4 text-right">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-emerald-950 quran-font tracking-tight">نبض البيان الإحصائي</h2>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest">لوحة الإحصائيات الشاملة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QURAN_STATS.map((stat) => (
                <div 
                  key={stat.id}
                  onClick={() => openStatDetail(stat.id)}
                  className="group relative bg-white p-8 rounded-2xl border border-emerald-50 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center h-64"
                >
                  <div className="p-5 bg-emerald-50 rounded-2xl mb-6 shadow-inner">{IconMap[stat.icon]}</div>
                  <div className="text-3xl font-black text-emerald-950 mb-1 tracking-tighter">{stat.value}</div>
                  <div className="text-lg font-black text-emerald-600 uppercase tracking-widest">{stat.label}</div>
                  <div className="mt-4 flex items-center gap-2 text-emerald-900/10 font-bold text-[10px] group-hover:text-emerald-500 transition-colors">
                    <span>عرض التفاصيل التحليلية</span>
                    <ArrowLeft size={14} className="rtl:rotate-0 rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تفاصيل الإحصائيات */}
        {activeTab === AnalysisTab.STATS_DETAIL && selectedStatCategory && DETAILED_STATS_DATA[selectedStatCategory] && (
          <div className="page-transition max-w-5xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.STATS)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للإحصائيات
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 bg-emerald-900 text-white p-8 rounded-2xl shadow-xl space-y-8 flex flex-col justify-between">
                 <div className="space-y-4">
                    <h2 className="text-3xl font-black quran-font text-emerald-400 leading-tight">{DETAILED_STATS_DATA[selectedStatCategory].title}</h2>
                    <p className="text-emerald-100/60 text-lg font-medium leading-relaxed">{DETAILED_STATS_DATA[selectedStatCategory].desc}</p>
                 </div>
                 <div className="space-y-6">
                    {DETAILED_STATS_DATA[selectedStatCategory].insights.map((ins: string, i: number) => (
                      <div key={i} className="flex gap-4 flex-row-reverse items-start text-right">
                        <div className="w-8 h-8 bg-emerald-400 text-emerald-950 rounded-md flex items-center justify-center shrink-0 font-black text-lg shadow-md mt-1">{i+1}</div>
                        <p className="text-lg text-emerald-100/90 font-bold quran-font leading-relaxed flex-1">{ins}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-emerald-50 overflow-hidden flex flex-col min-h-[400px]">
                 <h3 className="text-lg font-black text-emerald-900 mb-6 text-right border-b border-emerald-50 pb-2 w-fit ml-auto">التمثيل البياني</h3>
                 <div className="flex-1 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DETAILED_STATS_DATA[selectedStatCategory].chartData} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                         <XAxis dataKey="name" tick={{fill: '#064E3B', fontSize: 12, fontWeight: 'bold'}} angle={-15} textAnchor="end" interval={0} height={60} />
                         <YAxis tick={{fill: '#064E3B', fontSize: 10, fontWeight: 'bold'}} width={40} />
                         <Tooltip contentStyle={{borderRadius: '15px', fontSize: '14px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '10px', direction: 'rtl'}} />
                         <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={30}>
                            {(DETAILED_STATS_DATA[selectedStatCategory].chartData as any[]).map((e, i) => (
                              <Cell key={i} fill={i % 2 === 0 ? "#10B981" : "#059669"} />
                            ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* الاكتشافات (Master View) */}
        {activeTab === AnalysisTab.DISCOVERIES && (
           <div className="page-transition space-y-12 pt-4 px-4 text-right">
             <div className="text-center space-y-2">
               <h2 className="text-3xl md:text-4xl font-black text-emerald-950 quran-font">مكتبة اليقين الرقمية</h2>
               <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest leading-tight">مكتبة الأدلة العلمية والإحصائية</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {FEATURED_DISCOVERIES.map(item => (
                 <div 
                   key={item.id} 
                   onClick={() => openDiscovery(item)} 
                   className="group bg-white p-8 rounded-2xl border border-emerald-50 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-right h-full"
                 >
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[10px] font-black border border-emerald-100">{item.category}</span>
                        <div className="flex gap-2 text-emerald-100/50"><Heart size={16} /><Share2 size={16} /></div>
                     </div>
                     <h4 className="text-xl font-black text-emerald-950 quran-font leading-tight">{item.title}</h4>
                     <p className="text-emerald-900/60 text-sm leading-relaxed line-clamp-3 font-medium">{item.desc}</p>
                   </div>
                   <div className="flex items-center justify-between pt-6 border-t border-emerald-50 mt-6">
                     <span className="flex items-center gap-2 text-xs text-emerald-900/30 font-black"><Eye size={14} /> {item.views}</span>
                     <div className="bg-emerald-900 text-emerald-400 p-2 rounded-lg group-hover:px-6 transition-all shadow-md">
                       <ChevronLeft size={20} />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* تفاصيل الاكتشاف */}
        {activeTab === AnalysisTab.DISCOVERY_DETAIL && selectedDiscovery && (
          <div className="page-transition max-w-4xl mx-auto space-y-10 py-6 px-4 text-right">
            <button onClick={() => setActiveTab(AnalysisTab.DISCOVERIES)} className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <ArrowLeft size={20} /> العودة للمكتبة
            </button>
            <article className="bg-white p-10 md:p-14 rounded-3xl border border-emerald-50 shadow-xl space-y-12 relative overflow-hidden">
               <header className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3 justify-end">
                   {selectedDiscovery.verified && <span className="flex items-center gap-2 text-emerald-600 font-bold text-lg"><CheckCircle2 size={20} /> مُحقق إحصائياً</span>}
                   <span className="bg-emerald-900 text-emerald-400 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{selectedDiscovery.category}</span>
                 </div>
                 <h2 className="text-2xl md:text-4xl font-black text-emerald-950 quran-font leading-tight">{selectedDiscovery.title}</h2>
               </header>
               <div className="space-y-10 relative z-10">
                 <div className="text-xl leading-relaxed text-emerald-950/80 quran-font font-medium bg-emerald-50/30 p-8 rounded-2xl border-r-4 border-emerald-600">
                   {selectedDiscovery.fullContent}
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-emerald-950 border-b-2 border-emerald-50 pb-4 flex items-center gap-3 justify-end">براهين الإعجاز الرقمي <Zap className="text-emerald-500" size={24} /></h3>
                    {selectedDiscovery.evidence.map((ev, i) => (
                      <div key={i} className="flex gap-4 p-6 bg-emerald-50/10 border border-emerald-50 rounded-xl flex-row-reverse items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-900 text-emerald-400 rounded-lg flex items-center justify-center font-black text-lg shadow-sm">{i+1}</div>
                        <p className="text-lg text-emerald-950/70 quran-font font-bold leading-relaxed flex-1">{ev}</p>
                      </div>
                    ))}
                 </div>
                 <div className="bg-emerald-900 text-white p-10 rounded-2xl shadow-xl border-2 border-emerald-800 text-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-emerald-400/10 pointer-events-none"><Quote size={40} /></div>
                    <p className="text-xl md:text-2xl font-black quran-font leading-relaxed italic relative z-10 px-4">"{selectedDiscovery.conclusion}"</p>
                 </div>
               </div>
            </article>
          </div>
        )}

        {/* نتائج البحث */}
        {activeTab === AnalysisTab.SEARCH && (
          <div className="page-transition space-y-10 py-6 px-4 text-right">
            <div className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4 text-base shadow-sm">
              <button onClick={() => setActiveTab(AnalysisTab.HOME)} className="font-bold text-emerald-600 flex items-center gap-2 hover:gap-4 transition-all order-2 md:order-1"><ArrowLeft size={18} className="rtl:rotate-0 rotate-180"/> عودة</button>
              <span className="opacity-50 font-bold order-1 md:order-2">نتيجة تحليل البصمة لـ: <span className="text-emerald-950 opacity-100">"{lastSearched}"</span></span>
            </div>
            {isAnalyzing ? (
              <div className="py-32 text-center space-y-6">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto shadow-sm"></div>
                <h3 className="text-xl md:text-2xl font-black text-emerald-950 quran-font animate-pulse">جاري استخراج الأنماط والـ DNA الرقمي من نسيج الوحي...</h3>
              </div>
            ) : analysisData ? (
               <div className="space-y-10">
                  <div className="bg-white p-8 md:p-12 rounded-3xl border border-emerald-50 shadow-lg text-right relative overflow-hidden">
                    <h2 className="text-3xl font-black quran-font text-emerald-950 border-b-2 border-emerald-600 pb-3 mb-6 w-fit ml-auto leading-none">{lastSearched}</h2>
                    <p className="text-xl leading-relaxed text-emerald-950/70 quran-font font-medium">{analysisData.summary}</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                     <div className="bg-emerald-900 p-8 rounded-2xl text-right space-y-8 shadow-xl relative overflow-hidden">
                       <h3 className="text-xl font-black text-emerald-400 flex items-center gap-3 justify-end border-b border-white/10 pb-4 relative z-10"><Zap size={20}/> أنماط ذكية مكتشفة</h3>
                       <div className="space-y-8 relative z-10 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {analysisData.patterns.map((p, i) => (
                          <div key={i} className="space-y-2 text-white/90">
                            <div className="font-black text-emerald-400 text-xl leading-tight">{p.title}</div>
                            <p className="text-base opacity-70 leading-relaxed font-medium">{p.description}</p>
                            <div className="text-[9px] text-emerald-500/50 uppercase tracking-widest pt-3 border-t border-white/5 font-black">الدليل: {p.evidence}</div>
                          </div>
                        ))}
                       </div>
                     </div>
                     <div className="h-[500px] w-full sticky top-24">
                        <NetworkGraph data={networkData} onNodeClick={(id) => handleSearch(id)} />
                     </div>
                  </div>
               </div>
            ) : (
              <div className="py-32 text-center">
                <p className="text-xl text-emerald-900/30 font-black quran-font">لم تتوفر بيانات دقيقة لهذا الاستفسار حالياً.</p>
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="bg-emerald-900 py-16 px-12 mt-16 text-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Book size={200} /></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-right relative z-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab(AnalysisTab.HOME)}>
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
               <Dna className="text-emerald-950" size={32} />
            </div>
            <div className="space-y-1 text-right">
              <h5 className="text-2xl font-black tracking-tighter leading-none">البيّنة</h5>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">مشروع البصمة الوراثية للقرآن الكريم</span>
            </div>
          </div>
          <div className="space-y-6 max-w-xl">
            <p className="text-emerald-100/40 font-black text-lg leading-relaxed">مشروع بحثي متقدم يهدف لاستكشاف التوازن المطلق في كتاب الله باستخدام تقنيات الذكاء الاصطناعي الحديثة والتحليل الرقمي العميق.</p>
            <div className="flex justify-center md:justify-end gap-8 opacity-20">
               <Globe size={24} className="hover:opacity-100 transition-opacity cursor-pointer hover:text-emerald-400" />
               <Share2 size={24} className="hover:opacity-100 transition-opacity cursor-pointer hover:text-emerald-400" />
               <Info size={24} className="hover:opacity-100 transition-opacity cursor-pointer hover:text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-8 border-t border-white/5 text-center text-emerald-400/10 font-black text-[10px] uppercase tracking-widest">
           جميع الحقوق محفوظة لنظام البيّنة الرقمي © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default App;
