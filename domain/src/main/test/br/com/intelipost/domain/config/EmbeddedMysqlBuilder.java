package br.com.intelipost.domain.config;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import com.mysql.management.MysqldResource;
import com.mysql.management.MysqldResourceI;

/**
 * Creates a new instance of embedded Mysql.
 * 
 * @author rnojiri
 */
public class EmbeddedMysqlBuilder
{
	private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddedMysqlBuilder.class);

	private final String DB_FILES_BASE_DIR = System.getProperty("java.io.tmpdir");
	
	private final String databaseName;
	private final String hostname;
	private final int port;
	
	private ResourceDatabasePopulator databasePopulator;

	/**
	 * Initializes the builder with the specified values and sets all scripts to be executed after the database creation.
	 * 
	 * @param hostname
	 * @param port
	 * @param scripts
	 */
	public EmbeddedMysqlBuilder(String databaseName, String hostname, int port, String ... scripts)
	{
		this.databaseName = databaseName;
		this.hostname = hostname;
		this.port = port;
		
		addScripts(scripts);
	}
	
	/**
	 * Adds the specified scripts.
	 * 
	 * @param scripts
	 */
	private void addScripts(String ... scripts)
	{
		if(scripts != null && scripts.length > 0)
		{
			ResourceLoader resourceLoader = new DefaultResourceLoader();
			
			this.databasePopulator = new ResourceDatabasePopulator();
			
			for(String script : scripts)
			{
				databasePopulator.addScript(resourceLoader.getResource(script));
			}
		}
	}

	/**
	 * Creates the embedded mysql.
	 * 
	 * @param mysqldResource
	 * @return EmbeddedMysql
	 */
	private EmbeddedMysql createDatabase(MysqldResource mysqldResource)
	{
		if (!mysqldResource.isRunning())
		{
			LOGGER.error("Mysql instance is not running.");
			
			throw new RuntimeException("Error getting datasource.");
		}
		
		String url = "jdbc:mysql://" + hostname + ":" + port + "/" + databaseName + "?" + "createDatabaseIfNotExist=true";
		
		EmbeddedMysql database = new EmbeddedMysql(mysqldResource);
		database.setDriverClassName("com.mysql.jdbc.Driver");
		database.setUsername("root");
		database.setPassword(null);
		database.setUrl(url);
		
		LOGGER.info("Embedded Mysql url: {}", url);

		return database;
	}

	/**
	 * Creates the database file and configures the mysqld resource.
	 * 
	 * @return MysqldResource
	 * @throws IOException 
	 */
	private MysqldResource createMysqldResource() throws IOException
	{
		Map<String, String> databaseOptions = new HashMap<String, String>();
		databaseOptions.put(MysqldResourceI.PORT, Integer.toString(port));

		File databaseDir = new File(DB_FILES_BASE_DIR + "/mysql");
		
		FileUtils.deleteDirectory(databaseDir);
				
		MysqldResource mysqldResource = new MysqldResource(databaseDir);
		mysqldResource.start("embedded-mysqld-thread-" + System.currentTimeMillis(), databaseOptions);

		if (!mysqldResource.isRunning())
		{
			throw new RuntimeException("Error starting embedded Mysql.");
		}

		LOGGER.info("Mysql started successfully @ {}", System.currentTimeMillis());
		
		return mysqldResource;
	}

	/**
	 * Runs all added scripts.
	 * 
	 * @param database
	 */
	private void populateScripts(EmbeddedMysql database)
	{
		if(databasePopulator == null) return;
		
		try
		{
			DatabasePopulatorUtils.execute(databasePopulator, database);
		}
		catch (Exception e)
		{
			LOGGER.error(e.getMessage(), e);
			
			database.shutdown();
		}
	}

	/**
	 * Builds the embedded mysql.
	 * 
	 * @return EmbeddedMysql
	 * @throws IOException 
	 */
	public EmbeddedMysql build() throws IOException
	{
		MysqldResource mysqldResource = createMysqldResource();
		
		EmbeddedMysql database = createDatabase(mysqldResource);
		
		populateScripts(database);
		
		return database;
	}
}
