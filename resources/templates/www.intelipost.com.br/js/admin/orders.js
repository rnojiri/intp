function dashboardPage()
{
	loadSubPage('/api/get/order/statistics', '#dashboardTpl', 'Erro ao carregar as estatísticas dos pedidos.');
}

function activeOrdersPage()
{
	handleResponseFunc = function(response)
	{
		if(response.data.length > 0)
		{
			for(i=0; i<response.data.length; i++)
			{
				if(response.data[i].totalSeconds < 60)
				{
					response.data[i].totalWaitingTime = parseInt(response.data[i].totalSeconds) + 's';
				}
				else if(response.data[i].totalSeconds >= 60 && response.data[i].totalSeconds < 3600)
				{
					response.data[i].totalWaitingTime = parseInt(response.data[i].totalSeconds/60) + 'm';
				}
				else
				{
					response.data[i].totalWaitingTime = parseInt(response.data[i].totalSeconds/3600) + 'h';
				}

				switch(response.data[i].status)
				{
					case 'ORDERED':
						response.data[i].actionButtonLabel = 'Ciente';
						response.data[i].actionButtonNextStatus = 'ACKNOWLEDGED';
						break;
					case 'ACKNOWLEDGED':
						response.data[i].actionButtonLabel = 'Entregue';
						response.data[i].actionButtonNextStatus = 'DELIVERED';
						break;
					default:
						response.data[i].actionButtonLabel = 'Erro';
						response.data[i].actionButtonNextStatus = 'NONE';
						break;
				}
			}
		}
	};

	loadSubPage('/api/get/orders', '#activeOrdersTpl', 'Erro ao carregar os pedidos ativos.', handleResponseFunc);
}

function changeStatus(idOrder, nextStatus)
{
	$.ajax({
		url: '/api/update/order',
		data: {'idOrder': idOrder, 'status': nextStatus}, 
		method: 'POST',
		statusCode: {
			200: function (response) {
				alert('Pedido confirmado con sucesso!');
				activeOrdersPage();
			},
			400: function (response) {
				alert('Houve um erro na confirmação.');
			},
			403: function (response) {
				alert('Acesso negado.');
			},
			500: function (response) {
				alert('Erro desconhecido ao tentar confirmar o status do pedido.');
			}
		}
	});
}

function changePageImplFunction(subPage)
{
	if(subPage == 'ativos')
	{
		activeOrdersPage();
		currentLink = $('#activeOrdersLink');
	}
	else //if(subPage == 'dashboard')
	{
		dashboardPage();
		currentLink = $('#dashboardLink');
	}

	return currentLink;
}

$(function() 
{
	setHash();

	changeSubPage(null, changePageImplFunction);

	rootPageLink = $('#ordersLink');
	rootPageLink.removeClass('nav-link');
	rootPageLink.addClass('disabled');

	$("#dashboardLink").click(function() 
	{
		changeSubPage('dashboard', changePageImplFunction);
	});

	$("#activeOrdersLink").click(function() 
	{
		changeSubPage('ativos', changePageImplFunction);
	});
});