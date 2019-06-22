 let music = {
     changeClass: function(target, id) {
         console.log('chaneg');
         let className = $(target).attr('class');
         let ids = document.getElementById(id);
         (className === 'on') ?
         $(target).removeClass('on').addClass('off'): $(target).removeClass('off').addClass('on');
         (className === 'on') ?
         ids.pause(): ids.play();
     },
     play: function() {
         document.getElementById('media').play();
     }
 };