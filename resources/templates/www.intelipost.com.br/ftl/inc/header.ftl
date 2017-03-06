<#include "constants.ftl">
<#include "html-tag-macros.ftl">
<!DOCTYPE HTML>
<html lang="pt">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Intelipost - Login</title>
		<#if cssInclusion??>
			<@printStyleIncTag baseUrl=CSS_PATH files=cssInclusion />
		</#if>
		<#if jsInclusion??>
			<@printScriptIncTag baseUrl=JS_PATH files=jsInclusion />
		</#if>
	</head>

	<body>

		<div id="wrapper">

			<h1>Intelipost</h1>
			
			<main>
				