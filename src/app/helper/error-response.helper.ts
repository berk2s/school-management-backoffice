const errorMessages = [
  {
    code: -1,
    message: 'Beklenmedik bir hata',
  },
  {
    code: 1,
    message: 'Kullanıcı adı veya şifre hatalı',
  },
  {
    code: 2,
    message: 'Kullanıcı adı veya şifre hatalı',
  },
  {
    code: 3,
    message: 'Geçersiz oturum',
  },
  {
    code: 4,
    message: 'Kullanıcı yetkisiz',
  },
  {
    code: 5,
    message: 'Geçersiz veya hatalı istek',
  },
  {
    code: 6,
    message: 'Böyle bir kullanıcı bulunamadı',
  },
  {
    code: 7,
    message: 'Böyle bir yetki bulunamadı',
  },
  {
    code: 8,
    message: 'Böyle bir rol bulunamadı',
  },
  {
    code: 9,
    message: 'Böyle bir veli bulunamadı',
  },
  {
    code: 10,
    message: 'Böyle bir öğrenci bulunamadı',
  },
  {
    code: 11,
    message: 'Böyle bir branş bulunamadı',
  },
  {
    code: 12,
    message: 'Böyle bir öğretmen bulunamadı',
  },
  {
    code: 13,
    message: 'Böyle bir sınıf bulunamadı',
  },
  {
    code: 14,
    message: 'Böyle bir randevu bulunamadı',
  },
  {
    code: 15,
    message: 'Öğretmen belirlenen randevu tarihlerinde müsait değil',
  },
  {
    code: 16,
    message: 'Öğrenci belirlenen randevu tarihlerinde müsait değil',
  },
  {
    code: 17,
    message: 'Sunucu hatası',
  },
]

export const translateMessage = (code: number): string => {
  const errorMessage = errorMessages.filter((data) => data.code === code)

  if (errorMessage.length === 0) return 'Bilinmeyen bir hata'

  return errorMessage[0].message
}
