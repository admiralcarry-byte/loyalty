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
    'system.settings.subtitle': 'Configure as preferências e configurações do sistema',
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
    'configuration.settings': 'Configurações',
    'manage.all.settings': 'Gerencie todas as configurações e preferências do sistema',
    
    // Tabs
    'general': 'Geral',
    'notifications': 'Notificações',
    'system': 'Sistema',
    'influencer': 'Influenciador',
    
    // General Settings
    'application.name': 'Nome da Aplicação',
    'support.email': 'Email de Suporte',
    'currency': 'Moeda',
    'app.description': 'Descrição da Aplicação',
    'timezone': 'Fuso Horário',
    'language': 'Idioma',
    'save.general.settings': 'Salvar Configurações Gerais',
    
    // Dashboard
    'dashboard': 'Painel de Controle',
    'dashboard.subtitle': 'Visão geral do sistema e estatísticas principais',
    'total.users': 'Total de Usuários',
    'total.sales': 'Total de Vendas',
    'total.commissions': 'Total de Comissões',
    'total.stores': 'Total de Lojas',
    'recent.activity': 'Atividade Recente',
    'sales.overview': 'Visão Geral de Vendas',
    'top.performers': 'Melhores Desempenhos',
    
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
    'influencer': 'Influenciador',
    'current.level': 'Nível Atual',
    'next.level': 'Próximo Nível',
    'progress': 'Progresso',
    'ready.for.promotion': 'Pronto para Promoção',
    'in.progress': 'Em Progresso',
    'no.promotion.candidates': 'Nenhum candidato à promoção encontrado',
    'loading.level.requirements': 'Carregando requisitos de nível...',
    'loading.promotion.candidates': 'Carregando candidatos à promoção...',
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
    'commission.rate': 'Taxa de Comissão',
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
    'deleting.data': 'Excluindo dados...'
  },
  English: {
    // General
    'system.settings': 'System Settings',
    'system.settings.subtitle': 'Configure system preferences and application settings',
    'system.active': 'System Active',
    'save.all': 'Save All',
    'refresh': 'Refresh',
    
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
    
    // Messages
    'settings.saved.successfully': 'Settings Saved Successfully!',
    'general.settings.updated': 'General settings have been updated and saved to database.',
    'error': 'Error',
    'failed.to.save.settings': 'Failed to save general settings',
    'failed.to.load.settings': 'Failed to load general settings'
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
    
    // Messages
    'settings.saved.successfully': '¡Configuraciones Guardadas Exitosamente!',
    'general.settings.updated': 'Las configuraciones generales han sido actualizadas y guardadas en la base de datos.',
    'error': 'Error',
    'failed.to.save.settings': 'Error al guardar configuraciones generales',
    'failed.to.load.settings': 'Error al cargar configuraciones generales'
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
    
    // Messages
    'settings.saved.successfully': 'Paramètres Sauvegardés avec Succès!',
    'general.settings.updated': 'Les paramètres généraux ont été mis à jour et sauvegardés dans la base de données.',
    'error': 'Erreur',
    'failed.to.save.settings': 'Échec de la sauvegarde des paramètres généraux',
    'failed.to.load.settings': 'Échec du chargement des paramètres généraux'
  }
};

class TranslationService {
  private currentLanguage: string = 'Portuguese';

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string): string {
    const languageTranslations = translations[this.currentLanguage];
    if (!languageTranslations) {
      return key; // Fallback to key if language not found
    }
    
    return languageTranslations[key] || key; // Fallback to key if translation not found
  }

  getAvailableLanguages(): string[] {
    return Object.keys(translations);
  }
}

export const translationService = new TranslationService();