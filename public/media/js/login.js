var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
           $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "用户名为必填项."
	                },
	                password: {
	                    required: "密码为必填项."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-error', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            //这里注释掉，不然可能相当于重载了系统的from submit，总是GET index.html
	            //submitHandler: function (form) {
	            //    window.location.href = "index.html";
	            //}
	        });

	        // $('.login-form input').keypress(function (e) {
	        //     // if (e.which == 13) {
	        //     //     if ($('.login-form').validate().form()) {
	        //     //         window.location.href = "index.html";
	        //     //     }
	        //     //     return false;
	        //     // }
	        //     return true;
	        // });

	        
        }

    };

}();