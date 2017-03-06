package br.com.intelipost.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import br.com.intelipost.domain.service.UserService;

/**
 * Configures the Spring security.
 * 
 * @author rnojiri
 */
@Configuration
@EnableWebSecurity
@DependsOn("userService")
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
	@Autowired
	private UserService userService;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http.csrf().disable()
			.authorizeRequests()
	            .anyRequest()
	            .authenticated()
			.and()
				.formLogin()
				.loginPage("/login")
				.failureUrl("/login?error")
				.successForwardUrl("/detalhes")
				.permitAll()
			.and()
				.logout()
				.logoutSuccessUrl("/login?logout")
				.permitAll();
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception
	{
		auth.userDetailsService(userService);
	}
}