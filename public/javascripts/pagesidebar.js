/*******************************************************************************************
Filename    : pagesidebar.js
Summary     : JQuery, add page sidebar click event
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/

//
// super sidebar menu click event handler
//
$("#super_sidebar_sysinit").click(function(){
    location.href='/super_sysinit';
    //window.open('http://www.baidu.com'); //this is open a new page
});

$("#super_sidebar_viewprjs").click(function(){
    location.href='/super_viewprjs';
});

$("#super_sidebar_viewprjs").click(function(){
    location.href='/super_viewprjs';
});

$("#super_sidebar_addnewstudent").click(function(){
    location.href='/super_addnewstudent';
});

$("#super_sidebar_viewsyslog").click(function(){
    location.href='/super_viewsyslog';
});

$("#super_sidebar_sysdatarestore").click(function(){
    location.href='/super_sysdatadump';
});

$("#super_sidebar_sysdatarecovery").click(function(){
    location.href='/super_sysdatarestore';
});

$("#super_sidebar_modifypassword").click(function(){
    location.href='/super_modifyselfpassword';
});

$("#super_sidebar_logout").click(function(){
    location.href='/super_logout';
});

//
// tutor sidebar menu click event handler
//
$("#tutor_sidebar_viewstudents").click(function(){
    location.href='/tutor_viewstudents';
});

$("#tutor_sidebar_modifyselfinfo").click(function(){
    location.href='/tutor_modifyselfinfo';
});

$("#tutor_sidebar_modifyselfpass").click(function(){
    location.href='/tutor_modifyselfpass';
});

$("#tutor_sidebar_viewworklog").click(function(){
    location.href='/tutor_viewworklog';
});

$("#tutor_sidebar_queryworklog").click(function(){
    location.href='/tutor_queryworklog';
});

$("#tutor_sidebar_logout").click(function(){
    location.href='/tutor_logout';
});

//
// student sidebar menu click event handler
//
$("#student_sidebar_modifyselfinfo").click(function(){
    location.href='/student_modifyselfinfo';
});

$("#student_sidebar_modifyselfpass").click(function(){
    location.href='/student_modifyselfpass';
});

$("#student_sidebar_viewworklog").click(function(){
    location.href='/student_viewworklog';
});

$("#student_sidebar_logout").click(function(){
    location.href='/student_logout';
});



