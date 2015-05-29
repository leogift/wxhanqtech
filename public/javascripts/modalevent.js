/*******************************************************************************************
Filename    : modalevent.js
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
$("#mbtnSuperDeleteMember").click(function(){
    
    var id = $(".modal-body #memberId").val();
    location.href='/deletesysrecord/:' + id;
    //location.href='/' + str;
    //window.open('http://www.baidu.com'); //this is open a new page
});


$(document).on("click", ".tryDelete", function(){
    var id = $(this).data('id');
    $(".modal-body #memberId").val(id);
});

$("#mbtnTutorDeleteMember").click(function(){
    var id = $(".modal-body #memberId").val();
    location.href='/delstudent/:' + id;
});

$("#mbtnSuperDeleteSyslog").click(function(){
    var id = $(".modal-body #memberId").val();
    location.href='/super_deletesyslog/:' + id;
});

$("#mbtnTutorDeleteSyslog").click(function(){
    var id = $(".modal-body #memberId").val();
    location.href='/tutor_deletesyslog/:' + id;
});

$("#mbtnSuperRestoreSyslog").click(function(){
    var id = $(".modal-body #memberId").val();
    if(id=='removedatabase')
        location.href='/super_removedatabase';
    else
        location.href='/dodbrestore/:' + id;
});


