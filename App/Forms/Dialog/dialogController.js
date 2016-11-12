"use strict";
app.controller('MainCtrl', function ($scope, $http, $log, $location, $rootScope,  spFormFactory, textAngularManager) {

    function init(){
        
        if($scope.formMode == 'New'){
            $scope.setDefaultSteps();
        }
        else {
            $scope.steps = angular.fromJson($scope.f.steps.Value);
            $scope.settings = angular.fromJson($scope.f.settings.Value);
            if($scope.settings == null){
                $scope.settings = {};
            }
            if ($scope.settings.collapseSteps == null){
                $scope.settings.collapseSteps = false;
            }

            if($scope.formMode == 'View'){
                $scope.stepsHistory = [$scope.steps[0]];
                $scope.stepsHistory2 = [
                    {
                        "title": $scope.f.Title.Value,
                        "id": "Root",
                        "options": $scope.steps[0].options
                    }
                ]
            }
        }
    }// End of init()


    spFormFactory.initialize($scope, 'Dialogs').then(init);
    $scope.calendarFormat = 'dd-MMMM-yyyy';
    $scope.userId = _spPageContextInfo.userId;
    $scope.selectedItem = {
        value: 0,
        label: ''
    };

    $scope.addStep = function(){
        var step = {
                id:1,
                header:'header1',            
                body:'body 1',
                options:[{title:'option 1',id:2},{title:'option 2',id:3}]
            };
            
        $scope.steps.push(step) ;
    };

    $scope.addOption = function(step, option){
            step.options.push({title:'type option text',id:0});
    };

    $scope.deleteStep = function(step){
        var index = $scope.steps.indexOf(step);
        $scope.steps.splice(index, 1)
    }

    $scope.deleteOption = function(step, option){
        var index = step.options.indexOf(step);
        step.options.splice(index, 1);
    }

    $scope.unselectAll = function(){
        
        $scope.steps.forEach(function(step){
            console.log(step.title);
            step.options.forEach(function(option){
                console.log(option.title);
                option.selected = false;
            });
        });
    }

    $scope.selectOption = function(step, option, $index, $event){
        var currentOptionSelected = option.selected;

        for(var i =0; i< step.options.length;i++){
            step.options[i].selected = false;
        }

        if(currentOptionSelected){
            option.selected = false;
            if($index!=0){
                $scope.stepsHistory =  $scope.stepsHistory.slice(0, $index); 
            }
            else{
                $scope.stepsHistory =  $scope.stepsHistory.slice(0, 1); 
            }
        }
        else{
            option.selected = true;
            var nextStep = $scope.getStepById(option.id);
            $scope.stepsHistory.length=$index+1;
            $scope.stepsHistory.push(nextStep);
            $scope.stepsHistory.length=$index+2;
            if($scope.settings.collapseSteps){
                $($event.target).closest('div').hide();
            }
        }
    }

    $scope.appliedClass = function(option) {
    if (option.selected == true) {
        return "active";
    } else {
        return ""; // Or even "", which won't add any additional classes to the element
    }
}

    $scope.getStepById = function(stepId){
        for (var i=0; i<$scope.steps.length;i++){
            if($scope.steps[i].id == stepId){
                return $scope.steps[i];
            }
        }
    }

    $scope.setDefaultSteps = function(){
       $scope.settings = {};
       $scope.settings.collapseSteps = false;
       $scope.steps = [];
       $scope.steps = [
           {
               id:1,
               header:'header1',               
               body:'body 1',
               options:[{title:'option 1',id:2},{title:'option 2',id:3}]
           },
           {
               id:2,
               header:'header2',
               body:'body 2',
               options:[{title:'option 1',id:3},{title:'option 2',id:4}]
           },
           {
               id:3,
               header:'header3',
               body:'body 3',
               options:[{title:'option 1',id:3},{title:'option 2',id:4}]
           }
       ];
    }

    $scope.toggleHeader = function($event){
        console.log($event.target);
        $($event.target).next().slideToggle();
    }

    $scope.saveWithCopy = function(){
        $scope.f.steps.Value = JSON.stringify($scope.steps, null, 2);
        $scope.f.settings.Value = JSON.stringify($scope.settings, null, 2);
        $scope.save();
    }


    //TESTS
     //test tree model 1
    $scope.stepsHistory2 = [{
        "title": "User",
        "id": "role1",
        "options": [{
          "title": "subUser1",
          "id": "role11",
          "options": []
        }, {
          "title": "subUser2",
          "id": "role12",
          "options": [{
            "title": "subUser2-1",
            "id": "role121",
            "options": [{
              "title": "subUser2-1-1",
              "id": "role1211",
              "options": []
            }, {
              "title": "subUser2-1-2",
              "id": "role1212",
              "options": []
            }]
          }]
        }]
      },

      {
        "title": "Admin",
        "id": "role2",
        "options": []
      },

      {
        "title": "Guest",
        "id": "role3",
        "options": []
      }
    ];

});