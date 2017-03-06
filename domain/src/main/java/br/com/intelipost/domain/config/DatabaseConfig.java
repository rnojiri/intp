package br.com.intelipost.domain.config;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import net.spy.memcached.BinaryConnectionFactory;
import net.spy.memcached.MemcachedClient;

/**
 * The domain configuration class.
 * 
 * @author rnojiri
 */
@Order(0)
@Configuration
@MapperScan(basePackages = {"br.com.intelipost.domain.persistence"})
public class DatabaseConfig
{
	private DataSource dataSource;
	
	@Bean(destroyMethod="close")
	public DataSource dataSource() throws PropertyVetoException
	{
		if(dataSource != null) return dataSource;
		
		ComboPooledDataSource comboPooledDataSource = new ComboPooledDataSource();
		comboPooledDataSource.setDriverClass("com.mysql.jdbc.Driver");
		comboPooledDataSource.setJdbcUrl("jdbc:mysql://database.intranet:3306/intelipost");
		comboPooledDataSource.setUser("intelipost");
		comboPooledDataSource.setPassword("1nt3l1p0st");
		comboPooledDataSource.setInitialPoolSize(2);
		comboPooledDataSource.setMinPoolSize(2);
		comboPooledDataSource.setMaxPoolSize(10);
		comboPooledDataSource.setCheckoutTimeout(60000);
		comboPooledDataSource.setIdleConnectionTestPeriod(5000);
		comboPooledDataSource.setAcquireIncrement(1);
		comboPooledDataSource.setMaxStatements(10);
		comboPooledDataSource.setNumHelperThreads(3);

		dataSource = comboPooledDataSource;
		
		return dataSource;
	}
	
	/**
	 * Creates the memcached client bean.
	 * 
	 * @return MemcachedClient
	 * @throws IOException
	 */
	@Bean
	public MemcachedClient memcachedClient() throws IOException
	{
		List<InetSocketAddress> socketList = new ArrayList<>();
		socketList.add(new InetSocketAddress("localhost", 11211));
		
		return new MemcachedClient(new BinaryConnectionFactory(), socketList);
	}
	
	/**
	 * Cache TTL.
	 * 
	 * @return int
	 */
	@Bean
	public Integer cacheTTL()
	{
		return 3600; //1 hour
	}
}
