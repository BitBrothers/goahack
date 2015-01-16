angular.module('GoaHack')
  .controller('UpdateProfileCtrl', function($scope, $rootScope, User, $alert, $location, $routeParams, $upload,
    ngProgress) {

    $scope.skill = [String];
    User.get({
        uslug: $routeParams.slug
      },
      function(user) {

        $scope.user = user;
        console.log($scope.user);
      });

    //  console.log($routeParams.slug);
    //  console.log($scope.skill);
    //$scope.employers=$scope.user.profile.employers;

    $scope.update = function() {
      User.update({
        name: $scope.user.profile.name,
        nameFull: $scope.user.profile.nameFull,
        employers: $scope.user.profile.employers,
        location: $scope.user.profile.location,
        website: $scope.user.profile.website,
        experience: $scope.user.profile.experience,
        occupation: $scope.user.profile.occupation,
        skills: $scope.user.profile.skills
      },
      function(data){
        $alert({
          content: 'Your profile was successfuly updated.',
          placement: 'right',
          type: 'success',
          duration: 5
        });
      },
      function(data){
        $alert({
          content: 'There was an error please try again later.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });

    };

    $scope.$watch('files', function() {
      // for (var i = 0; i < $scope.files.length; i++) {
        if ($scope.files[0].size > 500000) {
        $alert({
          content: 'Image cannot be more than 500KB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      } else {
        var file = $scope.files[0];
        console.log($scope.files);
        $scope.upload = $upload.upload({
          url: '/api/user/upload', // upload.php script, node.js route, or servlet url
          method: 'PUT',
          //headers: {'Authorization': 'xxx'}, // only for html5
          //withCredentials: true,
          //data: {myObj: $scope.myModelObj},
          file: file, // single file or a list of files. list is only for html5
          //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
          //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
          // could be a list of names for multiple files (html5). Default is 'file'
          //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData. 
          // See #40#issuecomment-28612000 for sample code

        }).progress(function(evt) {
          ngProgress.start();
          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
          ngProgress.complete();
          console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
          $alert({
            content: 'Your image was successfuly updated.',
            placement: 'right',
            type: 'success',
            duration: 5
          });
        }).error(function(data) {
          console.log(data);
          $alert({
            content: 'There was an error please try again later.',
            placement: 'right',
            type: 'danger',
            duration: 5
          });
        });
        //.error(...)
        //.then(success, error, progress); // returns a promise that does NOT have progress/abort/xhr functions
        //.xhr(function(xhr){xhr.upload.addEventListener(...)}) // access or attach event listeners to 
        //the underlying XMLHttpRequest
        // }
        /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request. 
           Note that the whole file will be loaded in browser first so large files could crash the browser.
           You should verify the file size before uploading with $upload.http().
        */
        // $scope.upload = $upload.http({...})  // See 88#issuecomment-31366487 for sample code.
      };
    });

  });
