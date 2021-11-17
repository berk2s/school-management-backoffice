import { FuseNavigationItem } from '@fuse/components/navigation'

export const classroomNavigationData: FuseNavigationItem[] = [
  {
    title: 'Sınıf',
    subtitle: 'Sınıf işlemleri',
    type: 'group',
    children: [
      {
        title: 'Sınıflar',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-list',
        link: '/sinif/siniflar',
      },
      {
        title: 'Sınıf ekle',
        type: 'basic',
        icon: 'heroicons_outline:plus-circle',
        link: '/sinif/ekle',
      },
      {
        title: 'Danışman ata',
        type: 'basic',
        icon: 'mat_outline:person_add_alt',
        link: '/sinif/danisman-ata',
      },
      {
        title: 'Öğrenci ekle',
        type: 'basic',
        icon: 'mat_outline:group_add',
        link: '/sinif/ogrenci-ekle',
      },
    ],
  },
]
