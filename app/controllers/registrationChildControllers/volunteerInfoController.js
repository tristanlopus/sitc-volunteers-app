var app = angular.module('volunteersApp')

app.controller('VolunteerInfoController', ['$scope', '$log', '$window', '$http', '$state', 'getCarpoolSites', 'mapsModal', function($scope, $log, $window, $http, $state, getCarpoolSites, mapsModal) {

  $log.log('VolunteerInfoController is running!')

  // controls which of two phone fields is required
  $scope.noCellPhone = false

  $scope.genders = {
    "female": "Female",
    "male": "Male",
    "nonbinary": "Non-binary",
    "transWoman": "Trans Woman",
    "transMan": "Trans Man",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.ethnicities = {
    "white" : "White, not of Hispanic Origin, Latino, or Spanish origin",
    "white_hispan" : "White, of Hispanic, Latino, or Spanish origin",
    "black" : "Black or African American",
    "native" : "American Indian or Alaska Native",
    "asianIndian" : "Asian Indian",
    "asian": "Asian",
    "multi": "Multiracial",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.religions = {
    "buddhist": "Buddhist",
    "christian" : "Christian",
    "hindu" : "Hindu",
    "jewish": "Jewish",
    "muslim": "Muslim",
    "sikh": "Sikh",
    "athiest": "Athiest",
    "agnostic": "Agnostic",
    "unitarian": "Unitarian/Universalist",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.highSchools = {
    "huron": "Ann Arbor Huron",
    "pioneer": "Ann Arbor Pioneer",
    "Skyline": "Ann Arbor Skyline",
    "berkley": "Berkely High School",
    "groves": "Birmingham Groves",
    "seaholm": "Birmingham Seaholm",
    "bloomfield": "Bloomfield Hills H.S.",
    "cranbrook": "Cranbrook Kingswood",
    "dcds": "Detroit Country Day School",
    "harrison": "Farmington Harrison",
    "farmington": "Farmington H.S.",
    "gpNorth": "Grosse Pointe North",
    "gpSouth": "Grosse Pointe South",
    "greenhills": "Greenhills School",
    "mercy": "Mercy H.S.",
    "northFarm": "North Farmington H.S.",
    "notreDame": "Notre Dame Prep",
    "roeper": "Roeper School",
    "renaissance": "Renaissance H.S.",
    "troy": "Troy H.S.",
    "uOfD": "U of D Jesuit",
    "westBloomfield": "West Bloomfield H.S.",
    "other": "Other"
  }

  $scope.states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

  $scope.driverPermitOptions = {
    "isAdult": "I am 18, I meet the requirements and can drive if needed.",
    "isMinorWithPermission": "I am 17 and have parent permission to drive if needed",
    "noPermission": "I cannot drive",
  }

  var todayDate = new Date()

  $scope.setBirthdateAndValidate = function() {

    // create date obj from mmddyyyy string
    var dateString = $scope.birthdateString
    var month = parseInt(dateString.slice(0,2))
    var day = parseInt(dateString.slice(2,4))
    var year = parseInt(dateString.slice(4))


    var myBirthdate = new Date()
    myBirthdate.setFullYear(year)
    myBirthdate.setMonth(month)
    myBirthdate.setDate(day)

    $log.log("birth month: " + month)
    $log.log("myBirthdate: " + myBirthdate.toString())

    // create a new date object and set it to August of this year
    var minEligibleDate = new Date(todayDate)
    minEligibleDate.setMonth(7)

    // set to 10 years prior to August of this year
    // Min teer age is 14, but here we allow for some leeway to accomodate certain anomalous cases
    minEligibleDate.setFullYear(minEligibleDate.getFullYear() - 10)

    $log.log(minEligibleDate.getFullYear())

    if (minEligibleDate.getFullYear() < myBirthdate.getFullYear()) {
      $scope.registrationForm.birthdateString.$error.notOldEnough = true
      $scope.registrationForm.birthdateString.$setValidity("notOldEnough", false)
      if (!$scope.hasHadInvalidBirthdate) {
        // if the person has already seen the birthdate error, don't continue auto-focusing the birthdate field, as this prevents them from focusing any other fields if they do not change the birthdate
        $scope.hasHadInvalidBirthdate = true
        var field = $window.document.getElementById('birthdate')
        field.focus()
      }
    }
    else {
      // set errors to valid in case they were set to false by a previous input
      $scope.registrationForm.birthdateString.$error.notOldEnough = false
      $scope.registrationForm.birthdateString.$setValidity("notOldEnough", true)
      // floor() rounds down
      $scope.regInfo["age"] = Math.floor((todayDate.getTime() - myBirthdate.getTime()) / (365*24*60*60*1000))
      $scope.regInfo.birthdate = year + "-" + ((month>9) ? month : "0" + month) + "-" + ((day>9) ? day : "0" + day)
      $log.log("age: " + $scope.regInfo.birthdate)
      $log.log("age: " + $scope.regInfo.age)
    }
  }

  $scope.showMapsModal = function(displayName, address, city, state, zip) {
    $log.log("showMapsModal ran with address " + address)
    mapsModal(displayName, address, city, state, zip)
  }


  $scope.checkForOtherEthnicity = function() {
    $scope.otherEthnicityIsRequired = ($scope.regInfo.ethnicity == "other")
    $log.log("otherEthnicityIsRequired: " + $scope.otherEthnicityIsRequired)
  }

  $scope.checkForOtherReligion = function() {
    $scope.otherReligionIsRequired = ($scope.regInfo.religion == "other")
    $log.log("otherReligionIsRequired: " + $scope.otherReligionIsRequired)
  }

  $scope.strToInt = function(whichYear) {
    $scope.regInfo[whichYear] = parseInt($scope.regInfo[whichYear])
    $log.log(whichYear + " is: " + $scope.regInfo[whichYear] + " and is of type " + typeof $scope.regInfo[whichYear])
  }

  // $scope.checkForOtherHighSchool = function() {
  //   $scope.otherHighSchoolIsRequired = ($scope.regInfo.highSchool == "other")
  //   $log.log("otherHighSchoolIsRequired: " + $scope.otherHighSchoolIsRequired)
  //   // do not automatically focus "other" input, as this causes it to be marked invalid immediately when it appears
  // }

  $scope.checkForOtherGender = function() {
    $scope.otherGenderIsRequired = ($scope.regInfo.gender == "other")
    $log.log("otherGenderIsRequired: " + $scope.otherGenderIsRequired)
  }

  $scope.fillAddressFields = function() {
    var myURL = "http://zip.getziptastic.com/v2/US/" + $scope.regInfo.zip
    $http({
      method: "GET",
      url: myURL
    }).then(function success(response) {
      $scope.regInfo.city = response.data.city
      $scope.regInfo.state = response.data.state_short
      $log.log("city: " + $scope.regInfo.city)
      $scope.showFields = true
    }, function failure() {
      // still show fields so user can fill them
      $scope.showFields = true
    })
  }

  // $scope.resetValidity = function() {
  //   $log.log("resetValidity ran!")
  //   if ($scope.regInfo.otherHighSchool) {
  //     $log.log("resetValidity condition true!")
  //     var field = angular.element(document.querySelector('#otherHighSchool'))
  //     field.removeClass('ng-invalid').removeClass('ng-invalid-one-or-other')
  //     field = angular.element(document.querySelector('#otherHighSchoolInput'))
  //     field.removeClass('md-input-invalid')
  //   }
  // }

  $scope.logPhone = function() {
    $log.log("phone: " + $scope.regInfo.phone)
  }

  $scope.goToPage = function() {
    $log.log("goToPage ran!")
    // if (!$scope.regInfo.highSchool && !$scope.regInfo.otherHighSchool) {
    //   $scope.registrationForm.otherHighSchool.$error.oneOrOther = true
    //   $scope.registrationForm.otherHighSchool.$setValidity("oneOrOther", false)
    //   var container = angular.element(document.querySelector('#otherHighSchoolInput'))
    //   container.addClass('md-input-invalid')
    //   var field = angular.element(document.querySelector('#otherHighSchool'))
    //   field.removeClass('ng-untouched').removeClass('ng-pristine')
    //   field.addClass('ng-touched')
    //   field = $window.document.getElementById('otherHighSchool')
    //   field.focus()
    //   return
    // }
    $scope.goToState($scope.registrationForm, 'emergencyContacts', 1)
  }

}])
