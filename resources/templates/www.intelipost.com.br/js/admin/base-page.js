function render(templateId, templateData, customContainerId)
{
	var template = $(templateId).html();
	Mustache.parse(template); // optional, speeds up future uses
	rendered = Mustache.render(template, templateData);
	dynamicContent = $((customContainerId == null ? '#dynamicContent' : customContainerId));
	dynamicContent.html('');
	dynamicContent.html(rendered);
}

function loadSubPage(apiService, templateId, errorMessage, handleResponseFunc, callbackFunc, customContainerId)
{
	$.ajax({
		url: apiService,
		method: 'GET',
		statusCode: {
			200: function (response) {
				if(handleResponseFunc) handleResponseFunc(response);
				if((response.resultCode == 'success') && (response.data != null && response.data.length > 0)) response.hasElements = true;
				render(templateId, response, customContainerId);
				if(callbackFunc) callbackFunc(response);
			},
			400: function (response) {
				alert('Erro ao recuperar dados para exibição da página.');
			},
			403: function (response) {
				window.location = '/acessar';
			},
			500: function (response) {
				alert('Erro desconhecido no servidor.');
			}
		}
	});
}

function resetLinks(currentLink)
{
	allLinks = $('#sideMenu a');
	allLinks.removeClass('nav-link disabled');
	allLinks.addClass('nav-link');

	if(currentLink != null)
	{
		currentLink.removeClass('nav-link');
		currentLink.addClass('disabled');
	}
}

function paintTableRows()
{
	lastRowStyle = '';

	$('.table-row').each(function(i){
		item = $(this);
		item.removeClass('table-row');
		if(i%2 == 0)
		{
			item.addClass('table-row-odd');
			lastRowStyle = 'odd';
		}
		else
		{
			item.addClass('table-row-even');
			lastRowStyle = 'odd';
		}
	});

	$('#lastRowStyleInput').val(lastRowStyle);
}

function setHash()
{
	hash = window.location.hash;

	if(hash && hash != '')
	{
		$('#subPageInput').val(hash.substring(1, hash.length));
	}
}

function changeSubPage(subPageName, changePageImplFunction)
{
	subPageInput = $('#subPageInput');

	if(subPageName && subPageName != '')
	{
		subPageInput.attr('value', subPageName);
	}

	if(subPageName == null || subPageName == '')
	{
		subPageName = 'dashboard';
	}

	currentLink = changePageImplFunction(subPageName);

	resetLinks(currentLink);

	window.history.pushState('', '', window.location.pathname + window.location.hash);
}

function buildStatusIconProps(struct, isActive)
{
	struct.statusIconValue = (isActive ? 'on' : 'off');
	struct.statusIconInverseValue = (isActive ? 'off' : 'on');
	struct.statusIconTitle = (isActive ? 'Desativar' : 'Ativar');
	struct.toggleParameter = (isActive ? 'disable' : 'enable');
	struct.actionParameter = (isActive ? 'enable' : 'disable');
}

var htmlConfigJson = {
						"warnClass":"warning", 
						"hideClass":"hidden", 
						"displayClass":"displaying", 
						"messageBoxTextId":"messageBoxText", 
						"messageBoxId":"messageBox"
					 };

function ColumnSelector(configParams)
{
	this.configParams = configParams;
}

ColumnSelector.prototype.loadLeftColumn = function(id)
{
	$(this.configParams.leftColumnSelector).html('');

	loadSubPage(this.configParams.loadLeftColumnServiceUrl + id, this.configParams.itemListTemplateId, this.configParams.loadLeftColumnErrorMsg, null, null, this.configParams.leftColumnSelector);
}

ColumnSelector.prototype.loadRightColumn = function(id)
{
	$(this.configParams.rightColumnSelector).html('');

	loadSubPage(this.configParams.loadRightColumnServiceUrl + id, this.configParams.itemListTemplateId, this.configParams.loadRightColumnErrorMsg, null, null, this.configParams.rightColumnSelector);
}

ColumnSelector.prototype.executeItemsExchange = function(inputMatrix, serviceUrl, id, index)
{
	if(index >= inputMatrix.length)
	{
		this.loadLeftColumn(id);
		this.loadRightColumn(id);

		return;
	}

	if(inputMatrix[index].length == 0)
	{
		this.executeItemsExchange(inputMatrix, serviceUrl, id, ++index);

		return;
	}

	params = '';

	for(i=0; i<inputMatrix[index].length; i++)
	{
		params += this.configParams.itemArrayParamName + '=' + inputMatrix[index][i].value + '&';
	}

	params += this.configParams.mainItemParamName + '=' + id;

	parent = this;

	$.ajax({
		url: serviceUrl[index] + '?' + params,
		method: 'POST',
		statusCode: {
			200: function (response) {
				parent.executeItemsExchange(inputMatrix, serviceUrl, id, ++index);
			},
			400: function (response) {
				alert('Houve um erro no envio dos dados.');
			},
			403: function (response) {
				alert('Acesso negado.');
			},
			500: function (response) {
				alert(this.configParams.unknownErrorMsg);
			}
		}
	});
}

ColumnSelector.prototype.exchangeItems = function()
{
	inputMatrix = [];

	for(i=0; i<this.configParams.inputSelectorArray.length; i++)
	{
		inputMatrix[i] = $(this.configParams.inputSelectorArray[i]);
	}

	this.executeItemsExchange(inputMatrix, this.configParams.serviceUrlArray, this.mainId, 0, this.configParams.uriHash);
}

ColumnSelector.prototype.init = function()
{
	this.mainId = $(this.configParams.idSelector).val();

	parent = this;

	$(this.configParams.exchangeItemsButtonSelector).click(function() 
	{
		parent.exchangeItems();
	});

	this.loadLeftColumn(this.mainId);
	this.loadRightColumn(this.mainId);
}