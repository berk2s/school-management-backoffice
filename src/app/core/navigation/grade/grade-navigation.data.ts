import { FuseNavigationItem } from '@fuse/components/navigation'

export const gradeNavigationData: FuseNavigationItem[] = [
  {
    title: 'Şube',
    subtitle: 'Şube işlemleri',
    type: 'group',
    children: [
      {
        title: 'Şubeler',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-list',
        link: '/sube/subeler',
      },
      {
        title: 'Şube ekle',
        type: 'basic',
        icon: 'heroicons_outline:plus-circle',
        link: '/sube/ekle',
      },
    ],
  },
  {
    title: 'ŞUBE KATEGORİLERİ',
    subtitle: 'Şube kategori işlemleri',
    type: 'group',
    children: [
      {
        title: 'Şube kategorileri',
        type: 'basic',
        icon: 'heroicons_outline:view-grid',
        link: '/sube/kategoriler',
      },
      {
        title: 'Şube kategorisi ekle',
        type: 'basic',
        icon: 'heroicons_outline:view-grid-add',
        link: '/sube/kategori/ekle',
      },
    ],
  },
]
