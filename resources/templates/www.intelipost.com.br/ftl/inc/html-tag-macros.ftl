<#-- Prints the script inclusion tag -->
<#macro printScriptIncTag baseUrl files>
	<#list files as file>
		<script type="text/javascript" src="${baseUrl}/${file}"></script>
	</#list>
</#macro>

<#-- Prints the style inclusion tag -->
<#macro printStyleIncTag baseUrl files>
	<#list files as file>
		<link rel="stylesheet" type="text/css" href="${baseUrl}/${file}">
	</#list>
</#macro>