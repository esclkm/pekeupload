/*
 *  PekeUpload 1.0.6 - jQuery plugin
 *  written by Pedro Molina
 *  http://www.pekebyte.com/
 *
 *  Copyright (c) 2013 Pedro Molina (http://pekebyte.com)
 *  Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL (GPL-LICENSE.txt) licenses.
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */
(function($) {

	$.fn.pekeUpload = function(options) {

		// default configuration properties
		var defaults = {
			onSubmit: false,
			btnText: "Browse files...",
			url: "upload.php",
			data: null,
			multi: true,
			showFilename: true,
			showPercent: true,
			showErrorAlerts: true,
			allowedExtensions: "",
			invalidExtError: "Invalid File Type",
			maxSize: 0,
			sizeError: "Size of the file is greather than allowed",
			onFileError: function(file, error) {
			},
			onFileSuccess: function(file, data) {
			}
		};

		var options = $.extend(defaults, options);

		//Main function
		var obj;
		var file = new Object();
		var fileinput = this;
		this.each(function() {
			obj = $(this);
			var html = '<button class="button large special">' + options.btnText + '</button><div class="pekecontainer"></div>';
			obj.after(html);
			obj.hide();
			//Event when clicked the newly created link
			obj.next('button').click(function() {
				obj.click();
				return false;
			});
			//Event when user select a file
			obj.change(function() {
				file.name = obj.val().split('\\').pop();
				file.size = (obj[0].files[0].size / 1024) / 1024;
				if (validateresult() == true) {
					if (options.onSubmit == false) {
						UploadFile();
					}
					else {
						obj.next('button').next('div').prepend('<br /><span class="filename">' + file.name + '</span>');
						obj.parent('form').bind('submit', function() {
							obj.next('button').next('div').html('');
							UploadFile();
						});
					}
				}
			});
		});
		//Function that uploads a file
		function UploadFile() {
			var error = true;
			var htmlprogress = '<div class="file"><div class="filename"></div><div class="progress-pekeupload"><div class="bar-pekeupload pekeup-progress-bar" style="width: 0%;"><span></span></div></div></div>';
			var uploadobj;
			obj.next('button').next('div').prepend(htmlprogress);
			
			uploadobj = obj.next('button').next('div').find('.file:first');
			
			var formData = new FormData();
			formData.append(obj.attr('name'), obj[0].files[0]);
			formData.append('data', options.data);
			$.ajax({
				url: options.url,
				type: 'POST',
				data: formData,
			//	dataType: 'json',
				success: function(data) {
					var percent = 100;
					uploadobj.find('.pekeup-progress-bar:first').width(percent + '%');
					uploadobj.find('.pekeup-progress-bar:first').text(percent + "%");
					var response = jQuery.parseJSON(data);
					if (typeof response == 'object') {
						data = response;
					} else {
						if (data == 1)	data = {success: "1"};
						else data = {success: "0", error: data};
					}
					if (data == 1 || data.success == 1) {
						options.multi == false && obj.attr('disabled', 'disabled');
						uploadobj.remove();
						options.onFileSuccess(file, data);
					}
					else {
						options.onFileError(file, data);
						uploadobj.remove();

						if (options.showErrorAlerts == true) {
							obj.next('button').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close" data-dismiss="alert">&times;</button> ' + data.error + '</div>');
							closenotification();
						}
						error = false;
					}
				},
				xhr: function() {  // custom xhr
					myXhr = $.ajaxSettings.xhr();
					if (myXhr.upload) { // check if upload property exists
						myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // for handling the progress of the upload
					}
					return myXhr;
				},
				cache: false,
				contentType: false,
				processData: false
			});
			return error;
		}
		//Function that updates bars progress
		function progressHandlingFunction(e) {
			if (e.lengthComputable) {
				var total = e.total;
				var loaded = e.loaded;
				if (options.showFilename == true) {
					obj.next('button').next('div').find('.file').first().find('.filename:first').text(file.name);
				}
				if (options.showPercent == true) {
					var percent = Number(((e.loaded * 100) / e.total).toFixed(2));
					obj.next('button').next('div').find('.file').first().find('.pekeup-progress-bar:first').width(percent + '%');
				}
				obj.next('button').next('div').find('.file').first().find('.pekeup-progress-bar:first').html('<center>' + percent + "%</center>");
			}
		}
		//Validate master
		function validateresult() {
			var canUpload = true;
			if (options.allowedExtensions != "") {
				var validationresult = validateExtension();
				if (validationresult == false) {
					canUpload = false;
					if (options.showErrorAlerts == true) {
						obj.next('button').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close">&times;</button> ' + options.invalidExtError + '</div>');
						closenotification();
					}
					options.onFileError(file, options.invalidExtError);
				}
				else {
					canUpload = true;
				}
			}
			if (options.maxSize > 0) {
				var validationresult = validateSize();
				if (validationresult == false) {
					canUpload = false;
					if (options.showErrorAlerts == true) {
						obj.next('button').next('div').prepend('<div class="alert-pekeupload"><button type="button" class="close" data-dismiss="alert">&times;</button> ' + options.sizeError + '</div>');
						closenotification();
					}
					options.onFileError(file, options.sizeError);
				}
				else {
					canUpload = true;
				}
			}
			return canUpload
		}
		//Validate extension of file
		function validateExtension() {
			var ext = obj.val().split('.').pop().toLowerCase();
			var allowed = options.allowedExtensions.split("|");
			if ($.inArray(ext, allowed) == -1) {
				return false;
			}
			else {
				return true;
			}
		}
		//Validate Size of the file
		function validateSize() {
			if (file.size > options.maxSize) {
				return false;
			}
			else {
				return true;
			}
		}
		function closenotification() {
			obj.next('button').next('div').find('.alert-pekeupload').click(function() {
				$(this).remove();
			});
		}
	};

})(jQuery);