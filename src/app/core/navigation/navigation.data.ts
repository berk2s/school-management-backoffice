/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation'

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Özetler',
    subtitle: 'Gidişata göz atın',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'dashboards.project',
        title: 'Genel Bakış',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-check',
        link: '/anasayfa',
      },
      {
        id: 'dashboards.feed',
        title: 'Akış',
        subtitle: 'Duyurular ve haberler',
        type: 'basic',
        icon: 'heroicons_outline:speakerphone',
        link: '/akis',
      },
    ],
  },
  {
    id: 'organization',
    title: 'OKUL ORGANİZASYONU',
    subtitle: 'Sınıf ve Şube işlemleri',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'organization.grade',
        title: 'Şube',
        type: 'basic',
        icon: 'mat_outline:alt_route',
        link: '/sube',
      },
      {
        id: 'organization.classroom',
        title: 'Sınıf',
        type: 'basic',
        icon: 'mat_outline:meeting_room',
        link: '/sinif',
      },
    ],
  },
  {
    id: 'operation',
    title: 'İŞLEYİŞ',
    subtitle: 'İşleyiş işlemleri',
    type: 'group',
    children: [
      {
        id: 'operation.grade',
        title: 'Ders',
        type: 'basic',
        icon: 'mat_outline:class',
        link: '/ders',
      },
      {
        id: 'operation.lessonSubject',
        title: 'Öğretmen Branşları',
        type: 'basic',
        icon: 'mat_outline:subtitles',
        link: '/ogretmen-branslari',
      },
    ],
  },
  // {
  //   id: 'operation',
  //   title: 'İşleyiş',
  //   subtitle: 'İşleyiş işlemleri',
  //   type: 'group',
  //   icon: 'heroicons_outline:home',
  //   children: [
  //     {
  //       id: 'operation.appointments',
  //       title: 'Randevular',
  //       type: 'basic',
  //       icon: 'heroicons_outline:calendar',
  //       link: '/apps/academy',
  //     },
  //     {
  //       id: 'operation.discontiunity',
  //       title: 'Devamsızlıklar',
  //       type: 'basic',
  //       icon: 'heroicons_outline:clipboard-list',
  //       link: '/apps/calendar',
  //     },
  //     {
  //       id: 'operation.syllabus',
  //       title: 'Ders Programı',
  //       type: 'basic',
  //       icon: 'heroicons_outline:chat-alt',
  //       link: '/apps/chat',
  //     },
  //     {
  //       id: 'operation.syllabus',
  //       title: 'Sınavlar',
  //       type: 'basic',
  //       icon: 'heroicons_outline:chat-alt',
  //       link: '/apps/academy',
  //     },
  //     {
  //       id: 'operation.chat',
  //       title: 'Öneriler & Şikayetler',
  //       type: 'basic',
  //       icon: 'heroicons_outline:chat-alt',
  //       link: '/apps/chat',
  //       badge: {
  //         title: '3',
  //         classes: 'px-2 bg-pink-600 text-white rounded-full',
  //       },
  //     },
  //   ],
  // },
  {
    id: 'users',
    title: 'Kullanıcı Grupları',
    subtitle: 'Öğrenciler, veliler ve öğretmenler',
    type: 'group',
    icon: 'heroicons_outline:document',
    children: [
      {
        id: 'users.students',
        title: 'Öğrenciler',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/ogrenciler',
      },
      {
        id: 'users.teachers',
        title: 'Öğretmenler',
        type: 'basic',
        icon: 'mat_outline:supervised_user_circle',
        link: '/ogretmenler',
      },
      {
        id: 'users.parents',
        title: 'Veliler',
        type: 'basic',
        icon: 'iconsmind:business_manwoman',
        link: '/apps/academy',
      },
    ],
  },
]
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    tooltip: 'Dashboards',
    type: 'aside',
    icon: 'heroicons_outline:home',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'apps',
    title: 'Apps',
    tooltip: 'Apps',
    type: 'aside',
    icon: 'heroicons_outline:qrcode',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'pages',
    title: 'Pages',
    tooltip: 'Pages',
    type: 'aside',
    icon: 'heroicons_outline:document-duplicate',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'user-interface',
    title: 'UI',
    tooltip: 'UI',
    type: 'aside',
    icon: 'heroicons_outline:collection',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'navigation-features',
    title: 'Navigation',
    tooltip: 'Navigation',
    type: 'aside',
    icon: 'heroicons_outline:menu',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
]
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'DASHBOARDS',
    type: 'group',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'apps',
    title: 'APPS',
    type: 'group',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'others',
    title: 'OTHERS',
    type: 'group',
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'aside',
    icon: 'heroicons_outline:document-duplicate',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'user-interface',
    title: 'User Interface',
    type: 'aside',
    icon: 'heroicons_outline:collection',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'navigation-features',
    title: 'Navigation Features',
    type: 'aside',
    icon: 'heroicons_outline:menu',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
]
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'apps',
    title: 'Apps',
    type: 'group',
    icon: 'heroicons_outline:qrcode',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'heroicons_outline:document-duplicate',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'user-interface',
    title: 'UI',
    type: 'group',
    icon: 'heroicons_outline:collection',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
  {
    id: 'navigation-features',
    title: 'Misc',
    type: 'group',
    icon: 'heroicons_outline:menu',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
]
