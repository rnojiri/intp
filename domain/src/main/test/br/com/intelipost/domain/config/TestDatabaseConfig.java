package br.com.intelipost.domain.config;

import java.beans.PropertyVetoException;
import java.io.IOException;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import ch.qos.logback.core.joran.spi.JoranException;

/**
 * Configures the embedded mysql database.
 * 
 * @author rnojiri
 */
@Configuration
public class TestDatabaseConfig
{
	private DataSource dataSource;
	
	private final String schemaBuildFile;
	
	private final String mappersLocation;
	
	private final String logbackFilePath;
	
	/**
	 * @throws JoranException
	 * @throws IOException
	 */
	public TestDatabaseConfig() throws JoranException
	{
		schemaBuildFile = "file:" + System.getProperty("user.dir").replace("/domain", "") + "/resources/database/schema.sql";
		mappersLocation = "br.com.intelipost.domain.persistence";
		logbackFilePath = System.getProperty("user.dir") + "/src/main/test/resources/logback.xml";
		
		configureLogback();
	}
	
	/**
	 * Configures logback.
	 * 
	 * @param logbackFilePath
	 * @throws JoranException 
	 */
	private void configureLogback() throws JoranException
	{
		System.setProperty("logback.configurationFile", logbackFilePath);
	}
	
	@Bean(destroyMethod = "shutdown")
	public DataSource dataSource() throws IOException
	{
		if(dataSource == null)
		{
			dataSource = new EmbeddedMysqlBuilder("intelipost", "localhost", 13306, schemaBuildFile).build();
		}
		
		return dataSource;
	}
	
	@Bean
	public DataSourceTransactionManager transactionManager() throws PropertyVetoException, IOException
	{
		return new DataSourceTransactionManager(dataSource());
	}
	
	@Bean
	public SqlSessionFactory sqlSessionFactory() throws Exception
	{
		SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		
		return sessionFactory.getObject();
	}
	
	@Bean
	public MapperScannerConfigurer mapperScannerConfigurer()
	{
		MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer(); 
		mapperScannerConfigurer.setBasePackage(mappersLocation);
		
		return mapperScannerConfigurer;
	}
}
