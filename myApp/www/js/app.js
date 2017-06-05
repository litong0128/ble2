// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('con', function($scope,$ionicPopup, $timeout) {
    //$scope.cost = 123;
    $scope.firstName = "John",
    $scope.lastName = "Doe"
    $scope.myVar = false;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };

    $scope.scan = function() {
        //$scope.alertShow("12345");
        deviceList.innerHTML = '';
        ble.startScan([], 
        function(device) { 
          $scope.alertShow("success:"+JSON.stringify(device));
          $scope.onDiscoverDevice(device);
        }
        ,function() { $scope.alertShow("fail");});

        setTimeout(ble.stopScan,
            15000,
            function() { $scope.alertShow("stop success");},
            function() { $scope.alertShow("stop fail");}
        );
        
    };

    $scope.alertShow = function(massage) {
      var alertPopup = $ionicPopup.alert({
            title: 'device',
            template: massage
      });
    }

    //展现蓝牙设备
    $scope.onDiscoverDevice = function(device) {
      var listItem = document.createElement('div');
          html = '<b>' + device.name + '</b><br/>' +
              'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
              device.id;

      listItem.dataset.deviceId = device.id;
      listItem.setAttribute("id",device.id);
      //$scope.alertShow(listItem.getAttribute("id"));
      //listItem.setAttribute("ng-click","connect(this.id)");
      listItem.innerHTML = html;
      deviceList.appendChild(listItem);

      //绑定监听点击时候链接
      listItem.addEventListener("click", function(){
        $scope.connect(this.id);
      });
      
      //定义发送按钮
      sendButtenUp = document.createElement('button');
      sendButtenUp.innerHTML = "up";
      deviceList.appendChild(sendButtenUp);
      sendButtenUp.addEventListener("click", function(){
        $scope.write(device.id,"0x01");
      });

      sendButtenDown = document.createElement('button');
      sendButtenDown.innerHTML = "down";
      deviceList.appendChild(sendButtenDown);
      sendButtenDown.addEventListener("click", function(){
        $scope.write(device.id,"0x02");
      });

      sendButtenLeft = document.createElement('button');
      sendButtenLeft.innerHTML = "left";
      deviceList.appendChild(sendButtenLeft);
      sendButtenLeft.addEventListener("click", function(){
        $scope.write(device.id,"0x03");
      });

      sendButtenRight = document.createElement('button');
      sendButtenRight.innerHTML = "right";
      deviceList.appendChild(sendButtenRight);
      sendButtenRight.addEventListener("click", function(){
        $scope.write(device.id,"0x04");
      });

    }


    $scope.connect = function(deviceId) {
      //$scope.alertShow("start connecting");
      
      ble.connect(deviceId, 
        function() {$scope.alertShow("connected!");}, 
        function() {$scope.alertShow("connect fail!");});
    }

    $scope.write = function(deviceId,sdata) {
      $scope.alertShow(deviceId+'|'+sdata);
      var data = new Uint8Array(1);
      data[0] = sdata;
      ble.write(deviceId, "FFE0", "FFE1", data.buffer, 
        function() {$scope.alertShow("send success!");}, 
        function() {$scope.alertShow("send fail!");});
    }
});