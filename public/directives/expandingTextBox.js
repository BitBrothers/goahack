angular.module('GoaHack')
    .directive("expandingTextBox", function(){
        return function(scope, element, attr){
          var elInput = element.find('input');
          var elDummy = element.find('span');
          var inputText = elInput.val();
          elDummy.html(inputText);
          console.log("Working");
          elInput.bind("keydown keyup", function(){
            var inputText = elInput.val();
            elDummy.html(inputText);
            elInput.css('width', (elDummy[0].offsetWidth + 30) + 'px');
          });
            
        }
    });