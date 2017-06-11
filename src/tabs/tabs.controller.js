(function () {
    'use strict';

    angular
        .module('app')
        .controller('TabController', TabController);

    TabController.$inject = ['UserService', '$rootScope', '$http'];
    function TabController(UserService, $rootScope, $http) {
        var vm = this;
        vm.user = null;
        vm.tab = 1;
        
        loadCurrentUser();
        
        vm.isSet = isSet
        vm.setTab = setTab
        vm.submitAddQuizForm = submitAddQuizForm
        vm.updateNumQuestions = updateNumQuestions
        
        function updateNumQuestions() {
        	var N = vm.numquestions 
        	vm.questionnumbers_temp = Array.apply(null, {length: N}).map(Number.call, Number)
        	vm.questionnumbers = vm.questionnumbers_temp.map( function(value) { 
        	    return value + 1; 
        	} );
//        	alert(vm.questionnumbers)
        }
        
        function submitAddQuizForm() {
        	addQuizDetails();
        	addQuestions();
        	alert('Quiz added successfully. Thanks for adding!');
        }
        
        /*
         * Private methods
         */
        function addQuizDetails() {
        	var category = vm.category;
        	var language = vm.language;
        	var material = vm.material;
        	var category = vm.category;
        	var quizname = vm.quizname;
        	var quizId = 'quiz' + Math.floor((Math.random() * 100000) + 1); // Generate random whole number between 1 and 100000
        	vm.quizId = quizId;
        	
        	var quizDetails = {};        	
        	quizDetails['display_image_link'] = '';
        	quizDetails['language'] = language;
        	quizDetails['materials_link'] = material;
        	quizDetails['name'] = quizname;
        	
        	var postBody = {};
        	postBody[quizId] = quizDetails;
        	
        	$http.put('https://vroom-83bc4.firebaseio.com/quiz_categories/' + category + '.json', JSON.stringify(postBody)).then(function(response) {
//        		alert(response.data);
        	}, function(response) {
        		alert ('Error posting quiz details!');
        	});
//        	alert(JSON.stringify(postBody));
        }
        
        function addQuestions() {
        	var quizId = vm.quizId;
        	var N = vm.numquestions 
        	var questionnumbers = Array.apply(null, {length: N}).map(Number.call, Number)
        	
        	var questions = []
        	for (var i = 0; i < questionnumbers.length; i++) {
        		var current_question = {}
        		var ind = questionnumbers[i];

        		var question = document.getElementById("question_" + ind).value;
        		current_question["question_text"] = question;

        		for (var option = 1; option <= 3; option++) {
        			current_question["option" + option] = document.getElementById("ans_" + ind + "_" + option).value; 
        			if (document.getElementById("radio_" + ind + "_" + option).checked) {
        				current_question["answer"] = "option" + option
        			}
        		}
        		questions.push(current_question);
        	}
        	
        	$http.put('https://vroom-83bc4.firebaseio.com/' + quizId + '.json', JSON.stringify(questions)).then(function(response) {
//        		alert(response.data);
        	}, function(response) {
        		alert ('Error posting question details!');
        	});
        	
//        	alert(JSON.stringify(questions));
        
//        	alert('submit');
        }
        
        function setTab(newTab){
          vm.tab = newTab;
        };

        function isSet(tabNum){
          return vm.tab == tabNum;
        };

        function loadCurrentUser() {
        	vm.user = 'Pandian';
//            UserService.GetByUsername($rootScope.globals.currentUser.username)
//                .then(function (user) {
//                    vm.user = user;
//                });
        }
    }

})();