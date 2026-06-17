export interface UserData {
  name: string;
  avatarUrl?: string;
}

export type ActiveTab = 'perfil' | 'configuracoes';

export interface UserSidebarProps {
  user: UserData;
  activeTab: ActiveTab;
  currentAvatar: string | null;
  onTabChange: (tab: ActiveTab) => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBackClick?: () => void;
}