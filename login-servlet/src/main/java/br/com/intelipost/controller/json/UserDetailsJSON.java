package br.com.intelipost.controller.json;

import java.io.Serializable;
import java.util.Date;

/**
 * User details object JSON.
 * 
 * @author rnojiri
 */
public class UserDetailsJSON implements Serializable
{
	private static final long serialVersionUID = 5058459001386243832L;

	private String email;

	private String firstName;

	private String lastName;

	private String sex;

	private Date birthDate;

	public UserDetailsJSON()
	{
		;
	}

	/**
	 * @return the email
	 */
	public String getEmail()
	{
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email)
	{
		this.email = email;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName()
	{
		return firstName;
	}

	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName)
	{
		this.firstName = firstName;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName()
	{
		return lastName;
	}

	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName)
	{
		this.lastName = lastName;
	}

	/**
	 * @return the sex
	 */
	public String getSex()
	{
		return sex;
	}

	/**
	 * @param sex the sex to set
	 */
	public void setSex(String sex)
	{
		this.sex = sex;
	}

	/**
	 * @return the birthDate
	 */
	public Date getBirthDate()
	{
		return birthDate;
	}

	/**
	 * @param birthDate the birthDate to set
	 */
	public void setBirthDate(Date birthDate)
	{
		this.birthDate = birthDate;
	}
}
