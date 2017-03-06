package br.com.intelipost.domain.spring;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 * Adds the Long type user id to the object.
 * 
 * @author rnojiri
 */
public class SpringUserDetails extends User
{
	private static final long serialVersionUID = 6201972353599414926L;
	
	private final Long userId;
	
	public SpringUserDetails(Long userId, String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired,
			boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities)
	{
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
		
		this.userId = userId;
	}

	public SpringUserDetails(Long userId, String username, String password, Collection<? extends GrantedAuthority> authorities)
	{
		super(username, password, authorities);
		
		this.userId = userId;
	}

	/**
	 * @return the userId
	 */
	public Long getUserId()
	{
		return userId;
	}
}
