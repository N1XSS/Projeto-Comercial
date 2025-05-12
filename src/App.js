import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
// Ensure all used icons are listed
import { 
  BarChart, DollarSign, ShoppingCart, TrendingUp, Tractor, FileText, Settings, LogOut, 
  ChevronDown, ChevronRight, Bell, Search, Calendar, Download, Sun, Moon, 
  Briefcase, BarChart2, PieChart as PieChartIcon, List, Grid, ArrowRightLeft, Package, 
  Scale, Percent, Bean, Beef, Menu, X, Cloud, Carrot, CircleDot, UserPlus, AlertTriangle,
  ArrowUp, ArrowDown, Minus // Icons for Ticker
} from 'lucide-react'; 

// Constants for brand colors from the manual
const BRAND_COLORS = {
  primaryGreen: '#00594F',
  primaryYellow: '#DB8A06',
  secondaryBeige: '#EDC472',
  secondaryLightGreen: '#86A96F',
  neutralGray: '#676769',
  accentBlue: '#02549D',
  textPrimary: '#1a202c', 
  textSecondary: '#4a5568',
  backgroundLight: '#f7fafc',
  backgroundWhite: '#ffffff',
  danger: '#e53e3e',
  success: '#38a169',
};

// Context for managing theme (dark/light mode)
const ThemeContext = createContext(null);
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};


// Context for Sidebar state
const SidebarContext = createContext(null);
const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
    return context;
};


// Mock User Data
const mockUser = {
  name: "Usuário Admin",
  email: "admin@locks.com.br",
  avatarUrl: "https://placehold.co/100x100/E2E8F0/A0AEC0?text=User", 
};

// Mock Notifications
const mockNotifications = [
  { id: 1, message: "Novo contrato de Soja adicionado.", time: "Há 15 minutos" },
  { id: 2, message: "Preço do Milho atingiu meta de venda.", time: "Há 1 hora" },
  { id: 3, message: "Relatório de rentabilidade mensal gerado.", time: "Há 3 horas" },
];

// Logo URL
const LOGO_URL = "https://static.wixstatic.com/media/961011_68c256f18a4840ad901e5687bd719798~mv2.png/v1/crop/x_108,y_44,w_583,h_236/fill/w_145,h_57,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO-03.png"; 

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700 p-4">
           <AlertTriangle size={48} className="mb-4"/>
          <h1 className="text-2xl font-bold mb-2">Ocorreu um erro!</h1>
          <p className="mb-4 text-center">Algo deu errado ao tentar renderizar esta parte da aplicação. Por favor, tente recarregar a página.</p>
          <details className="mb-4 text-xs bg-red-50 p-2 rounded overflow-auto max-w-full w-full text-left">
            <summary>Detalhes do erro (clique para expandir)</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
           <button 
             onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
             className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
           >
             Tentar renderizar novamente
           </button>
           <button 
             onClick={() => window.location.reload()} 
             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
           >
             Recarregar Página
           </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

// --- App Component ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('Visão Geral');
  const [theme, setTheme] = useState('light'); 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true); 

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const setSidebarExpanded = (expanded) => setIsSidebarExpanded(expanded);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (document.body) { 
      document.body.classList.toggle('mobile-sidebar-open', isMobileSidebarOpen);
    }
  }, [isMobileSidebarOpen]);

  return (
     <ThemeContext.Provider value={{ theme, toggleTheme }}>
       <ErrorBoundary>
         {!isAuthenticated ? (
           showLogin ? (
             <LoginPage 
               onLogin={() => setIsAuthenticated(true)} 
               onGoToRegister={() => setShowLogin(false)} 
             />
           ) : (
             <RegistrationPage onGoToLogin={() => setShowLogin(true)} />
           )
         ) : (
           <SidebarContext.Provider value={{ isSidebarExpanded, toggleSidebar, setSidebarExpanded, isMobileSidebarOpen, toggleMobileSidebar, setCurrentPage }}>
               <MainLayout 
                 currentPage={currentPage} 
                 onLogout={() => {
                     setIsAuthenticated(false); 
                     setCurrentPage('Visão Geral'); 
                     setIsSidebarExpanded(false); 
                     setIsMobileSidebarOpen(false);
                 }} 
                 setCurrentPage={setCurrentPage} 
               />
           </SidebarContext.Provider>
         )}
       </ErrorBoundary>
     </ThemeContext.Provider>
  );
}

// --- Ticker Component ---
function Ticker() {
  const { theme } = useTheme();
  const tickerData = [
    { id: 1, name: "USD/BRL", price: "5.4572", change: "+0.0015", trend: "up" },
    { id: 2, name: "Algodão NY", price: "78.50", change: "-0.25", trend: "down", unit: "¢/lb" },
    { id: 3, name: "Soja CHI", price: "1177.25", change: "+2.50", trend: "up", unit: "¢/bu" },
    { id: 4, name: "Milho CHI", price: "450.75", change: "0.00", trend: "stable", unit: "¢/bu" },
    { id: 5, name: "Boi Gordo B3", price: "225.80", change: "-1.10", trend: "down", unit: "R$/@" },
    { id: 6, name: "Café ARA NY", price: "220.15", change: "+1.80", trend: "up", unit: "¢/lb" },
  ];

  // Duplicate data for seamless scrolling effect
  const duplicatedTickerData = [...tickerData, ...tickerData];

  const getTrendColor = (trend) => {
    if (trend === "up") return BRAND_COLORS.success;
    if (trend === "down") return BRAND_COLORS.danger;
    return theme === 'dark' ? BRAND_COLORS.neutralGray : BRAND_COLORS.textSecondary;
  };

  return (
    <>
      {/* CSS for ticker animation - embedded for simplicity */}
      <style>
        {`
          .ticker-wrap {
            width: 100%;
            overflow: hidden;
            padding: 0.5rem 0; /* py-2 */
            box-sizing: border-box;
          }
          .ticker-move {
            display: inline-flex; /* Changed from flex to inline-flex for better animation control */
            white-space: nowrap;
            animation: ticker-scroll 40s linear infinite; /* Adjust duration as needed */
          }
          .ticker-move:hover {
            animation-play-state: paused;
          }
          .ticker-item {
            display: inline-block; /* Ensure items are inline */
            margin-right: 2rem; /* mx-4 equivalent for right margin */
            font-size: 0.875rem; /* text-sm */
          }
          @keyframes ticker-scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%); /* Scroll by half the width because items are duplicated */
            }
          }
        `}
      </style>
      <div 
        className={`ticker-wrap ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b border-t`}
      >
        <div className="ticker-move">
          {duplicatedTickerData.map((item, index) => (
            <div key={`${item.id}-${index}`} className="ticker-item">
              <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
                {item.name}:
              </span>
              <span className={`ml-1 font-bold ${theme === 'dark' ? 'text-white' : BRAND_COLORS.textPrimary}`}>
                {item.price}
              </span>
              {item.unit && <span className={`ml-0.5 text-xs ${theme === 'dark' ? 'text-gray-400' : BRAND_COLORS.textSecondary}`}>{item.unit}</span>}
              <span className="ml-2 inline-flex items-center" style={{ color: getTrendColor(item.trend) }}>
                {item.trend === "up" && <ArrowUp size={12} className="mr-0.5" />}
                {item.trend === "down" && <ArrowDown size={12} className="mr-0.5" />}
                {item.trend === "stable" && <Minus size={12} className="mr-0.5" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


// --- MainLayout Component (Authenticated View) ---
function MainLayout({ currentPage, onLogout, setCurrentPage }) {
    const { theme } = useTheme();
    const { isSidebarExpanded, isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();

    return (
        <div className={`flex h-screen font-inter antialiased ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
          
          <div className="hidden md:block"> 
             <Sidebar currentPage={currentPage} onLogout={onLogout} isMobile={false} />
          </div>

           <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden shadow-lg`}>
             <Sidebar currentPage={currentPage} onLogout={onLogout} isMobile={true} />
           </div>
           {isMobileSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar}></div>}

          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
            <Header currentPage={currentPage} onLogout={onLogout} setCurrentPage={setCurrentPage} />
            <Ticker /> {/* Added Ticker component here */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6"> 
              {renderPage(currentPage)}
            </main>
          </div>
        </div>
    );
}


// --- LoginPage Component ---
function LoginPage({ onLogin, onGoToRegister }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    if (email && password) {
      if (email === "admin@locks.com.br" && password === "password") { 
          onLogin();
      } else {
          setError("E-mail ou senha inválidos.");
      }
    } else {
      setError("Por favor, preencha e-mail e senha.");
    }
  };
  
  const getInputClasses = () => {
    let baseClasses = "mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-opacity-50";
    if (theme === 'dark') {
      baseClasses += ` bg-gray-700 border-gray-600 text-white focus:border-[${BRAND_COLORS.primaryYellow}] focus:ring-[${BRAND_COLORS.primaryYellow}]`;
    } else {
      baseClasses += ` bg-white border-gray-300 focus:border-[${BRAND_COLORS.primaryYellow}] focus:ring-[${BRAND_COLORS.primaryYellow}]`;
    }
    return baseClasses;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : BRAND_COLORS.backgroundWhite}`}>
        <img src={LOGO_URL} alt="Locks Logo" className="mx-auto mb-8 h-12 object-contain" />
        <h2 className={`text-3xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : BRAND_COLORS.primaryGreen}`}>Bem-vindo!</h2>
        <p className={`text-center text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : BRAND_COLORS.textSecondary}`}>
          Acesse sua plataforma de gestão comercial.
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={getInputClasses()}
              placeholder="seuemail@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={getInputClasses()}
              placeholder="Sua senha"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <a href="#!" className={`hover:underline`} style={{ color: BRAND_COLORS.primaryYellow }}>
              Esqueceu a senha?
            </a>
             <button 
               type="button" 
               onClick={onGoToRegister} 
               className={`hover:underline`} 
               style={{ color: BRAND_COLORS.primaryGreen }}
             >
               Criar conta
             </button>
          </div>
          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-150`}
            style={{ backgroundColor: BRAND_COLORS.primaryGreen }}
          >
            Entrar
          </button>
        </form>
        <p className={`text-center text-xs mt-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} Locks Agropecuária. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

// --- RegistrationPage Component ---
function RegistrationPage({ onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
       setError('A senha deve ter pelo menos 6 caracteres.');
       return;
    }

    console.log('Registration attempt:', { name, email, password });
    setSuccess('Cadastro simulado com sucesso! Você seria redirecionado ou logado.');
    // setTimeout(onGoToLogin, 2000); 
  };

  const getInputClasses = () => {
    let baseClasses = "mt-1 block w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-opacity-50";
    if (theme === 'dark') {
      baseClasses += ` bg-gray-700 border-gray-600 text-white focus:border-[${BRAND_COLORS.primaryYellow}] focus:ring-[${BRAND_COLORS.primaryYellow}]`;
    } else {
      baseClasses += ` bg-white border-gray-300 focus:border-[${BRAND_COLORS.primaryYellow}] focus:ring-[${BRAND_COLORS.primaryYellow}]`;
    }
    return baseClasses;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : BRAND_COLORS.backgroundWhite}`}>
        <img src={LOGO_URL} alt="Locks Logo" className="mx-auto mb-8 h-12 object-contain" />
        <h2 className={`text-3xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : BRAND_COLORS.primaryGreen}`}>Criar Conta</h2>
        <p className={`text-center text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : BRAND_COLORS.textSecondary}`}>
          Preencha os dados para se cadastrar.
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}
         {success && (
          <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-700 text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              Nome Completo
            </label>
            <input type="text" id="reg-name" value={name} onChange={(e) => setName(e.target.value)} className={getInputClasses()} placeholder="Seu nome" />
          </div>
          <div>
            <label htmlFor="reg-email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              E-mail
            </label>
            <input type="email" id="reg-email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={getInputClasses()} placeholder="seuemail@example.com" />
          </div>
          <div>
            <label htmlFor="reg-password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              Senha (mín. 6 caracteres)
            </label>
            <input type="password" id="reg-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={getInputClasses()} placeholder="Crie uma senha" />
          </div>
           <div>
            <label htmlFor="reg-confirm-password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>
              Confirmar Senha
            </label>
            <input type="password" id="reg-confirm-password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={getInputClasses()} placeholder="Repita a senha" />
          </div>
          
          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-150 mt-6`} 
            style={{ backgroundColor: BRAND_COLORS.primaryGreen }}
          >
            Cadastrar
          </button>
        </form>
         <div className="text-center mt-6">
           <button onClick={onGoToLogin} className={`text-sm hover:underline`} style={{ color: BRAND_COLORS.primaryGreen }}>
             Já tem uma conta? Entrar
           </button>
         </div>
        <p className={`text-center text-xs mt-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} Locks Agropecuária. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

// --- Sidebar Component ---
function Sidebar({ currentPage, onLogout, isMobile }) {
  const { theme } = useTheme();
  const { isSidebarExpanded, toggleSidebar, toggleMobileSidebar, setCurrentPage, setSidebarExpanded } = useSidebar();
  const [openMenu, setOpenMenu] = useState(null); 
  const sidebarRef = useRef(null); 

  const showExpanded = isMobile || isSidebarExpanded;

  const navItems = [
    { name: 'Visão Geral', icon: BarChart2, page: 'Visão Geral' },
    { 
      name: 'Comercialização', 
      icon: ShoppingCart, 
      subItems: [
        { name: 'Soja', icon: Bean, page: 'Comercialização Soja' }, 
        { name: 'Milho', icon: Carrot, page: 'Comercialização Milho' }, 
        { name: 'Algodão', icon: Cloud, page: 'Comercialização Algodão' }, 
        { name: 'Caroço de Algodão', icon: CircleDot, page: 'Comercialização Caroço Algodão' }, 
        { name: 'Boi Gordo', icon: Beef, page: 'Comercialização Boi' }, 
        { name: 'Contratos', icon: FileText, page: 'Contratos' },
      ]
    },
    { 
      name: 'Mercado', 
      icon: TrendingUp, 
      subItems: [
        { name: 'Cotações', icon: DollarSign, page: 'Cotações' },
        { name: 'Notícias Agrícolas', icon: List, page: 'Notícias Agrícolas' },
        { name: 'Análise de Basis', icon: ArrowRightLeft, page: 'Análise de Basis' },
      ]
    },
    { 
      name: 'Custos', 
      icon: Tractor, 
      subItems: [
        { name: 'Custos Logísticos', icon: Package, page: 'Custos Logísticos' },
        { name: 'Custos de Produção', icon: Scale, page: 'Custos de Produção' },
      ]
    },
    { 
      name: 'Rentabilidade', 
      icon: Percent, 
      subItems: [
        { name: 'Análise em Tempo Real', icon: BarChart, page: 'Rentabilidade Tempo Real' },
        { name: 'Matriz de Lucratividade', icon: Grid, page: 'Matriz de Lucratividade' },
        { name: 'Marcação a Mercado', icon: DollarSign, page: 'Marcação a Mercado' },
      ]
    },
    { name: 'Relatórios', icon: FileText, page: 'Relatórios' },
    { name: 'Configurações', icon: Settings, page: 'Configurações' },
    { name: 'Cadastro de Usuário', icon: UserPlus, page: 'Cadastro de Usuário' }, 
  ];

  const handleToggleAccordion = (itemName) => {
     setOpenMenu(prevOpenMenu => {
       if (prevOpenMenu === itemName) return null;
       setTimeout(() => setOpenMenu(itemName), 0); // Open new after current cycle allows closing
       return null; // Close current immediately
     });
  };

  const handleMainItemClick = (item) => {
    if (item.subItems) {
      if (!isSidebarExpanded && !isMobile) {
         setSidebarExpanded(true); 
         setTimeout(() => handleToggleAccordion(item.name), 150); 
      } else {
         handleToggleAccordion(item.name);
      }
    } else {
      setCurrentPage(item.page);
      setOpenMenu(null); 
      if (isMobile) toggleMobileSidebar(); 
    }
  };

  const handleSubmenuNavigate = (page) => {
     setCurrentPage(page);
     if (isMobile) toggleMobileSidebar(); 
  }

  const sidebarBaseClasses = `h-full shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : ''}`;
  const sidebarDesktopPosition = isMobile ? '' : 'fixed inset-y-0 left-0 z-30'; 
  const sidebarWidth = isMobile ? 'w-64' : (isSidebarExpanded ? 'w-64' : 'w-20');

  const isActive = (page) => currentPage === page;
  const isParentActive = (item) => item.subItems?.some(sub => isActive(sub.page)) ?? false;

  return (
    <div 
      ref={sidebarRef}
      className={`${sidebarBaseClasses} ${sidebarDesktopPosition} ${sidebarWidth}`} 
      style={{ backgroundColor: theme === 'light' ? BRAND_COLORS.primaryGreen : '' }}
    >
      <div className="flex flex-col h-full overflow-hidden"> 
        <div className={`flex items-center h-20 px-4 flex-shrink-0 ${showExpanded ? 'justify-between' : 'justify-center'}`}>
          <div className={`transition-opacity duration-200 ease-in-out ${showExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             {showExpanded && <img src={LOGO_URL} alt="Locks Logo" className="h-8 object-contain"/>}
          </div>
          {!isMobile && (
            <button onClick={toggleSidebar} className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10'}`} aria-label={isSidebarExpanded ? "Recolher menu" : "Expandir menu"}>
              <Menu size={20} />
            </button>
          )}
           {isMobile && (
             <button onClick={toggleMobileSidebar} className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10'}`}>
               <X size={20} />
             </button>
           )}
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto overflow-x-hidden"> 
          {navItems.map((item) => {
            const isAccordionOpen = openMenu === item.name; 
            const itemIsActive = isActive(item.page);
            const parentIsActive = !itemIsActive && isParentActive(item); 

            let buttonClasses = `w-full flex items-center py-3 text-sm transition-colors duration-200 whitespace-nowrap ${showExpanded ? 'px-6 justify-between' : 'px-6 justify-center'}`;
            let stateClasses = '';
            if (itemIsActive && !item.subItems) {
              stateClasses = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-20 text-white';
            } else if (parentIsActive && showExpanded) {
              stateClasses = theme === 'dark' ? 'bg-gray-600 text-gray-100' : 'bg-white bg-opacity-10 text-gray-50';
            } else {
              stateClasses = theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10';
            }
            
            return (
              <div key={item.name} className="overflow-hidden"> 
                <button onClick={() => handleMainItemClick(item)} title={!showExpanded ? item.name : ''} className={`${buttonClasses} ${stateClasses}`}>
                  <div className="flex items-center">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${showExpanded ? 'mr-3' : 'mx-auto'}`} />
                    {showExpanded && <span className={`truncate transition-opacity duration-200 ease-in-out ${showExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.name}</span>}
                  </div>
                  {item.subItems && showExpanded && (isAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAccordionOpen && showExpanded ? 'max-h-96' : 'max-h-0'} ${theme === 'dark' ? 'bg-gray-750' : 'bg-black bg-opacity-10'}`}>
                 {showExpanded && item.subItems && item.subItems.map(subItem => { 
                    const subItemIsActive = isActive(subItem.page);
                    let subButtonClasses = `w-full text-left py-2.5 text-xs transition-colors duration-200 flex items-center whitespace-nowrap ${showExpanded ? 'pl-12 pr-6' : 'justify-center pl-6'}`;
                    let subStateClasses = subItemIsActive ? (theme === 'dark' ? 'text-white font-semibold' : 'text-white font-semibold') : (theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-200 hover:text-white');
                    return (
                      <button key={subItem.name} onClick={() => handleSubmenuNavigate(subItem.page)} title={!showExpanded ? subItem.name : ''} className={`${subButtonClasses} ${subStateClasses}`}>
                         <subItem.icon className={`h-4 w-4 flex-shrink-0 ${showExpanded ? 'mr-2' : 'mx-auto'}`} />
                        {showExpanded && <span className="truncate">{subItem.name}</span>}
                      </button>
                    );
                 })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t flex-shrink-0" style={{borderColor: theme === 'dark' ? 'rgb(55 65 81)' : 'rgba(255,255,255,0.2)'}}>
        <button onClick={onLogout} title={!showExpanded ? "Sair" : ''} className={`w-full flex items-center py-3 text-sm rounded-lg transition-colors duration-200 whitespace-nowrap ${showExpanded ? 'px-6' : 'px-6 justify-center'} ${theme === 'dark' ? 'text-gray-300 hover:bg-red-700 hover:text-white' : 'text-gray-100 hover:bg-red-500 hover:bg-opacity-80'}`}>
          <LogOut className={`h-5 w-5 flex-shrink-0 ${showExpanded ? 'mr-3' : 'mx-auto'}`} />
          {showExpanded && <span className={`truncate transition-opacity duration-200 ease-in-out ${showExpanded ? 'opacity-100' : 'opacity-0'}`}>Sair</span>}
        </button>
      </div>
    </div>
  );
}

// --- Header Component ---
function Header({ currentPage, onLogout, setCurrentPage }) { 
  const { theme, toggleTheme } = useTheme();
  const { toggleMobileSidebar } = useSidebar(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputClasses = () => {
    let base = "pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border focus:ring-2 transition-colors"; 
    if (theme === 'dark') {
      return `${base} bg-gray-700 border-gray-600 text-gray-200 focus:ring-[${BRAND_COLORS.primaryYellow}] focus:border-[${BRAND_COLORS.primaryYellow}]`;
    }
    return `${base} border-gray-300 focus:ring-[${BRAND_COLORS.primaryYellow}] focus:border-[${BRAND_COLORS.primaryYellow}]`;
  };

  return (
    <header className={`shadow-md py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : BRAND_COLORS.backgroundWhite + ' border-b border-gray-200'}`}> 
      <div className="flex items-center">
         <button 
           onClick={toggleMobileSidebar} 
           className={`mr-3 md:hidden p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
           aria-label="Abrir menu"
         >
           <Menu size={24} />
         </button>
        <h1 className={`text-xl md:text-2xl font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : BRAND_COLORS.textPrimary}`}>{currentPage}</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden sm:block"> 
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input 
            type="text" 
            placeholder="Pesquisar..."
            className={searchInputClasses()}
          />
        </div>

        <button onClick={toggleTheme} className={`p-2 rounded-full hover:bg-opacity-20 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className={`p-2 rounded-full hover:bg-opacity-20 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}>
            <Bell size={20} />
            {mockNotifications.length > 0 && (
              <span className={`absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ${theme === 'dark' ? 'ring-gray-800' : 'ring-white'} bg-red-500`} />
            )}
          </button>
          {notificationsOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl overflow-hidden z-20 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className={`p-4 font-semibold border-b ${theme === 'dark' ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-100'}`}>Notificações</div>
              {mockNotifications.length > 0 ? (
                mockNotifications.map(notif => (
                  <div key={notif.id} className={`p-3 border-b ${theme === 'dark' ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{notif.message}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{notif.time}</p>
                  </div>
                ))
              ) : (
                <p className={`p-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma notificação nova.</p>
              )}
              <div className={`p-2 text-center ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <a href="#!" className={`text-sm font-medium hover:underline`} style={{color: BRAND_COLORS.primaryYellow}}>Ver todas</a>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
            <img src={mockUser.avatarUrl} alt="User Avatar" className={`h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border-2 ${dropdownOpen ? `border-[${BRAND_COLORS.primaryYellow}]` : 'border-transparent'} hover:border-[${BRAND_COLORS.primaryYellow}]`} />
            <span className={`hidden lg:inline text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>{mockUser.name}</span>
            <ChevronDown size={16} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} transform transition-transform ${dropdownOpen ? 'rotate-180' : ''} hidden sm:block`} />
          </button>
          {dropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 z-20 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <a href="#!" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Meu Perfil</a>
              <button 
                onClick={() => { setCurrentPage('Configurações'); setDropdownOpen(false); }} 
                className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Configurações
              </button>
               <button 
                 onClick={() => { setCurrentPage('Cadastro de Usuário'); setDropdownOpen(false); }} 
                 className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
               >
                 Cadastrar Usuário
               </button>
              <div className={`${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-100'} my-1`}></div>
              <button 
                onClick={onLogout} 
                className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-red-400 hover:bg-red-700 hover:text-white' : 'text-red-600 hover:bg-red-100'}`}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// --- Generic Card Component ---
function Card({ title, children, icon, className = "" }) {
  const { theme } = useTheme();
  const IconComponent = icon;
  return (
    <div className={`rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : BRAND_COLORS.backgroundWhite} ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {IconComponent && <IconComponent className="h-5 w-5 md:h-6 md:w-6 mr-3" style={{ color: BRAND_COLORS.primaryYellow }} />}
          <h3 className={`text-md md:text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : BRAND_COLORS.textPrimary}`}>{title}</h3>
        </div>
      )}
      <div className={`${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary} text-sm md:text-base`}>
        {children}
      </div>
    </div>
  );
}

// --- DashboardPage Component ---
function DashboardPage() {
  const { theme } = useTheme();
  const salesData = [
    { name: 'Soja', value: 400000, color: BRAND_COLORS.primaryGreen },
    { name: 'Milho', value: 300000, color: BRAND_COLORS.primaryYellow },
    { name: 'Algodão', value: 200000, color: BRAND_COLORS.secondaryBeige },
    { name: 'Boi', value: 500000, color: BRAND_COLORS.accentBlue },
  ];

  const profitTrendData = [
    { month: 'Jan', profit: 50000 }, { month: 'Fev', profit: 65000 },
    { month: 'Mar', profit: 80000 }, { month: 'Abr', profit: 75000 },
    { month: 'Mai', profit: 95000 }, { month: 'Jun', profit: 110000 },
  ];
  
  const commodityPrices = [
    { name: 'Soja (saca 60kg)', price: 'R$ 135,50', trend: 'up', change: '+1.2%' },
    { name: 'Milho (saca 60kg)', price: 'R$ 58,20', trend: 'down', change: '-0.8%' },
    { name: 'Algodão (libra-peso)', price: 'US$ 0,85', trend: 'up', change: '+0.5%' },
    { name: 'Boi Gordo (@)', price: 'R$ 245,00', trend: 'stable', change: '0.0%' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-xl md:text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : BRAND_COLORS.textPrimary}`}>Visão Geral do Desempenho</h2>
          <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : BRAND_COLORS.textSecondary}`}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 self-start md:self-center">
          <button className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : `bg-white border-gray-300 text-[${BRAND_COLORS.textSecondary}] hover:bg-gray-50`}`}>
            <Calendar size={14} className="mr-1 md:mr-2" />
            <span>Data</span>
          </button>
          <button className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors`} style={{backgroundColor: BRAND_COLORS.primaryYellow, color: BRAND_COLORS.primaryGreen}}>
            <Download size={14} className="mr-1 md:mr-2" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card title="Receita Total (Mês)" icon={DollarSign}>
          <p className="text-2xl md:text-3xl font-bold" style={{color: BRAND_COLORS.primaryGreen}}>R$ 1.45M</p> 
          <p className="text-xs md:text-sm text-green-500">+5.2%</p> 
        </Card>
        <Card title="Contratos Ativos" icon={FileText}>
          <p className="text-2xl md:text-3xl font-bold" style={{color: BRAND_COLORS.primaryGreen}}>78</p>
          <p className="text-xs md:text-sm text-gray-500">3 novos</p> 
        </Card>
        <Card title="Volume (Mês)" icon={ShoppingCart}> 
          <p className="text-2xl md:text-3xl font-bold" style={{color: BRAND_COLORS.primaryGreen}}>12,5kt</p> 
          <p className="text-xs md:text-sm text-green-500">+8%</p> 
        </Card>
        <Card title="Margem Média" icon={TrendingUp}> 
          <p className="text-2xl md:text-3xl font-bold" style={{color: BRAND_COLORS.primaryGreen}}>18.7%</p>
          <p className="text-xs md:text-sm text-red-500">-0.5%</p> 
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title="Vendas por Produto" icon={PieChartIcon}>
          <div className="h-64 md:h-72 w-full"> 
             <p className="text-center pt-10 text-sm md:text-base">Gráfico de Pizza aqui (ex: Recharts)</p>
             <ul className="mt-4 space-y-1 text-xs md:text-sm">
                {salesData.map(item => (
                    <li key={item.name} className="flex items-center justify-between">
                        <span className="flex items-center">
                            <span className="w-2 h-2 md:w-3 md:h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                            {item.name}
                        </span>
                        <span>R$ {item.value.toLocaleString('pt-BR')}</span>
                    </li>
                ))}
             </ul>
          </div>
        </Card>
        <Card title="Tendência de Lucratividade" icon={BarChart}>
           <div className="h-64 md:h-72 w-full"> 
            <p className="text-center pt-10 text-sm md:text-base">Gráfico de Linha/Barra aqui (ex: Recharts)</p>
            <div className="flex justify-around items-end h-40 md:h-48 mt-4 border-b border-gray-300 dark:border-gray-700">
                {profitTrendData.map(item => (
                    <div key={item.month} className="flex flex-col items-center">
                        <div className="w-4 md:w-8 rounded-t-md" style={{height: `${item.profit / 1500}px`, backgroundColor: BRAND_COLORS.primaryGreen}}></div>
                        <span className="text-xxs md:text-xs mt-1">{item.month}</span>
                    </div>
                ))}
            </div>
           </div>
        </Card>
      </div>
      
      <Card title="Cotações Atuais" icon={DollarSign}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left font-semibold p-2 md:p-3">Produto</th>
                <th className="text-right font-semibold p-2 md:p-3">Preço</th>
                <th className="text-right font-semibold p-2 md:p-3">Variação</th>
              </tr>
            </thead>
            <tbody>
              {commodityPrices.map(comm => (
                <tr key={comm.name} className={`border-b last:border-b-0 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="p-2 md:p-3">{comm.name}</td>
                  <td className="text-right p-2 md:p-3 font-medium">{comm.price}</td>
                  <td className={`text-right p-2 md:p-3 ${comm.trend === 'up' ? 'text-green-500' : comm.trend === 'down' ? 'text-red-500' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
                    {comm.change} {comm.trend === 'up' ? '▲' : comm.trend === 'down' ? '▼' : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Ações Rápidas" icon={Briefcase}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
            <button className={`p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : `bg-gray-50 hover:bg-[${BRAND_COLORS.secondaryBeige}] hover:text-[${BRAND_COLORS.primaryGreen}]`}`}>
                <FileText size={20} className="mb-1 md:mb-2" style={{color: BRAND_COLORS.primaryGreen}}/>
                <span className="text-xs md:text-sm font-medium">Novo Contrato</span>
            </button>
            <button className={`p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : `bg-gray-50 hover:bg-[${BRAND_COLORS.secondaryBeige}] hover:text-[${BRAND_COLORS.primaryGreen}]`}`}>
                <DollarSign size={20} className="mb-1 md:mb-2" style={{color: BRAND_COLORS.primaryGreen}}/>
                <span className="text-xs md:text-sm font-medium">Registrar Venda</span>
            </button>
            <button className={`p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : `bg-gray-50 hover:bg-[${BRAND_COLORS.secondaryBeige}] hover:text-[${BRAND_COLORS.primaryGreen}]`}`}>
                <Tractor size={20} className="mb-1 md:mb-2" style={{color: BRAND_COLORS.primaryGreen}}/>
                <span className="text-xs md:text-sm font-medium">Lançar Custo</span>
            </button>
            <button className={`p-3 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : `bg-gray-50 hover:bg-[${BRAND_COLORS.secondaryBeige}] hover:text-[${BRAND_COLORS.primaryGreen}]`}`}>
                <BarChart2 size={20} className="mb-1 md:mb-2" style={{color: BRAND_COLORS.primaryGreen}}/>
                <span className="text-xs md:text-sm font-medium">Ver Relatórios</span>
            </button>
        </div>
      </Card>
    </div>
  );
}


// --- PlaceholderPage Component ---
function PlaceholderPage({ title }) {
  const { theme } = useTheme();

  if (title === 'Cadastro de Usuário') {
     return (
       <Card title="Cadastro de Usuário" icon={UserPlus} className="max-w-lg mx-auto">
          <p className="text-center mb-6">Esta é a área onde o formulário de cadastro seria implementado, interagindo com um serviço de backend seguro (como Firebase ou Supabase) para armazenar os dados do novo usuário.</p>
           <form className="space-y-4">
              <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>Nome</label>
                  <input type="text" disabled className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 cursor-not-allowed' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`} placeholder="Nome Completo" />
              </div>
               <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>Email</label>
                  <input type="email" disabled className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 cursor-not-allowed' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`} placeholder="seuemail@example.com" />
              </div>
               <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : BRAND_COLORS.textSecondary}`}>Senha</label>
                  <input type="password" disabled className={`mt-1 block w-full px-3 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 cursor-not-allowed' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}`} placeholder="********" />
              </div>
               <button 
                 type="button" 
                 disabled 
                 className="w-full py-2 px-4 rounded-md text-white font-medium cursor-not-allowed" 
                 style={{backgroundColor: BRAND_COLORS.primaryGreen, opacity: 0.5}}
               >
                 Cadastrar (Desabilitado)
               </button>
           </form>
           <p className="text-xs text-center mt-4 text-red-500">Nota: O cadastro real requer implementação de backend.</p>
       </Card>
     );
  }

  return (
    <Card title={`Página: ${title}`} className="h-full">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Briefcase size={64} className="mb-4" style={{color: BRAND_COLORS.primaryYellow}}/>
        <h2 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : BRAND_COLORS.textPrimary}`}>
          {title}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : BRAND_COLORS.textSecondary}`}>
          Esta seção está em desenvolvimento. Conteúdo e funcionalidades específicas para "{title}" serão adicionados aqui.
        </p>
        <button 
            className="mt-6 px-6 py-2 rounded-lg text-white font-medium transition-colors"
            style={{backgroundColor: BRAND_COLORS.primaryGreen}}
        >
            Saber Mais
        </button>
      </div>
    </Card>
  );
}

// --- Function to render the current page ---
function renderPage(pageName) {
  switch (pageName) {
    case 'Visão Geral':
      return <DashboardPage />;
    case 'Cadastro de Usuário': 
      return <PlaceholderPage title={pageName} />; 
    case 'Comercialização Soja':
    case 'Comercialização Milho':
    case 'Comercialização Algodão':
    case 'Comercialização Caroço Algodão':
    case 'Comercialização Boi':
    case 'Contratos':
    case 'Cotações':
    case 'Notícias Agrícolas':
    case 'Análise de Basis':
    case 'Custos Logísticos':
    case 'Custos de Produção':
    case 'Rentabilidade Tempo Real':
    case 'Matriz de Lucratividade':
    case 'Marcação a Mercado':
    case 'Relatórios':
    case 'Configurações':
      return <PlaceholderPage title={pageName} />;
    default:
      console.warn(`Unhandled page: ${pageName}. Rendering Dashboard.`); 
      return <DashboardPage />; // Fallback to Dashboard
  }
}

export default App;

