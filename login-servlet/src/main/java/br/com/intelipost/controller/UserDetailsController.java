package br.com.intelipost.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import br.com.intelipost.controller.json.UserDetailsJSON;
import br.com.intelipost.domain.model.User;
import br.com.intelipost.domain.model.UserDetails;
import br.com.intelipost.domain.service.UserService;
import br.com.intelipost.domain.spring.SpringUserDetails;

/**
 * The user details controller.
 * 
 * @author rnojiri
 */
@Controller
public class UserDetailsController
{
	@Autowired
	private UserService userService;
	
	/**
	 * Returns the user details view.
	 * 
	 * @return ModelAndView
	 */
	@RequestMapping(value = "/detalhes", method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView details()
	{
		ModelAndView modelAndView = new ModelAndView("/details");
		
		SpringUserDetails springUserDetails = getSpringUserDetails();
		
		User user = userService.getUser(springUserDetails.getUserId());
		
		modelAndView.addObject("user", user);
		
		return modelAndView;
	}
	
	/**
	 * Returns the user details JSON.
	 * 
	 * @return UserDetails
	 */
	@GetMapping("/api/get/details")
	@ResponseBody
	public UserDetailsJSON apiGetUserDetails()
	{
		SpringUserDetails springUserDetails = getSpringUserDetails();
		
		UserDetails userDetails = userService.getUserDetails(springUserDetails.getUserId());
		
		return toJson(springUserDetails.getUsername(), userDetails);
	}
	
	/**
	 * Converts to JSON.
	 * 
	 * @param email
	 * @param userDetails
	 * @return UserDetailsJSON
	 */
	private UserDetailsJSON toJson(String email, UserDetails userDetails)
	{
		UserDetailsJSON json = new UserDetailsJSON();
		json.setBirthDate(userDetails.getDatBirth());
		json.setEmail(email);
		json.setFirstName(userDetails.getNamFirst());
		json.setLastName(userDetails.getNamLast());
		json.setSex(userDetails.getEnuSex().name());
		
		return json;
	}
	
	/**
	 * Returns the logged user id.
	 * 
	 * @return Long
	 */
	private SpringUserDetails getSpringUserDetails()
	{
		return (SpringUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
