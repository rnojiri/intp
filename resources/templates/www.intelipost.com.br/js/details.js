$(function()
{
	$.ajax('/api/get/details')
		.done(function(response)
		{
			var template = $('#detailsTpl').html();
			Mustache.parse(template); // optional, speeds up future uses
			var d = new Date(response.birthDate);
			response.formatedBirthDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
			rendered = Mustache.render(template, response);
			dynamicContent = $('#detailsContent');
			dynamicContent.html(rendered);
		})
		.fail(function()
		{
			alert('Erro ao carregar os detalhes de usuário.');
		}
	);
});