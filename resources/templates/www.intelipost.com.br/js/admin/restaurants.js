function dashboardPage()
{
	handleResponseFunc = function(response)
	{
		if(response.data.length > 0)
		{
			for(i=0; i<response.data.length; i++)
			{
				isActive = response.data[i].status == 'ACTIVE';
				buildStatusIconProps(response.data[i], isActive);
			}
		}
	};

	callback = function()
	{
		paintTableRows();

		$('div[name=cnpjDisplayField]').each(function()
		{
			div = $(this);
			
			value = div.html();

			formated = '';

			for(i=0; i<value.length; i++)
			{
				formated += value.charAt(i);

				if(i == 1 || i == 4)
				{
					formated += '.';
				}
				else if(i == 7)
				{
					formated += '/';
				}
				else if(i == 11)
				{
					formated += '-';
				}
			}

			div.html(formated);
		});
	};

	loadSubPage('/api/get/restaurants', '#restaurantsTpl', 'Erro ao carregar os restaurantes.', handleResponseFunc, callback);
}

function loadRegisterPageItems(afterCallback)
{
	$.ajax('/api/get/restaurants')
		.done(function(response) 
		{
			if(response.resultCode == 'success' || response.resultCode == 'empty')
			{
				headquarterIdInput = $('#headquarterIdInput');

				for(i=0; i<response.data.length; i++)
				{
					headquarterIdInput.append($('<option>', {value: response.data[i].id, text: response.data[i].name}));
				}

				if(afterCallback != null) afterCallback();
			}
			else
			{
				alert('Erro ao carregar a lista de restaurantes: ' + response.messageCode);
			}
		})
		.fail(function() 
		{
			alert('Erro desconhecido ao carregar a lista de restaurantes.');
		})
	;

	$('#cnpjInput').mask('99.999.999/9999-99');

	validation.hookUpEvents();
	resetLinks();
}

function registerPage()
{
	render('#registerTpl', {mode:'register'} );
	loadRegisterPageItems();
	$('#registerTplTitle').html('Cadastrar novo restaurante');
	$('#registerSubmitInput').val('Cadastrar');
}

function editPage(idRestaurant)
{
	loadSubPage('/api/get/restaurant?idRestaurant=' + idRestaurant, '#registerTpl', 'Erro carregando página de edição de restaurante.', 
		function(response)
		{
			response.mode = 'edit';
		}, 
		function(response)
		{
			loadRegisterPageItems(function()
			{
				$("#headquarterIdInput > option").each(function() 
				{
					if(this.value == response.data.headquarterId)
					{
						this.selected = true;
					}
				});
			}); 
			$('#registerTplTitle').html('Editar restaurante'); 
			$('#registerSubmitInput').val('Editar');
		}
	);
}

function changePageImplFunction(subPage)
{
	if(subPage == 'cadastrar')
	{
		registerPage();
		currentLink = $('#registerLink');
	}
	else //if(subPage == 'dashboard')
	{
		dashboardPage();
		currentLink = $('#dashboardLink');
	}

	return currentLink;
}

function setImageId(idImage, urlImage)
{
	$('#idImageInput').val(idImage);
	isRegister = ($('#modeInput').val() == 'register');

	$.ajax({
			url: (isRegister ? '/api/add/restaurant' : '/api/update/restaurant'),
			data: $('#restaurantRegisterForm').serialize(),
			method: 'POST',
			statusCode: {
				200: function (response) {
					alert('Restaurante ' + (isRegister ? 'cadastrado' : 'atualizado') + ' com sucesso!');
					changeSubPage('dashboard', changePageImplFunction);
				},
				400: function (response) {
					alert('Algum dos campos possui formato inválido ou está ausente.');
				},
				403: function (response) {
					alert('Acesso negado.');
				},
				409: function (response) {
					alert('Este CNPJ já foi cadastrado.');
				},
				500: function (response) {
					alert('Erro desconhecido ao ' + (isRegister ? 'cadastrar' : 'atualizar') + ' restaurante.');
				}
			}
		})
	;
}

function setRestaurantStatus(idRestaurant, newStatus)
{
	var fillStruct = {};
	buildStatusIconProps(fillStruct, newStatus == 'enable');

	$.ajax(
		{
			url: '/api/' + fillStruct.actionParameter + '/restaurant',
			method: 'POST',
			data: { 'idRestaurant' : idRestaurant }
		})
		.done(function(response) {
			aTagId = '#iconToggle' + idRestaurant;

			aTag = $('#iconToggle' + idRestaurant);
			aTag.attr('onclick', 'JavaScript:setRestaurantStatus(' + idRestaurant + ',\'' + fillStruct.toggleParameter + '\');');
			aTag.attr('title', fillStruct.statusIconTitle);

			iTag = $(aTagId + " i");
			iTag.removeClass('fa-toggle-' + fillStruct.statusIconInverseValue);
			iTag.addClass('fa-toggle-' + fillStruct.statusIconValue);
		})
		.fail(function() {
			alert('Erro desconhecido ao tentar ' + (newStatus == 'enable' ? 'ativar' : 'desativar') + ' restaurantes.');
		})
	;
}

var validationStructArray = 
[
	{
		type: 'DEFAULT',
		input: "nameInput",
		validations: ["REQUIRED", "SIMPLE_NAME_PATTERN"],
		messages: ["O nome é obrigatório.", "Insira um nome válido."]
	},
	{
		type: 'DEFAULT',
		input: "cnpjInput",
		validations: ["REQUIRED", "CNPJ_PATTERN"],
		messages: ["O CNPJ é obrigatório.", "Insira um CNPJ válido."] 
	}
];

var submitOverrideFunction = function()
{
	$('#cnpjInputHidden').val($('#cnpjInput').val().replace(/[^\d]+/g,''));

	document.getElementById("imageUploadIframe").contentWindow.uploadImage();

	//waits for setIdImage
};

var validation = new Validation(htmlConfigJson, validationStructArray, "restaurantRegisterForm", submitOverrideFunction);

$(function() 
{
	setHash();

	changeSubPage(null, changePageImplFunction);

	rootPageLink = $('#restaurantsLink');
	rootPageLink.removeClass('nav-link');
	rootPageLink.addClass('disabled');

	$("#dashboardLink").click(function() 
	{
		changeSubPage('dashboard', changePageImplFunction);
	});

	$("#registerLink").click(function() 
	{
		changeSubPage('cadastrar', changePageImplFunction);
	});
});