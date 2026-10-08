import { Home, Dumbbell, Store, Users, BookA, Stethoscope, BookOpen, Phone } from "lucide-react";

export const NAV_ITENS_ALUNO = [
  { icon: Home, path: "/dashboard", label: "Dashboard" },
  { icon: Dumbbell, path: "/inicio-atividades", label: "Atividades" },
  { icon: Store, path: "/loja", label: "Loja" },
  { icon: Users, path: "/acompanhante", label: "Acompanhante" },
  { icon: BookA, path: "/dicionario", label: "Dicionário" },
];

export const NAV_ITENS_PROFISSIONAL = [
  { icon: Home, path: "/dashboard-medico", label: "Início" },
  { icon: Phone, path: "/contato-medico", label: "Contato" },
];

export const NAV_ITENS_ADMIN = [
  { icon: Home, path: "/dashboard-admin", label: "Início" },
  { icon: Stethoscope, path: "/profissional-admin", label: "Profissionais" },
  { icon: BookOpen, path: "/atividades-admin", label: "Atividades" },
];
