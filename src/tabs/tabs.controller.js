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
        vm.getAddedQuizzes = getAddedQuizzes
        vm.getCorrectOption = getCorrectOption
        vm.getUserMessages = getUserMessages
        vm.sendMessage = sendMessage
        
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
        	var user = vm.user
        	
        	var quizDetails = {};        	
        	quizDetails['display_image_link'] = '';
        	quizDetails['language'] = language;
        	quizDetails['materials_link'] = material;
        	quizDetails['name'] = quizname;
        	quizDetails['user'] = user;
        	        	
        	$http.put('https://vroom-83bc4.firebaseio.com/quiz_categories/' + category + '/' + quizId + '.json', JSON.stringify(quizDetails))
        		.then(function(response) {

        		}, function(response) {
        			alert ('Error posting quiz details!');
        		});
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
        	
        	$http.put('https://vroom-83bc4.firebaseio.com/' + quizId + '.json', JSON.stringify(questions))
        		.then(function(response) {
        		
        		}, function(response) {
        			alert ('Error posting question details!');
        		});
        	
        }
        
        function sleep(ms) {
        	  return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        function getCorrectOption(ans) {
        	if (ans == "option1") {
        		return "a";
        	}
        	if (ans == "option2") {
        		return "b";
        	}
        	if (ans == "option3") {
        		return "c";
        	}
        }
        
        function getAddedQuizzes() {
        	var user = vm.user;
        	
        	console.log(JSON.stringify(vm.all_quiz_details));
        	
        	$http.get('https://vroom-83bc4.firebaseio.com/quiz_categories.json/')
    		.then(function(responseData) {
    			console.log('Response of getting quiz details: ' + JSON.stringify(responseData));
    			var response = responseData['data'];
    			
    			vm.all_quiz_details = []
    			for (var category in response) {
    				console.log(category);
    				if (response.hasOwnProperty(category)) {
    					var quizzes = response[category];
    					for (var quizId in quizzes) {
    						console.log(quizId);
    						if (quizzes.hasOwnProperty(quizId)) {
    							var quiz = quizzes[quizId];
    							console.log(quiz['user'] + "----" + user);
    							if (quiz['user'] === user) {
    								console.log('Getting questions..');
    								$http.get('https://vroom-83bc4.firebaseio.com/' + quizId + '.json')
    									.then((function(category2, user2, quizId2, language2, display_image_link2, material2, quizname2) {
    										console.log('into top function');
    										return function(response2Data) {
    											console.log('into below function');
    	    				        			console.log('Response of getting questions: ' + JSON.stringify(response2Data));
    	    				        			var response2 = response2Data['data'];
    	    				        			    				        			
    	    				        			var quiz_details = {};
    	    				        			quiz_details['category'] = category2;
    	    				        			quiz_details['user'] = user2;
    	    				        			quiz_details['quizId'] = quizId2;
    	    				        			quiz_details['language'] = language2;
    	    				        			quiz_details['display_image_link'] = display_image_link2;
    	    				        			quiz_details['material'] = material2;
    	    				        			quiz_details['quizname'] = quizname2;
    	    				        			quiz_details['questions'] = response2;
    	    				        			
    	    				        			console.log('Adding ' + JSON.stringify(quiz_details) + ' to all_quiz_details..');
    	    				        			vm.all_quiz_details.push(quiz_details);
    										}
    									})(category, user, quizId, quiz['language'], quiz['display_image_link'], quiz['materials_link'], quiz['name']));
    								
//    				        		.then(function(response2Data) {
//
//    				        		}, function(response) {
//    				        			alert ('Error getting list of questions!');
//    				        		});    								
    							}
    						}
    					}
    				}
    			}
    			console.log(JSON.stringify(vm.all_quiz_details));
    			sleep(5000);
    			console.log(JSON.stringify(vm.all_quiz_details));
//    			alert(JSON.stringify(vm.all_quiz_details));
//    			vm.all_quiz_details = all_quiz_details;
    		}, function(response) {
    			alert ('Error getting quiz details!');
    		});
        }
        
        function getUserMessages() {
        	getReceivedMessages();
        	getSentMessages();
        }
        
        function getReceivedMessages() {
        	var user = vm.user;
        	console.log(JSON.stringify(vm.received_messages));
        	$http.get('https://vroom-83bc4.firebaseio.com/messages/' + user + '/received.json/')
    			.then(function(responseData) {
    				var response = responseData['data'];
    				console.log(JSON.stringify(response));
    				vm.received_messages = []
        			for (var otherUser in response) {
        				if (response.hasOwnProperty(otherUser)) {
        					var messages = response[otherUser];
        					for (var messageKey in messages) {
        						if (messages.hasOwnProperty(messageKey)) {
        							var message = messages[messageKey]; 
            						
        							var messageInfo = {};
            						messageInfo['user'] = otherUser;
            						messageInfo['message'] = message;
            						console.log('Received message: ' + JSON.stringify(messageInfo));
            						vm.received_messages.push(messageInfo);
        						}
        					}
        				}
        			}
    				
    			});
        }
        
        function getSentMessages() {
        	var user = vm.user;
        	console.log(JSON.stringify(vm.sent_messages));
        	$http.get('https://vroom-83bc4.firebaseio.com/messages/' + user + '/sent.json/')
    			.then(function(responseData) {
    				var response = responseData['data'];
    				console.log(JSON.stringify(response));
    				vm.sent_messages = []
        			for (var otherUser in response) {
        				if (response.hasOwnProperty(otherUser)) {
        					var messages = response[otherUser];
        					for (var messageKey in messages) {
        						if (messages.hasOwnProperty(messageKey)) {
        							var message = messages[messageKey]; 
            						
        							var messageInfo = {};
            						messageInfo['user'] = otherUser;
            						messageInfo['message'] = message;
            						console.log('Sent message: ' + JSON.stringify(messageInfo));
            						vm.sent_messages.push(messageInfo);
        						}
        					}
        				}
        			}
    				
    			});
        }
        
        function sendMessage() {
        	var user = vm.user;
        	var otherUser = vm.userToSend;
        	var messageKey = 'key' + Math.floor((Math.random() * 100000) + 1); // Generate random whole number between 1 and 100000
        	
        	var message = vm.messageToSend;
        	$http.put('https://vroom-83bc4.firebaseio.com/messages/' + user + '/sent/' + otherUser + '/' + messageKey + '.json', JSON.stringify(message))
	    		.then(function(response) {
	
	    		}, function(response) {
	    			alert ('Error sending message to the user!');
	    		});
        	$http.put('https://vroom-83bc4.firebaseio.com/messages/' + otherUser + '/received/' + user + '/' + messageKey + '.json', JSON.stringify(message))
	    		.then(function(response) {
	
	    		}, function(response) {
	    			alert ('Error sending message to the user!');
	    		});
        	
        	vm.messageToSend = '';
        	vm.userToSend = '';
        	
        	alert('Message sent successfully!');
        	
        }

        function setTab(newTab){
          vm.tab = newTab;
        };

        function isSet(tabNum){
          return vm.tab == tabNum;
        };

        function loadCurrentUser() {
        	vm.user = 'pandian';
//            UserService.GetByUsername($rootScope.globals.currentUser.username)
//                .then(function (user) {
//                    vm.user = user;
//                });
        }
    }

})();