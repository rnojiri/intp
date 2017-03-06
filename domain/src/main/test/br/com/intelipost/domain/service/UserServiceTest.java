package br.com.intelipost.domain.service;

import java.util.Calendar;
import java.util.Date;

import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import br.com.intelipost.domain.config.TestDatabaseConfig;
import br.com.intelipost.domain.model.Sex;
import br.com.intelipost.domain.model.User;
import br.com.intelipost.domain.model.UserDetails;
import br.com.intelipost.domain.persistence.UserDetailsMapper;
import br.com.intelipost.domain.persistence.UserMapper;

/**
 * Tests the user service functions.
 * 
 * @author rnojiri
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestDatabaseConfig.class, UserService.class})
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class UserServiceTest
{
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private UserDetailsMapper userDetailsMapper;
	
	@Autowired
	private UserService userService;
	
	/**
	 * Creates a test user.
	 * 
	 * @return User
	 */
	private User createUser()
	{
		String userString = String.valueOf(System.currentTimeMillis());
		
		User user = new User();
		user.setEmlUser(userString + "@test.com.br");
		user.setCodPassword(userString);
		user.setFlgActive(true);
		
		return user;
	}
	
	/**
	 * Creates a test user details.
	 * 
	 * @param idUser
	 * @return UserDetails
	 */
	private UserDetails createUserDetails(Long idUser)
	{
		Calendar calendar = Calendar.getInstance();
		Long currentTime = calendar.getTimeInMillis();
		
		calendar.set(Calendar.MILLISECOND, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		
		Date date = calendar.getTime();
		String userString = String.valueOf(currentTime);
		
		UserDetails userDetails = new UserDetails();
		userDetails.setDatBirth(date);
		userDetails.setDatCreation(date);
		userDetails.setEnuSex(currentTime % 2 == 0 ? Sex.F : Sex.M);
		userDetails.setFlgAllowEmails(true);
		userDetails.setIdUser(idUser);
		userDetails.setNamFirst(userString + 'F');
		userDetails.setNamLast(userString + 'L');
		
		return userDetails;
	}

	@Test
	public void test1GetUser()
	{
		User user = createUser();
		
		Assert.assertEquals(1, userMapper.insert(user));
		
		User dbUser = userService.getUser(user.getIdUser());
		
		Assert.assertEquals(user, dbUser);
	}
	
	@Test
	public void test2GetUserDetails()
	{
		User user = createUser();
		
		Assert.assertEquals(1, userMapper.insert(user));
		
		UserDetails userDetails = createUserDetails(user.getIdUser());
		
		Assert.assertEquals(1, userDetailsMapper.insert(userDetails));
		
		UserDetails dbUserDetails = userService.getUserDetails(user.getIdUser());
		
		Assert.assertEquals(userDetails, dbUserDetails);
	}
	
	@Test
	public void test3LoadUserByUsername()
	{
		User user = createUser();
		
		Assert.assertEquals(1, userMapper.insert(user));
		
		org.springframework.security.core.userdetails.UserDetails springUserDetails = userService.loadUserByUsername(user.getEmlUser());
		
		Assert.assertNotNull(springUserDetails);
		
		Assert.assertEquals(user.getEmlUser(), springUserDetails.getUsername());
		Assert.assertEquals(user.getCodPassword(), springUserDetails.getPassword());
	}
}
