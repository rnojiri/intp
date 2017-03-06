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

	loadSubPage('/api/get/menus', '#menusTpl', 'Erro ao carregar os menus.', handleResponseFunc, paintTableRows);
}

function registerPage()
{
	render('#registerTpl', {mode:'register'} );
	$('#registerTplTitle').html('Cadastrar novo menu');
	$('#registerSubmitInput').val('Cadastrar');
	resetLinks();
	validation.hookUpEvents();
}

function editPage(menuId)
{
	loadSubPage('/api/get/menu?menuId=' + menuId, '#registerTpl', 'Erro carregando página de edição de menu.', 
		function(response)
		{
			response.mode = 'edit';
		}, 
		function(response)
		{
			$('#registerTplTitle').html('Editar menu'); 
			$('#registerSubmitInput').val('Editar');
			resetLinks();
			validation.hookUpEvents();
		}
	);
}

function menuBuildPage()
{
	addEvents = function(response)
	{
		$('#menuSelector').change(function() 
		{
			menuId = $('#menuSelector option:selected');

			if(menuId != '')
			{
				itemListContainer = $('#itemListContainer');
				itemListContainer.removeClass('hidden');
				itemListContainer.addClass('displaying');

				columnSelector.init();
			}
			else
			{
				itemListContainer = $('#itemListContainer');
				itemListContainer.removeClass('displaying');
				itemListContainer.addClass('hidden');
			}
		});
	};

	loadSubPage('/api/get/menus', '#menuBuildTpl', 'Erro carregando página de montagem de menu.', null, addEvents);
}

function changePageImplFunction(subPage)
{
	if(subPage == 'cadastrar')
	{
		registerPage();
		currentLink = $('#registerLink');
	}
	else if(subPage == 'montar')
	{
		menuBuildPage();
		currentLink = $('#menuBuildLink');
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
	}
];

var submitOverrideFunction = function()
{
	isRegister = ($('#modeInput').val() == 'register');

	$.ajax({
		url: (isRegister ? '/api/add/menu' : '/api/update/menu'),
		data: $('#menuRegisterForm').serialize(),
		method: 'POST',
		statusCode: {
			200: function (response) {
				alert('Menu ' + (isRegister ? 'cadastrado' : 'atualizado') + ' com sucesso!');
				changeSubPage('dashboard', changePageImplFunction);
			},
			400: function (response) {
				alert('O nome possui formato inválido ou está ausente.');
			},
			403: function (response) {
				alert('Acesso negado.');
			},
			500: function (response) {
				alert('Erro desconhecido ao ' + (isRegister ? 'cadastrar' : 'atualizar') + ' menu.');
			}
		}
	});
};

function setMenuStatus(menuId, newStatus)
{
	var fillStruct = {};
	buildStatusIconProps(fillStruct, newStatus == 'enable');

	$.ajax(
		{
			url: '/api/' + fillStruct.actionParameter + '/menu',
			method: 'POST',
			data: { 'menuId' : menuId }
		})
		.done(function(response) {
			aTagId = '#iconToggle' + menuId;

			aTag = $('#iconToggle' + menuId);
			aTag.attr('onclick', 'JavaScript:setMenuStatus(' + menuId + ',\'' + fillStruct.toggleParameter + '\');');
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

var validation = new Validation(htmlConfigJson, validationStructArray, "menuRegisterForm", submitOverrideFunction);

var columnSelector = new ColumnSelector(
{
	leftColumnSelector: '#menuItemList',
	rightColumnSelector: '#availableItemList',
	loadLeftColumnServiceUrl: '/api/get/menu/items?status=ACTIVE&negateIds=true&idType=MENU&id=',
	loadRightColumnServiceUrl: '/api/get/menu/items?status=ACTIVE&idType=MENU&id=',
	itemListTemplateId: '#menuItemListTpl',
	loadLeftColumnErrorMsg: 'Erro carregando a lista de itens disponíveis.',
	loadRightColumnErrorMsg: 'Erro carregando a lista de itens do menu.',
	itemArrayParamName: 'menuItemId',
	mainItemParamName: 'ownerId',
	unknownErrorMsg: 'Erro desconhecido ao realizar operações de adição/remoção de itens no/do menu.',
	idSelector: '#menuSelector option:selected',
	inputSelectorArray: ['#menuItemList input[type=checkbox]:checked', '#availableItemList input[type=checkbox]:checked'],
	serviceUrlArray: ['/api/add/item/to/menu', '/api/remove/item/from/menu'],
	uriHash: '/menu#montar',
	exchangeItemsButtonSelector: '#exchangeItemsButton'
});

$(function() 
{
	setHash();

	changeSubPage(null, changePageImplFunction);

	menusPageLink = $('#menusLink');
	menusPageLink.removeClass('nav-link');
	menusPageLink.addClass('disabled');

	$("#dashboardLink").click(function() 
	{
		changeSubPage('dashboard', changePageImplFunction);
	});

	$("#registerLink").click(function() 
	{
		changeSubPage('cadastrar', changePageImplFunction);
	});

	$("#menuBuildLink").click(function() 
	{
		changeSubPage('montar', changePageImplFunction);
	});
});