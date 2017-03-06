package br.com.intelipost.domain.service;

import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.intelipost.domain.model.User;
import br.com.intelipost.domain.model.UserDetails;
import br.com.intelipost.domain.persistence.UserDetailsMapper;
import br.com.intelipost.domain.persistence.UserMapper;
import br.com.intelipost.domain.spring.SpringUserDetails;
import net.spy.memcached.MemcachedClient;

/**
 * Has all user related functions. 
 * 
 * @author rnojiri
 */
@Service
public class UserService implements UserDetailsService
{
	private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
	
	private static final String SPRING_USER_DETAILS_PREFIX = "spring-user-details-";
	private static final String USER_PREFIX = "db-user-";
	private static final String USER_DETAILS_PREFIX = "db-user-details-";
	
	@Autowired
	private UserMapper userMapper;

	@Autowired
	private UserDetailsMapper userDetailsMapper;
	
	@Autowired(required = false)
	private MemcachedClient memcachedClient;
	
	@Autowired(required = false)
	private Integer cacheTTL;

	public UserService()
	{
		
	}
	
	/**
	 * Returns an object from the cache.
	 * 
	 * @param prefix
	 * @param key
	 * @return
	 */
	private <T> T getFromCache(String prefix, String key)
	{
		if(memcachedClient != null)
		{
			final String fullKey = prefix + key;
			
			try
			{	
				@SuppressWarnings("unchecked")
				T value = (T)memcachedClient.get(fullKey);
				
				if(value != null)
				{
					LOGGER.debug("Found cached object under key {}.", fullKey);
					
					return value;
				}
			}
			catch(Exception e)
			{
				LOGGER.error("Error getting key {} from memcached.", fullKey, e);
			}
		}
		
		return null;
	}
	
	/**
	 * Adds an object to the cache.
	 * 
	 * @param prefix
	 * @param key
	 * @param value
	 */
	private void addToCache(String prefix, String key, Object value)
	{
		if(memcachedClient != null)
		{
			final String fullKey = prefix + key;
			
			try
			{
				memcachedClient.set(fullKey, cacheTTL, value);
				
				LOGGER.debug("Object with key {} was cached.", fullKey);
			}
			catch(Exception e)
			{
				LOGGER.error("Error setting object with key {} to memcached.", fullKey, e);
			}
		}
	}

	@Override
	public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
	{
		SpringUserDetails springUser = getFromCache(SPRING_USER_DETAILS_PREFIX, email);
		
		if(springUser != null) return springUser;
		
		User user = userMapper.selectByEmail(email);
		
		if(user == null) throw new UsernameNotFoundException("User email \"" + email + "\" is not registered.");
		
		Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
		grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
		
		springUser = new SpringUserDetails(user.getIdUser(), email, user.getCodPassword(), true, true, true, true, grantedAuthorities);
		
		addToCache(SPRING_USER_DETAILS_PREFIX, email, springUser);
		
		return springUser;
	}
	
	/**
	 * Returns an user.
	 * 
	 * @param idUser
	 * @return User
	 */
	public User getUser(Long idUser)
	{
		String strIdUser = String.valueOf(idUser);
		
		User user = getFromCache(USER_PREFIX, strIdUser);
		
		if(user != null) return user;
		
		user = userMapper.selectByPrimaryKey(idUser);
		
		addToCache(USER_PREFIX, strIdUser, user);
		
		return user;
	}
	
	/**
	 * Returns the user details.
	 * 
	 * @param idUser
	 * @return UserDetails
	 */
	public UserDetails getUserDetails(Long idUser)
	{
		String strIdUser = String.valueOf(idUser);
		
		UserDetails userDetails = getFromCache(USER_DETAILS_PREFIX, strIdUser);
		
		if(userDetails != null) return userDetails;
		
		userDetails = userDetailsMapper.selectByPrimaryKey(idUser);
		
		addToCache(USER_DETAILS_PREFIX, strIdUser, userDetails);
		
		return userDetails;
	}
}
