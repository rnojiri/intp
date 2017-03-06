<#assign cssInclusion=["details.css"]>
<#assign jsInclusion=["jquery-3.1.1.min.js", "mustache.min.js", "details.js"]>
<#include "inc/header.ftl">

				<script id="detailsTpl" type="x-tmpl-mustache">
					<table>
						<tr>
							<td>Nome:</td>
							<td>{{firstName}}</td>
						</tr>
						<tr>
							<td>Sobrenome:</td>
							<td>{{lastName}}</td>
						</tr>
						<tr>
							<td>Email:</td>
							<td>{{email}}</td>
						</tr>
						<tr>
							<td>Sexo:</td>
							<td>{{sex}}</td>
						</tr>
						<tr>
							<td>Nascimento:</td>
							<td>{{formatedBirthDate}}</td>
						</tr>
					</table>
				</script>

				<h2>Detalhes</h2>

				<div id="detailsContent">
				</div>

<#include "inc/footer.ftl">

