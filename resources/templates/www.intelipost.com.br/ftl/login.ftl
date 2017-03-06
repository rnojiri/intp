<#assign cssInclusion=["login.css"]>
<#include "inc/header.ftl">

				<h2>Login</h2>

				<form id="signinForm" action="/login" method="post">

					<div class="full-width">
						<label class="text-df" for="formInputEmail">e-mail:</label>
						<input id="formInputEmail" class="input-item full-width" autocomplete="off" maxlength="50" tabindex="1" type="text" name="username"/>
					</div>

					<div class="full-width">
						<label class="text-df" for="formInputPassword">Senha:</label>
						<input id="formInputPassword" class="input-item full-width" autocomplete="off" maxlength="30" tabindex="2" type="password" name="password"/>
					</div>

					<div class="full-width top-margin-10">
						<input type="submit" class="submit-button" tabindex="3" value="Entrar"/>
					</div>

				</form>

<#include "inc/footer.ftl">

