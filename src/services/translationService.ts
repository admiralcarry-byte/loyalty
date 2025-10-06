export interface Translations {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: Translations;
}

const translations: LanguageTranslations = {
  Portuguese: {
    'dashboard': 'Painel de Controle',
    'user.management': 'Gerenciamento de Usuários',
    'sales.management': 'Gerenciamento de Vendas',
    'commission.settings': 'Configurações de Comissão',
    'reports.analytics': 'Relatórios e Análises',
    'stores': 'Lojas',
    'billing.integration': 'Integração de Faturamento',
    'settings': 'Configurações',
    'total.users': 'Total de Usuários',
    'total.sales': 'Total de Vendas',
    'total.commissions': 'Total de Comissões',
    'total.stores': 'Total de Lojas',
    'active.users': 'Usuários Ativos',
    'users': 'Usuários',
    'customers': 'Clientes',
    'influencers': 'Influenciadores',
    'user': 'Usuário',
    'customer': 'Cliente',
    'influencer': 'Influenciador',
    'type': 'Tipo',
    'tier': 'Nível',
    'status': 'Status',
    'actions': 'Ações',
    'view.details': 'Ver Detalhes',
    'edit.user.info': 'Editar Informações do Usuário',
    'change.password': 'Alterar Senha',
    'block.user': 'Bloquear Usuário',
    'unblock.user': 'Desbloquear Usuário',
    'delete.user': 'Excluir Usuário',
    'add.new.sale': 'Adicionar Nova Venda',
    'sale.details': 'Detalhes da Venda',
    'add.new.store': 'Adicionar Nova Loja',
    'cancel': 'Cancelar',
    'close': 'Fechar',
    'save': 'Salvar',
    'edit': 'Editar',
    'delete': 'Excluir',
    'loading': 'Carregando...',
    'error': 'Erro',
    'success': 'Sucesso',
  },
  English: {
    'dashboard': 'Dashboard',
    'user.management': 'User Management',
    'sales.management': 'Sales Management',
    'commission.settings': 'Commission Settings',
    'reports.analytics': 'Reports & Analytics',
    'stores': 'Stores',
    'billing.integration': 'Billing Integration',
    'settings': 'Settings',
    'total.users': 'Total Users',
    'total.sales': 'Total Sales',
    'total.commissions': 'Total Commissions',
    'total.stores': 'Total Stores',
    'active.users': 'Active Users',
    'users': 'Users',
    'customers': 'Customers',
    'influencers': 'Influencers',
    'user': 'User',
    'customer': 'Customer',
    'influencer': 'Influencer',
    'type': 'Type',
    'tier': 'Tier',
    'status': 'Status',
    'actions': 'Actions',
    'view.details': 'View Details',
    'edit.user.info': 'Edit User Info',
    'change.password': 'Change Password',
    'block.user': 'Block User',
    'unblock.user': 'Unblock User',
    'delete.user': 'Delete User',
    'add.new.sale': 'Add New Sale',
    'sale.details': 'Sale Details',
    'add.new.store': 'Add New Store',
    'cancel': 'Cancel',
    'close': 'Close',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
  },
  Spanish: {
    'dashboard': 'Panel de Control',
    'user.management': 'Gestión de Usuarios',
    'sales.management': 'Gestión de Ventas',
    'commission.settings': 'Configuración de Comisiones',
    'reports.analytics': 'Informes y Análisis',
    'stores': 'Tiendas',
    'billing.integration': 'Integración de Facturación',
    'settings': 'Configuraciones',
    'total.users': 'Total de Usuarios',
    'total.sales': 'Total de Ventas',
    'total.commissions': 'Total de Comisiones',
    'total.stores': 'Total de Tiendas',
    'active.users': 'Usuarios Activos',
    'users': 'Usuarios',
    'customers': 'Clientes',
    'influencers': 'Influenciadores',
    'user': 'Usuario',
    'customer': 'Cliente',
    'influencer': 'Influenciador',
    'type': 'Tipo',
    'tier': 'Nivel',
    'status': 'Estado',
    'actions': 'Acciones',
    'view.details': 'Ver Detalles',
    'edit.user.info': 'Editar Información de Usuario',
    'change.password': 'Cambiar Contraseña',
    'block.user': 'Bloquear Usuario',
    'unblock.user': 'Desbloquear Usuario',
    'delete.user': 'Eliminar Usuario',
    'add.new.sale': 'Agregar Nueva Venta',
    'sale.details': 'Detalles de Venta',
    'add.new.store': 'Agregar Nueva Tienda',
    'cancel': 'Cancelar',
    'close': 'Cerrar',
    'save': 'Guardar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'loading': 'Cargando...',
    'error': 'Error',
    'success': 'Éxito',
  },
  French: {
    'dashboard': 'Tableau de Bord',
    'user.management': 'Gestion des Utilisateurs',
    'sales.management': 'Gestion des Ventes',
    'commission.settings': 'Paramètres de Commission',
    'reports.analytics': 'Rapports et Analyses',
    'stores': 'Magasins',
    'billing.integration': 'Intégration de Facturation',
    'settings': 'Paramètres',
    'total.users': 'Total des Utilisateurs',
    'total.sales': 'Total des Ventes',
    'total.commissions': 'Total des Commissions',
    'total.stores': 'Total des Magasins',
    'active.users': 'Utilisateurs Actifs',
    'users': 'Utilisateurs',
    'customers': 'Clients',
    'influencers': 'Influenceurs',
    'user': 'Utilisateur',
    'customer': 'Client',
    'influencer': 'Influenceur',
    'type': 'Type',
    'tier': 'Niveau',
    'status': 'Statut',
    'actions': 'Actions',
    'view.details': 'Voir Détails',
    'edit.user.info': 'Modifier les Informations Utilisateur',
    'change.password': 'Changer le Mot de Passe',
    'block.user': 'Bloquer l\'Utilisateur',
    'unblock.user': 'Débloquer l\'Utilisateur',
    'delete.user': 'Supprimer l\'Utilisateur',
    'add.new.sale': 'Ajouter Nouvelle Vente',
    'sale.details': 'Détails de la Vente',
    'add.new.store': 'Ajouter Nouveau Magasin',
    'cancel': 'Annuler',
    'close': 'Fermer',
    'save': 'Sauvegarder',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'loading': 'Chargement...',
    'error': 'Erreur',
    'success': 'Succès',
  }
};

class TranslationService {
  private currentLanguage: string = 'Portuguese';

  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  translate(key: string): string {
    const languageTranslations = translations[this.currentLanguage];
    if (!languageTranslations) {
      console.warn(`Language ${this.currentLanguage} not found`);
      return key;
    }

    const translation = languageTranslations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language ${this.currentLanguage}`);
      return key;
    }

    return translation;
  }

  getAvailableLanguages(): string[] {
    return Object.keys(translations);
  }
}

export const translationService = new TranslationService();
