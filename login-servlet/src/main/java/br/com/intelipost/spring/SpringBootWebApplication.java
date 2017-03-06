package br.com.intelipost.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * Main entry for the Spring boot application.
 * 
 * @author rnojiri
 */
@SpringBootApplication(scanBasePackages = {"br.com.intelipost"})
public class SpringBootWebApplication extends SpringBootServletInitializer
{
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application)
	{
		return application.sources(SpringBootWebApplication.class);
	}

	public static void main(String[] args) throws Exception
	{
		SpringApplication.run(SpringBootWebApplication.class, args);
	}
}