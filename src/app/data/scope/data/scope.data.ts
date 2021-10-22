export interface ScopeData {
  url: string
  scope: string
  children?: ScopeData[]
}
export const scopesData: ScopeData[] = [
  {
    url: 'anasayfa',
    scope: 'profile:manage',
  },
  {
    url: 'akis',
    scope: 'manage:announcements',
    children: [
      {
        url: 'ekle',
        scope: 'write:announcement',
      },
    ],
  },
]
