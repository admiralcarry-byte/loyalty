export interface Translations {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: Translations;
}

const translations: LanguageTranslations = {
  Portuguese: {
    // General
    'system.settings': 'Configurações do Sistema',
    'system.settings.subtitle': 'Configurar preferências e configurações do sistema',
    'system.active': 'Sistema Ativo',
    'save.all': 'Salvar Tudo',
    'refresh': 'Atualizar',
    'loading': 'Carregando...',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'search': 'Pesquisar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'add': 'Adicionar',
    'create': 'Criar',
    'update': 'Atualizar',
    'view': 'Visualizar',
    'details': 'Detalhes',
    'status': 'Status',
    'active': 'Ativo',
    'inactive': 'Inativo',
    'enabled': 'Habilitado',
    'disabled': 'Desabilitado',
    'yes': 'Sim',
    'no': 'Não',
    'success': 'Sucesso',
    'warning': 'Aviso',
    'info': 'Informação',
    'error': 'Erro',
    
    // Stats Cards
    'active.settings': 'Configurações Ativas',
    'saved.changes': 'Alterações Salvas',
    'system.status': 'Status do Sistema',
    'from.last.month': 'do mês passado',
    'all.systems.operational': 'Todos os Sistemas Operacionais',
    
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
    'dashboard': 'Painel de Controle',
    'dashboard.subtitle': 'Visão geral do sistema e estatísticas principais',
    'total.users': 'Total de Usuários',
    'total.sales': 'Total de Vendas',
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
    
    // Navigation
    'dashboard': 'Painel de Controle',
    'user.management': 'Gerenciamento de Usuários',
    'sales.management': 'Gerenciamento de Vendas',
    'commission.settings': 'Configurações de Comissão',
    'reports.analytics': 'Relatórios e Análises',
    'stores': 'Lojas',
    'billing.integration': 'Integração de Faturamento',
    'billing': 'Faturamento',
    'my.level': 'Meu Nível',
    'my.influencer': 'Meu Influenciador',
    'my.buyers': 'Meus Compradores',
    'statistics': 'Estatísticas',
    'settings': 'Configurações',
    
    // User Registration
    'full.name': 'Nome Completo',
    'email.address': 'Endereço de Email',
    'phone.number': 'Número de Telefone',
    'influencer.phone.optional': 'Telefone do Influenciador (Opcional)',
    'influencer.phone': 'Telefone do Influenciador',
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
    'database.management': 'Gerenciamento de Banco de Dados',
    'database.management.subtitle': 'Gerenciar operações e manutenção do banco de dados',
    'check.join.status': 'Verificar Status de Junção',
    'clean.cache': 'Limpar Cache',
    'backup.database': 'Fazer Backup do Banco',
    'delete.database': 'Excluir Banco de Dados',
    'select.language': 'Selecionar Idioma',
    'refreshing': 'Atualizando...',
    'join.status.checked': 'Status de Junção Verificado',
    'database.join.optimized': 'A estrutura de junção do banco de dados está otimizada',
    'cache.cleaned': 'Cache Limpo',
    'cache.cleared.successfully': 'Todos os dados em cache foram limpos com sucesso',
    'backup.created': 'Backup Criado',
    'backup.created.successfully': 'Backup do banco de dados foi criado e salvo com sucesso',
    'database.deleted': 'Banco de Dados Excluído',
    'database.deleted.permanently': 'Todo o banco de dados foi excluído permanentemente',
    'language.changed': 'Idioma Alterado',
    'interface.language.changed': 'Idioma da interface alterado para',
    'failed.to.load.statistics': 'Falha ao carregar estatísticas',
    'failed.to.check.join.status': 'Falha ao verificar status de junção',
    'failed.to.clean.cache': 'Falha ao limpar cache',
    'failed.to.create.backup': 'Falha ao criar backup do banco de dados',
    'failed.to.delete.database': 'Falha ao excluir banco de dados'
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
    'saved.changes': 'Alterações Salvas',
    'system.status': 'Status do Sistema',
    'from.last.month': 'do mês passado',
    'all.systems.operational': 'Todos os Sistemas Operacionais',
    
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
    'dashboard': 'Painel de Controle',
    'dashboard.subtitle': 'Visão geral do sistema e estatísticas principais',
    'total.users': 'Total de Usuários',
    'total.sales': 'Total de Vendas',
    'total.commissions': 'Total Commissions',
    'total.stores': 'Total Stores',
    'recent.activity': 'Recent Activity',
    'sales.overview': 'Sales Overview',
    'top.performers': 'Top Performers',
    
    // Database Management
    'database.management': 'Gerenciamento de Banco de Dados',
    'database.management.subtitle': 'Gerenciar operações e manutenção do banco de dados',
    'check.join.status': 'Verificar Status de Junção',
    'clean.cache': 'Limpar Cache',
    'backup.database': 'Fazer Backup do Banco',
    'delete.database': 'Excluir Banco de Dados',
    'select.language': 'Selecionar Idioma',
    'refreshing': 'Atualizando...',
    'join.status.checked': 'Status de Junção Verificado',
    'database.join.optimized': 'A estrutura de junção do banco de dados está otimizada',
    'cache.cleaned': 'Cache Limpo',
    'cache.cleared.successfully': 'Todos os dados em cache foram limpos com sucesso',
    'backup.created': 'Backup Criado',
    'backup.created.successfully': 'Backup do banco de dados foi criado e salvo com sucesso',
    'database.deleted': 'Banco de Dados Excluído',
    'database.deleted.permanently': 'Todo o banco de dados foi excluído permanentemente',
    'language.changed': 'Idioma Alterado',
    'interface.language.changed': 'Idioma da interface alterado para',
    'failed.to.load.statistics': 'Falha ao carregar estatísticas',
    'failed.to.check.join.status': 'Falha ao verificar status de junção',
    'failed.to.clean.cache': 'Falha ao limpar cache',
    'failed.to.create.backup': 'Falha ao criar backup do banco de dados',
    'failed.to.delete.database': 'Falha ao excluir banco de dados',
    
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
    
    // Navigation
    'dashboard': 'Dashboard',
    'user.management': 'User Management',
    'sales.management': 'Sales Management',
    'commission.settings': 'Commission Settings',
    'reports.analytics': 'Reports & Analytics',
    'stores': 'Stores',
    'billing.integration': 'Billing Integration',
    'billing': 'Billing',
    'my.level': 'My Level',
    'my.influencer': 'My Influencer',
    'my.buyers': 'My Buyers',
    'statistics': 'Statistics',
    'settings': 'Settings',
    
    // User Registration
    'full.name': 'Full Name',
    'email.address': 'Email Address',
    'phone.number': 'Phone Number',
    'influencer.phone.optional': 'Influencer\'s Phone Number (Optional)',
    'influencer.phone': 'Influencer\'s Phone Number',
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
    
    // Navigation
    'dashboard': 'Panel de Control',
    'user.management': 'Gestión de Usuarios',
    'sales.management': 'Gestión de Ventas',
    'commission.settings': 'Configuración de Comisiones',
    'reports.analytics': 'Informes y Análisis',
    'stores': 'Tiendas',
    'billing.integration': 'Integración de Facturación',
    'billing': 'Facturación',
    'my.level': 'Mi Nivel',
    'my.influencer': 'Mi Influenciador',
    'my.buyers': 'Mis Compradores',
    'statistics': 'Estadísticas',
    'settings': 'Configuraciones',
    
    // User Registration
    'full.name': 'Nombre Completo',
    'email.address': 'Dirección de Email',
    'phone.number': 'Número de Teléfono',
    'influencer.phone.optional': 'Número de Teléfono del Influenciador (Opcional)',
    'influencer.phone': 'Número de Teléfono del Influenciador',
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
    'no.influencers.available': 'No hay influenciadores disponibles',
    
    // Missing general translations
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'export': 'Exportar',
    'import': 'Importar',
    'add': 'Agregar',
    'create': 'Crear',
    'update': 'Actualizar',
    'view': 'Ver',
    'details': 'Detalles',
    'active': 'Activo',
    'inactive': 'Inactivo',
    'enabled': 'Habilitado',
    'disabled': 'Deshabilitado',
    'yes': 'Sí',
    'no': 'No',
    'success': 'Éxito',
    'warning': 'Advertencia',
    'info': 'Información',
    
    // Influencer Levels
    'influencer.level.management': 'Gestión de Niveles de Influenciador',
    'influencer.level.subtitle': 'Configurar requisitos de nivel y configuraciones de promoción automática para crecimiento de la red',
    'auto.promotion': 'Promoción Automática',
    'total.influencers': 'Total de Influenciadores',
    'active.networks': 'Redes Activas',
    'avg.commission': 'Comisión Promedio',
    'promotions': 'Promociones',
    'level.requirements': 'Requisitos de Nivel',
    'auto.promotion.tab': 'Promoción Automática',
    'platinum.level': 'Nivel Platino',
    'gold.level': 'Nivel Oro',
    'silver.level': 'Nivel Plata',
    'elite': 'Élite',
    'premium': 'Premium',
    'standard': 'Estándar',
    'requirements.for': 'Requisitos para',
    'tier.influencers': 'influenciadores de nivel',
    'required.referrals': 'Referencias Requeridas',
    'active.clients': 'Clientes Activos',
    'commission.rate': 'Tasa de Comisión',
    'commission.percentage.per.liter': 'Porcentaje de comisión por litro comprado por miembros de la red',
    'network.focus': 'Enfoque de Red',
    'referrals.and.clients': 'Referencias y Clientes',
    'benefits': 'Beneficios',
    'commission.rate.percentage': 'Tasa de comisión',
    'priority.support.access': 'Acceso prioritario al soporte',
    'exclusive.campaign.access': 'Acceso exclusivo a campañas',
    'save.changes': 'Guardar Cambios',
    'level.updated': 'Nivel Actualizado',
    'level.requirements.updated': 'Los requisitos de nivel han sido actualizados',
    'failed.to.update.level': 'Error al actualizar nivel. Por favor intente de nuevo.',
    'level.promotion.status': 'Estado de Promoción de Nivel',
    'monitor.influencers.approaching': 'Monitorear influenciadores acercándose a actualizaciones de nivel y promociones automáticas',
    'current.level': 'Nivel Actual',
    'next.level': 'Siguiente Nivel',
    'progress': 'Progreso',
    'ready.for.promotion': 'Listo para Promoción',
    'in.progress': 'En Progreso',
    'no.promotion.candidates': 'No se encontraron candidatos para promoción',
    'loading.level.requirements': 'Cargando requisitos de nivel...',
    'loading.promotion.candidates': 'Cargando candidatos para promoción...',
    'failed.to.load.influencer.data': 'Error al cargar datos de influenciadores. Por favor intente de nuevo.',
    
    // Users
    'users': 'Usuarios',
    'user.management': 'Gestión de Usuarios',
    'add.user': 'Agregar Usuario',
    'user.details': 'Detalles del Usuario',
    'user.name': 'Nombre del Usuario',
    'user.email': 'Email del Usuario',
    'user.phone': 'Teléfono del Usuario',
    'user.level': 'Nivel del Usuario',
    'user.status': 'Estado del Usuario',
    'user.created': 'Usuario Creado',
    'user.updated': 'Usuario Actualizado',
    'total.points': 'Total de Puntos',
    'total.purchases': 'Total de Compras',
    
    // Sales
    'sales': 'Ventas',
    'sales.management': 'Gestión de Ventas',
    'sales.date': 'Fecha de Venta',
    'sales.amount': 'Monto de Venta',
    'sales.store': 'Tienda de Venta',
    'sales.customer': 'Cliente de Venta',
    'sales.status': 'Estado de Venta',
    
    // Commission
    'commission': 'Comisión',
    'commission.management': 'Gestión de Comisiones',
    'commission.amount': 'Monto de Comisión',
    'commission.status': 'Estado de Comisión',
    'commission.paid': 'Comisión Pagada',
    'commission.pending': 'Comisión Pendiente',
    
    // Stores
    'stores': 'Tiendas',
    'store.management': 'Gestión de Tiendas',
    'store.name': 'Nombre de la Tienda',
    'store.address': 'Dirección de la Tienda',
    'store.phone': 'Teléfono de la Tienda',
    'store.email': 'Email de la Tienda',
    'store.status': 'Estado de la Tienda',
    'add.store': 'Agregar Tienda',
    'store.details': 'Detalles de la Tienda',
    
    // Campaigns
    'campaigns': 'Campañas',
    'campaign.management': 'Gestión de Campañas',
    'campaign.name': 'Nombre de la Campaña',
    'campaign.description': 'Descripción de la Campaña',
    'campaign.start.date': 'Fecha de Inicio',
    'campaign.end.date': 'Fecha de Fin',
    'campaign.status': 'Estado de la Campaña',
    'add.campaign': 'Agregar Campaña',
    'campaign.details': 'Detalles de la Campaña'
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
    
    // Navigation
    'dashboard': 'Tableau de Bord',
    'user.management': 'Gestion des Utilisateurs',
    'sales.management': 'Gestion des Ventes',
    'commission.settings': 'Paramètres de Commission',
    'reports.analytics': 'Rapports et Analyses',
    'stores': 'Magasins',
    'billing.integration': 'Intégration de Facturation',
    'billing': 'Facturation',
    'my.level': 'Mon Niveau',
    'my.influencer': 'Mon Influenceur',
    'my.buyers': 'Mes Acheteurs',
    'statistics': 'Statistiques',
    'settings': 'Paramètres',
    
    // User Registration
    'full.name': 'Nom Complet',
    'email.address': 'Adresse Email',
    'phone.number': 'Numéro de Téléphone',
    'influencer.phone.optional': 'Numéro de Téléphone de l\'Influenceur (Optionnel)',
    'influencer.phone': 'Numéro de Téléphone de l\'Influenceur',
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