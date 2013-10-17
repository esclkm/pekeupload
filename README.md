pekeupload
==========

Моя модификация html5 загрузчика


Редактировать ее не буду , и трогать тожже....
просто чтобы было

инициализация, пример:

		<script type="text/javascript">
		$(document).ready(function() {
			$('head').append('<link href="{PHP.cfg.plugins_dir}/mavatars/js/pekeupload.css" type="text/css" rel="stylesheet" />');
			$("#mavatar_file").pekeUpload({ url:'{FILEUPLOAD_URL}', 
				btnText:'{PHP.L.mavatar_form_addfiles}',
				onFileSuccess: function(file,data){
					var decoded = $('<textarea/>').html(data.form).val();
					$('.uploadedfiles').append(decoded);
            }
			});
//upload.php?r=mavatars&ext=page&cat=ceiling&code=96
			//url:'{FILEUPLOAD_URL}',
			});
		</script>
