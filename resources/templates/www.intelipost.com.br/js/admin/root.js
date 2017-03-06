function dashboardPage()
{
	loadSubPage('/api/get/statistics', '#statisticsTpl', 'Erro ao carregar as estatísticas.');
}

function userManagementPage()
{
	loadSubPage('/api/get/administrators', '#userManagementTpl', 'Erro ao carregar os usuários.', 
		function(response) 
		{
			if(response.data && response.data.length > 0)
			{
				for(i=0; i<response.data.length; i++)
				{
					response.data[i].isRoot = false;
					response.data[i].isAdmin = false;

					for(j=0; j<response.data[i].roles.length; j++)
					{
						if(response.data[i].roles[j] == '1')
						{
							response.data[i].isRoot = true;
						}
						else if(response.data[i].roles[j] == '2')
						{
							response.data[i].isAdmin = true;
						}
					}
				}
			}
		},

		function() 
		{
			paintTableRows();

			$('#adminUsersTable [type=checkbox]').change(function() 
			{
				checkboxInput = $(this);
				array = checkboxInput.val().split('-');
				addRole = checkboxInput.prop('checked');
				$.ajax({
					url: '/api/' + (addRole ? 'add' : 'remove') +  '/role',
					data: {'idUser': array[1] , 'idRole': (array[0] == 'r' ? '1' : '2')},
					method: 'POST'
				}).fail(function() {
						alert('Erro ao ' + (addRole ? 'adicionar' : 'remover') + ' permissão.');
					}
				);
			});

			$("#addUserButton").click(function() {
				addUser();
			});
		}
	);
}

function categoriesPage()
{
	loadSubPage('/api/get/statistics', '#statisticsTpl', 'Erro ao carregar as estatísticas.');
}

function changePageImplFunction(subPage)
{
	if(subPage == 'dashboard')
	{
		dashboardPage();
		currentLink = $('#dashboardLink');
	}
	else if(subPage == 'userManagement')
	{
		userManagementPage();
		currentLink = $('#userManagementLink');
	}

	return currentLink;
}

function addUser()
{
	email = $('#emailInput').val();

	if(email == '')
	{
		alert('Você precisa especificar o e-mail do usuário.');

		return;
	}

	$.ajax('/api/get/user?email=' + email)
		.done(function(response) {
			if(response.resultCode == 'empty')
			{
				alert('Usuário ' + email + ' não encontrado!');
			}
			else
			{
				var template = $('#addUserTableRowTpl').html();
				Mustache.parse(template); // optional, speeds up future uses
				var rendered = Mustache.render(template, response);
				$('#adminUsersTable').append(rendered);
				addedRow = $('#adminUsersTable .table-row').last();
				lastRowStyleInput = $('#lastRowStyleInput');

				if(lastRowStyleInput.val() == 'even')
				{
					addedRow.addClass('table-row-odd');
					lastRowStyleInput.val('odd');
				}
				else
				{
					addedRow.addClass('table-row-even');
					lastRowStyleInput.val('even');
				}
			}
		})
		.fail(function() {
			alert(errorMessage);
		})
	;
}

$(function() 
{
	setHash();
	
	changeSubPage(null, changePageImplFunction);

	rootPageLink = $('#rootLink');
	rootPageLink.removeClass('nav-link');
	rootPageLink.addClass('disabled');

	$("#dashboardLink").click(function() {
		changeSubPage('dashboard', changePageImplFunction);
	});

	$("#userManagementLink").click(function() {
		changeSubPage('userManagement', changePageImplFunction);
	});

	$("#categoriesLink").click(function() {
		changeSubPage('categories', changePageImplFunction);
	});
});