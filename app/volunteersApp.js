var app = angular.module('volunteersApp', ['ngMaterial', 'ui.router', 'ngMessages', 'ngMask', 'formly', 'formlyMaterial'])

app.config(function($stateProvider) {
  $stateProvider
    .state('registration', {
      url: '/registration',
      templateUrl: 'app/views/registrationView.html',
      controller: 'RegistrationController'
    })

    .state('registration.volunteerInfo', {
      url: '/volunteerInfo',
      templateUrl: 'app/views/registrationChildViews/volunteerInfoView.html',
      controller: 'VolunteerInfoController'
    })

    .state('registration.emergencyContacts', {
      url: '/emergencyContacts',
      templateUrl: 'app/views/registrationChildViews/emergencyContactsView.html',
      controller: 'EmergencyContactsController'
    })

    .state('registration.payments', {
      url: '/payments',
      templateUrl: 'app/views/registrationChildViews/paymentsView.html',
      controller: 'PaymentsController'
    })
})

//open to volunteer info page by default
app.config(function($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.when('', '/registration/volunteerInfo')
})

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')
    .accentPalette('deep-orange');
  })