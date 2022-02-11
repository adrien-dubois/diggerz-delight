import $ from 'jquery';
global.$ =  $;

$(function(){

    $('.close-btn').on('click', function(){
        $('.success').addClass("hide");
        $('.success').removeClass("show");
    });
    $('.success')
    setTimeout(function(){
        $('.success').addClass("hide");
        $('.success').removeClass("show");
    }, 5000);


    $('.close-btn').on('click', function(){
        $('.danger').addClass("hide");
        $('.danger').removeClass("show");
    });
    $('.danger')
    setTimeout(function(){
        $('.danger').addClass("hide");
        $('.danger').removeClass("show");
    }, 5000);


});