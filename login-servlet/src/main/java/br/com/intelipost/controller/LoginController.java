package br.com.intelipost.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * The login controller.
 * 
 * @author rnojiri
 */
@Controller
public class LoginController
{
	/**
	 * Returns the login view.
	 * 
	 * @return ModelAndView
	 */
	@RequestMapping(value = {"/", "/login"}, method = RequestMethod.GET)
	public ModelAndView login(@RequestParam(value = "error", required = false) String error,
			@RequestParam(value = "logout", required = false) String logout)
	{
		ModelAndView modelAndView = new ModelAndView("/login");

		if (error != null)
		{
			modelAndView.addObject("msg", "Usuário ou senha inválidos!");
		}

		if (logout != null)
		{
			modelAndView.addObject("msg", "Você se deslogou com sucesso!");
		}

		return modelAndView;
	}
}
