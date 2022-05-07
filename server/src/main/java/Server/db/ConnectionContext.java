package Server.db;

import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class ConnectionContext implements ServletContextListener {

	private static final String PROTOCOL = "jdbc:mysql";
	private static final String HOST = "localhost";
	private static final String PORT = "3306";
	private static final String DB_SCHEMA = "server";
	private static final String TIMEZONE_PARAMS = "useLegacyDatetimeCode=false&serverTimezone=Europe/Berlin";

	private static final String DRIVER_CLASS_NAME = "com.mysql.cj.jdbc.Driver";
	private static final String CONNECTION_STRING = PROTOCOL + "://" + HOST + ":" + PORT + "/" + DB_SCHEMA + "?"
			+ TIMEZONE_PARAMS;
	private static final String USER = "server";
	private static final String PASSWORD = "server";

	public void contextInitialized(ServletContextEvent event) {
		Database.log("Initializing database connection...");
		try {
			Class.forName(DRIVER_CLASS_NAME);
			Database.connection = DriverManager.getConnection(CONNECTION_STRING, USER, PASSWORD);
			Database.connection.setSchema(DB_SCHEMA);
		} catch (SQLException | ClassNotFoundException e) {
			throw new Error("Database mandatory for execution", e);
		}
		Database.log("Successfully connected to database: { host: " + HOST + ", port: " + PORT + ", schema: "
				+ DB_SCHEMA + ", user: " + USER + " }");
	}

	public void contextDestroyed(ServletContextEvent event) {
		Database.log("Destroying database connection...");
		if (Database.connection != null) {
			try {
				if (!Database.connection.isClosed()) {
					try {
						if (!Database.connection.getAutoCommit()) {
							Database.connection.rollback();
						}
					} catch (SQLException e) {
						Database.log(e);
					}
				}
			} catch (SQLException e) {
				Database.log(e);
			} finally {
				try {
					Database.connection.close();
				} catch (SQLException e) {
					Database.log(e);
				}
			}
		}
		Database.log("Connection closed, not commited changes were rolled back.");
	}
}
