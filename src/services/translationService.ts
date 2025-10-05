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
    
    // Dashboard
    'total.users': 'Total de Usuários',
    'store.locations': 'Localizações das Lojas',
    'geographic.distribution.of.our.stores': 'Distribuição geográfica das nossas lojas',
    'recent.users': 'Usuários Recentes',
    'latest.user.registrations.and.activity': 'Últimos registros de usuários e atividade',
    'please.log.in.to.access.dashboard': 'Por favor, faça login para acessar o painel',
    'access.denied.admin.privileges.required': 'Acesso negado: Privilégios de administrador necessários',
    'authentication.check.failed': 'Verificação de autenticação falhou',
    'failed.to.load.dashboard.data': 'Falha ao carregar dados do painel',
    'lead': 'Iniciante',
    'silver': 'Prata',
    'gold': 'Ouro',
    'platinum': 'Platina',
    
    // Users Management
    'manage.customers.and.influencers': 'Gerenciar clientes e influenciadores',
    'add.user': 'Adicionar Usuário',
    'all.users': 'Todos os Usuários',
    'customers': 'Clientes',
    'influencers': 'Influenciadores',
    
    // Receipt Upload
    'receipt.upload': 'Upload de Recibos',
    'upload.receipts.for.ocr.processing': 'Faça upload de recibos para processamento OCR e extração automática de dados',
    
    // Sales Management
    'monitor.and.manage.all.sales.transactions': 'Monitore e gerencie todas as transações de vendas e receita',
    'search.sales': 'Pesquisar Vendas',
    'all.status': 'Todos os Status',
    'pending': 'Pendente',
    'verified': 'Verificado',
    'rejected': 'Rejeitado',
    'add.sale': 'Adicionar Venda',
    
    // Commission Settings
    'manage.influencer.commission.structure.and.payouts': 'Gerenciar estrutura de comissões de influenciadores e pagamentos',
    'general.commission.settings': 'Configurações Gerais de Comissão',
    'base.commission.rate': 'Taxa de Comissão Base',
    'cashback.rate': 'Taxa de Cashback',
    'tier.multipliers': 'Multiplicadores de Nível',
    
    // Reports & Analytics
    'comprehensive.insights.into.your.loyalty.program.performance': 'Insights abrangentes sobre o desempenho do seu programa de fidelidade',
    
    // Store Management
    'manage.all.store.locations.and.their.information.across.angola': 'Gerenciar todos os locais de lojas e suas informações em Angola',
    'store.name': 'Nome da Loja',
    'add.store': 'Adicionar Loja',
    'search.stores': 'Pesquisar Lojas',
    
    // Login & Authentication
    'admin.panel.login': 'Login do Painel Admin',
    'only.administrators.can.access.the.admin.panel': 'Apenas administradores podem acessar o painel admin',
    'login.successful': 'Login Bem-sucedido',
    'welcome.to.agua.twezah.admin.panel': 'Bem-vindo ao Painel Admin da ÁGUA TWEZAH',
    'login.failed': 'Login Falhou',
    'invalid.credentials': 'Credenciais inválidas',
    'an.error.occurred.during.login': 'Ocorreu um erro durante o login',
    
    // User Dashboard
    'welcome': 'Bem-vindo',
    'customer': 'Cliente',
    'track.your.purchases.and.earnings': 'Acompanhe suas compras e ganhos',
    'total.liters.purchased': 'Total de Litros Comprados',
    
    // Admin Layout
    'admin.panel': 'Painel Admin',
    'loyalty.tiers': 'Níveis de Fidelidade',
    'live.system': 'Sistema Ativo',
    
    // Dashboard Stats
    'total.liters.users': 'Total de Litros/Usuários',
    'commission.paid': 'Comissão Paga',
    'active.influencers': 'Influenciadores Ativos',
    'sales.trend': 'Tendência de Vendas',
    'monthly.liters.users.sold.and.revenue.generated': 'Litros/usuários vendidos mensalmente e receita gerada',
    'loyalty.tier.distribution': 'Distribuição de Níveis de Fidelidade',
    'customer.distribution.across.loyalty.levels': 'Distribuição de clientes por níveis de fidelidade',
    
    // User Management Stats
    'registered.users': 'Usuários Registrados',
    'active.users': 'Usuários Ativos',
    'platinum.users': 'Usuários Platina',
    'total.cashback': 'Total de Cashback',
    
    // Sales Management Stats
    'total.revenue': 'Total de Receita',
    'total.water.sold': 'Total de Água Vendida',
    'total.commission': 'Total de Comissão',
    'sales.transactions': 'Transações de Vendas',
    'all.sales.with.detailed.information.and.status': 'Todas as vendas com informações detalhadas e status',
    
    // Dashboard Stats Descriptions
    'this.month': 'este mês',
    'growth': 'crescimento',
    'pending': 'pendente',
    'active.campaigns': 'campanhas ativas',
    
    // User Management Descriptions
    'active.rate': 'taxa ativa',
    'highest.tier.members': 'membros do nível mais alto',
    'rewards.distributed': 'recompensas distribuídas',
    'users': 'Usuários',
    'search.and.filter.users.by.various.criteria': 'Pesquisar e filtrar usuários por vários critérios',
    'search.by.name.phone.or.email': 'Pesquisar por nome, telefone ou email...',
    'all.types': 'Todos os Tipos',
    'all.tiers': 'Todos os Níveis',
    'liters.users': 'Litros/Usuários',
    'cashback': 'Cashback',
    'commission': 'Comissão',
    'joined': 'Entrou',
    'actions': 'Ações',
    'network': 'Rede',
    
    // Sales Management Additional
    'water': 'Água',
    'date.time': 'Data/Hora',
    'location': 'Localização',
    'find.specific.sales.transactions': 'Encontrar transações de vendas específicas',
    'search.by.customer.phone.or.location': 'Pesquisar por cliente, telefone ou localização...',
    'view.details': 'Ver Detalhes',
    'customer.name': 'Nome do Cliente',
    'amount.currency': 'Valor (Kz)',
    
    // Commission Settings
    'paid.commissions': 'Comissões Pagas',
    'total.approved.payouts': 'Total de pagamentos aprovados',
    'average.payout.amount': 'Valor médio de pagamento',
    'configure.how.commissions.are.calculated.and.paid': 'Configure como as comissões são calculadas e pagas',
    'base.percentage.of.sales.converted.to.commission': 'Porcentagem base de vendas convertida em comissão',
    'cashback.amount.in.kz.awarded.per.liter.purchased': 'Valor de cashback em Kz concedido por litro comprado',
    'tier.progression.requirements': 'Requisitos de Progressão de Nível',
    'users.automatically.progress.through.tiers.based.on.total.liters.purchased': 'Os usuários progridem automaticamente através dos níveis com base no total de litros comprados',
    'automatic.progression': 'Progressão Automática',
    'user.tiers.are.automatically.updated.when.they.make.purchases.based.on.the.requirements.above': 'Os níveis dos usuários são atualizados automaticamente quando fazem compras com base nos requisitos acima',
    'commission.rates.are.calculated.using.the.tier.multipliers.from.commission.settings': 'As taxas de comissão são calculadas usando os multiplicadores de nível das configurações de comissão',
    
    // Reports & Analytics
    'refreshing': 'Atualizando...',
    'refresh.data': 'Atualizar Dados',
    'avg.order.value': 'Valor Médio do Pedido',
    'monthly.performance': 'Desempenho Mensal',
    'sales.users.and.commission.trends': 'Tendências de vendas, usuários e comissões',
    'user.tier.distribution': 'Distribuição de Níveis de Usuário',
    'breakdown.of.users.by.loyalty.tier': 'Distribuição de usuários por nível de fidelidade',
    'new.this.month': 'novos este mês',
    'from.last.month': 'do mês passado',
    
    // Store Management
    'total.stores': 'Total de Lojas',
    'store.locations': 'Localizações das lojas',
    'active.stores': 'Lojas Ativas',
    'currently.operating': 'Atualmente operando',
    'search.stores.by.name.address.or.manager': 'Pesquisar lojas por nome, endereço ou gerente...',
    'all.stores': 'Todas as Lojas',
    'manage.store.locations.and.their.information': 'Gerenciar localizações das lojas e suas informações',
    'store.code': 'Código da Loja',
    'contact': 'Contato',
    'suspended': 'Suspenso',
    
    // Billing Integration
    'customer.found': 'Cliente Encontrado',
    'customer.not.found': 'Cliente Não Encontrado',
    'no.customer.found.with.this.phone.number': 'Nenhum cliente encontrado com este número de telefone',
    'invoice.generated': 'Fatura Gerada',
    'invoice.has.been.generated.and.downloaded.successfully': 'A fatura foi gerada e baixada com sucesso',
    'invoice.generation.failed': 'Falha na Geração da Fatura',
    'failed.to.generate.invoice.please.try.again': 'Falha ao gerar fatura. Tente novamente.',
    'invoice.generation': 'Geração de Fatura',
    'create.invoices.with.qr.codes': 'Criar faturas com códigos QR',
    'customer.information.capture': 'Captura de informações do cliente',
    'create.invoice': 'Criar Fatura',
    'enter.customer.and.purchase.information.to.generate.an.invoice': 'Digite as informações do cliente e da compra para gerar uma fatura',
    'loading.customer.data': 'Carregando dados do cliente...',
    'enter.liters': 'Digite os litros',
    'enter.amount': 'Digite o valor',
    'generating': 'Gerando...',
    
    // Seller Dashboard
    'seller.dashboard': 'Painel do Vendedor',
    'manage.your.store.and.track.sales.performance': 'Gerencie sua loja e acompanhe o desempenho das vendas',
    'total.sales': 'Total de Vendas',
    'total.commissions': 'Total de Comissões',
    'total.customers': 'Total de Clientes',
    'total.liters': 'Total de Litros',
    
    // Influencer Statistics
    'total.buyers': 'Total de Compradores',
    'total.liters.sold': 'Total de Litros Vendidos',
    'total.liters.purchased': 'Total de Litros Comprados',
    
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
    
    // Dashboard
    'total.users': 'Total Users',
    'store.locations': 'Store Locations',
    'geographic.distribution.of.our.stores': 'Geographic distribution of our stores',
    'recent.users': 'Recent Users',
    'latest.user.registrations.and.activity': 'Latest user registrations and activity',
    'please.log.in.to.access.dashboard': 'Please log in to access the dashboard',
    'access.denied.admin.privileges.required': 'Access denied: Admin privileges required',
    'authentication.check.failed': 'Authentication check failed',
    'failed.to.load.dashboard.data': 'Failed to load dashboard data',
    'lead': 'Lead',
    'silver': 'Silver',
    'gold': 'Gold',
    'platinum': 'Platinum',
    
    // Users Management
    'manage.customers.and.influencers': 'Manage customers and influencers',
    'add.user': 'Add User',
    'all.users': 'All Users',
    'customers': 'Customers',
    'influencers': 'Influencers',
    
    // Receipt Upload
    'receipt.upload': 'Receipt Upload',
    'upload.receipts.for.ocr.processing': 'Upload receipts for OCR processing and automatic data extraction',
    
    // Sales Management
    'monitor.and.manage.all.sales.transactions': 'Monitor and manage all sales transactions and revenue',
    'search.sales': 'Search Sales',
    'all.status': 'All Status',
    'pending': 'Pending',
    'verified': 'Verified',
    'rejected': 'Rejected',
    'add.sale': 'Add Sale',
    
    // Commission Settings
    'manage.influencer.commission.structure.and.payouts': 'Manage influencer commission structure and payouts',
    'general.commission.settings': 'General Commission Settings',
    'base.commission.rate': 'Base Commission Rate',
    'cashback.rate': 'Cashback Rate',
    'tier.multipliers': 'Tier Multipliers',
    
    // Reports & Analytics
    'comprehensive.insights.into.your.loyalty.program.performance': 'Comprehensive insights into your loyalty program performance',
    
    // Store Management
    'manage.all.store.locations.and.their.information.across.angola': 'Manage all store locations and their information across Angola',
    'store.name': 'Store Name',
    'add.store': 'Add Store',
    'search.stores': 'Search Stores',
    
    // Login & Authentication
    'admin.panel.login': 'Admin Panel Login',
    'only.administrators.can.access.the.admin.panel': 'Only administrators can access the admin panel',
    'login.successful': 'Login Successful',
    'welcome.to.agua.twezah.admin.panel': 'Welcome to ÁGUA TWEZAH Admin Panel',
    'login.failed': 'Login Failed',
    'invalid.credentials': 'Invalid credentials',
    'an.error.occurred.during.login': 'An error occurred during login',
    
    // User Dashboard
    'welcome': 'Welcome',
    'customer': 'Customer',
    'track.your.purchases.and.earnings': 'Track your purchases and earnings',
    'total.liters.purchased': 'Total Liters Purchased',
    
    // Admin Layout
    'admin.panel': 'Admin Panel',
    'loyalty.tiers': 'Loyalty Tiers',
    'live.system': 'Live System',
    
    // Dashboard Stats
    'total.liters.users': 'Total Liters/Users',
    'commission.paid': 'Commission Paid',
    'active.influencers': 'Active Influencers',
    'sales.trend': 'Sales Trend',
    'monthly.liters.users.sold.and.revenue.generated': 'Monthly liters/users sold and revenue generated',
    'loyalty.tier.distribution': 'Loyalty Tier Distribution',
    'customer.distribution.across.loyalty.levels': 'Customer distribution across loyalty levels',
    
    // User Management Stats
    'registered.users': 'Registered Users',
    'active.users': 'Active Users',
    'platinum.users': 'Platinum Users',
    'total.cashback': 'Total Cashback',
    
    // Sales Management Stats
    'total.revenue': 'Total Revenue',
    'total.water.sold': 'Total Water Sold',
    'total.commission': 'Total Commission',
    'sales.transactions': 'Sales Transactions',
    'all.sales.with.detailed.information.and.status': 'All sales with detailed information and status',
    
    // Dashboard Stats Descriptions
    'this.month': 'this month',
    'growth': 'growth',
    'pending': 'pending',
    'active.campaigns': 'active campaigns',
    
    // User Management Descriptions
    'active.rate': 'active rate',
    'highest.tier.members': 'highest tier members',
    'rewards.distributed': 'rewards distributed',
    'users': 'Users',
    'search.and.filter.users.by.various.criteria': 'Search and filter users by various criteria',
    'search.by.name.phone.or.email': 'Search by name, phone, or email...',
    'all.types': 'All Types',
    'all.tiers': 'All Tiers',
    'liters.users': 'Liters/Users',
    'cashback': 'Cashback',
    'commission': 'Commission',
    'joined': 'Joined',
    'actions': 'Actions',
    'network': 'Network',
    
    // Sales Management Additional
    'water': 'Water',
    'date.time': 'Date/Time',
    'location': 'Location',
    'find.specific.sales.transactions': 'Find specific sales transactions',
    'search.by.customer.phone.or.location': 'Search by customer, phone, or location...',
    'view.details': 'View Details',
    'customer.name': 'Customer Name',
    'amount.currency': 'Amount (Kz)',
    
    // Commission Settings
    'paid.commissions': 'Paid Commissions',
    'total.approved.payouts': 'Total approved payouts',
    'average.payout.amount': 'Average payout amount',
    'configure.how.commissions.are.calculated.and.paid': 'Configure how commissions are calculated and paid',
    'base.percentage.of.sales.converted.to.commission': 'Base percentage of sales converted to commission',
    'cashback.amount.in.kz.awarded.per.liter.purchased': 'Cashback amount in Kz awarded per liter purchased',
    'tier.progression.requirements': 'Tier Progression Requirements',
    'users.automatically.progress.through.tiers.based.on.total.liters.purchased': 'Users automatically progress through tiers based on total liters purchased',
    'automatic.progression': 'Automatic Progression',
    'user.tiers.are.automatically.updated.when.they.make.purchases.based.on.the.requirements.above': 'User tiers are automatically updated when they make purchases based on the requirements above',
    'commission.rates.are.calculated.using.the.tier.multipliers.from.commission.settings': 'Commission rates are calculated using the tier multipliers from Commission Settings',
    
    // Reports & Analytics
    'refreshing': 'Refreshing...',
    'refresh.data': 'Refresh Data',
    'avg.order.value': 'Avg. Order Value',
    'monthly.performance': 'Monthly Performance',
    'sales.users.and.commission.trends': 'Sales, users, and commission trends',
    'user.tier.distribution': 'User Tier Distribution',
    'breakdown.of.users.by.loyalty.tier': 'Breakdown of users by loyalty tier',
    'new.this.month': 'new this month',
    'from.last.month': 'from last month',
    
    // Store Management
    'total.stores': 'Total Stores',
    'store.locations': 'Store locations',
    'active.stores': 'Active Stores',
    'currently.operating': 'Currently operating',
    'search.stores.by.name.address.or.manager': 'Search stores by name, address, or manager...',
    'all.stores': 'All Stores',
    'manage.store.locations.and.their.information': 'Manage store locations and their information',
    'store.code': 'Store Code',
    'contact': 'Contact',
    'suspended': 'Suspended',
    
    // Billing Integration
    'customer.found': 'Customer Found',
    'customer.not.found': 'Customer Not Found',
    'no.customer.found.with.this.phone.number': 'No customer found with this phone number',
    'invoice.generated': 'Invoice Generated',
    'invoice.has.been.generated.and.downloaded.successfully': 'Invoice has been generated and downloaded successfully',
    'invoice.generation.failed': 'Invoice Generation Failed',
    'failed.to.generate.invoice.please.try.again': 'Failed to generate invoice. Please try again.',
    'invoice.generation': 'Invoice Generation',
    'create.invoices.with.qr.codes': 'Create invoices with QR codes',
    'customer.information.capture': 'Customer information capture',
    'create.invoice': 'Create Invoice',
    'enter.customer.and.purchase.information.to.generate.an.invoice': 'Enter customer and purchase information to generate an invoice',
    'loading.customer.data': 'Loading customer data...',
    'enter.liters': 'Enter liters',
    'enter.amount': 'Enter amount',
    'generating': 'Generating...',
    
    // Seller Dashboard
    'seller.dashboard': 'Seller Dashboard',
    'manage.your.store.and.track.sales.performance': 'Manage your store and track sales performance',
    'total.sales': 'Total Sales',
    'total.commissions': 'Total Commissions',
    'total.customers': 'Total Customers',
    'total.liters': 'Total Liters',
    
    // Influencer Statistics
    'total.buyers': 'Total Buyers',
    'total.liters.sold': 'Total Liters Sold',
    'total.liters.purchased': 'Total Liters Purchased',
    
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
    
    // Dashboard
    'total.users': 'Total de Usuarios',
    'store.locations': 'Ubicaciones de Tiendas',
    'geographic.distribution.of.our.stores': 'Distribución geográfica de nuestras tiendas',
    'recent.users': 'Usuarios Recientes',
    'latest.user.registrations.and.activity': 'Últimos registros de usuarios y actividad',
    'please.log.in.to.access.dashboard': 'Por favor, inicie sesión para acceder al panel',
    'access.denied.admin.privileges.required': 'Acceso denegado: Se requieren privilegios de administrador',
    'authentication.check.failed': 'La verificación de autenticación falló',
    'failed.to.load.dashboard.data': 'Error al cargar datos del panel',
    'lead': 'Principiante',
    'silver': 'Plata',
    'gold': 'Oro',
    'platinum': 'Platino',
    
    // Users Management
    'manage.customers.and.influencers': 'Gestionar clientes e influenciadores',
    'add.user': 'Agregar Usuario',
    'all.users': 'Todos los Usuarios',
    'customers': 'Clientes',
    'influencers': 'Influenciadores',
    
    // Receipt Upload
    'receipt.upload': 'Subida de Recibos',
    'upload.receipts.for.ocr.processing': 'Subir recibos para procesamiento OCR y extracción automática de datos',
    
    // Sales Management
    'monitor.and.manage.all.sales.transactions': 'Monitorear y gestionar todas las transacciones de ventas e ingresos',
    'search.sales': 'Buscar Ventas',
    'all.status': 'Todos los Estados',
    'pending': 'Pendiente',
    'verified': 'Verificado',
    'rejected': 'Rechazado',
    'add.sale': 'Agregar Venta',
    
    // Commission Settings
    'manage.influencer.commission.structure.and.payouts': 'Gestionar estructura de comisiones de influenciadores y pagos',
    'general.commission.settings': 'Configuración General de Comisiones',
    'base.commission.rate': 'Tasa de Comisión Base',
    'cashback.rate': 'Tasa de Cashback',
    'tier.multipliers': 'Multiplicadores de Nivel',
    
    // Reports & Analytics
    'comprehensive.insights.into.your.loyalty.program.performance': 'Insights integrales sobre el rendimiento de tu programa de fidelidad',
    
    // Store Management
    'manage.all.store.locations.and.their.information.across.angola': 'Gestionar todas las ubicaciones de tiendas y su información en Angola',
    'store.name': 'Nombre de la Tienda',
    'add.store': 'Agregar Tienda',
    'search.stores': 'Buscar Tiendas',
    
    // Login & Authentication
    'admin.panel.login': 'Inicio de Sesión del Panel Admin',
    'only.administrators.can.access.the.admin.panel': 'Solo los administradores pueden acceder al panel admin',
    'login.successful': 'Inicio de Sesión Exitoso',
    'welcome.to.agua.twezah.admin.panel': 'Bienvenido al Panel Admin de ÁGUA TWEZAH',
    'login.failed': 'Inicio de Sesión Fallido',
    'invalid.credentials': 'Credenciales inválidas',
    'an.error.occurred.during.login': 'Ocurrió un error durante el inicio de sesión',
    
    // User Dashboard
    'welcome': 'Bienvenido',
    'customer': 'Cliente',
    'track.your.purchases.and.earnings': 'Rastrea tus compras y ganancias',
    'total.liters.purchased': 'Total de Litros Comprados',
    
    // Admin Layout
    'admin.panel': 'Panel Admin',
    'loyalty.tiers': 'Niveles de Fidelidad',
    'live.system': 'Sistema Activo',
    
    // Dashboard Stats
    'total.liters.users': 'Total de Litros/Usuarios',
    'commission.paid': 'Comisión Pagada',
    'active.influencers': 'Influenciadores Activos',
    'sales.trend': 'Tendencia de Ventas',
    'monthly.liters.users.sold.and.revenue.generated': 'Litros/usuarios vendidos mensualmente e ingresos generados',
    'loyalty.tier.distribution': 'Distribución de Niveles de Fidelidad',
    'customer.distribution.across.loyalty.levels': 'Distribución de clientes por niveles de fidelidad',
    
    // User Management Stats
    'registered.users': 'Usuarios Registrados',
    'active.users': 'Usuarios Activos',
    'platinum.users': 'Usuarios Platino',
    'total.cashback': 'Total de Cashback',
    
    // Sales Management Stats
    'total.revenue': 'Total de Ingresos',
    'total.water.sold': 'Total de Agua Vendida',
    'total.commission': 'Total de Comisión',
    'sales.transactions': 'Transacciones de Ventas',
    'all.sales.with.detailed.information.and.status': 'Todas las ventas con información detallada y estado',
    
    // Dashboard Stats Descriptions
    'this.month': 'este mes',
    'growth': 'crecimiento',
    'pending': 'pendiente',
    'active.campaigns': 'campañas activas',
    
    // User Management Descriptions
    'active.rate': 'tasa activa',
    'highest.tier.members': 'miembros de nivel más alto',
    'rewards.distributed': 'recompensas distribuidas',
    'users': 'Usuarios',
    'search.and.filter.users.by.various.criteria': 'Buscar y filtrar usuarios por varios criterios',
    'search.by.name.phone.or.email': 'Buscar por nombre, teléfono o email...',
    'all.types': 'Todos los Tipos',
    'all.tiers': 'Todos los Niveles',
    'liters.users': 'Litros/Usuarios',
    'cashback': 'Cashback',
    'commission': 'Comisión',
    'joined': 'Se Unió',
    'actions': 'Acciones',
    'network': 'Red',
    
    // Sales Management Additional
    'water': 'Agua',
    'date.time': 'Fecha/Hora',
    'location': 'Ubicación',
    'find.specific.sales.transactions': 'Encontrar transacciones de ventas específicas',
    'search.by.customer.phone.or.location': 'Buscar por cliente, teléfono o ubicación...',
    'view.details': 'Ver Detalles',
    'customer.name': 'Nombre del Cliente',
    'amount.currency': 'Cantidad (Kz)',
    
    // Commission Settings
    'paid.commissions': 'Comisiones Pagadas',
    'total.approved.payouts': 'Total de pagos aprobados',
    'average.payout.amount': 'Monto promedio de pago',
    'configure.how.commissions.are.calculated.and.paid': 'Configure cómo se calculan y pagan las comisiones',
    'base.percentage.of.sales.converted.to.commission': 'Porcentaje base de ventas convertido en comisión',
    'cashback.amount.in.kz.awarded.per.liter.purchased': 'Monto de cashback en Kz otorgado por litro comprado',
    'tier.progression.requirements': 'Requisitos de Progresión de Nivel',
    'users.automatically.progress.through.tiers.based.on.total.liters.purchased': 'Los usuarios progresan automáticamente a través de niveles basados en el total de litros comprados',
    'automatic.progression': 'Progresión Automática',
    'user.tiers.are.automatically.updated.when.they.make.purchases.based.on.the.requirements.above': 'Los niveles de usuario se actualizan automáticamente cuando hacen compras basadas en los requisitos anteriores',
    'commission.rates.are.calculated.using.the.tier.multipliers.from.commission.settings': 'Las tasas de comisión se calculan usando los multiplicadores de nivel de la configuración de comisión',
    
    // Reports & Analytics
    'refreshing': 'Actualizando...',
    'refresh.data': 'Actualizar Datos',
    'avg.order.value': 'Valor Promedio del Pedido',
    'monthly.performance': 'Rendimiento Mensual',
    'sales.users.and.commission.trends': 'Tendencias de ventas, usuarios y comisiones',
    'user.tier.distribution': 'Distribución de Niveles de Usuario',
    'breakdown.of.users.by.loyalty.tier': 'Desglose de usuarios por nivel de fidelidad',
    'new.this.month': 'nuevos este mes',
    'from.last.month': 'del mes pasado',
    
    // Store Management
    'total.stores': 'Total de Tiendas',
    'store.locations': 'Ubicaciones de tiendas',
    'active.stores': 'Tiendas Activas',
    'currently.operating': 'Actualmente operando',
    'search.stores.by.name.address.or.manager': 'Buscar tiendas por nombre, dirección o gerente...',
    'all.stores': 'Todas las Tiendas',
    'manage.store.locations.and.their.information': 'Gestionar ubicaciones de tiendas y su información',
    'store.code': 'Código de Tienda',
    'contact': 'Contacto',
    'suspended': 'Suspendido',
    
    // Billing Integration
    'customer.found': 'Cliente Encontrado',
    'customer.not.found': 'Cliente No Encontrado',
    'no.customer.found.with.this.phone.number': 'No se encontró cliente con este número de teléfono',
    'invoice.generated': 'Factura Generada',
    'invoice.has.been.generated.and.downloaded.successfully': 'La factura ha sido generada y descargada exitosamente',
    'invoice.generation.failed': 'Error en la Generación de Factura',
    'failed.to.generate.invoice.please.try.again': 'Error al generar factura. Inténtalo de nuevo.',
    'invoice.generation': 'Generación de Factura',
    'create.invoices.with.qr.codes': 'Crear facturas con códigos QR',
    'customer.information.capture': 'Captura de información del cliente',
    'create.invoice': 'Crear Factura',
    'enter.customer.and.purchase.information.to.generate.an.invoice': 'Ingrese información del cliente y compra para generar una factura',
    'loading.customer.data': 'Cargando datos del cliente...',
    'enter.liters': 'Ingrese litros',
    'enter.amount': 'Ingrese monto',
    'generating': 'Generando...',
    
    // Seller Dashboard
    'seller.dashboard': 'Panel del Vendedor',
    'manage.your.store.and.track.sales.performance': 'Gestiona tu tienda y rastrea el rendimiento de ventas',
    'total.sales': 'Total de Ventas',
    'total.commissions': 'Total de Comisiones',
    'total.customers': 'Total de Clientes',
    'total.liters': 'Total de Litros',
    
    // Influencer Statistics
    'total.buyers': 'Total de Compradores',
    'total.liters.sold': 'Total de Litros Vendidos',
    'total.liters.purchased': 'Total de Litros Comprados',
    
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
    
    // Dashboard
    'total.users': 'Total des Utilisateurs',
    'store.locations': 'Emplacements des Magasins',
    'geographic.distribution.of.our.stores': 'Distribution géographique de nos magasins',
    'recent.users': 'Utilisateurs Récents',
    'latest.user.registrations.and.activity': 'Dernières inscriptions d\'utilisateurs et activité',
    'please.log.in.to.access.dashboard': 'Veuillez vous connecter pour accéder au tableau de bord',
    'access.denied.admin.privileges.required': 'Accès refusé: Privilèges d\'administrateur requis',
    'authentication.check.failed': 'La vérification d\'authentification a échoué',
    'failed.to.load.dashboard.data': 'Échec du chargement des données du tableau de bord',
    'lead': 'Débutant',
    'silver': 'Argent',
    'gold': 'Or',
    'platinum': 'Platine',
    
    // Users Management
    'manage.customers.and.influencers': 'Gérer les clients et les influenceurs',
    'add.user': 'Ajouter un Utilisateur',
    'all.users': 'Tous les Utilisateurs',
    'customers': 'Clients',
    'influencers': 'Influenceurs',
    
    // Receipt Upload
    'receipt.upload': 'Téléchargement de Reçus',
    'upload.receipts.for.ocr.processing': 'Téléchargez des reçus pour le traitement OCR et l\'extraction automatique de données',
    
    // Sales Management
    'monitor.and.manage.all.sales.transactions': 'Surveiller et gérer toutes les transactions de vente et les revenus',
    'search.sales': 'Rechercher les Ventes',
    'all.status': 'Tous les États',
    'pending': 'En Attente',
    'verified': 'Vérifié',
    'rejected': 'Rejeté',
    'add.sale': 'Ajouter une Vente',
    
    // Commission Settings
    'manage.influencer.commission.structure.and.payouts': 'Gérer la structure des commissions d\'influenceurs et les paiements',
    'general.commission.settings': 'Paramètres Généraux de Commission',
    'base.commission.rate': 'Taux de Commission de Base',
    'cashback.rate': 'Taux de Cashback',
    'tier.multipliers': 'Multiplicateurs de Niveau',
    
    // Reports & Analytics
    'comprehensive.insights.into.your.loyalty.program.performance': 'Insights complets sur les performances de votre programme de fidélité',
    
    // Store Management
    'manage.all.store.locations.and.their.information.across.angola': 'Gérer tous les emplacements de magasins et leurs informations en Angola',
    'store.name': 'Nom du Magasin',
    'add.store': 'Ajouter un Magasin',
    'search.stores': 'Rechercher des Magasins',
    
    // Login & Authentication
    'admin.panel.login': 'Connexion au Panneau Admin',
    'only.administrators.can.access.the.admin.panel': 'Seuls les administrateurs peuvent accéder au panneau admin',
    'login.successful': 'Connexion Réussie',
    'welcome.to.agua.twezah.admin.panel': 'Bienvenue au Panneau Admin ÁGUA TWEZAH',
    'login.failed': 'Échec de la Connexion',
    'invalid.credentials': 'Identifiants invalides',
    'an.error.occurred.during.login': 'Une erreur s\'est produite pendant la connexion',
    
    // User Dashboard
    'welcome': 'Bienvenue',
    'customer': 'Client',
    'track.your.purchases.and.earnings': 'Suivez vos achats et gains',
    'total.liters.purchased': 'Total de Litres Achetés',
    
    // Admin Layout
    'admin.panel': 'Panneau Admin',
    'loyalty.tiers': 'Niveaux de Fidélité',
    'live.system': 'Système Actif',
    
    // Dashboard Stats
    'total.liters.users': 'Total de Litres/Utilisateurs',
    'commission.paid': 'Commission Payée',
    'active.influencers': 'Influenceurs Actifs',
    'sales.trend': 'Tendance des Ventes',
    'monthly.liters.users.sold.and.revenue.generated': 'Litres/utilisateurs vendus mensuellement et revenus générés',
    'loyalty.tier.distribution': 'Distribution des Niveaux de Fidélité',
    'customer.distribution.across.loyalty.levels': 'Distribution des clients par niveaux de fidélité',
    
    // User Management Stats
    'registered.users': 'Utilisateurs Inscrits',
    'active.users': 'Utilisateurs Actifs',
    'platinum.users': 'Utilisateurs Platine',
    'total.cashback': 'Total de Cashback',
    
    // Sales Management Stats
    'total.revenue': 'Total des Revenus',
    'total.water.sold': 'Total d\'Eau Vendue',
    'total.commission': 'Total des Commissions',
    'sales.transactions': 'Transactions de Ventes',
    'all.sales.with.detailed.information.and.status': 'Toutes les ventes avec informations détaillées et statut',
    
    // Dashboard Stats Descriptions
    'this.month': 'ce mois-ci',
    'growth': 'croissance',
    'pending': 'en attente',
    'active.campaigns': 'campagnes actives',
    
    // User Management Descriptions
    'active.rate': 'taux actif',
    'highest.tier.members': 'membres de niveau le plus élevé',
    'rewards.distributed': 'récompenses distribuées',
    'users': 'Utilisateurs',
    'search.and.filter.users.by.various.criteria': 'Rechercher et filtrer les utilisateurs par différents critères',
    'search.by.name.phone.or.email': 'Rechercher par nom, téléphone ou email...',
    'all.types': 'Tous les Types',
    'all.tiers': 'Tous les Niveaux',
    'liters.users': 'Litres/Utilisateurs',
    'cashback': 'Cashback',
    'commission': 'Commission',
    'joined': 'Rejoint',
    'actions': 'Actions',
    'network': 'Réseau',
    
    // Sales Management Additional
    'water': 'Eau',
    'date.time': 'Date/Heure',
    'location': 'Emplacement',
    'find.specific.sales.transactions': 'Trouver des transactions de vente spécifiques',
    'search.by.customer.phone.or.location': 'Rechercher par client, téléphone ou emplacement...',
    'view.details': 'Voir les Détails',
    'customer.name': 'Nom du Client',
    'amount.currency': 'Montant (Kz)',
    
    // Commission Settings
    'paid.commissions': 'Commissions Payées',
    'total.approved.payouts': 'Total des paiements approuvés',
    'average.payout.amount': 'Montant moyen de paiement',
    'configure.how.commissions.are.calculated.and.paid': 'Configurez comment les commissions sont calculées et payées',
    'base.percentage.of.sales.converted.to.commission': 'Pourcentage de base des ventes converti en commission',
    'cashback.amount.in.kz.awarded.per.liter.purchased': 'Montant de cashback en Kz accordé par litre acheté',
    'tier.progression.requirements': 'Exigences de Progression de Niveau',
    'users.automatically.progress.through.tiers.based.on.total.liters.purchased': 'Les utilisateurs progressent automatiquement à travers les niveaux basés sur le total de litres achetés',
    'automatic.progression': 'Progression Automatique',
    'user.tiers.are.automatically.updated.when.they.make.purchases.based.on.the.requirements.above': 'Les niveaux des utilisateurs sont automatiquement mis à jour lorsqu\'ils font des achats basés sur les exigences ci-dessus',
    'commission.rates.are.calculated.using.the.tier.multipliers.from.commission.settings': 'Les taux de commission sont calculés en utilisant les multiplicateurs de niveau des paramètres de commission',
    
    // Reports & Analytics
    'refreshing': 'Actualisation...',
    'refresh.data': 'Actualiser les Données',
    'avg.order.value': 'Valeur Moyenne de Commande',
    'monthly.performance': 'Performance Mensuelle',
    'sales.users.and.commission.trends': 'Tendances des ventes, utilisateurs et commissions',
    'user.tier.distribution': 'Distribution des Niveaux d\'Utilisateur',
    'breakdown.of.users.by.loyalty.tier': 'Répartition des utilisateurs par niveau de fidélité',
    'new.this.month': 'nouveaux ce mois-ci',
    'from.last.month': 'du mois dernier',
    
    // Store Management
    'total.stores': 'Total des Magasins',
    'store.locations': 'Emplacements de magasins',
    'active.stores': 'Magasins Actifs',
    'currently.operating': 'Actuellement en fonctionnement',
    'search.stores.by.name.address.or.manager': 'Rechercher des magasins par nom, adresse ou gestionnaire...',
    'all.stores': 'Tous les Magasins',
    'manage.store.locations.and.their.information': 'Gérer les emplacements des magasins et leurs informations',
    'store.code': 'Code du Magasin',
    'contact': 'Contact',
    'suspended': 'Suspendu',
    
    // Billing Integration
    'customer.found': 'Client Trouvé',
    'customer.not.found': 'Client Non Trouvé',
    'no.customer.found.with.this.phone.number': 'Aucun client trouvé avec ce numéro de téléphone',
    'invoice.generated': 'Facture Générée',
    'invoice.has.been.generated.and.downloaded.successfully': 'La facture a été générée et téléchargée avec succès',
    'invoice.generation.failed': 'Échec de la Génération de Facture',
    'failed.to.generate.invoice.please.try.again': 'Échec de génération de facture. Veuillez réessayer.',
    'invoice.generation': 'Génération de Facture',
    'create.invoices.with.qr.codes': 'Créer des factures avec codes QR',
    'customer.information.capture': 'Capture d\'informations client',
    'create.invoice': 'Créer Facture',
    'enter.customer.and.purchase.information.to.generate.an.invoice': 'Entrez les informations client et d\'achat pour générer une facture',
    'loading.customer.data': 'Chargement des données client...',
    'enter.liters': 'Entrez les litres',
    'enter.amount': 'Entrez le montant',
    'generating': 'Génération...',
    
    // Seller Dashboard
    'seller.dashboard': 'Tableau de Bord du Vendeur',
    'manage.your.store.and.track.sales.performance': 'Gérez votre magasin et suivez les performances de vente',
    'total.sales': 'Total des Ventes',
    'total.commissions': 'Total des Commissions',
    'total.customers': 'Total des Clients',
    'total.liters': 'Total des Litres',
    
    // Influencer Statistics
    'total.buyers': 'Total des Acheteurs',
    'total.liters.sold': 'Total des Litres Vendus',
    'total.liters.purchased': 'Total des Litres Achetés',
    
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