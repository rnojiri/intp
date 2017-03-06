package br.com.intelipost.domain.config;

import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import com.mysql.management.MysqldResource;

/**
 * The embedded mysql database for tests.
 * 
 * @author rnojiri
 */
public class EmbeddedMysql extends DriverManagerDataSource
{
	private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddedMysqlBuilder.class);
	
	private final MysqldResource mysqldResource;

	/**
	 * @param mysqldResource
	 */
	public EmbeddedMysql(MysqldResource mysqldResource)
	{
		this.mysqldResource = mysqldResource;
	}

	/**
	 * Shuts down.
	 */
	public void shutdown()
	{
		if (mysqldResource != null)
		{
			mysqldResource.shutdown();
						
			if (!mysqldResource.isRunning())
			{
				try
				{
					LOGGER.info("Deleting database base directory {}", mysqldResource.getBaseDir());
				
					FileUtils.deleteDirectory(mysqldResource.getBaseDir());
				}
				catch(IOException e)
				{
					LOGGER.error("Error deleting base directory.", e);
				}
			}
		}
	}
}