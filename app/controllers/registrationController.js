var app = angular.module('volunteersApp')

app.controller('RegistrationController', ['$scope', '$log', '$http', '$state', 'submitRegistrationToDb', 'submitRegChargeToStripe', function($scope, $log, $http, $state, submitRegistrationToDb, submitRegChargeToStripe) {

  $log.log('RegistrationController is running!')

  $scope.personInfo = {}
  $scope.regInfo = {}
  $scope.emergencyContact1 = {}
  $scope.emergencyContact2 = {}

  // -- init values for debugging purposes
  // person values
  $scope.personInfo["firstName"] = "Linda"
  $scope.personInfo["lastName"] = "Cruise"
  $scope.personInfo["primaryCarpool_id"] = "aa"
  $scope.regInfo["birthdate"] = "02/25/1999"
  $scope.regInfo["phone"] = "6549874560"
  $scope.regInfo["altPhone"] = "6549873210"
  $scope.regInfo["email"] = "me@me.com"
  $scope.regInfo["address"] = "78542 Some St."
  $scope.regInfo["city"] = "Farmington"
  $scope.regInfo["state"] = "MI"
  $scope.regInfo["zip"] = "48209"
  $scope.regInfo["gender"] = "male"
  $scope.regInfo["ethnicity"] = "white"
  $scope.regInfo["religion"] = "hindu"
  $scope.regInfo["highSchool"] = "Greenhills"
  $scope.regInfo["hsGradYear"] = '2012'
  $scope.regInfo["college"] = "College of Wooster"
  $scope.regInfo["colGradYear"] = "2016"
  $scope.regInfo["driverPermit"] = "isAdult"
  $scope.regInfo["shirtSize"] = "S"
  $scope.regInfo["paymentMethod"] = "credit"

  // emergencyContact1 values
  $scope.emergencyContact1["firstName"] = "Melissa"
  $scope.emergencyContact1["lastName"] = "McCarthy"
  $scope.emergencyContact1["email"] = "mom@me.com"
  $scope.emergencyContact1["phone"] = "6549876540"
  $scope.emergencyContact1["altPhone"] = "4567891320"
  $scope.emergencyContact1["address"] = "546 Mystery Rd"
  $scope.emergencyContact1["addressLineTwo"] = "apt 56"
  $scope.emergencyContact1["city"] = "Farmville"
  $scope.emergencyContact1["state"] = "MI"
  $scope.emergencyContact1["zip"] = "48209"
  $scope.emergencyContact1["sendNewsletter"] = 1

  // emergencyContact2 values
  $scope.emergencyContact2["firstName"] = "Alec"
  $scope.emergencyContact2["lastName"] = "Baldwin"
  $scope.emergencyContact2["email"] = "dad@me.com"
  $scope.emergencyContact2["phone"] = "9874563210"
  $scope.emergencyContact2["altPhone"] = "6543219874"
  $scope.emergencyContact2["address"] = "546 Mystery Rd"
  $scope.emergencyContact2["addressLineTwo"] = "apt 56"
  $scope.emergencyContact2["city"] = "Farmville"
  $scope.emergencyContact2["state"] = "MI"
  $scope.emergencyContact2["zip"] = "48209"
  $scope.emergencyContact2["sendNewsletter"] = 0



  $scope.gotoState = function(destinationState) {
    $state.go('registration.' + destinationState)
  }

  /*
   * submitRegistration
   * Submits user's info, via $scope.regInfo object, to PHP script that enters the info into the Wufoo database and the app's MySQL db
   * Pre: All properties of $scope.regInfo that hold info required by Wufoo or app db are defined with valid values
   * Post: Records in the Wufoo form and the app db have been created with this user's data
   */
  $scope.submitRegistration = function() {

    var personInfo_json = $scope.personInfo
    JSON.stringify(personInfo_json)

    var regInfo_json = $scope.regInfo
    JSON.stringify(regInfo_json)

    var emergencyContact1_json = $scope.emergencyContact1
    JSON.stringify(emergencyContact1_json)

    var emergencyContact2_json = $scope.emergencyContact2
    JSON.stringify(emergencyContact2_json)

    if ($scope.regInfo.paymentMethod === "credit" || $scope.regInfo.paymentMethod === "credit_donation") {
      var chargeSubmit = submitRegChargeToStripe($scope.regInfo.myPaymentToken, $scope.regInfo.paymentAmount, ($scope.personInfo.firstName + $scope.personInfo.lastName))

      chargeSubmit.then(function success(response) {
        $log.log("Stripe charge response: \n" + dump(response, 'none'))
      },
      function failure(error) {
        $log.log("Stipe request failed with status: " + error.status)

        switch (error.status) {
          case 402:
            $log.log("The charge was rejected by Stripe\n" + error.data)
          case 401:
            $log.log("Invalid Stripe API key\n" + error.data)
          case 400:
            $log.log("Idk, something went wrong with Stripe and that's all we know\n" + error.data)
        }
      })
    }

    // $http({
    //   method: "POST",
    //   url: "app/appServer/submitRegistrationToWufoo.php",
    //   params: {
    //     "personInfo" : personInfo_json,
    //     "regInfo" : regInfo_json,
    //     "emergencyContact1" : emergencyContact1_json,
    //     "emergencyContact2" : emergencyContact2_json
    //   }
    // }).then(function success(response) {
    //   var wufooResponseObj = response.data
    //
    //   if (!wufooResponseObj["Success"]) {
    //     $log.log("The Wufoo submission failed!! :(")
    //     // TODO: Handle failed submit to Wufoo by notifying directors that this person needs to be submitted manually
    //   }
    //   $log.log(response)
    //
    //   submitRegistrationToDb(personInfo_json, regInfo_json, emergencyContact1_json, emergencyContact2_json).then(function success(response) {
    //     $log.log(response)
    //   },
    //   function failure(error) {
    //     $log.log(error)
    //   })
    // })

  }

}])