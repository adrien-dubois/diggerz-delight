import $ from 'jquery';
global.$ =  $;

$(function(){

    $('.options-02 a').on('click', function(){
        $('form').animate({
            height: "toggle", opacity: "toggle"
        }, "slow");
    });

});