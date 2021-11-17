// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  applicationUrl: 'http://localhost:4200',
  imgBaseUrl: 'http://192.168.0.33:8080',
  imageUrls: {
    imageBaseUrl:
      'https://school-management-ozsen.s3.eu-central-1.amazonaws.com',
    paths: {
      announcement: 'announcements',
    },
  },
  api: {
    baseUrl: 'http://192.168.0.33:8080',
    loginUrl: '/api/login',
    tokenUrl: '/api/token',
    announcement: {
      url: '/api/management/announcements',
      uploadImage: 'upload/images',
      deleteImage: 'delete/images',
    },
    userInfoUrl: '/api/userinfo',
    student: {
      url: '/api/management/students',
    },
    grade: {
      url: '/api/management/grades',
    },
    gradeCategory: {
      url: '/api/management/grade/category',
    },
    lesson: {
      url: '/api/management/lessons',
    },
    teachingSubject: {
      url: '/api/management/teachingsubjects',
    },
    teacher: {
      url: '/api/management/teachers',
    },
    user: {
      url: '/api/management/users',
    },
    classroom: {
      url: '/api/management/classrooms',
    },
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
