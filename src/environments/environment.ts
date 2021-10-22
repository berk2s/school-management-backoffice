// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  applicationUrl: 'http://localhost:4200',
  imgBaseUrl: 'http://192.168.0.33:8080',
  api: {
    baseUrl: 'http://192.168.0.33:8080',
    loginUrl: 'http://192.168.0.33:8080/login',
    tokenUrl: 'http://192.168.0.33:8080/token',
    announcement: {
      url: 'http://192.168.0.33:8080/management/announcements',
      uploadImage: '/upload/images',
    },
    userInfoUrl: 'http://192.168.0.33:8080/userinfo',
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
