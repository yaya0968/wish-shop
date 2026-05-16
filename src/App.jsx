import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
//  CONSTANTS & MOCK DATA
// ═══════════════════════════════════════════════════════════════════════
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";

// 後台管理員帳號（上線後改為後端驗證）
const ADMIN_ACCOUNTS = [
  { id: "admin1", name: "小芭樂（店主）",   pw: "mg2025!",   role: "owner"   },
  { id: "admin2", name: "海外選品夥伴",      pw: "partner88", role: "editor"  },
  { id: "admin3", name: "物流夥伴",          pw: "ship456",   role: "shipper" },
];

// 後台角色可存取模組
const ROLE_ACCESS = {
  owner:   ["dash","products","orders","shipments","members","notify","share","settings"],
  editor:  ["dash","products","share"],
  shipper: ["dash","orders","shipments","notify"],
};

const INIT_SETTINGS = {
  storeName: "美購直送",
  storeSubtitle: "海外直採 · 低成本貨運 · 品質保證",
  themeColor: "#C94B3A",
  accentColor: "#E8A838",
  bgColor: "#FDFAF6",
  cardBg: "#FFFFFF",
  headerBg: "#1A1A1A",
  announcement: "🎉 新會員首購 95 折 ｜ 本批截單 5/20 ｜ 滿 $2,000 免運費",
  bankName: "玉山銀行", bankBranch: "信義分行",
  bankAccount: "808-0123456789", bankHolder: "美購直送",
  lineGroupUrl: "https://line.me/R/ti/g/XXXXXXXX",
  igUrl: "https://instagram.com/meigou",
  fbUrl: "https://fb.com/meigou",
  categories: ["母嬰","生活用品","保養","衣服","食品","保健食品"],
  shipping: { small:80, medium:120, large:180, extra:250 },
};

const INIT_PRODUCTS = [
  { id:1, name:"Pampers 幫寶適 拉拉褲 L 44片", cat:"母嬰", origin:"🇺🇸 美國", price:680, wholesale:510, cost:290, stock:30, status:"現貨", img:"🍼",
    desc:"美國原裝進口，透氣防漏底層設計，柔軟棉柔材質不刺激寶寶嬌嫩肌膚。超薄輕盈，穿起來像沒穿一樣，讓寶寶自在活動。",
    detail:"規格：L號（9-14kg）· 44片/包\n產地：美國\n成分：無螢光劑、無染料\n保存：避免陽光直射、保持乾燥",
    note:"", closeDate:"", sort:1, size:"medium", featured:true, visible:true },
  { id:2, name:"Stanley 冒險保溫杯 40oz Rose Quartz", cat:"生活用品", origin:"🇺🇸 美國", price:1580, wholesale:1180, cost:680, stock:5, status:"預購", img:"🥤",
    desc:"全美瘋搶限定粉色 Rose Quartz，正品原廠直送。採用 18/8 不鏽鋼，保冷 48 小時・保熱 12 小時，附原廠提環蓋。",
    detail:"容量：40oz（1182ml）\n顏色：Rose Quartz 限定色\n保溫時間：熱 12hr・冷 48hr・冰塊 2 天\n材質：18/8 不鏽鋼\n附件：提環蓋、吸管蓋",
    note:"本批截單 5/20，預計 6/10 到台", closeDate:"2025-05-20", sort:2, size:"medium", featured:true, visible:true },
  { id:3, name:"Drunk Elephant B-Hydra 保濕精華 50ml", cat:"保養", origin:"🇺🇸 美國", price:2200, wholesale:1650, cost:980, stock:0, status:"缺貨", img:"🧴",
    desc:"B5 玻尿酸強效補水精華，素顏水感透亮。適合所有膚質，油肌、敏感肌亦適用。連續使用 4 週可感受明顯保濕改善。",
    detail:"容量：50ml\n膚質：全膚質適用\n核心成分：前維生素 B5、Pro-Vita B5、Watermelon Rind Extract\n建議用法：早晚潔膚後取 2-3 滴按摩吸收",
    note:"", closeDate:"", sort:3, size:"small", featured:false, visible:true },
  { id:4, name:"Levi's 512 修身牛仔褲 女款", cat:"衣服", origin:"🇺🇸 美國", price:1890, wholesale:1420, cost:820, stock:12, status:"預購", img:"👖",
    desc:"美國官網獨家尺寸，修身錐形版型顯瘦不緊繃。高腰設計拉長比例，26-34W 多尺寸可選，台灣幾乎買不到的款式。",
    detail:"版型：修身錐形（Slim Taper）\n腰圍：26W / 27W / 28W / 29W / 30W / 32W / 34W\n材質：98% 棉、2% 彈性纖維\n顏色：深藍 Indigo / 淺藍 Light Wash\n產地：美國",
    note:"本批截單 5/28，預計 6/20 到台", closeDate:"2025-05-28", sort:4, size:"medium", featured:true, visible:true },
  { id:5, name:"Trader Joe's 天然杏仁奶油 16oz", cat:"食品", origin:"🇺🇸 美國", price:420, wholesale:310, cost:160, stock:22, status:"現貨", img:"🫙",
    desc:"純天然無添加，低糖高蛋白，健身族首選。Trader Joe's 自有品牌，成分只有杏仁，無棕櫚油、無人工添加物。",
    detail:"容量：16oz（454g）\n成分：100% 杏仁\n熱量：190 kcal / 2 湯匙\n蛋白質：7g / 2 湯匙\n保存：開封後冷藏，6 個月內食用",
    note:"", closeDate:"", sort:5, size:"small", featured:false, visible:true },
  { id:6, name:"e.l.f. Halo Glow 液態高光", cat:"保養", origin:"🇺🇸 美國", price:680, wholesale:510, cost:240, stock:35, status:"現貨", img:"✨",
    desc:"TikTok 爆款高光，打造玻璃肌水光感。輕薄不卡粉，可單獨使用或混入粉底。持妝 12 小時，多色可選。",
    detail:"規格：40ml\n色號：Champagne（香檳金）/ Bronze（古銅）/ Pearl（珍珠白）/ Rosé（玫瑰粉）\n質地：液態，輕薄水潤\n適合：全膚質，乾肌、混合肌特別推薦\n用法：日霜後、粉底前，或混合粉底液使用",
    note:"", closeDate:"", sort:6, size:"small", featured:true, visible:true },
  { id:7, name:"Olly 膠原蛋白＋玻尿酸軟糖 60顆", cat:"保健食品", origin:"🇺🇸 美國", price:780, wholesale:580, cost:320, stock:18, status:"現貨", img:"🍬",
    desc:"Whole Foods 熱銷美顏軟糖。每顆含膠原蛋白 2500mg＋玻尿酸 60mg，草莓荔枝口味好吃不苦。",
    detail:"規格：60顆 / 瓶（30天份）\n核心成分：膠原蛋白 2500mg、玻尿酸 60mg、維他命 C\n口味：草莓荔枝\n建議用量：每日 2 顆\n保存：常溫、避免陽光直射",
    note:"", closeDate:"", sort:7, size:"small", featured:false, visible:true },
  { id:8, name:"Ergobaby Omni 360 嬰兒揹帶", cat:"母嬰", origin:"🇺🇸 美國", price:4200, wholesale:3150, cost:1900, stock:3, status:"預購", img:"🤱",
    desc:"人體工學嬰兒揹帶，新生兒至36個月全程適用。4 種揹法（前向外、前向內、後揹、側揹），可調節式腰靠設計，減輕腰背負擔。",
    detail:"適用月齡：新生兒（3.2kg）～ 3 歲（20kg）\n揹法：前向外 / 前向內 / 後揹 / 側揹\n材質：100% 精梳棉\n腰帶：可調節式，附腰靠\n顏色：黑 / 灰 / 深藍\n認證：SGS、ASTM F2236",
    note:"本批截單 5/28，預計 6/20 到台", closeDate:"2025-05-28", sort:8, size:"large", featured:false, visible:true },
  { id:9, name:"COSRX 蝸牛修護精華 100ml", cat:"保養", origin:"🇰🇷 韓國", price:880, wholesale:660, cost:360, stock:15, status:"現貨", img:"🐌",
    desc:"韓國美妝 No.1 暢銷精華，含 96.3% 蝸牛分泌過濾液。修護泛紅、淡化痘疤、保濕補水三效合一，適合需要修護的肌膚。",
    detail:"容量：100ml\n核心成分：蝸牛分泌過濾液 96.3%\n膚質：全膚質，敏感肌適用\n用法：早晚潔膚化妝水後，取適量輕拍吸收\n產地：韓國",
    note:"", closeDate:"", sort:9, size:"small", featured:true, visible:true },
  { id:10, name:"日本 MUJI 無印良品 導入化妝水 200ml", cat:"保養", origin:"🇯🇵 日本", price:650, wholesale:490, cost:260, stock:20, status:"現貨", img:"💧",
    desc:"日本無印良品熱銷保養，高保濕型導入化妝水。溫和不刺激，質地清爽易吸收，敏感肌亦可安心使用。日本當地版比台灣官網便宜。",
    detail:"容量：200ml\n類型：高保濕型\n成分：甘油、玻尿酸\n產地：日本\n建議用法：化妝水前使用，以手輕拍或化妝棉輕抹",
    note:"", closeDate:"", sort:10, size:"small", featured:false, visible:true },
];

const INIT_MEMBERS = [
  { id:"m001", name:"林小芳", lineId:"@fang_shop", phone:"0912111111", type:"wholesale", joinDate:"2025-03-01", totalSpent:18400, orders:8 },
  { id:"m002", name:"陳美惠", lineId:"@hui_mom",   phone:"0922222222", type:"member",    joinDate:"2025-04-10", totalSpent:4200,  orders:3 },
  { id:"m003", name:"王雅琪", lineId:"@qi_life",   phone:"0933333333", type:"member",    joinDate:"2025-04-22", totalSpent:2200,  orders:1 },
  { id:"m004", name:"黃雅文", lineId:"@yawan_buy", phone:"0944444444", type:"wholesale", joinDate:"2025-03-15", totalSpent:11800, orders:5 },
];

const INIT_ORDERS = [
  { id:"ORD-001", memberId:"m001", memberName:"林小芳", memberLine:"@fang_shop", phone:"0912111111",
    items:[{productId:1,name:"Pampers 幫寶適",qty:2,price:680,size:"medium"},{productId:6,name:"e.l.f. Halo Glow",qty:1,price:680,size:"small"}],
    total:2040, shippingFee:0, status:"已到貨", payStatus:"已付款", last5:"78901", addr:"台北市信義區信義路五段7號", createdAt:"2025-05-01", arrivedAt:"2025-05-18" },
  { id:"ORD-002", memberId:"m002", memberName:"陳美惠", memberLine:"@hui_mom", phone:"0922222222",
    items:[{productId:4,name:"Levi's 512 牛仔褲",qty:1,price:1890,size:"medium"}],
    total:1890, shippingFee:120, status:"國際運送中", payStatus:"已付款", last5:"34521", addr:"新北市板橋區文化路一段100號", createdAt:"2025-05-05", arrivedAt:"" },
  { id:"ORD-003", memberId:"m003", memberName:"王雅琪", memberLine:"@qi_life", phone:"0933333333",
    items:[{productId:3,name:"Drunk Elephant 精華",qty:1,price:2200,size:"small"}],
    total:2200, shippingFee:80, status:"缺貨通知", payStatus:"待付款", last5:"", addr:"台中市西屯區台灣大道三段301號", createdAt:"2025-05-08", arrivedAt:"" },
  { id:"ORD-004", memberId:"m004", memberName:"黃雅文", memberLine:"@yawan_buy", phone:"0944444444",
    items:[{productId:2,name:"Stanley 保溫杯",qty:1,price:1580,size:"medium"},{productId:5,name:"Trader Joe's 杏仁奶油",qty:2,price:420,size:"small"}],
    total:2420, shippingFee:120, status:"待出貨", payStatus:"已付款", last5:"56789", addr:"高雄市前金區中正四路200號", createdAt:"2025-05-10", arrivedAt:"" },
];

// 訂單狀態列表（含「國際運送中」，不綁定特定國家）
const ORDER_STATUSES = ["待出貨","國際運送中","已到貨","缺貨通知"];
const STATUS_CHIP = {
  "現貨":     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "預購":     "bg-sky-100 text-sky-700 border border-sky-200",
  "缺貨":     "bg-stone-100 text-stone-500 border border-stone-200",
  "已到貨":   "bg-emerald-100 text-emerald-700",
  "國際運送中":"bg-blue-100 text-blue-700",
  "待出貨":   "bg-amber-100 text-amber-700",
  "缺貨通知": "bg-red-100 text-red-600",
  "已付款":   "bg-emerald-100 text-emerald-700",
  "待付款":   "bg-amber-100 text-amber-800",
};

// ═══════════════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════════════
function cls(...a){ return a.filter(Boolean).join(" "); }

function useToast(){
  const [t,setT]=useState({show:false,msg:"",type:"info"});
  const show=useCallback((msg,type="info")=>{
    setT({show:true,msg,type});
    setTimeout(()=>setT(x=>({...x,show:false})),2600);
  },[]);
  return [t,show];
}

// ═══════════════════════════════════════════════════════════════════════
//  SHARED UI ATOMS
// ═══════════════════════════════════════════════════════════════════════
function Chip({label,sm}){
  return <span className={cls("font-bold rounded-full whitespace-nowrap",sm?"text-[10px] px-2 py-0.5":"text-xs px-2.5 py-0.5",STATUS_CHIP[label]||"bg-stone-100 text-stone-600")}>{label}</span>;
}

function Toast({msg,type,show}){
  if(!show)return null;
  const bg={success:"#059669",error:"#DC2626",info:"#1A1A1A",warn:"#D97706"};
  return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold pointer-events-none" style={{background:bg[type]||bg.info}}>{msg}</div>;
}

function Modal({open,onClose,title,children,wide,dark}){
  if(!open)return null;
  return(
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto" style={{background:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className={cls("w-full rounded-2xl shadow-2xl my-8 overflow-hidden",wide?"max-w-2xl":"max-w-md",dark?"bg-[#1E2028]":"bg-white")} onClick={e=>e.stopPropagation()}>
        <div className={cls("flex items-center justify-between px-6 py-4 border-b",dark?"border-white/10":"border-stone-100")}>
          <h2 className={cls("font-extrabold text-lg",dark?"text-white":"text-stone-800")}>{title}</h2>
          <button onClick={onClose} className={cls("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",dark?"bg-white/10 hover:bg-white/20 text-white/70":"bg-stone-100 hover:bg-stone-200 text-stone-500")}>✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Admin-themed inputs ────────────────────────────────────────────
function DInput(props){return <input {...props} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C94B3A] transition-all placeholder-white/20"/>;}
function DTextarea(props){return <textarea {...props} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C94B3A] transition-all placeholder-white/20 resize-none"/>;}
function DSelect({options,...props}){return <select {...props} className="w-full bg-[#1A1D26] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C94B3A] transition-all">{options.map(o=><option key={o.value??o} value={o.value??o} className="bg-[#1A1D26]">{o.label??o}</option>)}</select>;}
function DField({label,children,span2}){return <div className={span2?"col-span-2":""}>{label&&<label className="block text-[10px] font-bold text-white/30 mb-1.5 uppercase tracking-wider">{label}</label>}{children}</div>;}
function DBtn({children,variant="primary",size="md",className="",...props}){
  const v={primary:"bg-[#C94B3A] hover:bg-[#b83d2d] text-white",ghost:"text-white/40 hover:text-white hover:bg-white/8",outline:"border border-white/15 text-white/60 hover:text-white hover:border-white/30",green:"bg-emerald-600 hover:bg-emerald-700 text-white",amber:"bg-amber-600 hover:bg-amber-700 text-white",blue:"bg-blue-600 hover:bg-blue-700 text-white",red:"bg-red-600 hover:bg-red-700 text-white"};
  const s={xs:"text-[10px] px-2.5 py-1",sm:"text-xs px-3.5 py-1.5",md:"text-sm px-5 py-2.5",lg:"text-sm px-7 py-3"};
  return <button className={cls("font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-40",v[variant],s[size],className)} {...props}>{children}</button>;
}

// ─── Front-themed button ────────────────────────────────────────────
function FBtn({children,tc,className="",...props}){
  return <button className={cls("font-bold rounded-full transition-all active:scale-[.98] hover:opacity-90 text-white disabled:opacity-40",className)} style={{background:tc}} {...props}>{children}</button>;
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN LOGIN  ██  (獨立頁面，後台唯一入口)
// ═══════════════════════════════════════════════════════════════════════
// 進入方式：前台右下角有一個幾乎隱形的「⠿」點，只有知道的人才能觸發
// 上線後建議改為獨立路由 /admin-portal（不列在任何連結上）
function AdminLogin({onLogin}){
  const [id,setId]=useState("");const [pw,setPw]=useState("");
  const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const submit=()=>{
    setLoading(true);setErr("");
    setTimeout(()=>{
      const found=ADMIN_ACCOUNTS.find(c=>c.id===id&&c.pw===pw);
      if(found)onLogin(found); else setErr("帳號或密碼錯誤");
      setLoading(false);
    },700);
  };
  return(
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F14]" style={{fontFamily:FONT}}>
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>
            <span className="text-2xl">🛍️</span>
          </div>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">美購直送</h1>
          <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Admin Portal · 僅限授權人員</p>
        </div>
        <div className="bg-[#1A1D26] rounded-3xl p-8 border border-white/8 shadow-2xl space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-white/30 mb-1.5 uppercase tracking-wider">管理員帳號</label>
            <DInput value={id} onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="例：admin1" autoComplete="off"/>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-white/30 mb-1.5 uppercase tracking-wider">密碼</label>
            <DInput type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••"/>
          </div>
          {err&&<p className="text-red-400 text-xs text-center font-semibold">{err}</p>}
          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-50 mt-2"
            style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>
            {loading?"驗證中...":"登入後台"}
          </button>
          <p className="text-white/15 text-[10px] text-center pt-2">此頁面不對外公開，請勿分享連結</p>
          <p className="text-white/20 text-[10px] text-center">Demo：admin1 / mg2025!</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN SIDEBAR  ██
// ═══════════════════════════════════════════════════════════════════════
const ADMIN_NAV=[
  {key:"dash",     icon:"◈", label:"總覽儀表板"},
  {key:"products", icon:"⊞", label:"商品管理"},
  {key:"orders",   icon:"◫", label:"訂單管理"},
  {key:"shipments",icon:"⊡", label:"進出貨管理"},
  {key:"members",  icon:"◉", label:"會員管理"},
  {key:"notify",   icon:"◎", label:"通知中心"},
  {key:"share",    icon:"⊹", label:"分享推廣"},
  {key:"settings", icon:"◐", label:"店鋪設定"},
];
function AdminSidebar({tab,setTab,admin,onLogout,onViewFront}){
  const ROLE_LABEL={owner:"店主",editor:"選品夥伴",shipper:"物流夥伴"};
  const allowed=ROLE_ACCESS[admin.role]||[];
  return(
    <aside className="w-52 bg-[#0D0F14] flex flex-col h-full flex-shrink-0 border-r border-white/5">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2.5 mb-0.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>🛍️</div>
          <span className="font-extrabold text-white text-sm">美購直送</span>
        </div>
        <p className="text-white/20 text-[10px] pl-9 uppercase tracking-widest">Admin</p>
      </div>
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.filter(n=>allowed.includes(n.key)).map(n=>(
          <button key={n.key} onClick={()=>setTab(n.key)}
            className={cls("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left",
              tab===n.key?"bg-[#C94B3A] text-white":"text-white/40 hover:text-white/80 hover:bg-white/5")}>
            <span className="text-base font-normal">{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5 space-y-1">
        <button onClick={onViewFront} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/30 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all">
          <span>↗</span><span>查看前台</span>
        </button>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>{admin.name[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-[10px] font-bold truncate">{admin.name}</p>
            <p className="text-white/25 text-[10px]">{ROLE_LABEL[admin.role]}</p>
          </div>
          <button onClick={onLogout} className="text-white/25 hover:text-red-400 text-sm transition-colors" title="登出">⏻</button>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN DASHBOARD  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminDash({products,orders,members}){
  const paid=orders.filter(o=>o.payStatus==="已付款").reduce((s,o)=>s+o.total,0);
  const stats=[
    {label:"本月收款",    val:`$${paid.toLocaleString()}`,                              icon:"💰",color:"border-emerald-700/40 bg-emerald-950/30"},
    {label:"待付款訂單",  val:orders.filter(o=>o.payStatus==="待付款").length+" 筆",     icon:"⏳",color:"border-amber-700/40 bg-amber-950/30"},
    {label:"待出貨",      val:orders.filter(o=>o.status==="待出貨").length+" 筆",        icon:"📦",color:"border-blue-700/40 bg-blue-950/30"},
    {label:"庫存警示",    val:products.filter(p=>p.stock<=5&&p.stock>0).length+" 件",   icon:"⚠️",color:"border-red-700/40 bg-red-950/30"},
  ];
  return(
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-extrabold text-2xl">總覽儀表板</h1>
        <p className="text-white/30 text-sm mt-1">{new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.label} className={cls("rounded-2xl border p-5",s.color)}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-white font-extrabold text-2xl mt-2">{s.val}</p>
            <p className="text-white/30 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">最新訂單</h3>
          {[...orders].reverse().slice(0,5).map(o=>(
            <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white/80 text-sm font-semibold">{o.memberName}</p>
                <p className="text-white/30 text-xs">{o.id} · {o.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip label={o.status} sm/>
                <p className="text-[#C94B3A] font-bold text-sm">${(o.total+o.shippingFee).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">庫存狀況</h3>
          <div className="space-y-3">
            {products.slice(0,7).map(p=>(
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-lg w-7">{p.img}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs truncate font-semibold">{p.name}</p>
                  <div className="w-full bg-white/8 rounded-full h-1.5 mt-1.5">
                    <div className="h-1.5 rounded-full" style={{width:`${Math.min(100,(p.stock/30)*100)}%`,background:p.stock<=5?"#EF4444":p.stock<=10?"#F59E0B":"#10B981"}}/>
                  </div>
                </div>
                <span className={cls("text-xs font-bold w-6 text-right",p.stock===0?"text-red-400":p.stock<=5?"text-amber-400":"text-white/40")}>{p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN PRODUCTS  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminProducts({products,setProducts,settings}){
  const [editId,setEditId]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [filterCat,setFilterCat]=useState("全部");
  const blank={id:null,name:"",cat:settings.categories[0],origin:"🇺🇸 美國",price:"",wholesale:"",cost:"",stock:"",status:"現貨",img:"📦",desc:"",detail:"",note:"",closeDate:"",sort:products.length+1,size:"small",featured:false,visible:true};
  const [form,setForm]=useState(blank);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  const openNew=()=>{setForm(blank);setEditId(null);setShowForm(true);};
  const openEdit=p=>{setForm({...p});setEditId(p.id);setShowForm(true);};
  const save=()=>{
    if(!form.name)return;
    const parsed={...form,price:+form.price,wholesale:+form.wholesale,cost:+form.cost,stock:+form.stock};
    setProducts(prev=>editId?prev.map(p=>p.id===editId?parsed:p):[...prev,{...parsed,id:Date.now()}]);
    setShowForm(false);
  };
  const del=id=>{if(window.confirm("確定刪除？"))setProducts(prev=>prev.filter(p=>p.id!==id));};
  const move=(id,dir)=>{
    const arr=[...products];const i=arr.findIndex(p=>p.id===id);
    if(i+dir<0||i+dir>=arr.length)return;
    [arr[i],arr[i+dir]]=[arr[i+dir],arr[i]];
    setProducts(arr.map((p,idx)=>({...p,sort:idx+1})));
  };

  const filtered=filterCat==="全部"?products:products.filter(p=>p.cat===filterCat);
  return(
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-extrabold text-2xl">商品管理</h1>
        <DBtn onClick={openNew}>＋ 新增商品</DBtn>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["全部",...settings.categories].map(c=>(
          <button key={c} onClick={()=>setFilterCat(c)}
            className={cls("px-3 py-1.5 rounded-xl text-xs font-bold transition-all",filterCat===c?"bg-[#C94B3A] text-white":"bg-white/5 text-white/40 hover:text-white/70")}>
            {c}
          </button>
        ))}
      </div>
      <div className="bg-[#1A1D26] rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              {["序","商品","分類","來源","狀態","零售/批發","庫存","精選","操作"].map(h=>(
                <th key={h} className="text-left px-3 py-3 text-[10px] font-bold text-white/25 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-3 py-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={()=>move(p.id,-1)} className="text-white/20 hover:text-white/60 text-xs">▲</button>
                    <span className="text-white/30 text-[10px]">{i+1}</span>
                    <button onClick={()=>move(p.id,1)} className="text-white/20 hover:text-white/60 text-xs">▼</button>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.img}</span>
                    <div>
                      <p className="text-white/80 font-semibold text-xs max-w-[120px] truncate">{p.name}</p>
                      {p.closeDate&&<p className="text-[#C94B3A] text-[10px]">截單 {p.closeDate}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-white/40 text-xs">{p.cat}</td>
                <td className="px-3 py-3 text-white/50 text-xs">{p.origin}</td>
                <td className="px-3 py-3"><Chip label={p.status} sm/></td>
                <td className="px-3 py-3">
                  <p className="text-[#C94B3A] font-bold text-xs">${p.price.toLocaleString()}</p>
                  <p className="text-[#E8A838] text-[10px]">${p.wholesale.toLocaleString()}</p>
                </td>
                <td className="px-3 py-3">
                  <span className={cls("font-extrabold text-sm",p.stock===0?"text-red-400":p.stock<=5?"text-amber-400":"text-white/60")}>{p.stock}</span>
                </td>
                <td className="px-3 py-3">
                  <button onClick={()=>setProducts(prev=>prev.map(pr=>pr.id===p.id?{...pr,featured:!pr.featured}:pr))}
                    className={cls("text-lg transition-opacity",p.featured?"opacity-100":"opacity-15")}>⭐</button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                    <DBtn size="xs" variant="outline" onClick={()=>openEdit(p)}>編輯</DBtn>
                    <DBtn size="xs" variant={p.status==="缺貨"?"green":"ghost"}
                      onClick={()=>setProducts(prev=>prev.map(pr=>pr.id===p.id?{...pr,status:pr.status==="缺貨"?"現貨":"缺貨"}:pr))}>
                      {p.status==="缺貨"?"上架":"下架"}
                    </DBtn>
                    <DBtn size="xs" variant="ghost" className="text-red-400 hover:text-red-300" onClick={()=>del(p.id)}>刪</DBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={showForm} onClose={()=>setShowForm(false)} title={editId?"編輯商品":"新增商品"} wide dark>
        {form&&(
          <div className="grid grid-cols-2 gap-4">
            <DField label="商品名稱" span2><DInput value={form.name} onChange={f("name")} placeholder="完整商品名稱"/></DField>
            <DField label="分類"><DSelect options={settings.categories} value={form.cat} onChange={f("cat")}/></DField>
            <DField label="來源國"><DInput value={form.origin} onChange={f("origin")} placeholder="例：🇺🇸 美國 / 🇰🇷 韓國 / 🇯🇵 日本"/></DField>
            <DField label="狀態"><DSelect options={["現貨","預購","缺貨"]} value={form.status} onChange={f("status")}/></DField>
            <DField label="Emoji 圖示"><DInput value={form.img} onChange={f("img")} placeholder="🧴"/></DField>
            <DField label="零售價 $"><DInput type="number" value={form.price} onChange={f("price")}/></DField>
            <DField label="批發價 $"><DInput type="number" value={form.wholesale} onChange={f("wholesale")}/></DField>
            <DField label="成本 $"><DInput type="number" value={form.cost} onChange={f("cost")}/></DField>
            <DField label="庫存">
              <DInput type="number" value={form.stock} onChange={f("stock")}/>
            </DField>
            <DField label="包裹尺寸（運費）">
              <DSelect options={[{value:"small",label:"小型"},{value:"medium",label:"一般"},{value:"large",label:"大型"},{value:"extra",label:"加大"}]} value={form.size} onChange={f("size")}/>
            </DField>
            <DField label="截單日期"><DInput type="date" value={form.closeDate} onChange={f("closeDate")}/></DField>
            <DField label="商品簡介" span2><DTextarea rows={3} value={form.desc} onChange={f("desc")} placeholder="前台卡片顯示的簡短介紹"/></DField>
            <DField label="商品詳細說明（顯示在 Pop-up 詳情頁）" span2><DTextarea rows={5} value={form.detail} onChange={f("detail")} placeholder="規格、成分、尺寸、使用方式...（可換行）"/></DField>
            <DField label="訂單備註（前台顯示）" span2><DTextarea rows={2} value={form.note} onChange={f("note")} placeholder="例：本批截單後預計3週到台"/></DField>
            <DField span2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))} className="accent-[#C94B3A] w-4 h-4"/>
                <span className="text-white/60 text-sm">設為精選商品（顯示於前台首頁精選區）</span>
              </label>
            </DField>
            <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-white/8">
              <DBtn variant="outline" onClick={()=>setShowForm(false)}>取消</DBtn>
              <DBtn onClick={save}>儲存商品</DBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN ORDERS  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminOrders({orders,setOrders,settings}){
  const [detail,setDetail]=useState(null);
  const [filter,setFilter]=useState("全部");
  const [shipNote,setShipNote]=useState("");
  const [showShip,setShowShip]=useState(false);
  const [showPayConfirm,setShowPayConfirm]=useState(false);
  const [toast,showToast]=useToast();

  const tabs=["全部","未付款","待出貨","國際運送中","已到貨","缺貨通知"];
  const filtered=filter==="全部"?orders:filter==="未付款"?orders.filter(o=>o.payStatus==="待付款"):orders.filter(o=>o.status===filter);
  const upd=(id,patch)=>{setOrders(p=>p.map(o=>o.id===id?{...o,...patch}:o));setDetail(d=>d?.id===id?{...d,...patch}:d);};

  const payMsg=o=>`【美購直送 付款提醒】\n\n${o.memberName} 您好！\n訂單 ${o.id} 共 NT$${(o.total+o.shippingFee).toLocaleString()} 尚未完成付款。\n\n🏦 ${settings.bankName} ${settings.bankBranch}\n帳號：${settings.bankAccount}\n戶名：${settings.bankHolder}\n\n匯款後請回傳末五碼，謝謝！\n美購直送 ❤️`;
  const shipMsg=o=>`【美購直送 出貨通知】\n\n${o.memberName} 您好！\n您的訂單 ${o.id} 已出貨！\n\n📦 出貨商品：\n${o.items.map(i=>`• ${i.name} ×${i.qty}`).join("\n")}${shipNote?`\n\n📬 包裹資訊：${shipNote}`:""}\n\n感謝您的購買！\n美購直送 ❤️`;

  return(
    <div className="space-y-5">
      <h1 className="text-white font-extrabold text-2xl">訂單管理</h1>
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={cls("px-3 py-1.5 rounded-xl text-xs font-bold transition-all",filter===s?"bg-[#C94B3A] text-white":"bg-white/5 text-white/40 hover:text-white/70")}>
            {s}
            {s!=="全部"&&<span className="ml-1 opacity-50">({s==="未付款"?orders.filter(o=>o.payStatus==="待付款").length:orders.filter(o=>o.status===s).length})</span>}
          </button>
        ))}
      </div>
      <div className="bg-[#1A1D26] rounded-2xl border border-white/8 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead><tr className="border-b border-white/8">
            {["訂單","會員","金額","付款","狀態","操作"].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(o=>(
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 cursor-pointer" onClick={()=>setDetail(o)}>
                <td className="px-4 py-3"><p className="text-white/50 font-mono text-[10px]">{o.id}</p><p className="text-white/30 text-[10px]">{o.createdAt}</p></td>
                <td className="px-4 py-3"><p className="text-white/80 font-semibold text-xs">{o.memberName}</p><p className="text-white/30 text-[10px]">{o.memberLine}</p></td>
                <td className="px-4 py-3 font-bold text-[#C94B3A]">${(o.total+o.shippingFee).toLocaleString()}</td>
                <td className="px-4 py-3"><Chip label={o.payStatus} sm/></td>
                <td className="px-4 py-3"><Chip label={o.status} sm/></td>
                <td className="px-4 py-3"><DBtn size="xs" variant="outline" onClick={e=>{e.stopPropagation();setDetail(o);}}>詳情</DBtn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!detail} onClose={()=>setDetail(null)} title={`訂單 ${detail?.id}`} wide dark>
        {detail&&(
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 space-y-1 text-xs">
                <p className="text-white/30 font-bold uppercase mb-2">客戶資訊</p>
                <p className="text-white/80 font-semibold">{detail.memberName}</p>
                <p className="text-white/50">{detail.memberLine} · {detail.phone}</p>
                <p className="text-white/40 text-[10px]">{detail.addr}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 space-y-1 text-xs">
                <p className="text-white/30 font-bold uppercase mb-2">付款狀態</p>
                <div className="flex gap-2 flex-wrap"><Chip label={detail.payStatus} sm/><Chip label={detail.status} sm/></div>
                {detail.last5&&<p className="text-white/60 mt-1">末五碼：<span className="text-white font-bold font-mono">{detail.last5}</span></p>}
                {detail.arrivedAt&&<p className="text-white/50">到貨日：{detail.arrivedAt}</p>}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-xs space-y-1.5">
              <p className="text-white/30 font-bold uppercase mb-2">訂購商品</p>
              {detail.items.map((it,i)=>(
                <div key={i} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-white/70">{it.name} <span className="text-white/30">×{it.qty}</span></span>
                  <span className="text-white/70 font-bold">${(it.price*it.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-white/30 pt-1"><span>運費</span><span>${detail.shippingFee}</span></div>
              <div className="flex justify-between text-[#C94B3A] font-extrabold text-sm pt-1"><span>合計</span><span>${(detail.total+detail.shippingFee).toLocaleString()}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {detail.payStatus==="待付款"&&<DBtn variant="green" onClick={()=>setShowPayConfirm(true)} className="col-span-2">✅ 確認收款（末五碼：{detail.last5||"未提供"}）</DBtn>}
              {detail.status==="待出貨"&&detail.payStatus==="已付款"&&<DBtn variant="blue" onClick={()=>setShowShip(true)}>🚚 標記出貨</DBtn>}
              {detail.status==="國際運送中"&&<DBtn variant="green" onClick={()=>{upd(detail.id,{status:"已到貨",arrivedAt:new Date().toISOString().slice(0,10)});showToast("✅ 已標記到貨","success");}}>📬 確認到貨</DBtn>}
              {detail.status==="待出貨"&&<DBtn variant="red" onClick={()=>upd(detail.id,{status:"缺貨通知"})}>❌ 標記缺貨</DBtn>}
              <a href={`https://line.me/R/msg/text/?${encodeURIComponent(payMsg(detail))}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-xs font-bold px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-all">📱 LINE 付款提醒</a>
              <a href={`https://line.me/R/msg/text/?${encodeURIComponent(shipMsg(detail))}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-xs font-bold px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-all">📱 LINE 出貨通知</a>
              <DBtn variant="outline" size="sm" onClick={()=>{navigator.clipboard.writeText(payMsg(detail));showToast("已複製","success");}}>📋 複製付款提醒</DBtn>
              <DBtn variant="outline" size="sm" onClick={()=>{navigator.clipboard.writeText(shipMsg(detail));showToast("已複製","success");}}>📋 複製出貨通知</DBtn>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={showPayConfirm} onClose={()=>setShowPayConfirm(false)} title="確認收款" dark>
        <p className="text-white/60 text-sm mb-5">確認收到 <strong className="text-white">{detail?.memberName}</strong> 的款項（末五碼：<span className="font-mono text-[#C94B3A]">{detail?.last5||"未提供"}</span>）？</p>
        <div className="flex gap-3">
          <DBtn variant="outline" onClick={()=>setShowPayConfirm(false)} className="flex-1">取消</DBtn>
          <DBtn variant="green" onClick={()=>{upd(detail.id,{payStatus:"已付款",status:"待出貨"});setShowPayConfirm(false);showToast("✅ 已確認收款","success");}} className="flex-1">確認收款</DBtn>
        </div>
      </Modal>
      <Modal open={showShip} onClose={()=>setShowShip(false)} title="標記出貨" dark>
        <div className="space-y-4">
          <DField label="包裹號碼（選填）"><DInput value={shipNote} onChange={e=>setShipNote(e.target.value)} placeholder="例：黑貓 123456789"/></DField>
          <div className="flex gap-3">
            <DBtn variant="outline" onClick={()=>setShowShip(false)} className="flex-1">取消</DBtn>
            <DBtn variant="blue" onClick={()=>{upd(detail.id,{status:"國際運送中"});setShowShip(false);setShipNote("");showToast("🚚 已標記出貨","success");}} className="flex-1">確認出貨</DBtn>
          </div>
        </div>
      </Modal>
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN SHIPMENTS  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminShipments({orders,products}){
  const groups=[
    {label:"🌏 國際運送中（尚未到台灣）", color:"border-blue-500/30 bg-blue-950/20",    items:orders.filter(o=>o.status==="國際運送中")},
    {label:"📬 已到台灣 · 等待出貨",      color:"border-amber-500/30 bg-amber-950/20",  items:orders.filter(o=>o.status==="待出貨")},
    {label:"✅ 已出貨給客戶",             color:"border-emerald-500/30 bg-emerald-950/20",items:orders.filter(o=>o.status==="已到貨")},
    {label:"❌ 缺貨通知",                color:"border-red-500/30 bg-red-950/20",        items:orders.filter(o=>o.status==="缺貨通知")},
  ];
  const productStats=products.map(p=>{
    const total=orders.reduce((s,o)=>{const it=o.items.find(i=>i.productId===p.id);return s+(it?it.qty:0);},0);
    return{...p,totalOrdered:total};
  }).filter(p=>p.totalOrdered>0);
  return(
    <div className="space-y-6">
      <h1 className="text-white font-extrabold text-2xl">進出貨管理</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {groups.map(g=>(
          <div key={g.label} className={cls("rounded-2xl border p-5",g.color)}>
            <h3 className="text-white/80 font-bold text-sm mb-3">{g.label} <span className="text-white/30 font-normal">({g.items.length})</span></h3>
            {g.items.length===0?<p className="text-white/20 text-xs">目前無此狀態訂單</p>:(
              <div className="space-y-2">
                {g.items.map(o=>(
                  <div key={o.id} className="bg-black/20 rounded-xl px-3 py-2.5 flex justify-between items-start">
                    <div>
                      <p className="text-white/80 text-xs font-bold">{o.memberName} <span className="text-white/30 font-normal">{o.id}</span></p>
                      <p className="text-white/40 text-[10px] mt-0.5">{o.items.map(i=>`${i.name}×${i.qty}`).join("、")}</p>
                    </div>
                    <span className="text-[#C94B3A] font-bold text-xs">${o.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {productStats.length>0&&(
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">📊 商品訂購統計</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/8">{["商品","來源","庫存","訂購量","狀況"].map(h=>(
              <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-white/25 uppercase">{h}</th>
            ))}</tr></thead>
            <tbody>{productStats.map(p=>(
              <tr key={p.id} className="border-b border-white/5">
                <td className="px-4 py-3 text-white/70 font-semibold text-xs">{p.img} {p.name}</td>
                <td className="px-4 py-3 text-white/40 text-xs">{p.origin}</td>
                <td className="px-4 py-3 font-bold text-white/70">{p.stock}</td>
                <td className="px-4 py-3 font-bold text-blue-400">{p.totalOrdered}</td>
                <td className="px-4 py-3">{p.stock<p.totalOrdered?<span className="text-red-400 text-xs font-bold">⚠️ 不足 {p.totalOrdered-p.stock}</span>:<span className="text-emerald-400 text-xs">✅ 充足</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN MEMBERS  ██  (含批發申請審核)
// ═══════════════════════════════════════════════════════════════════════
function AdminMembers({members,setMembers,wholesaleApps,setWholesaleApps}){
  const approve=id=>{
    const app=wholesaleApps.find(a=>a.id===id);
    if(!app)return;
    setMembers(prev=>{
      const ex=prev.find(m=>m.lineId===app.lineId);
      if(ex)return prev.map(m=>m.lineId===app.lineId?{...m,type:"wholesale"}:m);
      return[...prev,{id:"m"+Date.now(),name:app.name,lineId:app.lineId,phone:app.phone||"",type:"wholesale",joinDate:new Date().toISOString().slice(0,10),totalSpent:0,orders:0}];
    });
    setWholesaleApps(prev=>prev.filter(a=>a.id!==id));
  };
  const reject=id=>setWholesaleApps(prev=>prev.filter(a=>a.id!==id));

  return(
    <div className="space-y-6">
      <h1 className="text-white font-extrabold text-2xl">會員管理</h1>

      {/* 批發申請審核 — 核心功能 */}
      {wholesaleApps.length>0&&(
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5">
          <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
            ⏳ 待審核批發申請
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">{wholesaleApps.length}</span>
          </h3>
          <div className="space-y-2">
            {wholesaleApps.map(r=>(
              <div key={r.id} className="bg-black/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-white/90 font-bold text-sm">{r.name}</p>
                    <p className="text-white/50 text-xs">LINE：{r.lineId} {r.phone&&`· 手機：${r.phone}`}</p>
                    <p className="text-white/50 text-xs">縣市：{r.city} · 預估月拿貨：{r.monthly}</p>
                    {r.groupSize&&<p className="text-white/40 text-xs">社群規模：{r.groupSize}</p>}
                    {r.note&&<p className="text-white/40 text-xs">備註：{r.note}</p>}
                    <p className="text-white/25 text-[10px]">申請時間：{r.date}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <DBtn size="sm" variant="green" onClick={()=>approve(r.id)}>✅ 批准</DBtn>
                    <DBtn size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={()=>reject(r.id)}>✕ 拒絕</DBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {wholesaleApps.length===0&&(
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
          <p className="text-white/30 text-sm">目前無待審批發申請</p>
        </div>
      )}

      {/* 會員列表 */}
      <div className="bg-[#1A1D26] border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/8">
            {["會員","LINE / 手機","類型","加入日期","訂單數","累計消費","操作"].map(h=>(
              <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-white/25 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>{members.map(m=>(
            <tr key={m.id} className="border-b border-white/5 hover:bg-white/3">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>{m.name[0]}</div>
                  <p className="text-white/80 font-semibold text-xs">{m.name}</p>
                </div>
              </td>
              <td className="px-4 py-3"><p className="text-white/60 text-xs">{m.lineId}</p><p className="text-white/30 text-[10px]">{m.phone}</p></td>
              <td className="px-4 py-3">
                <span className={cls("text-[10px] font-bold px-2 py-0.5 rounded-full",m.type==="wholesale"?"bg-amber-900/50 text-amber-300":"bg-white/8 text-white/40")}>
                  {m.type==="wholesale"?"👑 批發團媽":"一般會員"}
                </span>
              </td>
              <td className="px-4 py-3 text-white/30 text-xs">{m.joinDate}</td>
              <td className="px-4 py-3 text-white/60 font-bold">{m.orders}</td>
              <td className="px-4 py-3 text-[#C94B3A] font-bold">${m.totalSpent.toLocaleString()}</td>
              <td className="px-4 py-3">
                <button onClick={()=>setMembers(prev=>prev.map(mb=>mb.id===m.id?{...mb,type:mb.type==="wholesale"?"member":"wholesale"}:mb))}
                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                  {m.type==="wholesale"?"改一般":"升批發"}
                </button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN NOTIFY  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminNotify({settings}){
  const [tmpl,setTmpl]=useState("payment");
  const [custom,setCustom]=useState("");
  const [toast,showToast]=useToast();
  const templates={
    payment:`【美購直送 付款提醒】\n\n您好！\n您有未完成付款的訂單，請盡快匯款：\n\n🏦 ${settings.bankName} ${settings.bankBranch}\n帳號：${settings.bankAccount}\n戶名：${settings.bankHolder}\n\n匯款後請回傳末五碼，謝謝！\n美購直送 ❤️`,
    arrived:`【美購直送 到貨通知 📦】\n\n您好！您的訂單商品已到台灣！\n如需出貨，請告知我們收件需求。\n美購直送 ❤️`,
    closing:`【美購直送 截單提醒 ⏰】\n\n本批商品即將截單，有需要的朋友請把握時間！\n\n👉 下單：${settings.lineGroupUrl}\n\n美購直送 ❤️`,
    oos:`【美購直送 缺貨通知】\n\n非常抱歉！\n您訂購的商品因庫存問題無法出貨，我們將聯絡您處理退款或換貨。\n造成不便深感抱歉！\n美購直送 ❤️`,
  };
  const msg=tmpl==="custom"?custom:templates[tmpl];
  return(
    <div className="space-y-6">
      <h1 className="text-white font-extrabold text-2xl">通知中心</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5">
            <p className="text-white/30 text-[10px] font-bold uppercase mb-3">選擇範本</p>
            <div className="grid grid-cols-2 gap-2">
              {[["payment","💳 付款提醒"],["arrived","📦 到貨通知"],["closing","⏰ 截單提醒"],["oos","❌ 缺貨通知"],["custom","✏️ 自訂訊息"]].map(([k,l])=>(
                <button key={k} onClick={()=>setTmpl(k)}
                  className={cls("p-3 rounded-xl border text-xs font-bold text-left transition-all",tmpl===k?"border-[#C94B3A] bg-[#C94B3A]/10 text-[#C94B3A]":"border-white/8 text-white/40 hover:border-white/20")}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {tmpl==="custom"&&<DField label="自訂內容"><DTextarea rows={8} value={custom} onChange={e=>setCustom(e.target.value)} placeholder="輸入訊息..."/></DField>}
          <div className="flex gap-3">
            <a href={`https://line.me/R/msg/text/?${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">📱 LINE 傳送</a>
            <DBtn variant="outline" onClick={()=>{navigator.clipboard.writeText(msg);showToast("已複製","success");}} className="flex-1">📋 複製</DBtn>
          </div>
        </div>
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5">
          <p className="text-white/30 text-[10px] font-bold uppercase mb-3">訊息預覽</p>
          <div className="bg-[#0D0F14] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{background:"linear-gradient(135deg,#C94B3A,#E8A838)"}}>美</div>
              <p className="text-white/60 text-xs font-bold">美購直送</p>
            </div>
            <div className="bg-[#1A1D26] rounded-xl p-3 text-white/60 text-xs whitespace-pre-wrap leading-relaxed">{msg||"（請選擇範本）"}</div>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN SHARE  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminShare({products,settings}){
  const [pid,setPid]=useState(products[0]?.id);
  const [caption,setCaption]=useState("");
  const [toast,showToast]=useToast();
  const p=products.find(x=>x.id===+pid)||products[0];
  const gen=pr=>`【美購直送 新品上架 🛍️】\n\n${pr.img} ${pr.name}\n📦 分類：${pr.cat}\n🌏 來源：${pr.origin}\n💰 售價：NT$${pr.price.toLocaleString()}\n📌 狀態：${pr.status}${pr.closeDate?`\n⏰ 截單：${pr.closeDate}`:""}\n\n${pr.desc}${pr.note?`\n\n📝 ${pr.note}`:""}\n\n📲 下單加入：${settings.lineGroupUrl}\n─────────\n美購直送 × 海外直採 × 低成本貨運`;
  useState(()=>{if(p)setCaption(gen(p));});
  return(
    <div className="space-y-6">
      <h1 className="text-white font-extrabold text-2xl">分享推廣</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DField label="選擇商品">
            <DSelect options={products.map(x=>({value:x.id,label:`${x.img} ${x.name}`}))} value={pid} onChange={e=>{setPid(+e.target.value);const np=products.find(x=>x.id===+e.target.value);if(np)setCaption(gen(np));}}/>
          </DField>
          <DField label="分享文案（可編輯）"><DTextarea rows={14} value={caption} onChange={e=>setCaption(e.target.value)}/></DField>
        </div>
        <div className="space-y-3">
          <p className="text-white/30 text-[10px] font-bold uppercase">一鍵分享</p>
          <a href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(settings.lineGroupUrl)}&text=${encodeURIComponent(caption)}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-green-700 hover:bg-green-600 text-white rounded-2xl font-bold text-sm transition-all">📱 LINE 分享</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(settings.fbUrl)}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all">📘 Facebook 分享</a>
          <button onClick={()=>{navigator.clipboard.writeText(caption);showToast("已複製文案","success");}}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-800 to-pink-800 hover:opacity-90 text-white rounded-2xl font-bold text-sm transition-all">📸 複製文案（IG）</button>
          <button onClick={()=>{navigator.clipboard.writeText(caption);showToast("已複製","success");}}
            className="w-full flex items-center gap-3 p-4 bg-white/8 hover:bg-white/12 text-white/60 rounded-2xl font-bold text-sm transition-all">📋 複製全部文案</button>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ADMIN SETTINGS  ██
// ═══════════════════════════════════════════════════════════════════════
function AdminSettings({settings,setSettings}){
  const [s,setS]=useState(settings);
  const [newCat,setNewCat]=useState("");
  const [toast,showToast]=useToast();
  const save=()=>{setSettings(s);showToast("✅ 設定已儲存","success");};
  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-extrabold text-2xl">店鋪設定</h1>
        <DBtn onClick={save} size="lg">💾 儲存全部設定</DBtn>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5 space-y-4">
          <p className="text-white/30 text-[10px] font-bold uppercase">🏪 基本資訊</p>
          <DField label="店鋪名稱"><DInput value={s.storeName} onChange={e=>setS(p=>({...p,storeName:e.target.value}))}/></DField>
          <DField label="副標題"><DInput value={s.storeSubtitle} onChange={e=>setS(p=>({...p,storeSubtitle:e.target.value}))}/></DField>
          <DField label="公告跑馬燈"><DTextarea rows={2} value={s.announcement} onChange={e=>setS(p=>({...p,announcement:e.target.value}))}/></DField>
        </div>
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5 space-y-4">
          <p className="text-white/30 text-[10px] font-bold uppercase">🏦 匯款帳號</p>
          <DField label="銀行名稱"><DInput value={s.bankName} onChange={e=>setS(p=>({...p,bankName:e.target.value}))}/></DField>
          <DField label="分行"><DInput value={s.bankBranch} onChange={e=>setS(p=>({...p,bankBranch:e.target.value}))}/></DField>
          <DField label="帳號"><DInput value={s.bankAccount} onChange={e=>setS(p=>({...p,bankAccount:e.target.value}))}/></DField>
          <DField label="戶名"><DInput value={s.bankHolder} onChange={e=>setS(p=>({...p,bankHolder:e.target.value}))}/></DField>
        </div>
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5 space-y-4">
          <p className="text-white/30 text-[10px] font-bold uppercase">🎨 前台配色</p>
          {[["themeColor","主色（按鈕/重點）"],["accentColor","強調色（批發/截單）"],["bgColor","頁面背景"],["cardBg","卡片背景"],["headerBg","頁首背景"]].map(([k,l])=>(
            <div key={k} className="flex items-center gap-3">
              <input type="color" value={s[k]} onChange={e=>setS(p=>({...p,[k]:e.target.value}))} className="w-10 h-10 rounded-xl border border-white/10 cursor-pointer bg-transparent"/>
              <div className="flex-1"><p className="text-white/60 text-xs font-semibold">{l}</p><p className="text-white/20 text-[10px] font-mono">{s[k]}</p></div>
              <div className="w-10 h-10 rounded-xl border border-white/10" style={{background:s[k]}}/>
            </div>
          ))}
          <div className="rounded-xl overflow-hidden border border-white/10">
            <div className="px-3 py-2 text-white text-xs font-bold" style={{background:s.headerBg}}>{s.storeName}</div>
            <div className="p-3" style={{background:s.bgColor}}>
              <div className="rounded-xl p-3" style={{background:s.cardBg,border:"1px solid #e5e7eb"}}>
                <p style={{color:s.themeColor,fontSize:10,fontWeight:"bold"}}>母嬰</p>
                <p className="font-bold text-stone-800 text-sm mt-0.5">商品示例</p>
                <button className="mt-2 text-xs text-white px-3 py-1 rounded-full" style={{background:s.themeColor}}>加入購物車</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1A1D26] border border-white/8 rounded-2xl p-5 space-y-4">
          <p className="text-white/30 text-[10px] font-bold uppercase">🔗 社群連結</p>
          <DField label="LINE 群組連結"><DInput value={s.lineGroupUrl} onChange={e=>setS(p=>({...p,lineGroupUrl:e.target.value}))}/></DField>
          <DField label="Instagram"><DInput value={s.igUrl} onChange={e=>setS(p=>({...p,igUrl:e.target.value}))}/></DField>
          <DField label="Facebook"><DInput value={s.fbUrl} onChange={e=>setS(p=>({...p,fbUrl:e.target.value}))}/></DField>
          <div className="pt-3 border-t border-white/8 space-y-3">
            <p className="text-white/30 text-[10px] font-bold uppercase">🗂️ 商品分類</p>
            {s.categories.map((c,i)=>(
              <div key={i} className="flex gap-2">
                <DInput value={c} onChange={e=>{const arr=[...s.categories];arr[i]=e.target.value;setS(p=>({...p,categories:arr}));}}/>
                <button onClick={()=>setS(p=>({...p,categories:p.categories.filter((_,j)=>j!==i)}))} className="text-red-400 hover:text-red-300 font-bold text-lg w-6">×</button>
              </div>
            ))}
            <div className="flex gap-2">
              <DInput value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="新增分類"/>
              <DBtn size="sm" onClick={()=>{
                if(newCat.trim()){
                  setS(p=>({...p,categories:[...p.categories,newCat.trim()]}));
                  setNewCat("");
                }
              }}>＋</DBtn>
            </div>
          </div>
          <div className="pt-3 border-t border-white/8 space-y-2">
            <p className="text-white/30 text-[10px] font-bold uppercase">📦 運費設定</p>
            {[["small","小型"],["medium","一般"],["large","大型"],["extra","加大"]].map(([k,l])=>(
              <div key={k} className="flex items-center gap-3">
                <span className="text-white/50 text-xs w-14">{l}</span>
                <DInput type="number" value={s.shipping[k]} onChange={e=>setS(p=>({...p,shipping:{...p.shipping,[k]:+e.target.value}}))} className="w-24"/>
                <span className="text-white/30 text-xs">元</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  FRONTEND — LINE LOGIN  ██
// ═══════════════════════════════════════════════════════════════════════
function LineLogin({settings,onLogin,onGuest}){
  const [mode,setMode]=useState("line");
  const [name,setName]=useState("");const [phone,setPhone]=useState("");
  const [code,setCode]=useState("");const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const tc=settings.themeColor;

  const mockLine=()=>{setLoading(true);setTimeout(()=>{onLogin({id:"m_line",name:"LINE 用戶",lineId:"@line_user",type:"member"});setLoading(false);},1000);};
  const sendCode=()=>{if(!name||!phone)return;setLoading(true);setTimeout(()=>{setStep(2);setLoading(false);},700);};
  const verify=()=>{setLoading(true);setTimeout(()=>{onLogin({id:"m_ph",name,lineId:phone,type:"member"});setLoading(false);},700);};

  return(
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:settings.bgColor,fontFamily:FONT}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-xl text-4xl"
            style={{background:`linear-gradient(135deg,${tc},${settings.accentColor})`}}>🛍️</div>
          <h1 className="font-extrabold text-3xl tracking-tight" style={{color:settings.headerBg}}>{settings.storeName}</h1>
          <p className="text-stone-400 text-sm mt-1">{settings.storeSubtitle}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
          <div className="flex border-b border-stone-100">
            {["line","phone"].map(m=>(
              <button key={m} onClick={()=>setMode(m)}
                className={cls("flex-1 py-3.5 text-sm font-bold transition-colors",mode===m?"text-white":"text-stone-400 bg-stone-50")}
                style={mode===m?{background:tc}:{}}>
                {m==="line"?"LINE 登入":"手機號碼"}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {mode==="line"?(
              <>
                <p className="text-stone-500 text-sm text-center">使用 LINE 帳號快速登入，登入後可直接收到貨款通知</p>
                <button onClick={mockLine} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-base transition-all hover:opacity-90 disabled:opacity-60 shadow-md"
                  style={{background:"#06C755"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                  {loading?"連線中...":"使用 LINE 帳號登入"}
                </button>
                <div className="flex items-center gap-3"><div className="flex-1 h-px bg-stone-100"/><span className="text-stone-300 text-xs">或</span><div className="flex-1 h-px bg-stone-100"/></div>
                <button onClick={()=>setMode("phone")} className="w-full py-3 rounded-2xl font-semibold text-sm border-2 border-stone-200 text-stone-500 hover:border-stone-400 transition-all">使用手機號碼</button>
              </>
            ):(
              step===1?(
                <div className="space-y-3">
                  {[["姓名","name","text","你的名字",name,setName],["手機","phone","tel","09XX-XXX-XXX",phone,setPhone]].map(([l,k,t,ph,v,sv])=>(
                    <div key={k}>
                      <label className="block text-xs font-bold text-stone-500 mb-1.5">{l}</label>
                      <input type={t} value={v} onChange={e=>sv(e.target.value)} placeholder={ph}
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"/>
                    </div>
                  ))}
                  <button onClick={sendCode} disabled={loading||!name||!phone}
                    className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-40"
                    style={{background:tc}}>{loading?"發送中...":"發送驗證碼"}</button>
                </div>
              ):(
                <div className="space-y-3">
                  <p className="text-stone-500 text-sm text-center">驗證碼已發送至 {phone}</p>
                  <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6 位驗證碼"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] font-mono focus:outline-none" maxLength={6}/>
                  <p className="text-stone-400 text-xs text-center">Demo：輸入任意數字即可</p>
                  <button onClick={verify} disabled={loading}
                    className="w-full py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-90 disabled:opacity-40"
                    style={{background:tc}}>{loading?"驗證中...":"確認登入"}</button>
                  <button onClick={()=>setStep(1)} className="w-full text-stone-400 text-xs hover:text-stone-600">← 重新輸入</button>
                </div>
              )
            )}
            <button onClick={onGuest} className="w-full text-stone-400 text-xs hover:text-stone-600 py-1">不登入，先逛逛 →</button>
          </div>
          <div className="px-6 pb-5 text-center">
            <p className="text-stone-300 text-[10px]">登入即同意美購直送服務條款及隱私權政策</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  PRODUCT DETAIL POPUP  ██  (商品介紹頁)
// ═══════════════════════════════════════════════════════════════════════
function ProductDetail({product,tc,accentColor,onClose,onAdd,user}){
  if(!product)return null;
  const canBuy=product.status!=="缺貨";
  return(
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e=>e.stopPropagation()}>
        {/* Image area */}
        <div className="relative flex-shrink-0" style={{background:`linear-gradient(135deg,${tc}22,${accentColor}22)`}}>
          <div className="h-48 flex items-center justify-center text-8xl select-none">{product.img}</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white font-bold transition-all">✕</button>
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <Chip label={product.status}/>
            {product.featured&&<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ 精選</span>}
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{color:tc}}>{product.cat}</span>
              <span className="text-[10px] text-stone-400">{product.origin}</span>
            </div>
            <h2 className="font-extrabold text-stone-800 text-xl leading-snug">{product.name}</h2>
            {product.closeDate&&(
              <p className="text-sm font-bold mt-1" style={{color:tc}}>⏰ 截單日：{product.closeDate}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 py-4 border-y border-stone-100">
            <div>
              <p className="text-xs text-stone-400 mb-0.5">售價</p>
              <p className="font-extrabold text-3xl leading-none" style={{color:tc}}>${product.price.toLocaleString()}</p>
            </div>
            {product.stock>0&&product.stock<=10&&(
              <div className="ml-auto">
                <p className="text-[10px] text-stone-400">剩餘庫存</p>
                <p className={cls("font-extrabold text-xl",product.stock<=5?"text-red-500":"text-amber-600")}>{product.stock} 件</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">商品介紹</p>
            <p className="text-stone-700 text-sm leading-relaxed">{product.desc}</p>
          </div>

          {/* Detail specs */}
          {product.detail&&(
            <div className="bg-stone-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">商品規格</p>
              <div className="space-y-1.5">
                {product.detail.split("\n").filter(Boolean).map((line,i)=>{
                  const [label,...rest]=line.split("：");
                  return rest.length>0?(
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-stone-400 flex-shrink-0 w-20 text-xs">{label}</span>
                      <span className="text-stone-700 flex-1 text-xs">{rest.join("：")}</span>
                    </div>
                  ):(
                    <p key={i} className="text-stone-600 text-xs">{line}</p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note */}
          {product.note&&(
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <span className="text-base flex-shrink-0">📌</span>
              <p className="text-amber-800 text-sm">{product.note}</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-5 border-t border-stone-100 flex gap-3 flex-shrink-0">
          {!user?(
            <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-90" style={{background:tc}}>
              登入後購買
            </button>
          ):canBuy?(
            <button onClick={()=>{onAdd(product);onClose();}}
              className="flex-1 py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-90 active:scale-[.98] transition-all"
              style={{background:tc}}>
              加入購物車 🛒
            </button>
          ):(
            <div className="flex-1 py-3.5 rounded-2xl bg-stone-100 text-stone-400 font-bold text-sm text-center">
              目前缺貨
            </div>
          )}
          <button onClick={onClose} className="px-5 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-500 font-bold text-sm hover:border-stone-400 transition-all">
            返回
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  FRONT PRODUCT CARD  ██
// ═══════════════════════════════════════════════════════════════════════
function FrontCard({p,tc,accentColor,onAdd,onDetail}){
  const ok=p.status!=="缺貨";
  return(
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-all shadow-sm cursor-pointer" onClick={()=>onDetail(p)}>
      <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 h-36 flex items-center justify-center text-6xl select-none">
        {p.img}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Chip label={p.status} sm/>
          {p.featured&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐</span>}
        </div>
        {/* 來源國旗角標 */}
        <div className="absolute bottom-2 right-2 text-lg">{p.origin?.split(" ")[0]||""}</div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] font-extrabold uppercase tracking-wide" style={{color:tc}}>{p.cat}</p>
        <h3 className="font-bold text-stone-800 text-sm leading-snug flex-1">{p.name}</h3>
        <p className="text-xs text-stone-400 line-clamp-2">{p.desc}</p>
        {p.closeDate&&<p className="text-xs font-bold" style={{color:tc}}>⏰ 截單 {p.closeDate}</p>}
        <div className="flex items-center justify-between mt-1">
          <p className="font-extrabold text-xl" style={{color:tc}}>${p.price.toLocaleString()}</p>
          <div className="flex gap-1.5">
            <button onClick={e=>{e.stopPropagation();onDetail(p);}}
              className="text-xs font-bold px-2.5 py-1.5 rounded-full border border-stone-200 text-stone-500 hover:border-stone-400 transition-all">
              詳情
            </button>
            <button onClick={e=>{e.stopPropagation();ok&&onAdd(p);}} disabled={!ok}
              className="text-xs font-bold px-2.5 py-1.5 rounded-full text-white transition-all active:scale-95 disabled:opacity-40 hover:opacity-85"
              style={{background:ok?tc:"#9ca3af"}}>
              {p.status==="缺貨"?"缺貨":"加入"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  MY ORDER CARD  ██
// ═══════════════════════════════════════════════════════════════════════
function MyOrderCard({o,tc,settings,showToast}){
  const [open,setOpen]=useState(false);
  const [selIdxs,setSelIdxs]=useState([]);
  const [last5,setLast5]=useState("");
  const [shipSent,setShipSent]=useState(false);
  const [last5Sent,setLast5Sent]=useState(false);

  const toggleIdx=i=>setSelIdxs(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const fee=selIdxs.length===0?0:Math.max(...selIdxs.map(i=>settings.shipping[o.items[i].size]||80));

  const STATUS_ICON={"已到貨":"✅","國際運送中":"🌏","缺貨通知":"❌","待出貨":"📬"};

  return(
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={()=>setOpen(e=>!e)}>
        <div>
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="font-bold text-stone-800 text-sm">{o.id}</p>
            <Chip label={o.status} sm/><Chip label={o.payStatus} sm/>
          </div>
          <p className="text-xs text-stone-400">{o.createdAt} · {o.items.length} 件</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-extrabold text-base" style={{color:tc}}>${(o.total+o.shippingFee).toLocaleString()}</p>
          <span className="text-stone-300 text-sm">{open?"▲":"▼"}</span>
        </div>
      </div>
      {open&&(
        <div className="border-t border-stone-50 px-5 pb-5 pt-4 space-y-4">
          <div className="space-y-2">
            {o.items.map((it,i)=>(
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-stone-50 last:border-0">
                <span className="text-stone-400 text-sm">{STATUS_ICON[o.status]||"📦"}</span>
                <div className="flex-1"><p className="text-stone-700 text-sm font-semibold">{it.name}</p><p className="text-stone-400 text-xs">×{it.qty}</p></div>
                <p className="font-bold text-stone-700 text-sm">${(it.price*it.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* 待付款 */}
          {o.payStatus==="待付款"&&(
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <p className="font-bold text-amber-800 text-sm">💳 請完成付款</p>
              <div className="bg-white rounded-xl p-3 space-y-1">
                <p className="text-xs text-stone-500 font-semibold">{settings.bankName} {settings.bankBranch}</p>
                <p className="font-mono font-bold text-stone-800 text-sm">{settings.bankAccount}（{settings.bankHolder}）</p>
                <p className="font-extrabold text-rose-500 text-lg mt-1">應付：${(o.total+o.shippingFee).toLocaleString()}</p>
              </div>
              {!last5Sent?(
                <div className="flex gap-2">
                  <input value={last5} onChange={e=>setLast5(e.target.value.replace(/\D/g,"").slice(0,5))} placeholder="末五碼" maxLength={5}
                    className="flex-1 border border-amber-300 rounded-xl px-4 py-2.5 text-sm font-mono text-center tracking-widest focus:outline-none"/>
                  <button onClick={()=>{if(last5.length<4){showToast("請輸入至少4碼","warn");return;}setLast5Sent(true);showToast("✅ 末五碼已回傳！","success");}}
                    className="px-4 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90" style={{background:settings.accentColor}}>回傳</button>
                </div>
              ):<p className="text-emerald-600 text-sm font-bold text-center">✅ 末五碼已回傳，等待確認中</p>}
            </div>
          )}

          {/* 待出貨 */}
          {o.status==="待出貨"&&o.payStatus==="已付款"&&!shipSent&&(
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-3">
              <p className="font-bold text-sky-800 text-sm">📦 選擇要先出的商品</p>
              <p className="text-sky-600 text-xs">可選擇部分商品先出貨，系統自動計算預估運費</p>
              {o.items.map((it,i)=>(
                <label key={i} className="flex items-center gap-3 cursor-pointer bg-white rounded-xl p-3 border border-sky-100 hover:border-sky-300 transition-all">
                  <input type="checkbox" checked={selIdxs.includes(i)} onChange={()=>toggleIdx(i)} className="w-4 h-4 accent-blue-500"/>
                  <div className="flex-1">
                    <p className="text-stone-700 text-sm font-semibold">{it.name} ×{it.qty}</p>
                    <p className="text-stone-400 text-xs">尺寸：{({small:"小型",medium:"一般",large:"大型",extra:"加大"})[it.size]}</p>
                  </div>
                </label>
              ))}
              {selIdxs.length>0&&(
                <div className="bg-white rounded-xl p-3 border border-sky-200 flex justify-between text-sm">
                  <span className="text-stone-500">預估運費</span>
                  <span className="font-bold text-stone-800">${fee}（實際以管理員確認為準）</span>
                </div>
              )}
              <button onClick={()=>{if(!selIdxs.length){showToast("請選擇商品","warn");return;}setShipSent(true);showToast("✅ 出貨申請已送出！","success");}}
                className="w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90" style={{background:tc}}>
                申請出貨 {selIdxs.length>0?`（${selIdxs.length} 項）`:""}
              </button>
            </div>
          )}
          {shipSent&&o.status==="待出貨"&&(
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-emerald-700 font-bold text-sm">✅ 出貨申請已送出</p>
              <p className="text-emerald-600 text-xs mt-0.5">管理員確認後以 LINE 通知你</p>
            </div>
          )}

          {o.status==="國際運送中"&&<div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center"><p className="text-blue-700 font-semibold text-sm">🌏 國際運送中</p><p className="text-blue-500 text-xs mt-0.5">商品正從海外運往台灣，預計約 3 週到達</p></div>}
          {o.status==="已到貨"&&<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"><p className="text-emerald-700 font-semibold text-sm">✅ 已到貨{o.arrivedAt?` · ${o.arrivedAt}`:""}</p></div>}
          {o.status==="缺貨通知"&&<div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><p className="text-red-600 font-semibold text-sm">❌ 缺貨通知</p><p className="text-red-500 text-xs mt-0.5">管理員將聯絡你處理退款或換貨</p></div>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  WHOLESALE APPLY  ██
// ═══════════════════════════════════════════════════════════════════════
function WholesaleApply({tc,accentColor,settings,user,onBack,showToast,onSubmitApp}){
  const [form,setForm]=useState({name:user?.name||"",lineId:user?.lineId||"",phone:"",city:"",monthly:"",groupSize:"",note:""});
  const [done,setDone]=useState(false);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  const submit=()=>{
    if(!form.city||!form.monthly){showToast("請填寫必填欄位","warn");return;}
    onSubmitApp({...form,id:Date.now(),date:new Date().toISOString().slice(0,10)});
    setDone(true);
    showToast("✅ 批發申請已送出！","success");
  };

  if(done)return(
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-100 p-10 text-center shadow-sm">
      <p className="text-5xl mb-4">🎉</p>
      <h2 className="font-extrabold text-stone-800 text-xl mb-2">申請已送出！</h2>
      <p className="text-stone-500 text-sm">管理員審核後會以 LINE 通知你，通常 1～2 個工作天完成。</p>
      <button onClick={onBack} className="mt-6 text-sm font-bold px-6 py-2.5 rounded-full text-white" style={{background:tc}}>← 返回</button>
    </div>
  );

  return(
    <div className="max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-600 transition-colors text-sm">← 返回</button>
        <h2 className="font-extrabold text-stone-800 text-xl">申請批發拿貨資格</h2>
      </div>
      <div className="rounded-2xl p-4 border border-amber-200 bg-amber-50 flex gap-3">
        <span className="text-2xl">🤝</span>
        <div>
          <p className="font-bold text-amber-800 text-sm">批發拿貨福利</p>
          <p className="text-amber-700 text-xs mt-0.5">享有批發優惠價（約零售 75-85%）· 優先補貨通知 · 可轉售給自己的客群</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
        {[
          ["姓名","name","text","你的名字",""],
          ["LINE ID","lineId","text","@你的LINE ID",""],
          ["手機號碼","phone","tel","09XX-XXX-XXX",""],
          ["所在縣市 *","city","text","例：台北市",""],
          ["預估月拿貨金額 *","monthly","text","例：$5,000 ~ $10,000",""],
          ["社群 / 群組規模","groupSize","text","例：LINE 群 80 人",""],
        ].map(([l,k,t,ph])=>(
          <div key={k}>
            <label className="block text-xs font-bold text-stone-500 mb-1.5">{l}</label>
            <input type={t} value={form[k]} onChange={f(k)} placeholder={ph}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"/>
          </div>
        ))}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">其他備註</label>
          <textarea value={form.note} onChange={f("note")} rows={3} placeholder="代購經驗、主要銷售方式..."
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all resize-none"/>
        </div>
        <button onClick={submit} className="w-full py-3.5 rounded-2xl font-bold text-white text-sm hover:opacity-90" style={{background:accentColor}}>送出申請 →</button>
        <p className="text-stone-400 text-xs text-center">* 為必填欄位</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  FRONTEND CHECKOUT  ██
// ═══════════════════════════════════════════════════════════════════════
function FrontCheckout({open,onClose,cart,cartTotal,shipping,settings,tc,onDone}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",phone:"",addr:"",last5:""});
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  if(!open)return null;
  return(
    <Modal open={open} onClose={onClose} title={step===1?"填寫收件資料":"確認付款"}>
      {step===1&&(
        <div className="space-y-4">
          {[["姓名","name","text","收件人姓名"],["手機","phone","tel","0912-345-678"],["地址","addr","text","縣市/區/路/號"]].map(([l,k,t,ph])=>(
            <div key={k}>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">{l}</label>
              <input type={t} value={form[k]} onChange={f(k)} placeholder={ph}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"/>
            </div>
          ))}
          <button onClick={()=>setStep(2)} className="w-full py-3.5 rounded-2xl font-bold text-white hover:opacity-90" style={{background:tc}}>下一步 →</button>
        </div>
      )}
      {step===2&&(
        <div className="space-y-4">
          <div className="bg-stone-50 rounded-xl p-4 space-y-1.5 text-sm">
            {cart.map(i=>(
              <div key={i.id} className="flex justify-between"><span>{i.name} ×{i.qty}</span><span>${(i.price*i.qty).toLocaleString()}</span></div>
            ))}
            <div className="flex justify-between text-stone-400 border-t border-stone-200 pt-1.5"><span>運費</span><span>{shipping===0?"免運":`$${shipping}`}</span></div>
            <div className="flex justify-between font-extrabold border-t border-stone-200 pt-1.5 text-base" style={{color:tc}}><span>合計</span><span>${(cartTotal+shipping).toLocaleString()}</span></div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
            <p className="font-bold text-amber-800 text-sm">🏦 匯款帳號</p>
            <p className="text-sm font-mono font-bold text-stone-800">{settings.bankName} {settings.bankBranch}</p>
            <p className="text-sm font-mono text-stone-700">{settings.bankAccount}（{settings.bankHolder}）</p>
            <p className="text-xs text-amber-600 mt-1">匯款後請回傳末五碼，確認後才出貨</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1.5">匯款末五碼（已匯款請填）</label>
            <input value={form.last5} onChange={f("last5")} placeholder="例：78901" maxLength={5}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm font-mono text-center tracking-widest focus:outline-none"/>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 border-stone-200 text-stone-600 hover:border-stone-400">← 上一步</button>
            <button onClick={()=>{onDone();onClose();setStep(1);setForm({name:"",phone:"",addr:"",last5:""});}}
              className="flex-[2] py-3 rounded-2xl font-bold text-white text-sm hover:opacity-90" style={{background:tc}}>確認下單 ✓</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  FRONTEND MAIN  ██
// ═══════════════════════════════════════════════════════════════════════
function Frontend({settings,products,orders,user,onLogout}){
  const [view,setView]=useState("home");
  const [cat,setCat]=useState("全部");
  const [cart,setCart]=useState([]);
  const [showCart,setShowCart]=useState(false);
  const [showCheckout,setShowCheckout]=useState(false);
  const [detailProduct,setDetailProduct]=useState(null);
  const [toast,showToast]=useToast();
  const [wholesaleAppsLocal,setWholesaleAppsLocal]=useState([]);

  const tc=settings.themeColor;
  const ac=settings.accentColor;
  const myOrders=user?orders.filter(o=>o.memberLine===user.lineId||o.memberId===user.id):[];

  const addCart=p=>{
    if(!user){showToast("請先登入再加入購物車","warn");return;}
    setCart(prev=>{const ex=prev.find(i=>i.id===p.id);return ex?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}];});
    showToast(`${p.name} 已加入 🛒`);
  };
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipFee=cart.length>0&&cartTotal<2000?Math.max(...cart.map(i=>settings.shipping[i.size]||80)):0;

  const featured=products.filter(p=>p.featured&&p.visible&&p.status!=="缺貨");
  const closing=products.filter(p=>p.closeDate&&p.visible).sort((a,b)=>a.closeDate.localeCompare(b.closeDate)).slice(0,4);
  const filtered=products.filter(p=>p.visible&&(cat==="全部"||p.cat===cat));

  return(
    <div className="min-h-screen" style={{background:settings.bgColor,fontFamily:FONT}}>
      {/* MARQUEE */}
      <div className="text-white text-xs py-2 overflow-hidden" style={{background:tc}}>
        <div style={{animation:"mq 30s linear infinite",display:"flex",gap:"3rem",whiteSpace:"nowrap"}}>
          {[1,2,3].map(k=><span key={k}>{settings.announcement}</span>)}
        </div>
        <style>{`@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-30 shadow-md" style={{background:settings.headerBg}}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={()=>setView("home")} className="flex-shrink-0">
            <h1 className="font-extrabold text-white text-xl tracking-tight leading-none">{settings.storeName}</h1>
            <p className="text-white/40 text-[10px]">{settings.storeSubtitle}</p>
          </button>
          <div className="flex-1"/>
          {user?(
            <>
              <span className="text-white/50 text-xs hidden sm:block truncate max-w-[80px]">{user.name}</span>
              <button onClick={()=>setView("myorders")} className="text-white/60 hover:text-white text-xs transition-colors whitespace-nowrap">我的訂單</button>
              <button onClick={onLogout} className="text-white/40 hover:text-white/70 text-xs transition-colors">登出</button>
            </>
          ):(
            <button onClick={onLogout} className="text-white/70 hover:text-white text-xs font-bold border border-white/20 px-3 py-1.5 rounded-full transition-all whitespace-nowrap">登入 / 註冊</button>
          )}
          <button onClick={()=>setShowCart(true)} className="relative p-2 hover:bg-white/10 rounded-full flex-shrink-0">
            <span className="text-xl">🛒</span>
            {cartCount>0&&<span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center" style={{background:tc}}>{cartCount}</span>}
          </button>
        </div>
        <div className="border-t border-white/10 max-w-5xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
          {[["home","首頁"],["all","全部商品"],...(user?[["myorders","我的訂單"]]:[]),...(user?.type==="wholesale"?[["wholesale","批發專區"]]:[])]
            .map(([k,l])=>(
              <button key={k} onClick={()=>setView(k)}
                className={cls("px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0",
                  view===k?"text-white border-white":"text-white/40 border-transparent hover:text-white/70")}>
                {l}
              </button>
            ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* HOME */}
        {view==="home"&&(
          <>
            <div className="relative rounded-3xl overflow-hidden h-56 flex items-center" style={{background:`linear-gradient(135deg,${settings.headerBg} 0%,${tc} 100%)`}}>
              <div className="absolute inset-0 opacity-8 text-[160px] flex items-center justify-end pr-4 select-none">🌏</div>
              <div className="relative z-10 px-8">
                <p className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">海外直採代購</p>
                <h2 className="text-white font-extrabold text-3xl leading-tight mb-4">好物直送<br/>簡單購海外</h2>
                <div className="flex flex-wrap gap-2">
                  {["🌏 多國直採","🔒 正品保證","📦 約 3 週到貨"].map(t=>(
                    <span key={t} className="bg-white/12 text-white/80 text-xs px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              {!user&&<button onClick={onLogout} className="absolute bottom-5 right-5 z-10 bg-white text-sm font-bold px-4 py-2 rounded-full hover:bg-stone-100 transition-all" style={{color:tc}}>登入購物 →</button>}
            </div>

            {closing.length>0&&(
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-extrabold text-stone-800 text-xl">⏰ 近期截單</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{background:tc}}>把握時間</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {closing.map(p=><FrontCard key={p.id} p={p} tc={tc} accentColor={ac} onAdd={addCart} onDetail={setDetailProduct}/>)}
                </div>
              </div>
            )}

            {featured.length>0&&(
              <div>
                <h2 className="font-extrabold text-stone-800 text-xl mb-4">⭐ 精選商品</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {featured.map(p=><FrontCard key={p.id} p={p} tc={tc} accentColor={ac} onAdd={addCart} onDetail={setDetailProduct}/>)}
                </div>
              </div>
            )}

            {!user&&(
              <div className="rounded-2xl p-6 flex items-center gap-5 text-white" style={{background:`linear-gradient(135deg,${settings.headerBg},${tc})`}}>
                <span className="text-5xl">📱</span>
                <div>
                  <p className="font-extrabold text-lg">用 LINE 登入，享有更多功能</p>
                  <p className="text-white/70 text-sm mt-1">登入後可下單、查訂單、接收到貨通知</p>
                </div>
                <button onClick={onLogout} className="ml-auto bg-white font-bold text-sm px-5 py-2.5 rounded-full flex-shrink-0 hover:bg-stone-100 transition-all" style={{color:tc}}>立即登入</button>
              </div>
            )}
          </>
        )}

        {/* ALL PRODUCTS */}
        {view==="all"&&(
          <div>
            <h2 className="font-extrabold text-stone-800 text-xl mb-5">全部商品</h2>
            <div className="flex gap-2 flex-wrap mb-6">
              {["全部",...settings.categories].map(c=>(
                <button key={c} onClick={()=>setCat(c)}
                  className={cls("px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",cat===c?"text-white border-transparent":"bg-white border-stone-200 text-stone-600 hover:border-stone-400")}
                  style={cat===c?{background:tc,borderColor:tc}:{}}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map(p=><FrontCard key={p.id} p={p} tc={tc} accentColor={ac} onAdd={addCart} onDetail={setDetailProduct}/>)}
            </div>
          </div>
        )}

        {/* MY ORDERS */}
        {view==="myorders"&&user&&(
          <div className="space-y-5">
            <h2 className="font-extrabold text-stone-800 text-xl">我的訂單</h2>
            <div className="flex gap-2 flex-wrap">
              {[{l:"全部",c:myOrders.length},{l:"國際運送中",c:myOrders.filter(o=>o.status==="國際運送中").length},{l:"待出貨",c:myOrders.filter(o=>o.status==="待出貨").length},{l:"缺貨",c:myOrders.filter(o=>o.status==="缺貨通知").length}].map(s=>(
                <span key={s.l} className={cls("text-xs font-bold px-3 py-1 rounded-full",s.c>0?"bg-stone-200 text-stone-700":"bg-stone-100 text-stone-400")}>
                  {s.l}{s.c>0?` (${s.c})`:""}</span>
              ))}
            </div>
            {myOrders.length===0?(
              <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-stone-400 font-semibold">尚無訂單記錄</p>
                <button onClick={()=>setView("all")} className="mt-4 text-sm font-bold px-5 py-2 rounded-full text-white" style={{background:tc}}>去逛逛</button>
              </div>
            ):myOrders.map(o=><MyOrderCard key={o.id} o={o} tc={tc} settings={settings} showToast={showToast}/>)}
            {user.type!=="wholesale"&&(
              <div className="rounded-2xl p-5 flex items-center gap-4 border border-amber-200 bg-amber-50">
                <span className="text-3xl">🤝</span>
                <div className="flex-1">
                  <p className="font-bold text-amber-800">想要批發拿貨優惠？</p>
                  <p className="text-amber-600 text-xs mt-0.5">申請批發資格，享批發優惠價，適合有社群的你</p>
                </div>
                <button onClick={()=>setView("wholesale_apply")} className="text-xs font-bold px-4 py-2 rounded-full text-white flex-shrink-0" style={{background:ac}}>申請</button>
              </div>
            )}
          </div>
        )}

        {/* WHOLESALE APPLY */}
        {view==="wholesale_apply"&&user&&(
          <WholesaleApply tc={tc} accentColor={ac} settings={settings} user={user} onBack={()=>setView("myorders")}
            showToast={showToast} onSubmitApp={app=>setWholesaleAppsLocal(p=>[...p,app])}/>
        )}

        {/* WHOLESALE ZONE */}
        {view==="wholesale"&&user?.type==="wholesale"&&(
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <h2 className="font-extrabold text-amber-800 text-xl">📦 批發拿貨專區</h2>
              <p className="text-amber-600 text-sm mt-1">以下為批發優惠價格，訂購數量請與管理員確認最低起訂量</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.filter(p=>p.visible).map(p=>(
                <div key={p.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm cursor-pointer" onClick={()=>setDetailProduct(p)}>
                  <div className="bg-gradient-to-br from-amber-50 to-stone-50 h-32 flex items-center justify-center text-5xl select-none relative">
                    {p.img}
                    <div className="absolute bottom-2 right-2 text-base">{p.origin?.split(" ")[0]||""}</div>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase" style={{color:tc}}>{p.cat}</p>
                    <p className="font-bold text-stone-800 text-xs leading-snug">{p.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-[10px] text-stone-400 line-through">${p.price.toLocaleString()}</p>
                        <p className="font-extrabold text-base" style={{color:ac}}>${p.wholesale.toLocaleString()}</p>
                      </div>
                      <Chip label={p.status} sm/>
                    </div>
                    <button onClick={e=>{e.stopPropagation();addCart({...p,price:p.wholesale});}} disabled={p.status==="缺貨"}
                      className="w-full mt-1 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40" style={{background:ac}}>
                      {p.status==="缺貨"?"缺貨":"批發加入"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 border-t" style={{background:settings.headerBg}}>
        <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
          <p className="font-extrabold text-white">{settings.storeName}</p>
          <p className="text-white/30 text-xs">{settings.storeSubtitle}</p>
          <div className="flex items-center justify-center gap-5">
            <a href={settings.lineGroupUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm hover:text-green-300">📱 LINE</a>
            <a href={settings.igUrl} target="_blank" rel="noopener noreferrer" className="text-pink-400 text-sm hover:text-pink-300">📸 IG</a>
            <a href={settings.fbUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:text-blue-300">📘 FB</a>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <div className={cls("fixed inset-0 bg-black/50 z-40 transition-opacity",showCart?"opacity-100":"opacity-0 pointer-events-none")} onClick={()=>setShowCart(false)}/>
      <div className={cls("fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300",showCart?"translate-x-0":"translate-x-full")}>
        <div className="p-5 border-b flex items-center justify-between" style={{background:settings.headerBg}}>
          <h2 className="font-extrabold text-white text-lg">購物車 {cartCount>0&&`(${cartCount})`}</h2>
          <button onClick={()=>setShowCart(false)} className="text-white/60 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length===0&&<div className="text-center py-16 text-stone-400"><p className="text-4xl mb-3">🛒</p><p>購物車是空的</p></div>}
          {cart.map(item=>(
            <div key={item.id} className="bg-stone-50 rounded-2xl p-3 flex items-center gap-3">
              <span className="text-3xl">{item.img}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-700 truncate">{item.name}</p>
                <p className="font-extrabold text-sm" style={{color:tc}}>${item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={()=>setCart(prev=>prev.map(i=>i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} className="w-6 h-6 rounded-full bg-stone-200 text-xs font-bold flex items-center justify-center">−</button>
                <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={()=>setCart(prev=>prev.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i))} className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{background:tc}}>＋</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div className="p-5 border-t space-y-3 bg-stone-50">
            {cartTotal<2000&&<p className="text-xs text-stone-500 text-center">再買 <span className="font-bold" style={{color:tc}}>${(2000-cartTotal).toLocaleString()}</span> 可免運</p>}
            {cartTotal>=2000&&<p className="text-xs text-emerald-600 text-center font-bold">🎉 已達免運門檻！</p>}
            <div className="flex justify-between font-extrabold text-lg text-stone-800">
              <span>合計</span><span style={{color:tc}}>${(cartTotal+shipFee).toLocaleString()}</span>
            </div>
            <button onClick={()=>{setShowCart(false);setShowCheckout(true);}} className="w-full text-white font-bold py-3.5 rounded-full hover:opacity-90" style={{background:tc}}>確認結帳 →</button>
          </div>
        )}
      </div>

      <FrontCheckout open={showCheckout} onClose={()=>setShowCheckout(false)} cart={cart} cartTotal={cartTotal} shipping={shipFee}
        settings={settings} tc={tc} onDone={()=>{setCart([]);showToast("🎉 訂單已送出！感謝購買","success");}}/>

      <ProductDetail product={detailProduct} tc={tc} accentColor={ac} onClose={()=>setDetailProduct(null)} onAdd={addCart} user={user}/>

      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
//  ██  ROOT APP  ██
// ═══════════════════════════════════════════════════════════════════════
export default function App(){
  const [scene,setScene]=useState("frontend_login"); // frontend_login | frontend | admin_login | admin
  const [admin,setAdmin]=useState(null);
  const [user,setUser]=useState(null);
  const [adminTab,setAdminTab]=useState("dash");
  const [products,setProducts]=useState(INIT_PRODUCTS);
  const [orders,setOrders]=useState(INIT_ORDERS);
  const [members,setMembers]=useState(INIT_MEMBERS);
  const [settings,setSettings]=useState(INIT_SETTINGS);
  const [wholesaleApps,setWholesaleApps]=useState([]); // 批發申請：前台送出 → 後台審核

  const goAdmin=()=>setScene("admin_login");

  // ── ADMIN SCENES ─────────────────────────────────────────────────
  if(scene==="admin_login")return <AdminLogin onLogin={a=>{setAdmin(a);setScene("admin");}}/>;

  if(scene==="admin")return(
    <div className="flex h-screen overflow-hidden bg-[#0D0F14]" style={{fontFamily:FONT}}>
      <AdminSidebar tab={adminTab} setTab={setAdminTab} admin={admin}
        onLogout={()=>{setAdmin(null);setScene("admin_login");}}
        onViewFront={()=>setScene("frontend")}/>
      <div className="flex-1 overflow-y-auto p-8">
        {adminTab==="dash"&&      <AdminDash products={products} orders={orders} members={members}/>}
        {adminTab==="products"&&  <AdminProducts products={products} setProducts={setProducts} settings={settings}/>}
        {adminTab==="orders"&&    <AdminOrders orders={orders} setOrders={setOrders} settings={settings}/>}
        {adminTab==="shipments"&& <AdminShipments orders={orders} products={products}/>}
        {adminTab==="members"&&   <AdminMembers members={members} setMembers={setMembers} wholesaleApps={wholesaleApps} setWholesaleApps={setWholesaleApps}/>}
        {adminTab==="notify"&&    <AdminNotify settings={settings}/>}
        {adminTab==="share"&&     <AdminShare products={products} settings={settings}/>}
        {adminTab==="settings"&&  <AdminSettings settings={settings} setSettings={setSettings}/>}
      </div>
    </div>
  );

  // ── FRONTEND SCENES ───────────────────────────────────────────────
  if(scene==="frontend_login")return(
    <div className="relative">
      <LineLogin settings={settings} onLogin={u=>{setUser(u);setScene("frontend");}} onGuest={()=>setScene("frontend")}/>
      {/* 後台隱藏入口：右下角幾乎看不見的點，只有授權人員知道位置 */}
      <button onClick={goAdmin} className="fixed bottom-3 right-3 w-6 h-6 text-transparent hover:text-stone-300 transition-colors duration-700 select-none z-50 cursor-default" title="">⠿</button>
    </div>
  );

  return(
    <div className="relative">
      <Frontend settings={settings} products={products} orders={orders} user={user}
        onLogout={()=>{setUser(null);setScene("frontend_login");}}/>
      {/* 同樣的後台隱藏入口，前台也保留 */}
      <button onClick={goAdmin} className="fixed bottom-3 right-3 w-6 h-6 text-transparent hover:text-stone-300 transition-colors duration-700 select-none z-50 cursor-default" title="">⠿</button>
    </div>
  );
}
