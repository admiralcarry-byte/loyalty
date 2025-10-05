export interface Translations {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: Translations;
}

const translations: LanguageTranslations = {
  Portuguese: {
    // General
    'system.settings': 'System Settings',
    'system.settings.subtitle': 'Configure system preferences and application settings',
    'system.active': 'System Active',
    'save.all': 'Save All',
    'refresh': 'Refresh',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',
    'add': 'Add',
    'create': 'Create',
    'update': 'Update',
    'view': 'View',
    'details': 'Details',
    'status': 'Status',
    'active': 'Active',
    'inactive': 'Inactive',
    'enabled': 'Enabled',
    'disabled': 'Disabled',
    'yes': 'Yes',
    'no': 'No',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Info',
    'error': 'Error',
    
    // Stats Cards
    'active.settings': 'Active Settings',
    'saved.changes': 'Saved Changes',
    'system.status': 'System Status',
    'from.last.month': 'from last month',
    'all.systems.operational': 'All Systems Operational',
    
    // Configuration
    'configuration.settings': 'Configuration Settings',
    'manage.all.settings': 'Manage all system configurations and preferences',
    
    // Tabs
    'general': 'General',
    'notifications': 'Notifications',
    'system': 'System',
    'influencer': 'Influencer',
    
    // General Settings
    'application.name': 'Application Name',
    'support.email': 'Support Email',
    'currency': 'Currency',
    'app.description': 'App Description',
    'timezone': 'Timezone',
    'language': 'Language',
    'save.general.settings': 'Save General Settings',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'dashboard.subtitle': 'System overview and main statistics',
    'total.users': 'Total Users',
    'total.sales': 'Total Sales',
    'total.commissions': 'Total Commissions',
    'total.stores': 'Total Stores',
    'recent.activity': 'Recent Activity',
    'sales.overview': 'Sales Overview',
    'top.performers': 'Top Performers',
    
    // Influencer Levels
    'influencer.level.management': 'Gerenciamento de Níveis de Influenciador',
    'influencer.level.subtitle': 'Configure requisitos de nível e configurações de promoção automática para crescimento da rede',
    'auto.promotion': 'Promoção Automática',
    'total.influencers': 'Total de Influenciadores',
    'active.networks': 'Redes Ativas',
    'avg.commission': 'Comissão Média',
    'promotions': 'Promoções',
    'level.requirements': 'Requisitos de Nível',
    'auto.promotion.tab': 'Promoção Automática',
    'platinum.level': 'Nível Platina',
    'gold.level': 'Nível Ouro',
    'silver.level': 'Nível Prata',
    'elite': 'Elite',
    'premium': 'Premium',
    'standard': 'Padrão',
    'requirements.for': 'Requisitos para',
    'tier.influencers': 'influenciadores de nível',
    'required.referrals': 'Indicações Necessárias',
    'active.clients': 'Clientes Ativos',
    'commission.rate': 'Taxa de Comissão',
    'commission.percentage.per.liter': 'Porcentagem de comissão por litro comprado pelos membros da rede',
    'network.focus': 'Foco da Rede',
    'referrals.and.clients': 'Indicações e Clientes',
    'benefits': 'Benefícios',
    'commission.rate.percentage': 'Taxa de comissão',
    'priority.support.access': 'Acesso prioritário ao suporte',
    'exclusive.campaign.access': 'Acesso exclusivo a campanhas',
    'save.changes': 'Salvar Alterações',
    'level.updated': 'Nível Atualizado',
    'level.requirements.updated': 'Os requisitos de nível foram atualizados',
    'failed.to.update.level': 'Falha ao atualizar nível. Tente novamente.',
    'level.promotion.status': 'Status de Promoção de Nível',
    'monitor.influencers.approaching': 'Monitore influenciadores se aproximando de upgrades de nível e promoções automáticas',
    'current.level': 'Nível Atual',
    'next.level': 'Próximo Nível',
    'progress': 'Progresso',
    'ready.for.promotion': 'Pronto para Promoção',
    'in.progress': 'Em Progresso',
    'no.promotion.candidates': 'Nenhum candidato à promoção encontrado',
    'loading.level.requirements': 'Loading level requirements...',
    'loading.promotion.candidates': 'Loading promotion candidates...',
    'failed.to.load.influencer.data': 'Falha ao carregar dados de influenciadores. Tente novamente.',
    
    // Users
    'users': 'Usuários',
    'user.management': 'Gerenciamento de Usuários',
    'add.user': 'Adicionar Usuário',
    'user.details': 'Detalhes do Usuário',
    'user.name': 'Nome do Usuário',
    'user.email': 'Email do Usuário',
    'user.phone': 'Telefone do Usuário',
    'user.level': 'Nível do Usuário',
    'user.status': 'Status do Usuário',
    'user.created': 'Usuário Criado',
    'user.updated': 'Usuário Atualizado',
    'total.points': 'Total de Pontos',
    'total.purchases': 'Total de Compras',
    
    // Sales
    'sales': 'Vendas',
    'sales.management': 'Gerenciamento de Vendas',
    'sales.date': 'Data da Venda',
    'sales.amount': 'Valor da Venda',
    'sales.store': 'Loja da Venda',
    'sales.customer': 'Cliente da Venda',
    'sales.status': 'Status da Venda',
    
    // Commission
    'commission': 'Comissão',
    'commission.management': 'Gerenciamento de Comissões',
    'commission.amount': 'Valor da Comissão',
    'commission.status': 'Status da Comissão',
    'commission.paid': 'Comissão Paga',
    'commission.pending': 'Comissão Pendente',
    
    // Stores
    'stores': 'Lojas',
    'store.management': 'Gerenciamento de Lojas',
    'store.name': 'Nome da Loja',
    'store.address': 'Endereço da Loja',
    'store.phone': 'Telefone da Loja',
    'store.email': 'Email da Loja',
    'store.status': 'Status da Loja',
    'add.store': 'Adicionar Loja',
    'store.details': 'Detalhes da Loja',
    
    // Campaigns
    'campaigns': 'Campanhas',
    'campaign.management': 'Gerenciamento de Campanhas',
    'campaign.name': 'Nome da Campanha',
    'campaign.description': 'Descrição da Campanha',
    'campaign.start.date': 'Data de Início',
    'campaign.end.date': 'Data de Fim',
    'campaign.status': 'Status da Campanha',
    'add.campaign': 'Adicionar Campanha',
    'campaign.details': 'Detalhes da Campanha',
    
    // Messages
    'settings.saved.successfully': 'Configurações Salvas com Sucesso!',
    'general.settings.updated': 'As configurações gerais foram atualizadas e salvas no banco de dados.',
    'failed.to.save.settings': 'Falha ao salvar configurações gerais',
    'failed.to.load.settings': 'Falha ao carregar configurações gerais',
    'operation.successful': 'Operação realizada com sucesso',
    'operation.failed': 'Falha na operação',
    'data.loaded.successfully': 'Dados carregados com sucesso',
    'data.saved.successfully': 'Dados salvos com sucesso',
    'data.updated.successfully': 'Dados atualizados com sucesso',
    'data.deleted.successfully': 'Dados excluídos com sucesso',
    'please.try.again': 'Tente novamente',
    'no.data.found': 'Nenhum dado encontrado',
    'loading.data': 'Carregando dados...',
    'saving.data': 'Salvando dados...',
    'updating.data': 'Atualizando dados...',
    'deleting.data': 'Excluindo dados...',
    
    // User Registration
    'full.name': 'Nome Completo',
    'email.address': 'Endereço de Email',
    'phone.number': 'Número de Telefone',
    'influencer.phone.optional': 'Telefone do Influenciador (Opcional)',
    'password': 'Senha',
    'enter.full.name': 'Digite seu nome completo',
    'user.example.com': 'usuario@exemplo.com',
    'enter.phone.number': 'Digite seu número de telefone',
    'select.influencer': 'Selecione um influenciador que o indicou',
    'enter.password': 'Digite sua senha',
    'creating.account': 'Criando Conta...',
    'register': 'Registrar',
    'already.have.account': 'Já tem uma conta? Faça login',
    'back.to.home': '← Voltar ao Início',
    'select.influencer.helper': 'Selecione o influenciador que o indicou na lista suspensa',
    'loading.influencers': 'Carregando influenciadores...',
    'no.influencers.available': 'Nenhum influenciador disponível',
    
    // Database Management
    'database.management': 'Database Management',
    'database.management.subtitle': 'Manage database operations and maintenance',
    'check.join.status': 'Check Join Status',
    'clean.cache': 'Clean Cache',
    'backup.database': 'Backup Database',
    'delete.database': 'Delete Database',
    'select.language': 'Select Language',
    'refreshing': 'Refreshing...',
    'join.status.checked': 'Join Status Checked',
    'database.join.optimized': 'Database join structure is optimized',
    'cache.cleaned': 'Cache Cleaned',
    'cache.cleared.successfully': 'All cached data has been successfully cleared',
    'backup.created': 'Backup Created',
    'backup.created.successfully': 'Database backup has been successfully created and saved',
    'database.deleted': 'Database Deleted',
    'database.deleted.permanently': 'The entire database has been permanently deleted',
    'language.changed': 'Language Changed',
    'interface.language.changed': 'Interface language changed to',
    'failed.to.load.statistics': 'Failed to load statistics',
    'failed.to.check.join.status': 'Failed to check join status',
    'failed.to.clean.cache': 'Failed to clean cache',
    'failed.to.create.backup': 'Failed to create database backup',
    'failed.to.delete.database': 'Failed to delete database'
  },
  English: {
    // General
    'system.settings': 'System Settings',
    'system.settings.subtitle': 'Configure system preferences and application settings',
    'system.active': 'System Active',
    'save.all': 'Save All',
    'refresh': 'Refresh',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'search': 'Search',
    'filter': 'Filter',
    'export': 'Export',
    'import': 'Import',
    'add': 'Add',
    'create': 'Create',
    'update': 'Update',
    'view': 'View',
    'details': 'Details',
    'status': 'Status',
    'active': 'Active',
    'inactive': 'Inactive',
    'enabled': 'Enabled',
    'disabled': 'Disabled',
    'yes': 'Yes',
    'no': 'No',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Info',
    'error': 'Error',
    
    // Stats Cards
    'active.settings': 'Active Settings',
    'saved.changes': 'Saved Changes',
    'system.status': 'System Status',
    'from.last.month': 'from last month',
    'all.systems.operational': 'All Systems Operational',
    
    // Configuration
    'configuration.settings': 'Configuration Settings',
    'manage.all.settings': 'Manage all system configurations and preferences',
    
    // Tabs
    'general': 'General',
    'notifications': 'Notifications',
    'system': 'System',
    'influencer': 'Influencer',
    
    // General Settings
    'application.name': 'Application Name',
    'support.email': 'Support Email',
    'currency': 'Currency',
    'app.description': 'App Description',
    'timezone': 'Timezone',
    'language': 'Language',
    'save.general.settings': 'Save General Settings',
    
    // Dashboard
    'dashboard': 'Dashboard',
    'dashboard.subtitle': 'System overview and main statistics',
    'total.users': 'Total Users',
    'total.sales': 'Total Sales',
    'total.commissions': 'Total Commissions',
    'total.stores': 'Total Stores',
    'recent.activity': 'Recent Activity',
    'sales.overview': 'Sales Overview',
    'top.performers': 'Top Performers',
    
    // Database Management
    'database.management': 'Database Management',
    'database.management.subtitle': 'Manage database operations and maintenance',
    'check.join.status': 'Check Join Status',
    'clean.cache': 'Clean Cache',
    'backup.database': 'Backup Database',
    'delete.database': 'Delete Database',
    'select.language': 'Select Language',
    'refreshing': 'Refreshing...',
    'join.status.checked': 'Join Status Checked',
    'database.join.optimized': 'Database join structure is optimized',
    'cache.cleaned': 'Cache Cleaned',
    'cache.cleared.successfully': 'All cached data has been successfully cleared',
    'backup.created': 'Backup Created',
    'backup.created.successfully': 'Database backup has been successfully created and saved',
    'database.deleted': 'Database Deleted',
    'database.deleted.permanently': 'The entire database has been permanently deleted',
    'language.changed': 'Language Changed',
    'interface.language.changed': 'Interface language changed to',
    'failed.to.load.statistics': 'Failed to load statistics',
    'failed.to.check.join.status': 'Failed to check join status',
    'failed.to.clean.cache': 'Failed to clean cache',
    'failed.to.create.backup': 'Failed to create database backup',
    'failed.to.delete.database': 'Failed to delete database',
    
    // Messages
    'settings.saved.successfully': 'Settings Saved Successfully!',
    'general.settings.updated': 'General settings have been updated and saved to database.',
    'operation.successful': 'Operation completed successfully',
    'operation.failed': 'Operation failed',
    'data.loaded.successfully': 'Data loaded successfully',
    'data.saved.successfully': 'Data saved successfully',
    'data.updated.successfully': 'Data updated successfully',
    'data.deleted.successfully': 'Data deleted successfully',
    'please.try.again': 'Please try again',
    'no.data.found': 'No data found',
    'loading.data': 'Loading data...',
    'saving.data': 'Saving data...',
    'updating.data': 'Updating data...',
    'deleting.data': 'Deleting data...',
    'failed.to.save.settings': 'Failed to save general settings',
    'failed.to.load.settings': 'Failed to load general settings',
    
    // User Registration
    'full.name': 'Full Name',
    'email.address': 'Email Address',
    'phone.number': 'Phone Number',
    'influencer.phone.optional': 'Influencer\'s Phone Number (Optional)',
    'password': 'Password',
    'enter.full.name': 'Enter your full name',
    'user.example.com': 'user@example.com',
    'enter.phone.number': 'Enter your phone number',
    'select.influencer': 'Select an influencer who referred you',
    'enter.password': 'Enter your password',
    'creating.account': 'Creating Account...',
    'register': 'Register',
    'already.have.account': 'Already have an account? Sign in',
    'back.to.home': '← Back to Home',
    'select.influencer.helper': 'Select the influencer who referred you from the dropdown',
    'loading.influencers': 'Loading influencers...',
    'no.influencers.available': 'No influencers available'
  },
  Spanish: {
    // General
    'system.settings': 'Configuración del Sistema',
    'system.settings.subtitle': 'Configurar preferencias y configuraciones del sistema',
    'system.active': 'Sistema Activo',
    'save.all': 'Guardar Todo',
    'refresh': 'Actualizar',
    
    // Stats Cards
    'active.settings': 'Configuraciones Activas',
    'saved.changes': 'Cambios Guardados',
    'system.status': 'Estado del Sistema',
    'from.last.month': 'del mes pasado',
    'all.systems.operational': 'Todos los Sistemas Operacionales',
    
    // Configuration
    'configuration.settings': 'Configuraciones',
    'manage.all.settings': 'Gestionar todas las configuraciones y preferencias del sistema',
    
    // Tabs
    'general': 'General',
    'notifications': 'Notificaciones',
    'system': 'Sistema',
    'influencer': 'Influencer',
    
    // General Settings
    'application.name': 'Nombre de la Aplicación',
    'support.email': 'Email de Soporte',
    'currency': 'Moneda',
    'app.description': 'Descripción de la Aplicación',
    'timezone': 'Zona Horaria',
    'language': 'Idioma',
    'save.general.settings': 'Guardar Configuraciones Generales',
    
    // Dashboard
    'dashboard': 'Panel de Control',
    'dashboard.subtitle': 'Resumen del sistema y estadísticas principales',
    'total.users': 'Total de Usuarios',
    'total.sales': 'Total de Ventas',
    'total.commissions': 'Total de Comisiones',
    'total.stores': 'Total de Tiendas',
    'recent.activity': 'Actividad Reciente',
    'sales.overview': 'Resumen de Ventas',
    'top.performers': 'Mejores Desempeños',
    
    // Database Management
    'database.management': 'Gestión de Base de Datos',
    'database.management.subtitle': 'Gestionar operaciones y mantenimiento de la base de datos',
    'check.join.status': 'Verificar Estado de Unión',
    'clean.cache': 'Limpiar Caché',
    'backup.database': 'Respaldar Base de Datos',
    'delete.database': 'Eliminar Base de Datos',
    'select.language': 'Seleccionar Idioma',
    'refreshing': 'Actualizando...',
    'join.status.checked': 'Estado de Unión Verificado',
    'database.join.optimized': 'La estructura de unión de la base de datos está optimizada',
    'cache.cleaned': 'Caché Limpiado',
    'cache.cleared.successfully': 'Todos los datos en caché han sido eliminados exitosamente',
    'backup.created': 'Respaldo Creado',
    'backup.created.successfully': 'El respaldo de la base de datos ha sido creado y guardado exitosamente',
    'database.deleted': 'Base de Datos Eliminada',
    'database.deleted.permanently': 'La base de datos completa ha sido eliminada permanentemente',
    'language.changed': 'Idioma Cambiado',
    'interface.language.changed': 'El idioma de la interfaz cambió a',
    'failed.to.load.statistics': 'Error al cargar estadísticas',
    'failed.to.check.join.status': 'Error al verificar estado de unión',
    'failed.to.clean.cache': 'Error al limpiar caché',
    'failed.to.create.backup': 'Error al crear respaldo de la base de datos',
    'failed.to.delete.database': 'Error al eliminar base de datos',
    
    // Messages
    'settings.saved.successfully': '¡Configuraciones Guardadas Exitosamente!',
    'general.settings.updated': 'Las configuraciones generales han sido actualizadas y guardadas en la base de datos.',
    'error': 'Error',
    'failed.to.save.settings': 'Error al guardar configuraciones generales',
    'failed.to.load.settings': 'Error al cargar configuraciones generales',
    'operation.successful': 'Operación completada exitosamente',
    'operation.failed': 'Operación fallida',
    'data.loaded.successfully': 'Datos cargados exitosamente',
    'data.saved.successfully': 'Datos guardados exitosamente',
    'data.updated.successfully': 'Datos actualizados exitosamente',
    'data.deleted.successfully': 'Datos eliminados exitosamente',
    'please.try.again': 'Por favor intente de nuevo',
    'no.data.found': 'No se encontraron datos',
    'loading.data': 'Cargando datos...',
    'saving.data': 'Guardando datos...',
    'updating.data': 'Actualizando datos...',
    'deleting.data': 'Eliminando datos...',
    
    // User Registration
    'full.name': 'Nombre Completo',
    'email.address': 'Dirección de Email',
    'phone.number': 'Número de Teléfono',
    'influencer.phone.optional': 'Número de Teléfono del Influenciador (Opcional)',
    'password': 'Contraseña',
    'enter.full.name': 'Ingrese su nombre completo',
    'user.example.com': 'usuario@ejemplo.com',
    'enter.phone.number': 'Ingrese su número de teléfono',
    'select.influencer': 'Seleccione un influenciador que lo refirió',
    'enter.password': 'Ingrese su contraseña',
    'creating.account': 'Creando Cuenta...',
    'register': 'Registrar',
    'already.have.account': '¿Ya tiene una cuenta? Inicie sesión',
    'back.to.home': '← Volver al Inicio',
    'select.influencer.helper': 'Seleccione el influenciador que lo refirió del menú desplegable',
    'loading.influencers': 'Cargando influenciadores...',
    'no.influencers.available': 'No hay influenciadores disponibles'
  },
  French: {
    // General
    'system.settings': 'Paramètres du Système',
    'system.settings.subtitle': 'Configurer les préférences et paramètres du système',
    'system.active': 'Système Actif',
    'save.all': 'Tout Sauvegarder',
    'refresh': 'Actualiser',
    
    // Stats Cards
    'active.settings': 'Paramètres Actifs',
    'saved.changes': 'Modifications Sauvegardées',
    'system.status': 'Statut du Système',
    'from.last.month': 'du mois dernier',
    'all.systems.operational': 'Tous les Systèmes Opérationnels',
    
    // Configuration
    'configuration.settings': 'Paramètres de Configuration',
    'manage.all.settings': 'Gérer toutes les configurations et préférences du système',
    
    // Tabs
    'general': 'Général',
    'notifications': 'Notifications',
    'system': 'Système',
    'influencer': 'Influenceur',
    
    // General Settings
    'application.name': 'Nom de l\'Application',
    'support.email': 'Email de Support',
    'currency': 'Devise',
    'app.description': 'Description de l\'Application',
    'timezone': 'Fuseau Horaire',
    'language': 'Langue',
    'save.general.settings': 'Sauvegarder les Paramètres Généraux',
    
    // Dashboard
    'dashboard': 'Tableau de Bord',
    'dashboard.subtitle': 'Aperçu du système et statistiques principales',
    'total.users': 'Total des Utilisateurs',
    'total.sales': 'Total des Ventes',
    'total.commissions': 'Total des Commissions',
    'total.stores': 'Total des Magasins',
    'recent.activity': 'Activité Récente',
    'sales.overview': 'Aperçu des Ventes',
    'top.performers': 'Meilleurs Performeurs',
    
    // Messages
    'settings.saved.successfully': 'Paramètres Sauvegardés avec Succès!',
    'general.settings.updated': 'Les paramètres généraux ont été mis à jour et sauvegardés dans la base de données.',
    'error': 'Erreur',
    'failed.to.save.settings': 'Échec de la sauvegarde des paramètres généraux',
    'failed.to.load.settings': 'Échec du chargement des paramètres généraux',
    'operation.successful': 'Opération terminée avec succès',
    'operation.failed': 'Opération échouée',
    'data.loaded.successfully': 'Données chargées avec succès',
    'data.saved.successfully': 'Données sauvegardées avec succès',
    'data.updated.successfully': 'Données mises à jour avec succès',
    'data.deleted.successfully': 'Données supprimées avec succès',
    'please.try.again': 'Veuillez réessayer',
    'no.data.found': 'Aucune donnée trouvée',
    'loading.data': 'Chargement des données...',
    'saving.data': 'Sauvegarde des données...',
    'updating.data': 'Mise à jour des données...',
    'deleting.data': 'Suppression des données...',
    
    // User Registration
    'full.name': 'Nom Complet',
    'email.address': 'Adresse Email',
    'phone.number': 'Numéro de Téléphone',
    'influencer.phone.optional': 'Numéro de Téléphone de l\'Influenceur (Optionnel)',
    'password': 'Mot de Passe',
    'enter.full.name': 'Entrez votre nom complet',
    'user.example.com': 'utilisateur@exemple.com',
    'enter.phone.number': 'Entrez votre numéro de téléphone',
    'select.influencer': 'Sélectionnez un influenceur qui vous a référé',
    'enter.password': 'Entrez votre mot de passe',
    'creating.account': 'Création du Compte...',
    'register': 'S\'inscrire',
    'already.have.account': 'Vous avez déjà un compte? Connectez-vous',
    'back.to.home': '← Retour à l\'Accueil',
    'select.influencer.helper': 'Sélectionnez l\'influenceur qui vous a référé dans la liste déroulante',
    'loading.influencers': 'Chargement des influenceurs...',
    'no.influencers.available': 'Aucun influenceur disponible'
  }
};

class TranslationService {
  private currentLanguage: string = 'English';
  private listeners: Array<() => void> = [];

  constructor() {
    // Load language from localStorage on initialization
    const savedLanguage = localStorage.getItem('aguatwezah_language');
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }

  setLanguage(language: string) {
    if (translations[language] && this.currentLanguage !== language) {
      this.currentLanguage = language;
      // Save to localStorage for persistence
      localStorage.setItem('aguatwezah_language', language);
      // Notify all listeners about language change
      this.notifyListeners();
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string): string {
    const languageTranslations = translations[this.currentLanguage];
    if (!languageTranslations) {
      // Fallback to English if current language not found
      const englishTranslations = translations['English'];
      return englishTranslations[key] || key;
    }
    
    return languageTranslations[key] || key; // Fallback to key if translation not found
  }

  getAvailableLanguages(): string[] {
    return Object.keys(translations);
  }

  // Event system for language changes
  addLanguageChangeListener(callback: () => void) {
    this.listeners.push(callback);
  }

  removeLanguageChangeListener(callback: () => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const translationService = new TranslationService();