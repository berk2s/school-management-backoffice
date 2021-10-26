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
    message: 'Yetkisiz kullanıcı',
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
  {
    code: 18,
    message: 'Böyle bir duyuru bulunamadı',
  },
  {
    code: 19,
    message: 'Böyle bir organizasyon bulunamadı',
  },
  {
    code: 20,
    message: 'Böyle bir şube bulunamadı',
  },
  {
    code: 21,
    message: 'Böyle bir ders bulunamadı',
  },
  {
    code: 22,
    message: 'Böyle bir ders programı bulunamadı',
  },
  {
    code: 23,
    message: 'Böyle bir devamsızlık bulunamadı',
  },
  {
    code: 24,
    message: 'Geçersiz oturum',
  },
  {
    code: 25,
    message: 'Böyle bir ödev bulunamadı',
  },
  {
    code: 26,
    message: 'Böyle bir kişisel ödev bulunamadı',
  },
  {
    code: 27,
    message: 'Böyle bir sınav tipi bulunamadı',
  },
  {
    code: 28,
    message: 'Böyle bir sınav iskeleti bulunamadı',
  },
  {
    code: 29,
    message: 'Böyle bir sınav bulunamadı',
  },
  {
    code: 30,
    message: 'Böyle bir sınav alanı bulunamadı',
  },
  {
    code: 31,
    message: 'Dosya okunamadı',
  },
  {
    code: 32,
    message: 'Öğrenci sütunu tanımlanmamış',
  },
  {
    code: 33,
    message: 'Sınıf sütunu tanımlanmamış',
  },
  {
    code: 34,
    message: 'Şube sütunu tanımlanmamış',
  },
  {
    code: 35,
    message: 'Sınav sütunu tanımlanmamış',
  },
  {
    code: 36,
    message: 'Sıralama sütunu tanımlanmamış',
  },
  {
    code: 37,
    message: 'Sınav sonucu bulunamadı',
  },
  {
    code: 38,
    message: 'Sınav sonuç parçası bulunamadı',
  },
  {
    code: 39,
    message: 'Böyle bir şikayet veya öneri bulunamadı',
  },
  {
    code: 40,
    message: 'Böyle bir yazışma bulunamadı',
  },
]

export const translateMessage = (code: number): string => {
  const errorMessage = errorMessages.filter((data) => data.code === code)

  if (errorMessage.length === 0) return 'Bilinmeyen bir hata'

  return errorMessage[0].message
}
