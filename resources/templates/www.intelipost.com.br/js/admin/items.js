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
				response.data[i].value = formatPrice(response.data[i].value);
			}
		}
	};

	loadSubPage('/api/get/menu/items', '#itemsTpl', 'Erro ao carregar os itens de menu.', handleResponseFunc, paintTableRows);
}

function formatPrice(value)
{
	if(isNaN(value))
	{
		array = value.match(/[0-9]+/g);
		value = '';
		if(array != null && array.length > 0)
		{
			for(i=0; i<array.length; i++)
			{
				if(array[i] != '0')
				{
					value += array[i];
				}
			}
		}

		if(value.length > 0)
		{
			if(value.length <= 2)
			{
				value = '0,' + (value.length == 1 ? '0' : '') + value;
			}
			else if(value.length > 2)
			{
				splitIndex = value.length - 2;
				value = value.substring(0, splitIndex) + ',' + value.substring(splitIndex, value.length);
			}

			value = value;
		}
	}
	else
	{
		strValue = value.toString();
		if(strValue.match(/[0-9]+\.[0-9]+/))
		{
			value = strValue.replace('\.',',') + '0';
		}
		else 
		{
			value = strValue + ',00';
		}
	}

	return value;
}

function formatDiscountPercentage(value)
{
	number = new Number(value);
	if(number <= 0) return '';
	if(number > 100) return 100;
	return number;
}

function showComboModal(checkboxInput)
{
	modalDiv = $('#modalDiv');

	modalDiv.removeClass('hidden');
	modalDiv.addClass('displaying');

	$('#closeModal').click(function() 
	{
		modalDiv.removeClass('displaying');
		modalDiv.addClass('hidden');
	});
}

function registerPageCommonConfigs()
{
	priceInput = $('#priceInput');
	priceInput.keyup(function(event){
		value = formatPrice(priceInput.val());
		priceInput.val((value != '' ? 'R$ ' + value : ''));
		$('#priceInputHidden').val(value.replace(/,/g, '.'));
	});
	$('#comboEditButton').click(function() 
	{
		showComboModal($(this));
	});

	resetLinks();
	validation.hookUpEvents();
}

function registerPage()
{
	render('#registerTpl', {mode:'register'} );
	$('#registerTplTitle').html('Cadastrar novo item');
	$('#registerSubmitInput').val('Cadastrar');
	registerPageCommonConfigs();
}

function editPage(idMenuItem)
{
	loadSubPage('/api/get/menu/item?idMenuItem=' + idMenuItem, '#registerTpl', 'Erro carregando página de edição de item.', 
		function(response)
		{
			response.mode = 'edit';
			response.data.value = formatPrice(response.data.value);
		}, 
		function(response)
		{
			$('#registerTplTitle').html('Editar item'); 
			$('#registerSubmitInput').val('Editar');
			registerPageCommonConfigs();
			$('#priceInputHidden').val(response.data.value.replace(/,/g, '.'));
		}
	);
}

function updateFinalValue(idMenuItem)
{
	$.ajax({
		url: ('/api/get/menu/item'),
		data: 'idMenuItem=' + idMenuItem,
		method: 'GET',
		statusCode: {
			200: function (response) {
				$('#finalValue' + idMenuItem).html(formatPrice(response.data.finalValue));
			},
			400: function (response) {
				alert('Erro ao recuperar o valor com desconto.');
			},
			403: function (response) {
				alert('Acesso negado.');
			},
			500: function (response) {
				alert('Erro desconhecido ao recuperar o valor com desconto.');
			}
		}
	});
}

function discountsPage()
{
	handleResponseFunc = function(response)
	{
		if(response.data.length > 0)
		{
			for(i=0; i<response.data.length; i++)
			{
				response.data[i].value = formatPrice(response.data[i].value);
				response.data[i].finalValue = formatPrice(response.data[i].finalValue);
				
				if(response.data[i].discount != null)
				{
					if(response.data[i].discount == 0)
					{
						delete response.data[i].discount;
					}
					else
					{
						response.data[i].discount = String(response.data[i].discount * 100).replace(/\.[0-9]+/g,'');
					}
				}
			}
		}
	};

	lastCallbackFunc = function(response)
	{
		for(i=0; i<response.data.length; i++)
		{
			discountTextInput = $('#discountInput' + response.data[i].idMenuItem);
			discountTextInput.focusout(function(){
				thisInput = $(this);
				thisInput.val(formatDiscountPercentage(thisInput.val()));
			});
			
			$('#discountCheckbox' + response.data[i].idMenuItem).change(function(){
				checkInput = $(this);
				idMenuItem = checkInput.val();
				booleanValue = checkInput.prop('checked');
				discountValue = $('#discountInput' + idMenuItem).val();
				if(discountValue == 0)
				{
					alert('O valor deve ser maior que zero!');
					checkInput.prop('checked','');
					return;
				}
				$.ajax({
					url: ('/api/' + (booleanValue ? 'add' : 'remove') + '/discount'),
					data: 'idMenuItem=' + idMenuItem + '&discount=' + discountValue,
					method: 'POST',
					statusCode: {
						200: function (response) {
							alert('Desconto ' + (booleanValue ? 'aplicado' : 'removido') + ' com sucesso!');
							updateFinalValue(idMenuItem);
						},
						400: function (response) {
							alert('Algum dos campos possui formato inválido ou está ausente.');
						},
						403: function (response) {
							alert('Acesso negado.');
						},
						500: function (response) {
							alert('Erro desconhecido ao ' + (booleanValue ? 'aplicar' : 'remover') + ' desconto.');
						}
					}
				});
			});
		}

		paintTableRows();
	}

	loadSubPage('/api/get/menu/items', '#discountsTpl', 'Erro ao carregar os itens para desconto.', handleResponseFunc, lastCallbackFunc);
}

function changePageImplFunction(subPage)
{
	if(subPage == 'cadastrar')
	{
		registerPage();
		currentLink = $('#registerLink');
	}
	else if(subPage == 'descontos')
	{
		discountsPage();
		currentLink = $('#discountsLink');
	}
	else //if(subPage == 'dashboard')
	{
		dashboardPage();
		currentLink = $('#dashboardLink');
	}

	return currentLink;
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
		input: "priceInput",
		validations: ["REQUIRED", "CURRENCY_PATTERN"],
		messages: ["O preço é obrigatório.", "Insira um preço válido."]
	}
];

var submitOverrideFunction = function()
{
	document.getElementById("imageUploadIframe").contentWindow.uploadImage();

	//waits for setIdImage
};

function setImageId(idImage, urlImage)
{
	$('#idImageInput').val(idImage);
	isRegister = ($('#modeInput').val() == 'register');

	$.ajax({
			url: (isRegister ? '/api/add/menu/item' : '/api/update/menu/item'),
			data: $('#menuItemRegisterForm').serialize(),
			method: 'POST',
			statusCode: {
				200: function (response) {
					alert('Item ' + (isRegister ? 'cadastrado' : 'atualizado') + ' com sucesso!');
					changeSubPage('dashboard', changePageImplFunction);
				},
				400: function (response) {
					alert('Algum dos campos possui formato inválido ou está ausente.');
				},
				403: function (response) {
					alert('Acesso negado.');
				},
				500: function (response) {
					alert('Erro desconhecido ao ' + (isRegister ? 'cadastrar' : 'atualizar') + ' item.');
				}
			}
		})
	;
}

function setMenuStatus(idMenu, newStatus)
{
	var fillStruct = {};
	buildStatusIconProps(fillStruct, newStatus == 'enable');

	$.ajax(
		{
			url: '/api/' + fillStruct.actionParameter + '/menu',
			method: 'POST',
			data: { 'idMenu' : idMenu }
		})
		.done(function(response) {
			aTagId = '#iconToggle' + idMenu;

			aTag = $('#iconToggle' + idMenu);
			aTag.attr('onclick', 'JavaScript:setMenuStatus(' + idMenu + ',\'' + fillStruct.toggleParameter + '\');');
			aTag.attr('title', fillStruct.statusIconTitle);

			iTag = $(aTagId + " i");
			iTag.removeClass('fa-toggle-' + fillStruct.statusIconInverseValue);
			iTag.addClass('fa-toggle-' + fillStruct.statusIconValue);
		})
		.fail(function() {
			alert('Erro desconhecido ao tentar ' + (newStatus == 'enable' ? 'ativar' : 'desativar') + ' menu.');
		})
	;
}

var validation = new Validation(htmlConfigJson, validationStructArray, "menuItemRegisterForm", submitOverrideFunction);

$(function() 
{
	setHash();

	changeSubPage(null, changePageImplFunction);

	rootPageLink = $('#itemsLink');
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

	$("#discountsLink").click(function() 
	{
		changeSubPage('descontos', changePageImplFunction);
	});
});