function uploadImage(type)
{
	if(document.getElementById('fileInput').value == '')
	{
		window.parent.setImageId(null);
	}
	else
	{
		if(checkFile())
		{
			imageForm.submit();
		}
	}
}

function checkFile()
{
	input = document.getElementById('fileInput');

	if (!window.FileReader || !input.files) 
	{
		alert('Não foi possível medir o tamanho do arquivo neste navegador.');

		return true;
	}

	file = input.files[0];

	if(file.size >= 2097152)
	{
		alert("O arquivo \"" + file.name + "\" ultrapassa o limite de tamanho de permitido (2MB).");

		return false;
	}

	return true;
}

document.addEventListener('DOMContentLoaded', function() 
{
	idImageInput = document.getElementById('idImageInput');

	if(idImageInput != null)
	{
		idImage = idImageInput.value;

		if(idImage != '')
		{
			window.parent.setImageId(idImage, document.getElementById('urlImageInput').value);
		}
	}
}, false);