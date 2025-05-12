import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
// Removed unused icons: Wheat, Feather, Box
import { 
  BarChart, DollarSign, ShoppingCart, TrendingUp, Tractor, FileText, Settings, LogOut, 
  ChevronDown, ChevronRight, Bell, Search, Calendar, Download, Sun, Moon, 
  Briefcase, BarChart2, PieChart as PieChartIcon, List, Grid, ArrowRightLeft, Package, 
  Scale, Percent, Bean, Beef, Menu, X, Cloud, Carrot, CircleDot 
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
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// Context for Sidebar state
const SidebarContext = createContext();
const useSidebar = () => useContext(SidebarContext);

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

// --- App Component ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('Visão Geral');
  const [theme, setTheme] = useState('light'); 
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Start collapsed on desktop
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Toggle fixed expanded state (for desktop)
  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };
  
  // Explicitly set fixed expanded state (used when clicking icons in collapsed mode)
  const setSidebarExpanded = (expanded) => {
      setIsSidebarExpanded(expanded);
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  }
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { 
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Silencing the specific eslint warning for isMobileSidebarOpen if it persists
  // console.log("Mobile sidebar state:", isMobileSidebarOpen); // Uncomment if needed to satisfy linter

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Pass setSidebarExpanded to context */}
      <SidebarContext.Provider value={{ isSidebarExpanded, toggleSidebar, setSidebarExpanded, isMobileSidebarOpen, toggleMobileSidebar, setCurrentPage }}>
        <div className={`flex h-screen font-inter antialiased ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
          
          {/* Sidebar container for desktop */}
          <div className="hidden md:block"> 
             <Sidebar currentPage={currentPage} onLogout={() => setIsAuthenticated(false)} isMobile={false} />
          </div>

           {/* Mobile Sidebar (Sliding) */}
           <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden shadow-lg`}>
             {/* Pass isMobile=true here */}
             <Sidebar currentPage={currentPage} onLogout={() => setIsAuthenticated(false)} isMobile={true} />
           </div>
           {/* Mobile Overlay */}
           {isMobileSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar}></div>}


          {/* Main Content Area: Adjust margin based on fixed expansion state */}
          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
            <Header currentPage={currentPage} onLogout={() => setIsAuthenticated(false)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6"> 
              {renderPage(currentPage)}
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}

// --- LoginPage Component --- (No changes)
function LoginPage({ onLogin }) {
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={getInputClasses()}
              placeholder="Sua senha"
            />
          </div>
          <div className="flex items-center justify-between">
            <a href="#!" className={`text-sm hover:underline`} style={{ color: BRAND_COLORS.primaryYellow }}>
              Esqueceu a senha?
            </a>
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


// --- Sidebar Component ---
function Sidebar({ currentPage, onLogout, isMobile }) {
  const { theme } = useTheme();
  // Get state and setters from context
  const { isSidebarExpanded, toggleSidebar, setSidebarExpanded, toggleMobileSidebar, setCurrentPage } = useSidebar();
  const [openMenu, setOpenMenu] = useState(null); // State for accordion menu
  const [isHovering, setIsHovering] = useState(false); // State for hover effect
  const sidebarRef = useRef(null); // Ref for the sidebar element

  // Determine if the sidebar should visually appear expanded (fixed, hover, or mobile)
  const showExpanded = isMobile || isSidebarExpanded || isHovering;

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
  ];

  // --- Event Handlers ---
  const handleToggleAccordion = (itemName) => {
    setOpenMenu(prevOpenMenu => (prevOpenMenu === itemName ? null : itemName));
  };

  const handleMainItemClick = (item) => {
    if (item.subItems) {
      // If collapsed on desktop, expand fixed first, then toggle accordion
      if (!isSidebarExpanded && !isMobile) {
        setSidebarExpanded(true); // Expand fixed
        // Use setTimeout to allow the fixed expansion transition to start before opening accordion
        setTimeout(() => {
             handleToggleAccordion(item.name);
        }, 50); // Small delay
      } else {
        // Otherwise (expanded desktop or mobile), just toggle accordion
        handleToggleAccordion(item.name);
      }
    } else {
      // If it's a direct navigation item
      setCurrentPage(item.page);
      setOpenMenu(null); // Close any open accordion
      if (isMobile) {
        toggleMobileSidebar(); // Close mobile sidebar
      }
    }
  };

  const handleSubmenuNavigate = (page) => {
     setCurrentPage(page);
     if (isMobile) {
       toggleMobileSidebar(); // Close mobile sidebar on navigation
     }
  }

  const handleMouseEnter = () => {
    if (!isSidebarExpanded && !isMobile) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSidebarExpanded && !isMobile) {
      setIsHovering(false);
      setOpenMenu(null); // Close accordion when hover ends
    }
  };
  
  // --- Dynamic Styles ---
  const sidebarBaseClasses = `h-full shadow-lg flex flex-col justify-between transition-width duration-300 ease-in-out ${theme === 'dark' ? 'bg-gray-800' : ''}`;
  const sidebarDesktopPosition = isMobile ? '' : 'fixed inset-y-0 left-0 z-30'; // Higher z-index for hover overlay
  const sidebarWidth = isMobile ? 'w-64' : (isSidebarExpanded ? 'w-64' : 'w-20');
  const hoverWidth = isHovering ? 'w-64' : sidebarWidth; // Apply hover width

  return (
    <div 
      ref={sidebarRef}
      className={`${sidebarBaseClasses} ${sidebarDesktopPosition} ${hoverWidth}`} 
      style={{ backgroundColor: theme === 'light' ? BRAND_COLORS.primaryGreen : '' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {/* Header */}
        <div className={`flex items-center h-20 px-4 ${showExpanded ? 'justify-between' : 'justify-center'}`}>
          {showExpanded && (
            <img src={LOGO_URL} alt="Locks Logo" className="h-8 object-contain" />
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar} 
              className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10'}`}
              aria-label={isSidebarExpanded ? "Recolher menu" : "Expandir menu"}
            >
              <Menu size={20} />
            </button>
          )}
           {isMobile && (
             <button onClick={toggleMobileSidebar} className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10'}`}>
               <X size={20} />
             </button>
           )}
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 overflow-y-auto overflow-x-hidden"> {/* Hide horizontal overflow */}
          {navItems.map((item) => {
            const isAccordionOpen = openMenu === item.name; 
            return (
              <div key={item.name} className="overflow-hidden"> 
                <button
                  onClick={() => handleMainItemClick(item)}
                  title={!showExpanded ? item.name : ''} // Tooltip when collapsed
                  className={`
                    w-full flex items-center py-3 text-sm transition-colors duration-200 group whitespace-nowrap
                    ${showExpanded ? 'px-6 justify-between' : 'px-6 justify-center'} 
                    ${currentPage === item.page && !item.subItems ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-20 text-white') : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-100 hover:bg-white hover:bg-opacity-10')}
                    ${item.subItems && isAccordionOpen && showExpanded ? (theme === 'dark' ? 'bg-gray-700' : 'bg-white bg-opacity-10') : ''}
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${showExpanded ? 'mr-3' : 'mx-auto'}`} />
                    {showExpanded && <span className="truncate">{item.name}</span>}
                  </div>
                  {item.subItems && showExpanded && (isAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </button>

                {/* Submenu */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isAccordionOpen && showExpanded ? 'max-h-96' : 'max-h-0'} ${theme === 'dark' ? 'bg-gray-750' : 'bg-black bg-opacity-10'}`}
                >
                 {item.subItems && item.subItems.map(subItem => (
                    <button
                      key={subItem.name}
                      onClick={() => handleSubmenuNavigate(subItem.page)}
                      title={!showExpanded ? subItem.name : ''}
                      className={`
                        w-full text-left py-2.5 text-xs transition-colors duration-200 flex items-center whitespace-nowrap
                        ${showExpanded ? 'pl-12 pr-6' : 'px-6 justify-center'} 
                        ${currentPage === subItem.page ? (theme === 'dark' ? 'text-white font-semibold' : 'text-white font-semibold') : (theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-200 hover:text-white')}
                      `}
                    >
                       <subItem.icon className={`h-4 w-4 flex-shrink-0 ${showExpanded ? 'mr-2' : 'mx-auto'}`} />
                      {showExpanded && <span className="truncate">{subItem.name}</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t" style={{borderColor: theme === 'dark' ? 'rgb(55 65 81)' : 'rgba(255,255,255,0.2)'}}>
        <button
          onClick={onLogout}
          title={!showExpanded ? "Sair" : ''}
          className={`
            w-full flex items-center py-3 text-sm rounded-lg transition-colors duration-200 whitespace-nowrap
            ${showExpanded ? 'px-6' : 'px-6 justify-center'} 
            ${theme === 'dark' ? 'text-gray-300 hover:bg-red-700 hover:text-white' : 'text-gray-100 hover:bg-red-500 hover:bg-opacity-80'}
          `}
        >
          {/* Ensure icon is always visible */}
          <LogOut className={`h-5 w-5 flex-shrink-0 ${showExpanded ? 'mr-3' : 'mx-auto'}`} />
          {showExpanded && <span className="truncate">Sair</span>}
        </button>
      </div>
    </div>
  );
}

// --- Header Component --- (No significant changes needed, kept for context)
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
    <header className={`shadow-md py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : BRAND_COLORS.backgroundWhite + ' border-b border-gray-200'}`}> {/* Make header sticky */}
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

// --- Generic Card Component --- (No changes)
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

// --- DashboardPage Component --- (No changes)
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


// --- PlaceholderPage Component --- (No changes)
function PlaceholderPage({ title }) {
  const { theme } = useTheme();
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

// --- Function to render the current page --- (No changes)
function renderPage(pageName) {
  switch (pageName) {
    case 'Visão Geral':
      return <DashboardPage />;
    // ... other cases
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
      return <DashboardPage />;
  }
}

export default App;
